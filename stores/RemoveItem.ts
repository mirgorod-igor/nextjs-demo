import Api from './Api'
import {atom, WritableAtom} from 'nanostores'
import {useStore} from "@nanostores/react"


class RemoveItem extends Api implements store.Remove {
    private readonly type: ModelType
    id: Record<number, WritableAtom<boolean>> = {}

    constructor(type: ModelType) {
        super()
        this.type = type
    }

    async remove(id: number) {
        if (this.id[id].get())
            return false

        this.id[id].set(true)

        const res = await this.call(
            '/api/remove', { id, type: this.type }, 'DELETE'
        )

        this.id[id].set(false)

        return res
    }

    useId(id) {
        if (!this.id[id])
            this.id[id] = atom(false)
        return useStore(this.id[id])
    }
}


export default RemoveItem