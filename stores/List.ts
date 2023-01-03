import Api from './Api'



class List<T> extends Api implements store.List<T> {
	private readonly type: ModelType
	private _items: T[] = []
	private _itemsListeners: store.ItemsListener<T>[] = []

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

	async fetch() {
		this._items = []
		return await this.call('/api/list?type=' + this.type)
	}
	
	get items() {
		return this._items
	}
}


export default List