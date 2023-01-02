import {atom} from 'nanostores'
import {useStore} from '@nanostores/react'

class List<T> {
	private readonly type: ModelType
	private _items: T[] = []
	status = atom<api.Status | 'removing' | undefined>()
	removingId?: number

	constructor(type: ModelType) {
		this.type = type
	}
	
	async fetch() {
		this._items = []
		this.status.set(undefined)
		const res = await fetch('/api/list?type=' + this.type)
		if (res.ok) {
			const data = await res.json()
			this._items = data.items
			this.status.set('ok')
		}
		else {
			this.status.set('error')
		}
	}
	
	
	get items() {
		return this._items
	}
	set items(v) {
		this._items = v
	}
	
	async remove(id: number) {
		this.removingId = id
		this.status.set('removing')
		try {
			const res = await fetch('/api/remove', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id, type: this.type })
			})

			if (res.ok) {
				this.removingId = undefined
				this.fetch()
			}
			else {
				this.status.set('error')
			}

			return res.ok
		}
		catch (e) {
			this.status.set('net')
		}

		return false
	}
	
	forceRefresh() {
		this.status.set(undefined)
		this.status.notify()
		this.status.set('ok')
	}
	
	
	useStatus() {
		return useStore(this.status)
	}
}


export default List