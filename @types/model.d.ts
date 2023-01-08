interface Id {
    id: number
}

interface IdName extends Id {
    name
}

interface TreeItem<T> {
    parent?: T|null
    childs?: (T & TreeItem<T>)[]
}

interface Price extends Id {
    orgId?: number
    org?: IdName
    price: number
}

interface Product extends IdName, TreeItem<Product> {
    category?: IdName
    price?: number
    prices: Price[]
}

interface Org extends IdName, TreeItem<Org> {
    legalAddr: string
    region: IdName
}