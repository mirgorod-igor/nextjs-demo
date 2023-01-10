import {useEffect} from 'react'
import {NextPage} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {useStore} from '@nanostores/react'
import {atom} from 'nanostores'

import {Breadcrumbs, Prices, TabButtons, Tree} from 'components'

import {product} from 'stores/view/product'
import {RemoveItem} from 'stores'

import sty from 'styles/view.module.sass'
import {mockProviders} from 'next-auth/client/__tests__/helpers/mocks'
import id = mockProviders.github.id



const breadcrumbs: [string, string][] = [
    ['/', 'главная']
]

const BC = (p: { orgId: number }) => {
    const ready = product.useStatus()
        , orgs =  product.data?.orgs ?? {}

    return <Breadcrumbs
        items={ready ? [...breadcrumbs, [`/org/${p.orgId}`, orgs[p.orgId]]]  : breadcrumbs}
    />
}


const Card = () => {
    const st = product.useStatus()
        , wait = st == 'wait' ? ' '+sty.wait : ''
        , {view, orgs} = product.data ?? {}
        , { price, orgId } = view?.prices?.[0] ?? { }

    return <div className={sty.card + wait}>
        <i>{view?.category?.name ?? 'Наименование'}</i>
        <Link href={`/product/${view?.id}`}>{view?.name}</Link>
        {
            !!view?.parent && <>
                <i>Группа</i>
                <Link href={`/product/${view.parent.id}`}>{view.parent.name}</Link>
            </>
        }
        {
            !!view?.group && <>
                <i>Категория</i>
                <span>{view.group.name}</span>
            </>
        }
        {
            !!orgId && <>
                <i>Производитель</i>
                <Link href={`/org/${orgId}`}>{orgs?.[orgId!]}</Link>
                {
                    !!price && <>
                    <i>Цена</i>
                    <span>{price}</span>
                    </>
                }
            </>
        }
    </div>
}


const removeStores: Record<number, store.Remove> = {}

const removeStoreFactory = (id: number) =>
    removeStores[id] || (removeStores[id] = new RemoveItem('price', id))




type TabId = 'prices' | 'sales'
const tabs: [TabId, string, boolean?][] = [
    ['prices', 'Цены', true],
    ['sales', 'Продажи'],
]
const tab = atom<TabId>('prices')


const PriceList = () => {
    const {query: { id }} = useRouter()
        , st = product.useStatus()
        , {view, orgs} = product.data ?? {}
        , { prices, childs } = view ?? {}
        , wait = st == 'wait' ? ' ' + sty.wait : ''

    const onePrice = (prices?.length ?? 0) == 1 && !!prices![0].price

    return <div className={sty.list + wait}>
        {
            childs?.map(it =>
                <Tree key={it.id} href={p => `/org/${id}/${p.id}`} item={it} level={0}>
                    {
                        (prod, level) => <div className={sty.prices}>
                            <Prices
                                level={level}
                                items={prod.prices!}
                                removeStoreFactory={removeStoreFactory}
                            >
                                {
                                    pr => <>
                                        <Link href={`/org/${id}`}>{orgs[pr.orgId!]}</Link>
                                        <Link href={`/org/${id}/${prod.id}`}>{prod.name}</Link>
                                    </>
                                }
                            </Prices>
                        </div>
                    }
                </Tree>
            )
        }
        {
            !!view && !onePrice &&
                <div className={sty.prices}>
                    <Prices
                        level={-1}
                        items={view.prices!}
                        removeStoreFactory={removeStoreFactory}
                    >
                        {it => <Link href={`/org/${it.orgId}`}>{orgs?.[it.orgId!]}</Link>}
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
    const {view} = product.data ?? {}
        , onePrice = (view?.prices?.length ?? 0) == 1 && !!view?.prices![0].price
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
            product.fetch(productId, { orgId })
        }
    }, [orgId])

    return <main className={sty.main}>
        <BC orgId={orgId} />
        <Card />
        <Details />
    </main>
}


export default ProductPage