import Link from 'next/link'
import {RemoveToggler} from '.'

import sty from 'styles/view.module.sass'


export const Prices = (p: {
    items: Price[]
    level: number
    removeStoreFactory
    children: (it: Price, level: number) => JSX.Element
}) => <>{
    p.items?.map(it =>
        it.childs?.length
            ? <Prices
                items={it.childs}
                level={p.level+1}
                removeStoreFactory={p.removeStoreFactory}
                children={p.children}
            />
            : <RemoveToggler
                key={it.id} id={it.id}
                store={p.removeStoreFactory(it.id)}
            >
                {p.level > 0 && new Array(p.level).fill(<u />)}
                {p.children(it, p.level)}
                <b>{it.price}</b>
            </RemoveToggler>
    )
}</>


type Props = {
    level: number
    href: string
    it: Product
    removeStoreFactory: (id: number) => store.Remove
    children: (it: Price, level: number) => JSX.Element
}

const PriceList = (p: Props) => {
    const hasChilds = p.it.prices?.[0]?.childs?.length
        , cn = hasChilds ? sty.prices : sty.item

    return <div className={cn}>
        <div>
            {new Array(p.level).fill(<u/>)}
            <Link href={p.href}>{p.it.name}</Link>
        </div>
        {
            p.it.prices &&
                <Prices
                    items={p.it.prices} level={p.level}
                    removeStoreFactory={p.removeStoreFactory}
                    children={p.children}
                />
        }
    </div>
}


export default PriceList