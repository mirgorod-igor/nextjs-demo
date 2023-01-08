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
    price?: number
    childs?: Price[]
}

interface Product extends IdName, TreeItem<Product> {
    category?: IdName
    price?: number
    prices?: Price[]
}

interface Org extends IdName, TreeItem<Org> {
    desc: string
    legalAddr: string
    region: IdName
}