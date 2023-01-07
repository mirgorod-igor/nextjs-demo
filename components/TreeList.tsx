import {Pagination, RemoveToggler} from '.'

import {product} from 'stores/home'


import sty from 'styles/list.module.sass'
import {ReactNode} from 'react'


type TreeProps<T> = TreeItem<T> & {
    level?: number
    children: (it: TreeItem<T>, level: number) => ReactNode
}

const Tree = <T,>(p: TreeProps<T>) => {
    return p.childs ? <>
        <div style={{ textIndent: (p.level??0) * 40 + 'px' }}>{p.name}</div>
        {
            p.childs?.map(it => <Tree {...it} children={p.children} level={(p.level??0) + 1} />)
        }
    </> : <RemoveToggler id={p.id} store={product.list.remove(p.id)}>
        {/*<span style={{ textIndent: (p.level??0) * 40 + 'px' }}>{p.name}</span>*/}
        {p.children(p, p.level??0)}
    </RemoveToggler>
}


type Props<T> = {
    children: (it: TreeItem<T>, level: number) => ReactNode
    store: store.PagedList<TreeItem<T>>
}

const TreeList = <T,>(p: Props<T>) => {
    const st = p.store.useStatus()
        , items = p.store.items

    const wait = !st || st == 'wait'

    return <>
        <div className={`${sty.list} ${wait ? sty.loading : ''}`.trim()}>
            {
                items.map((it, i) => <Tree key={i} { ...it } children={p.children} />)
            }
        </div>
        <Pagination store={p.store} />
    </>
}


export default TreeList