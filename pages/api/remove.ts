import {NextApiRequest, NextApiResponse} from 'next'
import {Prisma, PrismaClient} from '@prisma/client'


const prisma = new PrismaClient()

type Body = {
	type: ModelType
	id: number
}


export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<{status: api.Status}>
) {
	const body = req.body as Body
	console.log(body)
	// @ts-ignore
	await prisma[body.type].delete({ where: { id: body.id } })
	res.json({status: 'ok'})
	await prisma.$disconnect()
}