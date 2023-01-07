import {ChangeEventHandler} from 'react'

type Props = {
    id
    name
    store: store.Api
    onChange?: ChangeEventHandler<HTMLInputElement>
}

const ApiToggler = (p: Props) => {
    const st = p.store.useStatus()

    return <input
        type='radio' id={`${p.name}-${p.id}`} className={'_T_ '+st}
        checked={st == 'wait'} onChange={p.onChange}
    />
}


export default ApiToggler