import {NextApiRequest, NextApiResponse} from 'next'


import prisma from 'lib/prisma'
import 'lib/ext'


const loadRelations = async (data: Product) => {
    data.childs = await prisma.product.findMany({
        select: {
            id: true, name: true,
            prices: {
                select: {
                    id: true, orgId: true, price: true,
                    childs: {
                        select: {
                            id: true, orgId: true, price: true
                        }
                    }
                }
            }
        },
        where: {
            parentId: data.id
        }
    })

    await Promise.all(data.childs!.map(ch => loadRelations(ch)))

    if (!data.childs!.length)
        delete data.childs
    if (!data.prices!.length)
        delete data.prices
    if (!data.parent)
        delete data.parent
    if (!data.category)
        delete data.category
}


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
        select: {
            id: true, name: true,
            category: {
                select: { id: true, name: true }
            },
            group: {
                select: { id: true, name: true }
            },
            prices: {
                select: {
                    id: true, org: { select: { id: true, name: true } }, price: true,
                    childs: {
                        select: {
                            id: true, price: true,
                            org: {
                                select: { id: true, name: true }
                            }
                        },
                        where: {
                            price: { not: null }
                        }
                    }
                },
                where: orgId ? { orgId } : undefined,
            },
            parent: {
                select: { id: true, name: true }
            }
        },
        where: { id }
    })

    if (data)
        await loadRelations(data)

    const status: api.Status = 'ok'

    console.log('product', data)

    res.json({ status, data })
}