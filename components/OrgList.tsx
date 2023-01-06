import {Fragment} from 'react'

import Link from 'next/link'

import {List} from '.'


import {tradeMap, regionMap} from 'stores'
import {org} from 'stores/home'

import sty from 'styles/list.module.sass'




const OrgList = () => {
    const region = (id: number) => <b>{regionMap[id]}</b>

    return <List
        className={sty.orgs} store={org.list}
        group={['regionId', region]}
    >
        {
            it => <Fragment key={it.id}>
                <Link href={'org/' + it.id}>{it.name}</Link>
                <span>{it.legalAddr}</span>
                <span>{tradeMap[it.trade]}</span>
            </Fragment>
        }
    </List>
}


export default OrgList