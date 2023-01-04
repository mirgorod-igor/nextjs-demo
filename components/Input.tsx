import {ChangeEventHandler} from 'react'

type Props<T> = {
    edit: store.Edit<T>
    placeholder: string
    asNumber?: boolean
    onChange?: ChangeEventHandler<HTMLInputElement>
}

const Input = <T,>(p: Props<T>) => {
    const st = p.edit.useStatus()

    return <input
        disabled={st == 'wait'}
        placeholder={p.placeholder}
        type={p.asNumber ? 'number' : 'text'}
        onChange={p.onChange} />
}


export default Input