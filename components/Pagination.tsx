import More from 'svg/more.svg'

type Props<T> = {
    store: store.PagedList<T>
}

const Pagination = <T,>(p: Props<T>) => {
    let dots = false

    return <ul className='paging'>
        {
            p.store.pages.map(it => (
                dots = isNaN(it as number),
                    <li
                        className={`${dots?'dots':''} ${p.store.page == it?'active':''}`.trim() || undefined}
                        onClick={_ => p.store.gotoPage(it)}
                    >{isNaN(it as number) ? <More /> : it as number + 1}</li>
            ))
        }
    </ul>
}

export default Pagination