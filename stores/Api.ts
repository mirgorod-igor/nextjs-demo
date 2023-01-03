import {atom} from 'nanostores'
import {useStore} from '@nanostores/react'

class Api implements store.Api {
    protected _status = atom<api.Status|undefined>()
    get status() {
        return this._status.get()
    }
    protected set status(v) {
        this._status.set(v)
    }

    protected onJson(data: any) {

    }

    protected async call(url: string, body?: any, method = 'POST'): Promise<boolean> {
        this.status = 'wait'
        let res = false
        const modify = method && body

        try {
            const resp = await fetch(url, {
                method: method ?? 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: modify ? JSON.stringify(body) : undefined
            })

            if (!modify) {
                if (resp.ok) {
                    const data = await resp.json()
                    this.onJson(data)
                }
            }

            this.status = (res = resp.ok) ? 'ok' : 'error'
        }
        catch (e) {
            this.status = 'net'
        }

        return res
    }

    listenStatus(listener: (st: api.Status|undefined) => void) {
        this._status.listen(listener)
    }

    useStatus() {
        return useStore(this._status)
    }
}


export default Api