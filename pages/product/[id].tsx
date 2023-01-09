import {useEffect} from 'react'
import {NextPage} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {atom} from 'nanostores'
import {useStore} from '@nanostores/react'

import {Prices, PriceList, TabButtons, Tree, Breadcrumbs} from 'components'

import {orgs, product} from 'stores/view/product'

import {RemoveItem} from 'stores'

import sty from 'styles/view.module.sass'



const breadcrumbs: [string, string][] = [
    ['/', 'главная']
]



const Card = () => {
    const st = product.useStatus()
        , wait = st == 'wait' ? ' '+sty.wait : ''
        , item = product.data ?? {}

    return <div className={sty.card + wait}>
        <i>{item.category?.name ?? 'Наименование'}</i>
        <span>{item.name}</span>
        {
            !!item.group && <>
                <i>Категория</i>
                <span>{item.group.name}</span>
            </>
        }
        {
            item.parent && <>
                <i>Группа</i>
                <Link href={`${item.parent.id}`}>{item.parent.name}</Link>
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


const _Prices = () => {
    const st = product.useStatus()
        , {childs, prices} = product.data
        , ost = orgs.useStatus()
        , wait = ost == 'wait' || st == 'wait' ? ' '+sty.wait : ''
        , orgMap: Record<number, string> = {}


    if (ost == 'ok') {
        for (const {id, name} of orgs.items)
            orgMap[id] = name
    }

    return <div className={sty.list + wait}>
        {
            childs?.map(it =>
                <Tree item={it} level={0}>
                    {
                        (it, level) =>
                            <PriceList key={it.id} level={level} href={`${it.id}`} it={it} removeStoreFactory={removeStoreFactory}>
                                {it => <Link href={`/org/${it.orgId}`}>{orgMap[it.orgId!]}</Link>}
                            </PriceList>
                    }
                </Tree>
            )
        }
        {
            prices &&
                <div className={sty.prices}>
                    <Prices items={prices!} level={-1} removeStoreFactory={removeStoreFactory}>
                        {it => <Link href={`/org/${it.org?.id}`}>{it.org?.name}</Link>}
                    </Prices>
                </div>
        }
    </div>
}


const TabContent = () => {
    const t = useStore(tab)

    return t == 'prices'
        ? <_Prices />
        : <div></div>
}

const Details = () => {

    return <div className={sty.details}>
        <TabButtons items={tabs} state={tab} />
        <div className={sty.content}>
            <TabContent />
        </div>
    </div>
}


const ProductPage: NextPage = () => {
    const {query} = useRouter()
    const id = (query.id as string)?.int

    useEffect(() => {
        if (id) {
            Promise.all([
                product.fetch(id),
                orgs.fetch()
            ])
        }
    }, [id])

    return <main className={sty.main}>
        <Breadcrumbs items={breadcrumbs} />
        <Card />
        <Details />
    </main>
}


export default ProductPage