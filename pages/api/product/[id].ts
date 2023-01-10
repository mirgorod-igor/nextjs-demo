import {NextApiRequest, NextApiResponse} from 'next'


import prisma from 'lib/prisma'
import 'lib/std'


function collectOrgIds(data: Product|Price, orgIds: Set<number>) {
    if ('orgId' in data)
        orgIds.add(data.orgId!)

    if ('prices' in data) {
        for (const it of data.prices!) {
            collectOrgIds(it, orgIds)
        }
    }
    if (!!data.childs)
        for (const it of data.childs)
            collectOrgIds(it, orgIds)
}

const loadRelations = async (data: Product, orgIds: Set<number>) => {
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

    for (const ch of data.childs)
        collectOrgIds(ch, orgIds)

    await Promise.all(
        data.childs!.map(it => loadRelations(it, orgIds))
    )

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
                    id: true, orgId: true, price: true,
                    childs: {
                        select: {
                            id: true, price: true, orgId: true
                        },
                        where: {
                            price: { not: null }
                        }
                    }
                },
                where: { orgId },
            },
            parent: {
                select: { id: true, name: true }
            }
        },
        where: { id }
    })

    const orgIds = new Set<number>()

    if (!!data) {
        collectOrgIds(data, orgIds)
        await loadRelations(data, orgIds)
    }

    const orgs = await prisma.org.findMany({
        select: {
            id: true, name: true
        },
        where: {
            id: { in: Array.from(orgIds.values()) }
        }
    })


    const status: api.Status = 'ok'

    console.log('product', data)

    res.json({
        status,
        data: {
            view: data, orgs: orgs.assoc('id', 'name')
        }
    })
}