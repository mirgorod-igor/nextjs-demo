import * as store from '../stores'

import sty from '../styles/list.module.sass'

const List = <T extends Id,>(p: {
	store: store.List<T>
}) => {
	const status = p.store.useStatus()
	const remove = async (id: number) => {
		const res = await p.store.remove(id)
		if (res)
			store.priceList.fetch()
	}
	
	return !status ? <>загрузка</> : <div className={sty.list}>{
		p.store.items.map((it, i) => <div key={i}>
			{it['name']}
			<i onClick={_ => remove(it.id)}>&ndash;</i>
		</div>)
	}</div>
}



export default List