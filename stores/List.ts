import {atom} from 'nanostores'
import {useStore} from '@nanostores/react'




class List<T> {
	private readonly type: ModelType
	private _items: T[] = []
	private _status = atom<api.Status | undefined>()
	private get status() {
		return this._status.get()
	}
	private set status(v) {
		this._status.set(v)
	}


	constructor(type: ModelType) {
		this.type = type
	}
	
	async fetch() {
		this._items = []
		this.status = undefined
		const res = await fetch('/api/list?type=' + this.type)
		if (res.ok) {
			const data = await res.json()
			this._items = data.items
			this.status = 'ok'
		}
		else {
			this.status = 'error'
		}
	}
	
	
	get items() {
		return this._items
	}
	set items(v) {
		this._items = v
	}
	
	forceRefresh() {
		this.status = undefined
		this._status.notify()
		this.status = 'ok'
	}
	
	
	useStatus() {
		return useStore(this._status)
	}

	onStatus(listener: (st: api.Status | undefined) => void) {
		this._status.subscribe(listener)
	}
}


export default List