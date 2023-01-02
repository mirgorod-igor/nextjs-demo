module api {
	type Status = 'ok' | 'net' | 'error'
	
	type PagedList<T> = {
		items: T[]
		total: number
	}
}