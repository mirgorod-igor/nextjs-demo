import {NextApiRequest, NextApiResponse} from 'next'

import {Product} from '@prisma/client'

import prisma from 'lib/prisma'
import 'lib/ext'


type P = Product & {
	prices?: { price: number }[]
	childs?: P[]
}

const prices = async (orgId: number) => {
	await prisma.price.findMany({
		where: {
			orgId, product: {
				parent: {
					is: null
				}
			}
		}
	})
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
			// корневые
			childs: !parentId && orgId ? {
				some: {
					prices: {
						every: { orgId }
					}
				}
			} : undefined,
			prices: {
				every: {
					/*OR: [
						{
							org: {
								id: orgId
							}
						},
						{
							org: {
								is: null
							}
						}
					]*/
					orgId
				},
			}
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
			console.log('>>> org ' + orgId + ', parent product', it)

			if (it.childs.length)
				await relations(it.childs, orgId)
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

	await (
		new Promise((res) => setTimeout(() => {res(true)}, 3000))
	)

	const [skip, take] = q.page_num && q.page_size
		? [q.page_num.int * q.page_size.int, q.page_size.int] : []

	const items = await findMany(null, q.orgId?.int, skip, take)
	console.log('>>> root items', items)

	if (q.tree)
		await relations(items as P[], q.orgId?.int)

	const total = await prisma.product.count({
		where: {
			parentId: null,
		}
	})

	console.log('products', q.orgId, items)

	res.json({
		items, total
	})

}