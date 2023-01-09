import {useEffect} from 'react'
import {NextPage} from 'next'
import {useRouter} from 'next/router'
import Link from 'next/link'

import {atom} from 'nanostores'
import {useStore} from '@nanostores/react'


import {Breadcrumbs, PriceList, TabButtons, TreeList} from 'components'


import {RemoveItem} from 'stores'
import {view, products} from 'stores/view/org'


import sty from 'styles/view.module.sass'



const breadcrumbs: [string, string][] = [
    ['/', 'главная']
]


const Card = () => {
    const wait = view.useStatus() == 'wait' ? ' '+sty.wait : ''
        , item = view.data

    return <div className={sty.card + wait}>
        <i>Наименование</i>
        <span>{item.name}</span>
        {
            item.parent && <>
                <i>Головная компания</i>
                <Link href={`/org/${item.parent.id}`}>{item.parent.name}</Link>
            </>
        }
        <i>Описание</i>
        <span>{item.desc}</span>
        <i>Регион</i>
        <span>{item.region?.name}</span>
        <i>Юридический адрес</i>
        <span>{item.legalAddr}</span>
        {
            item.childs?.length ? <>
                <i>Дочерние компании</i>
                <ul>
                    {
                        item.childs.map(it =>
                            <Link key={it.id} href={`/org/`+it.id}>{it.name}</Link>)
                    }
                </ul>
             </> : null
        }
    </div>
}



type TabId = 'prices' | 'sales'
const tabs: [TabId, string, boolean?][] = [
    ['prices', 'Цены', true],
    ['sales', 'Продажи'],
]
const tab = atom<TabId>('prices')



const removeStores: Record<number, store.Remove> = {}
const getRemove = (id: number) =>
    removeStores[id] || (removeStores[id] = new RemoveItem('price', id))


const orgMap: Record<number, string> = {}
const TabContent = (p: { orgId: number }) => {
    const t = useStore(tab)
        , st = view.useStatus()
        , orgs = view.data.childs


    if (st == 'ok' && orgs) {
        for (const {id, name} of orgs)
            orgMap[id] = name
    }

    return t == 'prices'
        ? <TreeList store={products} status={st}>
            {(it, level) =>
                <PriceList
                    key={it.id}
                    href={`${p.orgId}/${it.id}`}
                    level={level} it={it}
                    removeStoreFactory={getRemove}
                >
                    {
                        it => <Link href={`${it.orgId}`}>{orgMap[it.orgId!]}</Link>
                    }
                </PriceList>
            }</TreeList>
            : <></>

}

const Details = (p: { orgId: number }) => {
    const st = products.useStatus()
        , wait = st == 'wait' ? ' ' + sty.wait : ''

    return <div className={sty.details + wait}>
        <TabButtons state={tab} items={tabs} />
        <div className={sty.content}>
            <TabContent orgId={p.orgId} />
        </div>
    </div>
}


const OrgPage: NextPage = () => {
    const {query} = useRouter()
    const id = (query?.id as string)?.int

    useEffect(() => {
        if (id) {
            Promise.all([
                view.fetch(id),
                products.load(id)
            ])
        }
    }, [id])

    return <main className={sty.main}>
        <Breadcrumbs items={breadcrumbs} />
        <Card />
        <Details orgId={id} />
    </main>
}


export default OrgPage