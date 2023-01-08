import {useEffect} from 'react'
import {NextPage} from 'next'
import {useRouter} from 'next/router'
import Link from 'next/link'

import {atom} from 'nanostores'
import {useStore} from '@nanostores/react'


import {TabButtons, TreeList} from 'components'


import {view, products} from 'stores/view/org'

import sty from 'styles/view.module.sass'



const Card = () => {
    const wait = view.useStatus() == 'wait' ? ' '+sty.wait : ''
        , item = view.data

    return <div className={sty.card + wait}>
        <i>Наименование</i>
        <span>{item.name}</span>
        {
            item.parent && <>
                <i>Головная компания</i>
                <Link href={`/org/`+item.parent.id}>{item.parent.name}</Link>
            </>
        }
        <i>Специализация</i>
        <span>{item.name}</span>
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



const TabContent = (p: { orgId: number }) => {
    const t = useStore(tab)

    return t == 'prices'
        ? <TreeList store={products}>{
            (it, level) => <>
                <Link href={`${p.orgId}/${it.id}`} style={{ textIndent: level * 40 + 'px' }}>{it.name}</Link>
                <span>{it.price}</span>
            </>
        }</TreeList>
        : <></>
}

const Details = (p: { orgId: number }) => {
    const st = products.useStatus()
        , wait = st == 'wait' ? ' ' + sty.wait : ''

    return <div className={sty.details + wait}>
        <TabButtons state={tab} items={tabs} />
        <TabContent orgId={p.orgId} />
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
        <Card />
        <Details orgId={id} />
    </main>
}


export default OrgPage