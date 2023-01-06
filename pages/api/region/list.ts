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



	// @ts-ignore
	const items = await prisma.region.findMany({
		skip, take,
		orderBy: {
			name: 'asc'
		}
	})


	const total = await prisma.region.count()

	await (
		new Promise((res) => setTimeout(() => {res(true)}, 3000))
	)

	console.log('regions', items)

	res.json({
		items, total
	})
	
}