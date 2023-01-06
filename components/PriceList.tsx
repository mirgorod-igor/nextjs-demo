import {Fragment} from 'react'

import {List} from '.'

import {productMap, regionMap} from 'stores'
import {price} from 'stores/home'

import sty from 'styles/list.module.sass'



const PriceList = () => {

    const region = (id: number) => <b>{regionMap[id]}</b>

    return <List
        className={sty.prices} store={price.list}
        group={['regionId', region]}
    >
        {
            it => <Fragment key={it.id}>
                <span>{productMap[it.productId]}</span>
                <span>{it.price}</span>
            </Fragment>
        }
    </List>
}


export default PriceList