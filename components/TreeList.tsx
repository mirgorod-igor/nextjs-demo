import {ReactNode} from 'react'

import {Pagination, RemoveToggler} from '.'

import {product} from 'stores/home'

import sty from 'styles/list.module.sass'



type Children<T> = (it: T & TreeItem<T>, level: number) => ReactNode

interface TreeProps<T> {
    item: T & TreeItem<T>
    level: number
    children: Children<T>
}

const Tree = <T,>(p: TreeProps<T>) => {
    return p.item.childs ? <>
        <div style={{ textIndent: p.level * 40 + 'px' }}>{p.item.name}</div>
        {
            p.item.childs?.map(it => <Tree item={it} children={p.children} level={p.level + 1} />)
        }
    </> : <RemoveToggler id={p.item.id} store={product.list.remove(p.item.id)}>
        {p.children(p.item, p.level??0)}
    </RemoveToggler>
}


type Props<T> = {
    children: Children<T>
    store: store.PagedList<T>
}

const TreeList = <T extends TreeItem<T>,>(p: Props<T>) => {
    const st = p.store.useStatus()
        , items = p.store.items

    const loading = !st || st == 'wait' ? ' '+sty.loading : ''

    return <>
        <div className={sty.list + loading}>
            {
                items.map((it, i) =>
                    <Tree key={i} item={it} children={p.children} level={0} />
                )
            }
        </div>
        <Pagination store={p.store} />
    </>
}


export default TreeList