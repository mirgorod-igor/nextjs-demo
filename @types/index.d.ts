type Id = {
	id: number
}

type IdName = Id & {
	name
}


type ModelType = 'region' | 'product' | 'price' | 'org'


module store {
	type PageNum = number | 'l' | 'r'

	type StatusListener = (st: api.Status) => void

	interface Api {
		readonly status: api.Status
		useStatus(): api.Status
		listen(listener: StatusListener)
	}

	interface Edit<T> extends Api {
		opened: boolean
		useOpened(): boolean
		submit(): Promise<api.Status>
		cancel()
		value: T
	}


	type ItemsListener<T> = ((items: T[]) => void)
	interface List<T> extends Api {
		items: T[]
		fetch(): Promise<boolean>
		listenItems(listener: ItemsListener<T>)
		remove(id: number): store.Remove
		listenRemove(listener: StatusListener)
	}
	interface PagedList<T> extends List<T> {
		readonly page: store.PageNum
		gotoPage(num: store.PageNum)
		pages: store.PageNum[]
		fetchBegin(): Promise<void>
	}

	interface Remove extends Api {
		readonly type: string
		//new (type: ModelType, id: number): Remove
		remove(): Promise<boolean>
	}

	interface Compose<T> {
		edit: Edit<T>
		list: PagedList<T>
	}

}

