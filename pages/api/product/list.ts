import {NextApiRequest, NextApiResponse} from 'next'

import prisma from 'lib/prisma'
import 'lib/ext'



type Node = IdName & {
	price?: number
	parentId?: number|null
	childs?: Node[]
}

const loadRelationProducts = async (ids: number[], childs?: Node[], prices?: Record<number, number>) => {
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
		it.price = prices?.[it.id]
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

	await (
		new Promise((res) => setTimeout(() => {res(true)}, 3000))
	)

	const [skip, take] = q.page_num && q.page_size
		? [q.page_num.int * q.page_size.int, q.page_size.int] : []


	if (orgId) {
		// сначала ищем цены по orgId
		const [ prices, total ] = await Promise.all([
			prisma.price.findMany({
				skip, take,
				where: { orgId }
			}),
			prisma.price.count({
				where: { orgId }
			})
		])


		// собираем productId
		const items = await loadRelationProducts(
			prices.map(it => it.productId),
			undefined,
			prices.reduce((res, it) => ((res[it.productId] = it.price), res), {})
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