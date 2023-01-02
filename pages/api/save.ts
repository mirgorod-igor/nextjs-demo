// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {Prisma, PrismaClient} from '@prisma/client'



const prisma = new PrismaClient()

type Body = {
	type: ModelType
	item: Prisma.ProductCreateInput | Prisma.RegionCreateInput | Prisma.PriceCreateInput
}

type Data = {
	status: 'ok'
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const body = req.body as Body
	console.log(body)
	// @ts-ignore
	await prisma[body.type].create({ data: body.item })
	res.json({status: 'ok'})
	await prisma.$disconnect()
}
