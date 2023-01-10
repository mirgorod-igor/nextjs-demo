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
    price?: number|null
    childs?: Price[]
}

interface Product extends IdName, TreeItem<Product> {
    category?: IdName|null
    group?: IdName|null
    prices?: Price[]
}

interface Org extends IdName, TreeItem<Org> {
    desc: string
    legalAddr: string
    region: IdName
}