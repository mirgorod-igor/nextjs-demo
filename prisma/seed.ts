import * as fs from 'fs'
import * as path from 'path'
import * as csv from 'fast-csv'

import {Prisma, Region} from '@prisma/client'

import prisma from '../lib/prisma'



const regions: Prisma.RegionCreateManyInput[] = [

]


const societies: Prisma.SocietyCreateManyInput[] = [
	{ name: 'Общество с ограниченной ответственностью', short: 'ООО' },
	{ name: 'Акционерное общество', short: 'АО' },
	{ name: 'Закрытое акционерное общество', short: 'ЗАО' },
	{ name: 'Открытое акционерное общество', short: 'ОАО' },
	{ name: 'Публичное акционерное общество', short: 'ПАО' }
]

const orgServices: Prisma.OrgServiceCreateInput[] = [
	{
		name: 'Перевалка зерна'
	},
	{
		name: 'Перевалка масла'
	},
	{
		name: 'Производство'
	},
	{
		name: 'Маркетинг'
	},
	{
		name: 'Продажи'
	},
]

const orgs: Prisma.OrgUncheckedCreateInput[] = [
	{
		societyId: 1,
		name: 'Зерно-трейд',
		short: 'Зерно-трейд',
		desc: 'Торговля',
		regionId: 501165,
		trade: 'w',
		legalAddr: 'ул. Комсомольский Спуск, д.1, 4 этаж, комната 18'
	},
	{
		societyId: 1,
		name: 'Новороссийский Зерновой Терминал',
		short: 'НЗТ CPT',
		desc: 'Перевалка зерновых культур',
		regionId: 542415,
		parentId: 1,
		trade: 'w',
		legalAddr: 'ул. Портовая, 14А'
	},
	{
		societyId: 1,
		name: 'Таганрогский судоремонтный завод CPT',
		short: 'ТСРЗ CPT',
		desc: 'Перевалка зерновых культур',
		regionId: 501165,
		parentId: 1,
		trade: 'w',
		legalAddr: 'ул. Комсомольский Спуск, дом 1, 4 этаж, комната 27'
	},
	{
		societyId: 1,
		name: 'Зерновой Терминальный комплекс Тамань',
		short: 'ЗТКТ',
		desc: 'Перевалка зерновых культур',
		regionId: 542415,
		parentId: 1,
		trade: 'w',
		legalAddr: 'п. Волна, 1500м западнее'
	},
	{
		societyId: 1,
		name: 'Канмаш АГРО',
		short: 'Канмаш АГРО',
		desc: 'Машиностроительное предприятие',
		regionId: 567395,
		trade: 'w',
		legalAddr: 'ул.Красноармейская, д,72'
	}
]


const productCategories: Prisma.ProductCategoryCreateInput[] = [
	{
		name: 'Зерно'
	},
	{
		name: 'Сельскохозяйственная техника'
	}
]


const uniProducts: Prisma.ProductCreateInput[] = [
	{
		name: 'Пшеница',
		category: {
			connect: { id: 1 }
		},
		childs: {
			create: {
				name: 'Протеин', childs: {
					createMany: {
						data: [
							{ name: '14.5' },
							{ name: '14' },
							{ name: '13.5' },
							{ name: '13' },
							{ name: '12.5' },
							{ name: '12' },
							{ name: '11.5' },
							{ name: '11' },
							{ name: '10.5' },
							{ name: '< 10.5' }
						]
					}
				}
			}
		}
	},
	{
		name: 'Плуг чизельный',
		category: {
			connect: { id: 2 }
		},
		childs: {
			createMany: {
				data: [
					{ name: 'ПЧН-2,3' },
					{ name: 'ПЧН-3,2' },
					{ name: 'ПЧН-4,5' },
				]
			}
		}
	},
]




const productsPrices: Record<number, [string?, number?, number?][]> = {
	// зерно трейд
	1: [
		['14.5'],
		['14'],
		['13.5'],
		['13'],
		['12.5'],
		['12'],
		['11.5'],
		['11'],
		['10.5'],
		['< 10.5']
	],
	//
	2: [
		[, 14400, 1],
		[, 14400, 2],
		[, 14400, 3],
		[, 14400, 4],
		[, 14400, 5],
		[, 14400, 6],
		[, 14200, 7],
		[, 14000, 8],
		[, 14000, 9]
	],
	3: [
		[, 13300, 1],
		[, 12600, 2],
		[, 12400, 3],
		[, 12100, 4],
		[, 11900, 5],
		[, 11800, 6],
		[, 11600, 7],
		[, 11300, 8],
		[, 10100, 9],
		[, 9600, 10]
	],
	4: [
		//['14.5', 13300],
		//['14', 12600],
		[undefined, 14200, 3],
		[undefined, 14100, 4],
		[undefined, 13900, 5],
		[undefined, 13600, 6],
		[undefined, 13200, 7],
		/*['11', 11300],
		['10.5', 10100],
		['< 10.5', 9600]*/
	],
	5: [
		['ПЧН-2,3', 18000],
		['ПЧН-3,2', 21000],
		['ПЧН-4,5', 24000],
	]
}







const readRegions = (resolve: (value: Region[]) => void) =>
	fs.createReadStream(path.resolve(__dirname, 'region.csv'))
		.pipe(csv.parse({ headers: true }))
		.on('error', error => console.error(error))
		.on('data', row => regions.push({
			id: parseInt(row.geoname_id),
			name: row.name,
			code: row.iso_code,
		}))
		.on('end', (rowCount: number) => {
			console.log(`Parsed ${rowCount} rows`)
			resolve(regions)
		})



const createPrices = async (orgs: number[]) => {
	const prods: Record<string, any> = {}
	for (const orgId of orgs)
		for (const [name, price, parentId] of productsPrices[orgId]) {

			if (name && !prods[name]) {
				const p = await prisma.product.findFirst({
					select: { id: true },
					where: { name }
				})
				prods[name] = p!.id
			}

			await prisma.price.create({
				data: {
					orgId, productId: name ? prods[name] : undefined, price, parentId
				}
			})

		}
}

const main = async () => {
	const regions = await (new Promise<Region[]>(readRegions))

	try {
		await prisma.$executeRaw`SET foreign_key_checks = 0`
		const tables = ['prices', 'products', 'product_categories', 'product_attrs', 'orgs', 'org_services', 'regions', 'societies']
		for (const table of tables) {
			await prisma.$executeRawUnsafe(`truncate table ${table}`)
		}
		await prisma.$executeRaw`SET foreign_key_checks = 1`

		await prisma.region.createMany({
			data: regions
		})

		await prisma.society.createMany({
			data: societies
		})

		await prisma.orgService.createMany({
			data: orgServices
		})

		for (const data of orgs)
			await prisma.org.create({ data })

		await prisma.productCategory.createMany({
			data: productCategories
		})

		for (const data of uniProducts)
			await prisma.product.create({ data })


		await createPrices([1])
		await createPrices([2, 3, 4])
		await createPrices([5])
	}
	finally {
		await prisma.$disconnect()
	}
}

main()