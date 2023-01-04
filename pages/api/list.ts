
import {NextApiRequest, NextApiResponse} from 'next'
import {Prisma, PrismaClient} from '@prisma/client'

import 'lib/ext'

const prisma = new PrismaClient()

type OrderBy = Prisma.RegionOrderByWithRelationInput | Prisma.OrgOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput | Prisma.PriceOrderByWithRelationInput

const orderBy: Record<ModelType, OrderBy> = {
	region: {
		name: 'asc'
	},
	org: {
		name: 'asc'
	},
	product: {
		name: 'asc'
	},
	price: {
		region: {
			name: 'asc'
		}
	}
}

type Query = {
	page_num?: string
	page_size?: string
	type: ModelType
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<api.PagedList<any>>
) {
	const q = req.query as Query
	/*prisma.org.findMany({
		skip: (q.page_num.int * q.page_size.int),
		take: q.page_size.int
	})*/

	const [skip, take] = q.page_num && q.page_size ? [q.page_num.int * q.page_size.int, q.page_size.int] : []

	// @ts-ignore
	const items = await prisma[q.type].findMany({
		skip, take,
		orderBy: orderBy[q.type]
	})

	// @ts-ignore
	const total = await prisma[q.type].count()

	await (
		new Promise((res) => setTimeout(() => {res(true)}, 3000))
	)

	res.json({
		items, total
	})
	
}