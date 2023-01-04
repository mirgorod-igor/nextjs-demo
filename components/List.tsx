import {Fragment, ReactNode} from 'react'

import {RemoveToggler} from '.'

import More from 'svg/more.svg'

import sty from 'styles/list.module.sass'


type P<T> = {
	store: store.PagedList<T>
}

const Pagination = <T,>(p: P<T>) => {
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



type Props<T extends Id> = {
	className?: string
	store: store.PagedList<T>
	children(it: T, i: number): ReactNode
	compareFn?(a: T, b: T): number
	group?: [keyof T, (id) => ReactNode]
}


const List = <T extends Id,>(p: Props<T>) => {
	const st = p.store.useStatus()
		, items = p.compareFn ? p.store.items.sort(p.compareFn) : p.store.items

	const wait = !st || st == 'wait'


	let show = {}

	const group = (it: T) => {
		const id = it[p.group![0]] as number
		return !show[id] && (
			show[id] = true, p.group![1](id)
		)
	}

	return <>
		<div className={`${sty.list} ${wait ? sty.loading : ''} ${p.className ?? ''}`.trim()}>
			{
				items.map((it, i) => <Fragment key={i}>
					{p.group ? group(it) : undefined}
					<RemoveToggler id={it.id} store={p.store.remove(it.id)}>
						{p.children(it, i)}
					</RemoveToggler>
				</Fragment>)
			}
		</div>
		<Pagination store={p.store} />
	</>
}



export default List