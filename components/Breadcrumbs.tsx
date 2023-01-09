import Link from 'next/link'

type Props = {
    items: [string, string][]
}
const Breadcrumbs = (p: Props) => {
    return <nav className='breakcrumbs'>
        {
            p.items.map(it => <Link href={it[0]}>{it[1]}</Link>)
        }
    </nav>
}

export default Breadcrumbs