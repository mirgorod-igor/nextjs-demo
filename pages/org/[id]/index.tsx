import {useEffect} from 'react'
import {NextPage} from 'next'
import {useRouter} from 'next/router'
import Link from 'next/link'

import {TreeList} from 'components'

import {view, products} from 'stores/view/org'


import sty from 'styles/view.module.sass'




const Card = () => {
    const st = view.useStatus()
        , item = view.data

    return <div className={sty.card + ' ' + (st == 'wait' ? sty.wait : '')}>
        <i>Наименоваие</i>
        <span>{item.name}</span>
        <i>Юридический адрес</i>
        <span>{item.legalAddr}</span>
        {
            item.parent && <>
                <i>Головная компания</i>
                <Link href={`/org/`+item.parent.id}>{item.parent.name}</Link>
            </>
        }
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


const Details = (p: { orgId: number }) => {
    const st = products.useStatus()

    return <div className={sty.details + ' ' + (st == 'wait' ? sty.wait : '')}>
        <TreeList store={products}>{
            (it, level) => <>
                <Link href={`${p.orgId}/${it.id}`} style={{ textIndent: level * 40 + 'px' }}>{it.name}</Link>
                <span>{it.price}</span>
            </>
        }</TreeList>
    </div>
}


const OrgPage: NextPage = () => {
    const {query} = useRouter()
    const id = (query.id as string)?.int

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