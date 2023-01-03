import {NextApiRequest, NextApiResponse} from 'next'
import {PrismaClient} from '@prisma/client'
import {randomInt} from 'crypto'

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

	const tryRemove = randomInt(0, 100) > 50

	try {
		await (
			new Promise((res) => setTimeout(() => {res(true)}, 4000))
		)

		if (tryRemove) {
			// @ts-ignore
			await prisma[body.type].delete({ where: { id: body.id } })
			res.json({status: 'ok'})
		}
		else
			res.status(500).json({ status: 'error' })
	}
	catch(e) {
		console.error(e)
	}
}