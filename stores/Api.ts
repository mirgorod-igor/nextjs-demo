import {atom} from 'nanostores'
import {useStore} from "@nanostores/react";

class Api {
    private _status = atom<api.Status|undefined>()
    get status() {
        return this._status.get()
    }
    protected set status(v) {
        this._status.set(v)
    }

    protected async call(url: string, body, any, method = 'POST') {
        this.status = 'wait'
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            this.status = res.ok ? 'ok' : 'error'

            return res.ok
        }
        catch (e) {
            this.status = 'net'
        }

        return false
    }

    onStatus(listener: (st: api.Status|undefined) => void) {
        this._status.subscribe(listener)
    }

    useStatus() {
        return useStore(this._status)
    }
}


export default Api