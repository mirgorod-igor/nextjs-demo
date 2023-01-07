import {useEffect} from 'react'
import {NextPage} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {orgs, product} from 'stores/view/product'

import sty from 'styles/view.module.sass'



const Card = () => {
    const st = product.useStatus()
        , item = product.data
        , { price, org } = item.prices?.[0] ?? { }

    return <div className={sty.card + ' ' + (st == 'wait' ? sty.wait : '')}>
        <i>Наименоваие</i>
        <Link href={`/product/${item.id}`}>{item.name}</Link>
        <i>Поставщик</i>
        <Link href={`/org/${org?.id}`}>{org?.name}</Link>
        <i>Цена</i>
        <span>{price}</span>
    </div>
}


const Details = () => {
    const st = orgs.useStatus()

    return <div className={sty.details + ' ' + (st == 'wait' ? sty.wait : '')}>
        {/*<TreeList store={products}>{
            it => <>
                <span style={{ textIndent: (it.level??0) * 40 + 'px' }}>{it.name}</span>
                <span>{it.price}</span>
            </>
        }</TreeList>*/}
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