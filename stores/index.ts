import {Trade, Region} from '@prisma/client'

import List from './List'




export const
	// для селекта
	regionList = new List<Region>('region'),

	regionMap: Record<number, string> = {},
	productMap: Record<number, string> = {},
	tradeMap: Record<Trade, string> = {
		w: 'опт',
		r: 'роз'
	}






regionList.listenItems(items => {
	items.map(it => regionMap[it.id] = it.name)
})



export {default as List} from './List'
export {default as RemoveItem} from './RemoveItem'