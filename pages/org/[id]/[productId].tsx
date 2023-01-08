import {useEffect} from 'react'
import {NextPage} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {useStore} from '@nanostores/react'
import {atom} from 'nanostores'

import {RemoveToggler, TabButtons, Tree, TreeList} from 'components'

import {orgs, product} from 'stores/view/product'
import {RemoveItem} from 'stores'

import sty from 'styles/view.module.sass'
import {products} from 'stores/view/org'




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


const Prices = () => {
    const st = product.useStatus()
        , ost = orgs.useStatus()
        , wait = st == 'wait' || ost == 'wait' ? ' ' + sty.wait : ''

    return <div className={sty.list + wait}>
        {product.data.prices?.[0]?.childs?.map(it =>
            <RemoveToggler key={it.id} id={it.id} store={getRemove(it.id)}>
                <span><Link href={`/org/${it.org?.id}`}>{it.org?.name}</Link></span>
                <b>{it.price}</b>
            </RemoveToggler>
        )}
    </div>
}

const TabContent = () => {
    const t = useStore(tab)

    return t == 'prices' ? <Prices /> : <div></div>
}

const Details = () => {

    return <div className={sty.details}>
        <TabButtons state={tab} items={product.data.prices?.[0]?.childs?.length ? tabs : tabs.slice(1)} />
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
        <Card />
        <Details />
    </main>
}


export default ProductPage