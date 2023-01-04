import {Trade, Price, Product, Region, Org} from '@prisma/client'

import EditItem from './EditItem'
import List from './List'
import PagedList from './PagedList'



const compose = <T,>(type: ModelType) => ({
	edit: new EditItem<T>(type),
	list: new PagedList<T>(type)
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
	store.edit.listen(st => {
		if (st == 'ok') {
			store.list.fetch()
		}
	})


region.edit.listen(st => {
	if (st == 'ok')
		regionList.fetch()
})


region.list.listenRemove(async st => {
	if (st == 'ok') {
		await regionList.fetch()
		org.list.fetch()
		price.list.fetch()
	}
})


org.list.listenRemove(async st => {
	if (st == 'ok') {
		price.list.fetch()
	}
})


product.list.listenRemove(async st => {
	if (st == 'ok') {
		price.list.fetch()
	}
})





regionList.listenItems(items => {
	items.map(it => regionMap[it.id] = it.name)
})

product.list.listenItems(items => {
	items.map(it => productMap[it.id] = it.name)
})



export const fetchData = async () => {
	region.list.fetch()
	await Promise.all([
		product.list.fetch(),
		regionList.fetch()
	])
	org.list.fetch()
	price.list.fetch()
}