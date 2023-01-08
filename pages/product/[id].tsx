import {useEffect} from 'react'
import {NextPage} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {atom} from 'nanostores'
import {useStore} from '@nanostores/react'

import {RemoveToggler, TabButtons} from 'components'

import {orgMap, orgs, product} from 'stores/view/product'

import {RemoveItem} from 'stores'

import sty from 'styles/view.module.sass'




const Card = () => {
    const st = product.useStatus()
        , item = product.data ?? {}

    return <div className={sty.card + ' ' + (st == 'wait' ? sty.wait : '')}>
        <i>Наименование</i>
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
        {
            !!item.childs?.length && <>
                <i>Разновидности</i>
                {
                    <ul>
                        {
                            item.childs?.map(it => <Link href={''+it.id}>{it.name}</Link>)
                        }
                    </ul>
                }
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
        , item = product.data
        , ost = orgs.useStatus()
        , wait = ost == 'wait' || st == 'wait' ? ' '+sty.wait : ''

    return <div className={sty.list + wait}>
        {
            item.prices?.map(it => <RemoveToggler key={it.id} id={it.id} store={getRemove(it.id)}>
                <Link href={`/org/${it.orgId}`}>{orgMap[it.orgId!]}</Link>
                <span>{it.price}</span>
            </RemoveToggler>)
        }
    </div>
}

const TabContent = () => {
    const t = useStore(tab)

    return t == 'prices' ? <Prices /> : <div></div>
}

const Details = () => {

    return <div className={sty.details}>
        <TabButtons items={tabs} state={tab} />
        <TabContent />
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
        <Card />
        <Details />
    </main>
}


export default ProductPage