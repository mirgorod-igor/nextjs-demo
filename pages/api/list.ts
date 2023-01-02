import {NextApiRequest, NextApiResponse} from 'next'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()


export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<api.PagedList<any>>
) {
	const type = req.query.type as ModelType
	// @ts-ignore
	const items = await prisma[type].findMany()
	
	res.json({
		items,
		total: 100
	})
	
}