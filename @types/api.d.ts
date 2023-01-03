module api {
	type Status = 'ok' | 'wait' | 'net' | 'error'
	
	type PagedList<T> = {
		items: T[]
		total: number
	}
}