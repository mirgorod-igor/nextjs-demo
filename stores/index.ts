import {Price, Product, Region} from '@prisma/client'

import EditItem from './EditItem'
import RemoveItem from './RemoveItem'
import List from './List'

export { EditItem, RemoveItem, List }

const compose = <T,>(type: ModelType) => ({
	edit: new EditItem<T>(type),
	list: new List<T>(type),
	remove: new RemoveItem(type),
} as store.Compose<T>)

export const
	region = compose<Region>('region'),
	product = compose<Product>('product'),
	price = compose<Price>('price'),

	regionMap: Record<number, string> = {},
	productMap: Record<number, string> = {}


for (const store of [region, product, price])
	store.edit.onStatus(st => {
		if (st == 'ok') {
			store.list.fetch()
		}
	})



region.remove.onStatus(st => {
	if (st == 'ok') {
		region.list.fetch()
		price.list.fetch()
	}
})


product.remove.onStatus(st => {
	if (st == 'ok') {
		product.list.fetch()
		price.list.fetch()
	}
})


price.remove.onStatus(st => {
	if (st == 'ok')
		price.list.fetch()
})



region.list.onStatus(v => {
	region.list.items.map(it => regionMap[it.id] = it.name)
})

product.list.onStatus(v => {
	product.list.items.map(it => productMap[it.id] = it.name)
})
