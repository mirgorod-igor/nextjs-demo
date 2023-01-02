import {atom} from 'nanostores'
import {useStore} from '@nanostores/react'

class EditItem<T = any> {
	private _value: T
	private _opened = atom(false)

	private _status = atom<api.Status|'wait'|undefined>(undefined)
	private get status() {
		return this._status.get()
	}
	private set status(v) {
		this._status.set(v)
	}

	private _type = ''
	
	constructor(type: string) {
		this._type = type
		this._value = {} as T
	}

	useStatus() {
		return useStore(this._status)
	}
	get value() {
		return this._value
	}
	set value(v: T) {
		this._value = v
	}
	
	useOpened() {
		return useStore(this._opened)
	}
	set opened(v: boolean) {
		this._opened.set(v)
	}
	
	async submit() {
		this.status = 'wait'
		try {
			const res = await fetch('/api/save', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					type: this._type, item: this.value
				})
			})
			if (res.ok) {
				const s = await res.json()
				this.status = s.status
				this.opened = false
			}
			else {
				this.status = 'error'
			}
		}
		catch (e) {
			this.status = 'net'
		}
		
		return this.status
	}
	
	cancel() {
		this.value = {} as T
		this.opened = false
	}
}


export default EditItem