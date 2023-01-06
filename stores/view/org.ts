import ViewItem from 'stores/ViewItem'
import {Org, Price, Prisma, Product} from '@prisma/client'

import PagedList from 'stores/PagedList'



class ProductList extends PagedList<TreeItem<Product & { prices: Pick<Price, 'price'>[] }>> {
    #orgId?: number

    constructor() {
        super('product')
    }

    protected override get url() {
        return super.url + '&tree=true&orgId=' + this.#orgId
    }

    async load(orgId: number) {
        this.#orgId = orgId
        return super.fetch()
    }
}

export const
    view = new ViewItem<Org>('org'),
    products = new ProductList()