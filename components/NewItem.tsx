import {ReactNode} from 'react'
import {EditItem, List, priceList} from '../stores'

import sty from '../styles/home.module.sass'


const submit = (item: EditItem, list: List<any>) => {
	item.submit().then(async st => {
		if (st == 'ok') {
			await list.fetch()
			await priceList.forceRefresh()
		}
	})
}


const ToggleNew = (p: { id: string, item: EditItem }) => {
	return <span className={sty.toggleNew}>
		<input
			type='checkbox' id={p.id}
			onClick={e => p.item.opened = e.currentTarget.checked}/>
		<label htmlFor={p.id}> новая</label>
	</span>
}



const NewItem = (p: {
	name: string
	children: ReactNode
	store: [EditItem, List<any>]
}) => {
	const opened = p.store[0].useOpened()
	return opened
		? <div className={sty.newItem}>
			{p.children}
			<span onClick={_ => submit(p.store[0], p.store[1])} />
			<span onClick={_ => p.store[0].cancel()} />
		</div>
		: <ToggleNew id={'toggler_new_' + p.name} item={p.store[0]} />
}


export default NewItem