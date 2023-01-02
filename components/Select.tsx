import {EditItem, List} from '../stores'

const Options = (p: { store: List<any> }) => {
	p.store.useStatus()

	return <>
		<option value={undefined}>выберите</option>
		{
			p.store.items.map(it =>
				<option key={it.id} value={it.id}>{it.name}</option>
			)
		}
	</>
}

type Props<T> = {
	store: [EditItem<T>, List<any>]
	fieldName: keyof T
}

const Select = <T,>(p: Props<T>) => {
	const wait = p.store[0].useStatus() == 'wait'

	return <select disabled={wait} onChange={e =>
		p.store[0].value[p.fieldName] = parseInt(e.target.value) as T[keyof T]
	}>
		<Options store={p.store[1]} />
	</select>
}


export default Select