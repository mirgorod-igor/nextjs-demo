import {ReactNode} from 'react'
import {ApiToggler} from '.'



type Props = {
    id
    store: store.Remove
    children: ReactNode
}

const RemoveToggler = (p: Props) => {
    const name = 'remove-' + p.store.type
    return <div>
        <ApiToggler id={p.id} store={p.store} name={name} onChange={_ => p.store.remove()} />
        {p.children}
        <label htmlFor={name + '-' + p.id}>&ndash;</label>
    </div>
}

export default RemoveToggler