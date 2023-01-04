import {atom} from 'nanostores'

import List from 'stores/List'


const PAGE_SIZE = 10

class PagedList<T> extends List<T> implements store.PagedList<T> {
	private _page = atom(0)
	private _pageCount = 0
	private _pages = atom<store.PageNum[]>([])
	private _total = 0

	private calcPages(num: number, pageCount: number) {
		let pg: store.PageNum[]
		if (pageCount < 2) {
			pg = []
		} else if (pageCount < 7) {
			pg = [...Array(pageCount).keys()]
		} else {
			const lastPage = pageCount - 1
				, middle = num <= 3 ? 3 : num >= lastPage - 3 ? lastPage - 3 : num

			pg = [
				0,
				num <= 2 ? 1 : 'l',
				middle - 1, middle, middle + 1,
				num + 1 >= lastPage - 1 ? lastPage - 1 : 'r',
				lastPage
			]
		}

		this._pages.set(pg)
	}

	constructor(type: ModelType) {
		super(type)
		this._page.listen(this.fetch.bind(this))
	}

	protected override onJson(data: api.PagedList<T>) {
		super.onJson(data)

		this._total = data.total
		this._pageCount = Math.ceil(data.total / PAGE_SIZE)
		this.calcPages(this.page, this._pageCount)
	}

	gotoPage(num: store.PageNum) {
		if (this.status != 'wait') {
			const next = isNaN(num as number)
				? this.pages[this.pages.indexOf(num) - 1] as number + 1
				: num as number

			this._page.set(next)
		}
	}

	protected override get url() {
		return `${super.url}&page_num=${this.page}&page_size=${PAGE_SIZE}`
	}

	async fetchBegin() {
		if (this.page !== 0)
			this._page.set(0)
		else await this.fetch()
	}

	get page() {
		return this._page.get()
	}

	get pages() {
		return this._pages.get()
	}
}


export default PagedList