import {Pagination} from '.'


import sty from 'styles/list.module.sass'



type Children<T extends IdName> = (it: T & TreeItem<T>, level: number) => JSX.Element

interface TreeProps<T extends IdName> {
    item: T & TreeItem<T>
    level: number
    children: Children<T>
}

const Tree = <T extends IdName,>(p: TreeProps<T>) => {
    return p.item.childs
        ? <>
            <div style={{ textIndent: p.level * 40 + 'px' }}>{p.item.name}</div>
            {
                p.item.childs.map(it =>
                    <Tree key={it.id} item={it} children={p.children} level={p.level + 1} />
                )
            }
        </>
        : p.children(p.item, p.level??0)
}


type Props<T extends IdName> = {
    children: Children<T>
    status?: api.Status
    store: store.PagedList<T>
}

const TreeList = <T extends IdName & TreeItem<T>,>(p: Props<T>) => {
    const st = p.store.useStatus()
        , items = p.store.items

    const wait = st == 'wait' || p.status == 'wait' ? ' '+sty.wait : ''

    return <>
        <div className={sty.list + wait}>
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