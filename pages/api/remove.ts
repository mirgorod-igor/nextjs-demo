import {NextApiRequest, NextApiResponse} from 'next'

import {randomInt} from 'crypto'

import prisma from 'lib/prisma'
import {sleep} from 'utils/sleep'




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
		await sleep(4000)

		if (tryRemove) {
		//if (false) {
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