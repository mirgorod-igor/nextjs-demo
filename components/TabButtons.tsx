import {ChangeEventHandler, Fragment} from 'react'
import {WritableAtom} from 'nanostores'


const changeHandlerFactory: <T,>(state: WritableAtom<T>) => ChangeEventHandler<HTMLInputElement> =
    <T,>(state) => e => state.set(e.currentTarget.value as T)


type TabProps<T extends string|number> = {
    value: T
    default?: boolean
    onChange: ChangeEventHandler<HTMLInputElement>
}

const Tab = <T extends string|number,>(p: TabProps<T>) => {

    return <input
        id={'tab-'+p.value} defaultChecked={p.default} name='tab' className='_T_' type='radio'
        value={p.value} onChange={p.onChange}
    />
}

type Props<T extends string|number> = {
    items: [T, string, boolean?][]
    state: WritableAtom<T>
}

const TabButtons = <T extends string|number,>(p: Props<T>) => {
    const changeHandler = changeHandlerFactory(p.state)

    return <div className='tabs'>
        {
            p.items.map(it => <Fragment key={it[0]}>
                <Tab value={it[0]} default={it[2]} onChange={changeHandler} />
                <label htmlFor={`tab-${it[0]}`}>{it[1]}</label>
            </Fragment>)
        }
    </div>
}


export default TabButtons