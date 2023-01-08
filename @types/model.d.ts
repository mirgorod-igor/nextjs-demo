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
    org?: Org
    price?: number
    childs?: Price[]
}

interface Product extends IdName, TreeItem<Product> {
    group?: IdName
    price?: number
    prices?: Price[]
}

interface Org extends IdName, TreeItem<Org> {
    desc: string
    legalAddr: string
    region: IdName
}