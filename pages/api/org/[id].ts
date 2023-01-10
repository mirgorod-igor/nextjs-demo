import {NextApiRequest, NextApiResponse} from 'next'
import {Org} from '@prisma/client'

import prisma from 'lib/prisma'
import 'lib/std'




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
            region: {
                select: { id: true, name: true }
            },
            parent: {
                select: { id: true, name: true }
            },
            childs: {
                select: { id: true, name: true }
            }
        },
        where: { id: q.id.int }
    })


    const status: api.Status = 'ok'

    console.log('org', data)

    res.json({ status, data })
}