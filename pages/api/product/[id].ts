import {NextApiRequest, NextApiResponse} from 'next'


import prisma from 'lib/prisma'
import 'lib/ext'

import {sleep} from 'utils/sleep'


type Query = {
    id: string
    orgId?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse/*<api.View<{ product: Product|null, orgs?: IdName[] }>>*/
) {
    const q = req.query as Query
        , id = q.id.int
        , orgId = q.orgId?.int


    const data = await prisma.product.findUnique({
        include: {
            category: {
                select: { id: true, name: true }
            },
            group: {
                select: { id: true, name: true }
            },
            prices: {
                select: {
                    id: true, orgId: !orgId, price: true,
                    org: !!orgId
                        ? { select: { id: true, name: true } }
                        : false,
                    childs: {
                        select: {
                            id: true, price: true,
                            org: { select: { id: true, name: true } }
                        },
                        where: {
                            price: { not: null }
                        }
                    }
                },
                where: {
                    orgId: orgId ?? undefined,
                }
            },
            parent: {
                select: { id: true, name: true }
            },
            childs: {
                select: {
                    id: true, name: true,
                    prices: {
                        select: {
                            id: true, orgId: true, price: true
                        },
                        where: {
                            price: { not: null }
                        }
                    }
                }
            }
        },
        where: { id }
    })


    const status: api.Status = 'ok'

    await sleep()

    console.log('product', data)

    res.json({ status, data })
}