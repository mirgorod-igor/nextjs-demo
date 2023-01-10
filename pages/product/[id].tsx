import {useEffect} from 'react'
import {NextPage} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {atom} from 'nanostores'
import {useStore} from '@nanostores/react'

import {Breadcrumbs, Prices, PriceList, TabButtons, Tree} from 'components'

import {product} from 'stores/view/product'
import {RemoveItem} from 'stores'

import sty from 'styles/view.module.sass'



const breadcrumbs: [string, string][] = [
    ['/', 'главная']
]



const Card = () => {
    const st = product.useStatus()
        , wait = st == 'wait' ? ' '+sty.wait : ''
        , item = product.data.view ?? {}

    return <div className={sty.card + wait}>
        <i>{item.category?.name ?? 'Наименование'}</i>
        <span>{item.name}</span>
        {
            !!item.parent && <>
                <i>Группа</i>
                <Link href={`${item.parent.id}`}>{item.parent.name}</Link>
            </>
        }
        {
            !!item.group && <>
                <i>Категория</i>
                <span>{item.group.name}</span>
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
        , {view, orgs} = product.data ?? {}
        , wait = st == 'wait' ? ' '+sty.wait : ''


    return <div className={sty.list + wait}>
        {
            view?.childs?.map(it =>
                <Tree item={it} level={0}>
                    {
                        (it, level) =>
                            <PriceList key={it.id} level={level} href={`${it.id}`} it={it} removeStoreFactory={removeStoreFactory}>
                                {it => <Link href={`/org/${it.orgId}`}>{orgs[it.orgId!]}</Link>}
                            </PriceList>
                    }
                </Tree>
            )
        }
        {
            view?.prices &&
                <div className={sty.prices}>
                    <Prices items={view.prices} level={-1} removeStoreFactory={removeStoreFactory}>
                        {it => <Link href={`/org/${it.orgId}`}>{orgs[it.orgId!]}</Link>}
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
            product.fetch(id)
        }
    }, [id])

    return <main className={sty.main}>
        <Breadcrumbs items={breadcrumbs} />
        <Card />
        <Details />
    </main>
}


export default ProductPage