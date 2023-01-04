import {ReactNode} from 'react'
import Toggler from './Toggler'



type Props = {
    id
    store: store.Remove
    children: ReactNode
}

const RemoveToggler = (p: Props) => {
    const name = 'remove-' + p.store.type
    return <div>
        <Toggler id={p.id} store={p.store} name={name} onChange={_ => p.store.remove()} />
        {p.children}
        <label htmlFor={name + '-' + p.id}>&ndash;</label>
    </div>
}

export default RemoveToggler