import {NextApiRequest, NextApiResponse} from 'next'

import {Product} from '@prisma/client'

import prisma from 'lib/prisma'
import 'lib/ext'


type P = Product & {
	prices?: { price: number }[]
	childs?: P[]
}


const findMany = async (parentId: number|null, orgId?: number, skip?: number, take?: number) =>
	await prisma.product.findMany({
		select: {
			id: true, name: true,
			prices: parentId ? {
				select: { price: true }
			} : false
		},
		where: {
			parentId,
			childs: orgId ? {
				some: {
					prices: {
						every: { orgId }
					}
				}
			} : undefined,
		},
		skip, take,
		orderBy: {
			id: 'asc'
		}
	})



const relations = async (items: P[], orgId?: number) => {
	for (const it of items) {
		if (it) {
			it.childs = await findMany(it.id, orgId) as P[]

			if (it.childs.length)
				relations(it.childs)
			else
				it.childs = undefined
		}
	}
}


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

	const [skip, take] = q.page_num && q.page_size
		? [q.page_num.int * q.page_size.int, q.page_size.int] : []

	const items = await findMany(null, q.orgId?.int, skip, take)

	if (q.tree)
		await relations(items as P[], q.orgId?.int)

	const total = await prisma.product.count({
		where: {
			parentId: null,
		}
	})

	await (
		new Promise((res) => setTimeout(() => {res(true)}, 3000))
	)

	console.log('products', q.orgId, items)

	res.json({
		items, total
	})

}