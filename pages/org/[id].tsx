import {useEffect} from 'react'
import {NextPage} from 'next'
import {useRouter} from 'next/router'

import {TreeList} from 'components'

import {view, products} from 'stores/view/org'


import sty from 'styles/view.module.sass'



const Card = () => {
    const st = view.useStatus()

    return <div className={sty.card + ' ' + (st == 'wait' ? sty.wait : '')}>
        <i>Наименоваие</i>
        <span>{view.data.name}</span>
        <i>Юр. адрес</i>
        <span>{view.data.legalAddr}</span>
    </div>
}


const Details = () => {
    const st = products.useStatus()

    return <div className={sty.details + ' ' + (st == 'wait' ? sty.wait : '')}>
        <TreeList store={products}>{
            it => <>
                <span style={{ textIndent: (it.level??0) * 40 + 'px' }}>{it.name}</span>
                <span>{it.prices[0].price}</span>
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