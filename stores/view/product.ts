import {Org} from '@prisma/client'

import ViewItem from '../ViewItem'
import PagedList from '../PagedList'

import {List, RemoveItem} from '..'



class OrgList extends PagedList<TreeItem<Org>> {
    #productId?: number

    constructor() {
        super('org')
    }

    protected override get url() {
        return super.url + '&productId=' + this.#productId
    }

    async load(productId: number) {
        this.#productId = productId
        return super.fetch()
    }
}


export const
    product = new ViewItem<{ view: Product, orgs: Record<number, string> }>('product'),
    orgs = new List<IdName>('org'),
    orgMap: Record<number, string> = {}



orgs.listenItems(items => {
    items.map(it => orgMap[it.id] = it.name)
})
