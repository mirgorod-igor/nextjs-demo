import {NextApiRequest, NextApiResponse} from 'next'

import prisma from 'lib/prisma'

import 'lib/ext'




type Query = {
	page_num?: string
	page_size?: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<api.PagedList<any>>
) {
	const q = req.query as Query

	const [skip, take] = q.page_num && q.page_size ? [q.page_num.int * q.page_size.int, q.page_size.int] : []


	const items = await prisma.price.findMany({
		skip, take,
		orderBy: {
			region: {
				name: 'asc'
			}
		}
	})


	const total = await prisma.price.count()

	await (
		new Promise((res) => setTimeout(() => {res(true)}, 3000))
	)

	console.log('prices', items)

	res.json({
		items, total
	})
	
}