import {Trade, Price, Product, Region, Org} from '@prisma/client'

import EditItem from './EditItem'
import RemoveItem from './RemoveItem'
import List from './List'



const compose = <T,>(type: ModelType) => ({
	edit: new EditItem<T>(type),
	list: new List<T>(type),
	remove: new RemoveItem(type),
} as store.Compose<T>)

export const
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
			store.list.fetch()
		}
	})



region.remove.listenStatus(async st => {
	if (st == 'ok') {
		await region.list.fetch()
		org.list.fetch()
		price.list.fetch()
	}
})

org.remove.listenStatus(async st => {
	if (st == 'ok') {
		await org.list.fetch()
		price.list.fetch()
	}
})


product.remove.listenStatus(async st => {
	if (st == 'ok') {
		await product.list.fetch()
		price.list.fetch()
	}
})


price.remove.listenStatus(st => {
	if (st == 'ok')
		price.list.fetch()
})



region.list.listenItems(items => {
	items.map(it => regionMap[it.id] = it.name)
})

product.list.listenItems(items => {
	items.map(it => productMap[it.id] = it.name)
})
