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

	let isRem
	
	return !status ? <>загрузка</> : <div className={sty.list}>{
		p.store.items.map((it, i) => (isRem = it.id == p.store.removingId, <div key={i} className={isRem ? sty.disabled : undefined}>
			{it['name']}
			<i onClick={!isRem ? _ => remove(it.id) : undefined}>&ndash;</i>
		</div>))
	}</div>
}



export default List