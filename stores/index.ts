import {Price, Product, Region} from '@prisma/client'

import EditItem from './EditItem'
import List from './List'

export { EditItem, List }


export const
	regionItem = new EditItem<Region>('region'),
	productItem = new EditItem<Product>('product'),
	priceItem = new EditItem<Price>('price'),
	
	regionList = new List<Region>('region'),
	productList = new List<Product>('product'),
	priceList = new List<Price>('price'),


	regionMap: Record<number, string> = {},
	productMap: Record<number, string> = {}


regionList.status.subscribe(v => {
	regionList.items.map(it => regionMap[it.id] = it.name)
})

productList.status.subscribe(v => {
	productList.items.map(it => productMap[it.id] = it.name)
})
