const Options = (p: { store: store.List<any> }) => {
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
	edit: store.Edit<T>
	list: store.List<any>
	fieldName: keyof T
}

const Select = <T,>(p: Props<T>) => {
	const wait = p.edit.useStatus() == 'wait'

	return <select disabled={wait} onChange={e =>
		p.edit.value[p.fieldName] = parseInt(e.target.value) as T[keyof T]
	}>
		<Options store={p.list} />
	</select>
}


export default Select