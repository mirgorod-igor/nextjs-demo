import ViewItem from 'stores/ViewItem'
import {Org, Product} from '@prisma/client'

import PagedList from 'stores/PagedList'



class ProductList extends PagedList<TreeItem<Product & { price: number }>> {
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
    view = new ViewItem<TreeItem<Org & { head: IdName }>>('org'),
    products = new ProductList()