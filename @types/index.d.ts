type Id = {
	id: number
}

type IdName = Id & {
	name
}


type ModelType = 'region' | 'product' | 'price' | 'org'


module store {
	interface Api {
		readonly status: api.Status|undefined
		useStatus(): api.Status|undefined
		listenStatus(listener: (st: api.Status|undefined) => void)
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
	}

	interface Remove extends Api {
		useId(id): boolean
		remove(id): Promise<boolean>
	}

	interface Compose<T> {
		edit: Edit<T>
		list: List<T>
		remove: Remove
	}

}

