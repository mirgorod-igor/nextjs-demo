import {RemoveToggler} from '.'

import sty from '../styles/list.module.sass'



const Item = <T extends Id,>(p: T & { store: store.Remove }) => {

	return <RemoveToggler id={p.id} store={p.store}>
		<span>{p['name']}</span>
	</RemoveToggler>
}

const List = <T extends Id,>(p: {
	store: store.Compose<T>
}) => {
	const st = p.store.list.useStatus()

	return (!st || st == 'wait') ? <div className={sty.loading} /> : <div className={sty.list}>
		{
			p.store.list.items.map((it, i) => <Item key={i} store={p.store.remove} {...it} />)
		}
	</div>
}



export default List