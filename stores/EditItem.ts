import {atom} from 'nanostores'
import {useStore} from '@nanostores/react'
import Api from './Api'

class EditItem<T = any> extends Api implements store.Edit<T> {
	private _value: T
	private _edited = atom(false)
	
	constructor(
		private readonly type: string
	) {
		super()
		this._value = {} as T
	}

	get value() {
		return this._value
	}
	set value(v: T) {
		this._value = v
	}
	
	isEdited() {
		return useStore(this._edited)
	}
	set edited(v: boolean) {
		this._edited.set(v)
	}
	
	async submit() {
		const res = await this.call('/api/save', {
			type: this.type, item: this.value
		})

		if (res)
			this.cancel()
		
		return this.status!
	}
	
	cancel() {
		this.value = {} as T
		this.edited = false
	}
}


export default EditItem