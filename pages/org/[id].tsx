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
            item.head && <>
                <i>Головная компания</i>
                <Link href={`/org/`+item.head.id}>{item.head.name}</Link>
            </>
        }
        {
            item.childs?.length ? <>
                <i>Дочерние компании</i>
                <ul>
                    {
                        view.data.childs.map(it =>
                            <Link key={it.id} href={`/org/`+it.id}>{it.name}</Link>)
                    }
                </ul>
             </> : null
        }
    </div>
}


const Details = () => {
    const st = products.useStatus()

    return <div className={sty.details + ' ' + (st == 'wait' ? sty.wait : '')}>
        <TreeList store={products}>{
            it => <>
                <span style={{ textIndent: (it.level??0) * 40 + 'px' }}>{it.name}</span>
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
        <Details />
    </main>
}


export default OrgPage