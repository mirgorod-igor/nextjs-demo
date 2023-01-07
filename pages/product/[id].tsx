import {Fragment, useEffect} from 'react'
import {NextPage} from 'next'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {RemoveToggler} from 'components'

import {orgMap, orgs, product} from 'stores/view/product'

import sty from 'styles/view.module.sass'
import {RemoveItem} from 'stores'




const Card = () => {
    const st = product.useStatus()
        , item = product.data

    return <div className={sty.card + ' ' + (st == 'wait' ? sty.wait : '')}>
        {
            item.parent && <>
                <i>Группа</i>
                <Link href={`${item.parent.id}`}>{item.parent.name}</Link>
            </>
        }
        <i>Наименоваие</i>
        <span>{item.name}</span>
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


const Details = () => {
    const st = product.useStatus()
        , item = product.data
        , ost = orgs.useStatus()
        , wait = ost == 'wait' || st == 'wait' ? ' '+sty.loading : ''



    return <div className={sty.details}>
        <div className={sty.list + wait}>
            {
                item.prices?.map(it => <RemoveToggler key={it.id} id={it.id} store={getRemove(it.id)}>
                    <span>{orgMap[it.orgId!]}</span>
                    <span>{it.price}</span>
                </RemoveToggler>)
            }
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
        <Card />
        <Details />
    </main>
}


export default ProductPage