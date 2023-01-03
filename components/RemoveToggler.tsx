import {ReactNode} from 'react'


const Radio = (p: Props & { name }) => {
    p.store.useId(p.id)
    const st = p.store.status

    return <input
        type='radio' id={p.name + '-' + p.id} className={st} checked={st == 'wait'}
        onChange={_ => p.store.remove(p.id)}
    />
}


type Props = {
    id
    store: store.Remove
    children: ReactNode
}

const RemoveToggler = (p: Props) => {

    return <>
        <Radio name='remove' {...p} />
        {p.children}
        <label htmlFor={'remove-' + p.id}>&ndash;</label>
    </>
}

export default RemoveToggler