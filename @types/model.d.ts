interface Id {
    id: number
}

interface IdName extends Id {
    name
}

interface TreeItem<T> extends IdName {
    parent?: T & IdName|null
    childs?: (T & TreeItem<T>)[]
}

interface Price extends Id {
    orgId?: number
    org?: IdName
    price: number
}

interface Product extends TreeItem<Product> {
    price?: number
    prices: Price[]
}

interface Org extends TreeItem<Org> {
    legalAddr: string
    region: IdName
}