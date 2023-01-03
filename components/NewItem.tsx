import {ReactNode} from 'react'


import sty from '../styles/home.module.sass'





const ToggleNew = (p: { id: string, edit: store.Edit<any> }) => {
	return <span className={sty.toggleNew}>
		<input
			type='checkbox' id={p.id}
			onClick={e => p.edit.opened = e.currentTarget.checked}/>
		<label htmlFor={p.id}> новая</label>
	</span>
}



const NewItem = (p: {
	name: string
	children: ReactNode
	store: store.Edit<any>
}) => {
	const opened = p.store.useOpened()
	return opened
		? <div className={sty.newItem}>
			{p.children}
			<span onClick={_ => p.store.submit()} />
			<span onClick={_ => p.store.cancel()} />
		</div>
		: <ToggleNew id={'toggler_new_' + p.name} edit={p.store} />
}


export default NewItem