import {atom} from 'nanostores'
import {useStore} from '@nanostores/react'

class EditItem<T = any> {
	private _value: T
	private _opened = atom(false)
	private _status = atom<api.Status|undefined>(undefined)
	
	private _type = ''
	
	constructor(type: string) {
		this._type = type
		this._value = {} as T
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
		this._status.set(undefined)
		try {
			const res = await fetch('/api/save', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					type: this._type, item: this._value
				})
			})
			if (res.ok) {
				const s = await res.json()
				this._status.set(s.status)
				this.opened = false
			}
			else {
				this._status.set('error')
			}
		}
		catch (e) {
			this._status.set('net')
		}
		
		return this._status.get()
	}
	
	cancel() {
		this.value = {} as T
		this.opened = false
	}
}


export default EditItem