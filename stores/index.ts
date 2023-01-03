import {Price, Product, Region} from '@prisma/client'

import EditItem from './EditItem'
import RemoveItem from './RemoveItem'
import List from './List'

export { EditItem, RemoveItem, List }


export const
	regionItem = new EditItem<Region>('region'),
	productItem = new EditItem<Product>('product'),
	priceItem = new EditItem<Price>('price'),

	removeRegion = new RemoveItem('region'),
	removeProduct = new RemoveItem('product'),
	removePrice = new RemoveItem('price'),
	
	regionList = new List<Region>('region'),
	productList = new List<Product>('product'),
	priceList = new List<Price>('price'),


	regionMap: Record<number, string> = {},
	productMap: Record<number, string> = {}


removeRegion.onStatus(st => {
	if (st == 'ok') {
		regionList.fetch()
		priceList.fetch()
	}
})

removeProduct.onStatus(st => {
	if (st == 'ok') {
		productList.fetch()
		priceList.fetch()
	}
})

removePrice.onStatus(st => {
	if (st == 'ok')
		priceList.fetch()
})



regionList.onStatus(v => {
	regionList.items.map(it => regionMap[it.id] = it.name)
})

productList.onStatus(v => {
	productList.items.map(it => productMap[it.id] = it.name)
})
