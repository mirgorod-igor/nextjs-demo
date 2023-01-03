import * as store from '../stores'

import {RemoveToggler} from '.'


import sty from '../styles/list.module.sass'


const Item = <T extends Id,>(p: T & { store: store.RemoveItem }) => {

	return <RemoveToggler id={p.id} store={p.store}>
		<span>{p['name']}</span>
	</RemoveToggler>
}

const List = <T extends Id,>(p: {
	store: [store.List<T>, store.RemoveItem]
}) => {
	const status = p.store[0].useStatus()
	
	return !status ? <div className={sty.loading}>загрузка</div> : <div className={sty.list}>
		{
			p.store[0].items.map((it, i) => <Item key={i} store={p.store[1]} {...it} />)
		}
	</div>
}



export default List