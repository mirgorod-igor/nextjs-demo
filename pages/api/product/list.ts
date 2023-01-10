import {NextApiRequest, NextApiResponse} from 'next'

import prisma from 'lib/prisma'
import 'lib/std'
import {sleep} from 'utils/sleep'


type Node = IdName & {
	prices?: Price[]
	parentId?: number|null
	childs?: Node[]
}

const loadRelationProducts = async (ids: number[], childs?: Node[], groupedPrices?: Record<number, Price[]>) => {
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
		it.prices = groupedPrices?.[it.id]

		if (childs)
			it.childs = childs.filter(ch =>
				(ch.parentId == it.id && (ch.parentId = undefined, true))
			)

		if (!it.childs?.length)
			delete it.childs

		if (it.parentId)
			pids.add(it.parentId)
	}

	return pids.size
		? await loadRelationProducts(
			Array.from(pids.values()), items, groupedPrices
		)
		: items
}


const findMany = async (skip?: number, take?: number) =>
	await prisma.product.findMany({
		select: {
			id: true, name: true, childs: {
				select: { id: true, name: true }
			}
		},
		where: {
			parentId: null
		},
		skip, take,
		orderBy: [
			{ catId: 'asc' },
			{ id: 'asc' }
		]
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
				select: {
					id: true, productId: true, price: true,
					childs: {
						select: {
							id: true, orgId: true, price: true
						}
					}
				},
				skip, take,
				where: {
					orgId, productId: { not: null }
				}
			}),
			prisma.price.count({
				where: {
					orgId, productId: { not: null }
				}
			})
		])

		const productIds = prices.map(it => it.productId!)

		const groupedPrices = prices.reduce<Record<number, Price[]>>((res, it) => {
			(res[it.productId!] || (res[it.productId!] = [])).push(it)
			// @ts-ignore, чтобы не отдавать наружу лишние данные
			delete it.productId
			if (!it.childs?.length)
				// @ts-ignore, чтобы не отдавать наружу лишние данные
				delete it.childs
			return res
		}, {})


		console.log('prices', groupedPrices)

		// собираем productId
		const items = await loadRelationProducts(
			productIds,
			undefined,
			groupedPrices
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