import {EditItem, List} from '../stores'


type Props<T> = {
	store: [EditItem<T>, List<any>]
	valueName: keyof T
}

const Select = <T,>(p: Props<T>) => {
	p.store[1].useStatus()
	return <select onChange={e =>
		//@ts-ignore
		p.store[0].value[p.valueName] = parseInt(e.target.value)
	}>
		<option value={undefined}>выберите</option>
		{
			p.store[1].items.map(it =>
				<option key={it.id} value={it.id}>{it.name}</option>
			)
		}
	</select>
}


export default Select