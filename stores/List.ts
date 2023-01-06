import Api from './Api'
import RemoveItem from './RemoveItem'


class List<T> extends Api implements store.List<T> {
	private readonly type: ModelType

	private _remove: Record<number, RemoveItem> = {}
	private _items: T[] = []
	private _itemsListeners: store.ItemsListener<T>[] = []
	private _removeListeners: store.StatusListener[] = []

	constructor(type: ModelType) {
		super()
		this.type = type
	}

	protected override onJson(data: api.PagedList<T>) {
		this._items = data.items

		for (const l of this._itemsListeners)
			l(this._items)
	}

	listenItems(listener: store.ItemsListener<T>) {
		this._itemsListeners.push(listener)
	}

	protected get url() {
		return `/api/${this.type}/list?`
	}
	async fetch() {
		return await this.call(this.url)
	}

	get items() {
		return this._items
	}

	private async removeHandler(st: api.Status) {
		if (st == 'ok')
			await this.fetch()
		for (const l of this._removeListeners)
			l(st)
	}

	remove(id: number) {
		let store = this._remove[id]
		if (!store) {
			store = this._remove[id] = new RemoveItem(this.type, id)
			store.listen(this.removeHandler.bind(this))
		}

		return store
	}

	listenRemove(listener: store.StatusListener) {
		this._removeListeners.push(listener)
	}
}


export default List