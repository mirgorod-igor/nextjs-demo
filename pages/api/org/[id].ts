import {NextApiRequest, NextApiResponse} from 'next'
import {Org} from '@prisma/client'


import prisma from 'lib/prisma'
import 'lib/ext'



type Query = {
    id: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<api.View<Org>>
) {
    const q = req.query as Query

    const data = await prisma.org.findUnique({
        include: {
            head: {
                select: { id: true, name: true }
            },
            childs: {
                select: { id: true, name: true }
            }
        },
        where: { id: q.id.int }
    })


    const status: api.Status = 'ok'

    await (
        new Promise((res) => setTimeout(() => {res(true)}, 3000))
    )

    console.log('org', data)

    res.json({ status, data })
}