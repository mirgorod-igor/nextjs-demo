module api {
	type Status = 'ok' | 'wait' | 'net' | 'error'

	type Query<T> = {
		[P in T]: string
	}

	type View<T> = {
		status: api.Status
		data: T | null
	}

	type PagedList<T> = {
		items: T[]
		total: number
	}
}