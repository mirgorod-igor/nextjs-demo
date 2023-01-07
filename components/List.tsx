import {Fragment, ReactNode} from 'react'

import {Pagination, RemoveToggler} from '.'


import sty from 'styles/list.module.sass'



type Props<T extends Id> = {
	className?: string
	store: store.PagedList<T>
	children(it: T, i: number): ReactNode
	group?: [keyof T, (id) => ReactNode]
}


const List = <T extends Id,>(p: Props<T>) => {
	const st = p.store.useStatus()

	const wait = !st || st == 'wait'


	let show = {}

	const group = (it: T) => {
		const id = it[p.group![0]] as number
		return !show[id] && (
			show[id] = true, p.group![1](id)
		)
	}

	return <>
		<div className={`${sty.list} ${wait ? sty.wait : ''} ${p.className ?? ''}`.trim()}>
			{
				p.store.items.map((it, i) => <Fragment key={i}>
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