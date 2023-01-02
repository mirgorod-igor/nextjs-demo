import {PrismaClient, Prisma, Region, Product} from '@prisma/client'

console.log('start seeding')

const regions: Prisma.RegionCreateInput[] = [
	{
		name: 'Омск',
		code: 'OMS'
	},
	{
		name: 'Москва',
		code: 'MOW'
	},
	{
		name: 'Санкт-Петербург',
		code: 'SPE'
	}
]

const products: Prisma.ProductCreateInput[] = [
	{
		name: 'Стиральная машина'
	},
	{
		name: 'Зубная паста'
	},
	{
		name: 'Велотренажер'
	}
]

const main = async () => {
	const prisma = new PrismaClient()
	
	try {
		console.log('insert regions')
		const mapReg: Record<string, Region> = {}
		for (const data of regions) {
			const reg = await prisma.region.create({
				data,
			})
			
			mapReg[reg.code] = reg
		}
		
		for (const data of products) {
			const p = await prisma.product.create({
				data,
			})
		}
		
	}
	finally {
		await prisma.$disconnect()
	}
}

main()