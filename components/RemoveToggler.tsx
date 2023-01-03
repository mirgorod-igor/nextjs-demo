import {ReactNode} from 'react'


type Props = {
    id
    store: store.Remove
    children: ReactNode
}

const RemoveToggler = (p: Props) => {
    p.store.useId(p.id)
    const st = p.store.status

    return <>
        <input
            type='radio' id={'remove-' + p.id} className={st} checked={st == 'wait'}
            onChange={_ => p.store.remove(p.id)}
        />
        {p.children}
        <label htmlFor={'remove-' + p.id}>&ndash;</label>
    </>
}

export default RemoveToggler