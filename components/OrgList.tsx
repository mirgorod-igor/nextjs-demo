import {Fragment} from 'react'
import {Org} from '@prisma/client'

import {RemoveToggler} from '.'

import {org, tradeMap, regionMap} from 'stores'


import sty from 'styles/home.module.sass'


const Item = (p: { item: Org }) => {

    return <RemoveToggler id={p.item.id} store={org.remove}>
        <span>{p.item.name}</span>
        <span>{p.item.legalAddr}</span>
        <span>{tradeMap[p.item.trade]}</span>
    </RemoveToggler>
}

const OrgList = () => {
    const st = org.list.useStatus()

    const items = org.list.items.sort((it1, it2) =>
        it1.regionId > it2.regionId ? 1 : -1
    )

    const show = {}

    const region = (id: number) =>
        !show[id] && (
            show[id] = true, <b>{regionMap[id]}</b>
        )


    return (!st || st == 'wait') ? <div className={sty.loading} /> : <div className={sty.orgs}>
        {
            items.map(it => <Fragment key={it.id}>
                {region(it.regionId)}
                <Item item={it} />
            </Fragment>)
        }
    </div>
}


export default OrgList