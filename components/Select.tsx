import {ChangeEventHandler, ReactNode} from 'react'

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
	list?: store.List<any>
	children?: ReactNode
	onChange: ChangeEventHandler<HTMLSelectElement>
}

const Select = <T,>(p: Props<T>) => {
	const wait = p.edit.useStatus() == 'wait'

	return <select disabled={wait} onChange={p.onChange}>
		{ p.list ? <Options store={p.list} /> : p.children }
	</select>
}


export default Select