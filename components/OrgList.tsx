import {Fragment} from 'react'

import {List} from '.'

import {org, tradeMap, regionMap} from 'stores'


import sty from 'styles/list.module.sass'




const OrgList = () => {
    const region = (id: number) => <b>{regionMap[id]}</b>

    return <List
        className={sty.orgs} store={org.list}
        compareFn={(it1, it2) => it1.regionId > it2.regionId ? 1 : -1}
        group={['regionId', region]}
    >
        {
            it => <Fragment key={it.id}>
                <span>{it.name}</span>
                <span>{it.legalAddr}</span>
                <span>{tradeMap[it.trade]}</span>
            </Fragment>
        }
    </List>
}


export default OrgList