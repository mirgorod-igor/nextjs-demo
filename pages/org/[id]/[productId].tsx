import {Fragment, useEffect} from 'react'
import {NextPage} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {orgs, product} from 'stores/view/product'

import sty from 'styles/view.module.sass'
import {atom} from 'nanostores'
import {TabButtons} from 'components'
import {useStore} from '@nanostores/react'




const Card = () => {
    const st = product.useStatus()
        , item = product.data
        , { price, org } = item.prices?.[0] ?? { }
        , wait = st == 'wait' ? ' '+sty.wait : ''

    return <div className={sty.card + wait}>
        <i>Наименование</i>
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


type TabId = 'prices' | 'sales'
const tabs: [TabId, string, boolean?][] = [
    ['prices', 'Цены', true],
    ['sales', 'Продажи'],
]
const tab = atom<TabId>('prices')




const TabContent = () => {
    const t = useStore(tab)
        , st = product.useStatus()

    return st == 'ok'
        ? t == 'prices'
            ? <div className={sty.prices}>
                {product.data.prices?.[0].childs?.map(it =>
                    <Fragment key={it.id}>
                        <span><Link href={`/org/${it.orgId}`}>{it.orgId}</Link></span>
                        <b>{it.price}</b>
                    </Fragment>
                )}
            </div>
            : <div></div>
        : <></>
}

const Details = () => {
    const st = product.useStatus()
        , ost = orgs.useStatus()
        , wait = st == 'wait' || ost == 'wait' ? ' ' + sty.wait : ''

    return <div className={sty.details + wait}>
        <TabButtons state={tab} items={product.data.prices?.[0].childs?.length ? tabs : tabs.slice(1)} />
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