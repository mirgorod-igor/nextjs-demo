import {EditItem} from '../stores'

type Props<T> = {
    item: EditItem<T>
    placeholder: string
    fieldName: keyof T
    asNumber?: boolean
}

const Input = <T,>(p: Props<T>) => {
    const st = p.item.useStatus()

    return <input
        disabled={st == 'wait'}
        placeholder={p.placeholder}
        type={p.asNumber ? 'number' : 'text'}
        onChange={e => p.item.value[p.fieldName] = (p.asNumber ? e.target.valueAsNumber : e.target.value) as T[keyof T]} />
}


export default Input