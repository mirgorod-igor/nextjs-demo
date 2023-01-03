type Id = {
	id: number
}

type IdName = Id & {
	name
}

type ModelType = 'region' | 'product' | 'price'

module store {
	interface Api {
		readonly status: api.Status|undefined
		useStatus(): api.Status|undefined
		onStatus(listener: (st: api.Status|undefined) => void)
	}

	interface Edit<T> extends Api {
		opened: boolean
		useOpened(): boolean
		submit(): Promise<api.Status>
		cancel()
		value: T
	}

	interface List<T> extends Api {
		items: T[]
		fetch(): Promise<boolean>
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

