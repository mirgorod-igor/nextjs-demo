import ViewItem from '../ViewItem'
import PagedList from '../PagedList'



class ProductList extends PagedList<Product> {
    #orgId?: number

    constructor() {
        super('product')
    }

    protected override get url() {
        return super.url + '&orgId=' + this.#orgId
    }

    async load(orgId: number) {
        this.#orgId = orgId
        return super.fetch()
    }
}

export const
    view = new ViewItem<Org>('org'),
    products = new ProductList()