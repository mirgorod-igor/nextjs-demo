import {NextApiRequest, NextApiResponse} from 'next'
import {Prisma, PrismaClient} from '@prisma/client'


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

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<api.PagedList<any>>
) {
	const type = req.query.type as ModelType
	// @ts-ignore
	const items = await prisma[type].findMany({
		orderBy: orderBy[type]
	})

	await (
		new Promise((res) => setTimeout(() => {res(true)}, 4000))
	)

	res.json({
		items,
		total: 100
	})
	
}