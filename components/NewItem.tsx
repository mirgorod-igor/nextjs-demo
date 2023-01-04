import {ReactNode} from 'react'

import Toggler from './Toggler'


import sty from 'styles/home.module.sass'



const NewToggler = (p: { id: string, edit: store.Edit<any> }) => {
	return <span className={sty.newToggler}>
		<input
			type='radio' id={p.id} className='_T_'
			onClick={e => p.edit.opened = e.currentTarget.checked}/>
		<label htmlFor={p.id}> добавить</label>
	</span>
}

const SubmitToggler = (p: Props) => {
	return <div className={sty.newItem}>
		<Toggler id={p.name} store={p.store} name='submit' />
		{p.children}
		<span className='icon:check' onClick={_ => p.store.submit()} />
		<span className='icon:cancel' onClick={_ => p.store.cancel()} />
		<span className='icon:loading' />
	</div>
}



type Props = {
	name: string
	children: ReactNode
	store: store.Edit<any>
}

const NewItem = (p: Props) => {
	const opened = p.store.useOpened()
	return opened
		? <SubmitToggler {...p}>
			{p.children}
		</SubmitToggler>
		: <NewToggler id={'toggler_new_' + p.name} edit={p.store} />
}


export default NewItem