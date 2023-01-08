import {NextApiRequest, NextApiResponse} from 'next'

import prisma from 'lib/prisma'
import 'lib/ext'
import {sleep} from 'utils/sleep'


type Pr = {
	value: number
	childs?: Price[]
}

type Node = IdName & {
	price?: number
	prices?: Price[]
	parentId?: number|null
	childs?: Node[]
}

const loadRelationProducts = async (ids: number[], childs?: Node[], prices?: Record<number, Pr>) => {
	const items: Node[] = await prisma.product.findMany({
		select: {
			id: true, name: true, parentId: true
		},
		where: {
			id: { in: ids }
		}
	})

	const pids = new Set<number>()
	for (const it of items) {
		const pr = prices?.[it.id]
		if (pr) {
			if (pr.value)
				it.price = pr.value
			else
				it.prices = pr.childs
		}


		if (childs)
			it.childs = childs.filter(ch => (ch.parentId == it.id && (ch.parentId = undefined, true)))

		if (it.parentId)
			pids.add(it.parentId)
	}


	return pids.size ? await loadRelationProducts(Array.from(pids.values()), items) : items
}


const findMany = async (skip?: number, take?: number) =>
	await prisma.product.findMany({
		select: {
			id: true, name: true
		},
		where: {
			parentId: null
		},
		skip, take,
		orderBy: {
			id: 'asc'
		}
	})




type Query = {
	page_num?: string
	page_size?: string
	tree?: boolean
	orgId?: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<api.PagedList<any>>
) {
	const q = req.query as Query
		, orgId = q.orgId?.int

	await sleep()

	const [skip, take] = q.page_num && q.page_size
		? [q.page_num.int * q.page_size.int, q.page_size.int] : []


	if (orgId) {
		// сначала ищем цены по orgId
		const [ prices, total ] = await Promise.all([
			prisma.price.findMany({
				include: {
					childs: {
						select: {
							org: {
								select: {
									id: true, name: true
								},
							},
							id: true, price: true
						}
					}
				},
				skip, take,
				where: { orgId }
			}),
			prisma.price.count({
				where: { orgId }
			})
		])


		const pricesWithProduct = prices.filter(it => !!it.productId)
		// собираем productId
		const items = await loadRelationProducts(
			pricesWithProduct.map(it => it.productId!),
			undefined,
			pricesWithProduct.reduce((res, it) => ((res[it.productId!] = {
				value: it.price, childs: it.childs
			}), res), {})
		)

		res.json({ items, total })
	}
	else {
		const [ items, total ] = await Promise.all([
			findMany(skip, take),
			prisma.product.count({
				where: {
					parentId: null
				}
			})
		])

		res.json({ items, total })
	}
}