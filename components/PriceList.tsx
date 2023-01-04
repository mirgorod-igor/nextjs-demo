import {Fragment} from 'react'

import {List} from '.'

import {price, productMap, regionMap} from 'stores'

import sty from 'styles/list.module.sass'



const PriceList = () => {

    const region = (id: number) => <b>{regionMap[id]}</b>

    return <List
        className={sty.prices} store={price.list}
        compareFn={(it1, it2) => it1.regionId > it2.regionId ? 1 : -1}
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