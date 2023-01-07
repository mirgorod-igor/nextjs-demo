interface Id {
    id: number
}

interface IdName extends Id {
    name
}

type TreeItem<T> = T & IdName & {
    parent?: T & IdName|null
    childs?: TreeItem<T>[]
}

interface Price extends Id {
    orgId?: number
    org?: IdName
    price: number
}


type Product = TreeItem<Product> & {
    price?: number
    prices: Price[]
}

type Org = TreeItem<Org> & {
    legalAddr: string
}