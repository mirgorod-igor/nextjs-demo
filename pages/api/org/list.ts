import {NextApiRequest, NextApiResponse} from 'next'

import {Org} from '@prisma/client'

import prisma from 'lib/prisma'
import 'lib/ext'




type Query = {
	page_num?: string
	page_size?: string
}

type GroupBy = Record<number, Org[]>

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<api.PagedList<GroupBy>>
) {
	const q = req.query as Query

	const [skip, take] = q.page_num && q.page_size ? [q.page_num.int * q.page_size.int, q.page_size.int] : []

	const items = await prisma.org.findMany({
		skip, take,
		orderBy: [
			{ regionId: 'asc' },
			{ name: 'asc' }
		]
	})

	//const data = items.groupBy('regionId')

	const total = await prisma.org.count()

	await (
		new Promise((res) => setTimeout(() => {res(true)}, 3000))
	)

	console.log('orgs', items)

	res.json({
		items, total
	})
	
}