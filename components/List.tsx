import {RemoveToggler} from '.'

import More from 'svg/more.svg'

import sty from 'styles/list.module.sass'



const Item = <T extends Id,>(p: T & { store: store.Remove }) => {

	return <RemoveToggler id={p.id} store={p.store}>
		<span>{p['name']}</span>
	</RemoveToggler>
}

const List = <T extends Id,>(p: {
	store: store.Compose<T>
}) => {
	const st = p.store.list.useStatus()
	const wait = !st || st == 'wait'
	let dots = false

	return <>
		<div className={sty.list + (wait ? ' '+sty.loading : '')}>
			{
				p.store.list.items.map((it, i) =>
					<Item key={i} store={p.store.remove} {...it} />
				)
			}
		</div>
		<ul className='paging'>
		{
			p.store.list.pages.map(it => (
				dots = isNaN(it as number),
				<li
					className={`${dots?'dots':''} ${p.store.list.page == it?'active':''}`.trim() || undefined}
					onClick={_ => p.store.list.gotoPage(it)}
				>{isNaN(it as number) ? <More /> : it as number + 1}</li>
			))
		}
		</ul>
	</>
}



export default List