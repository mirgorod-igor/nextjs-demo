import {useEffect} from 'react'
import {NextPage} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {useStore} from '@nanostores/react'
import {atom} from 'nanostores'

import {TabButtons, Tree, Prices, Breadcrumbs} from 'components'

import {orgMap, orgs, product} from 'stores/view/product'
import {RemoveItem} from 'stores'

import sty from 'styles/view.module.sass'



const breadcrumbs: [string, string][] = [
    ['/', 'главная']
]

const BC = (p: { orgId: number }) => {
    const ready = orgs.useStatus()

    return <Breadcrumbs
        items={ready ? [...breadcrumbs, [`/org/${p.orgId}`, orgMap[p.orgId]]]  : breadcrumbs}
    />
}


const Card = () => {
    const st = product.useStatus()
        , item = product.data
        , { price, org } = item.prices?.[0] ?? { }
        , wait = st == 'wait' ? ' '+sty.wait : ''

    return <div className={sty.card + wait}>
        <i>{item.category?.name ?? 'Наименование'}</i>
        <Link href={`/product/${item.id}`}>{item.name}</Link>
        {
            !!item.parent && <>
                <i>Группа</i>
                <Link href={`/product/${item.parent.id}`}>{item.parent.name}</Link>
            </>
        }
        {
            !!item.group && <>
                <i>Категория</i>
                <span>{item.group.name}</span>
            </>
        }
        <i>Производитель</i>
        <Link href={`/org/${org?.id}`}>{org?.name}</Link>
        {
            !!price && <>
                <i>Цена</i>
                <span>{price}</span>
            </>
        }
    </div>
}


const removeStores: Record<number, store.Remove> = {}

const getRemove = (id: number) =>
    removeStores[id] || (removeStores[id] = new RemoveItem('price', id))




type TabId = 'prices' | 'sales'
const tabs: [TabId, string, boolean?][] = [
    ['prices', 'Цены', true],
    ['sales', 'Продажи'],
]
const tab = atom<TabId>('prices')


const PriceList = () => {
    const st = product.useStatus()
        , ost = orgs.useStatus()
        , {childs, prices} = product.data
        , wait = st == 'wait' || ost == 'wait' ? ' ' + sty.wait : ''

    const onePrice = (prices?.length ?? 0) == 1 && !!prices![0].price

    return <div className={sty.list + wait}>
        {
            childs?.map(it =>
                <Tree key={it.id} item={it} level={0}>
                    {
                        (prod, level) => <div className={sty.prices}>
                            <Prices
                                level={level}
                                items={prod.prices!}
                                removeStoreFactory={getRemove}
                            >
                                {
                                    pr => <>
                                        <Link href={`/org/${pr.orgId}`}>{orgMap[pr.orgId!]}</Link>
                                        <Link href={`/org/${pr.orgId}/${prod.id}`}>{prod.name}</Link>
                                    </>
                                }
                            </Prices>
                        </div>
                    }
                </Tree>
            )
        }
        {
            !onePrice && <div className={sty.prices}>
                <Prices
                    level={-1}
                    items={product.data.prices!}
                    removeStoreFactory={getRemove}
                >
                    {pr => <Link href={`/org/${pr.org?.id}`}>{pr.org?.name}</Link>}
                </Prices>
            </div>
        }
    </div>
}

const TabContent = () => {
    const t = useStore(tab)

    return t == 'prices' ? <PriceList /> : <div></div>
}

const Details = () => {
    const onePrice = (product.data.prices?.length ?? 0) == 1 && !!product.data.prices![0].price
        , items = product.useStatus() == 'wait' ? [] : onePrice ? tabs.slice(1) : tabs

    return <div className={sty.details}>
        <TabButtons state={tab} items={items} />
        <div className={sty.content}>
            <TabContent />
        </div>
    </div>
}

const ProductPage: NextPage = () => {

    const {query} = useRouter()
    const orgId = (query.id as string)?.int
        , productId = (query.productId as string)?.int

    useEffect(() => {
        if (orgId) {
            Promise.all([
                product.fetch(productId, { orgId }),
                orgs.fetch()
            ])
        }
    }, [orgId])

    return <main className={sty.main}>
        <BC orgId={orgId} />
        <Card />
        <Details />
    </main>
}


export default ProductPage