import {Trade, Price, Product, Region, Org} from '@prisma/client'

import EditItem from './EditItem'
import RemoveItem from './RemoveItem'

import List from './List'
import PagedList from './PagedList'



const compose = <T,>(type: ModelType) => ({
	edit: new EditItem<T>(type),
	list: new PagedList<T>(type),
	remove: new RemoveItem(type),
} as store.Compose<T>)

export const
	// для селекта
	regionList = new List<Region>('region'),
	region = compose<Region>('region'),
	product = compose<Product>('product'),
	price = compose<Price>('price'),
	org = compose<Org>('org'),

	regionMap: Record<number, string> = {},
	productMap: Record<number, string> = {},
	tradeMap: Record<Trade, string> = {
		w: 'опт',
		r: 'роз'
	}


for (const store of [region, org, product, price])
	store.edit.listenStatus(st => {
		if (st == 'ok') {
			store.list.fetchPage()
		}
	})

region.edit.listenStatus(st => {
	if (st == 'ok')
		regionList.fetch()
})

region.remove.listenStatus(async st => {
	if (st == 'ok') {
		await region.list.fetchPage()
		await regionList.fetch()
		org.list.fetchPage()
		price.list.fetchPage()
	}
})

org.remove.listenStatus(async st => {
	if (st == 'ok') {
		await org.list.fetchPage()
		price.list.fetchPage()
	}
})


product.remove.listenStatus(async st => {
	if (st == 'ok') {
		await product.list.fetchPage()
		price.list.fetchPage()
	}
})


price.remove.listenStatus(st => {
	if (st == 'ok')
		price.list.fetchPage()
})



regionList.listenItems(items => {
	items.map(it => regionMap[it.id] = it.name)
})

product.list.listenItems(items => {
	items.map(it => productMap[it.id] = it.name)
})



export const fetchData = () => {
	Promise.all([
		region.list.fetchPage(),
		product.list.fetchPage(),
		regionList.fetch()
	]).then(() => {
		org.list.fetchPage()
		price.list.fetchPage()
	})
}