import {Fragment} from 'react'
import {Price} from '@prisma/client'

import {RemoveToggler} from '.'

import {price, productMap, regionMap} from 'stores'

import sty from 'styles/home.module.sass'


const Item = (p: { item: Price }) => {

    return <RemoveToggler id={p.item.id} store={price.remove}>
        <span>{productMap[p.item.productId]}</span>
        <span>{p.item.price}</span>
    </RemoveToggler>
}

const PriceList = () => {
    const st = price.list.useStatus()

    const items = price.list.items.sort((it1, it2) =>
        it1.regionId > it2.regionId ? 1 : -1
    )


    const show = {}

    const region = (id: number) =>
        !show[id] && (
            show[id] = true, <b>{regionMap[id]}</b>
        )


    return (!st || st == 'wait') ? <div className={sty.loading} /> : <div className={sty.prices}>
        {
            items.map(it => <Fragment key={it.id}>
                {region(it.regionId)}
                <Item item={it} />
            </Fragment>)
        }
    </div>
}


export default PriceList