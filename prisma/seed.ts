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

const orgs: Prisma.OrgCreateManyInput[] = [
	{
		societyId: 1,
		name: 'Зерно-трейд',
		short: 'Зерно-трейд',
		regionId: 501165,
		trade: 'w',
		legalAddr: 'ул. Комсомольский Спуск, д.1, 4 этаж, комната 18'
	},
	{
		societyId: 1,
		name: 'Новороссийский Зерновой Терминал',
		short: 'НЗТ CPT',
		regionId: 542415,
		headId: 1,
		trade: 'w',
		legalAddr: 'ул. Портовая, 14А'
	},
	{
		societyId: 1,
		name: 'Таганрогский судоремонтный завод CPT',
		short: 'ТСРЗ CPT',
		regionId: 501165,
		headId: 1,
		trade: 'w',
		legalAddr: 'ул. Комсомольский Спуск, дом 1, 4 этаж, комната 27'
	},
	{
		societyId: 1,
		name: 'Зерновой Терминальный комплекс Тамань',
		short: 'ЗТКТ',
		regionId: 542415,
		headId: 1,
		trade: 'w',
		legalAddr: 'п. Волна, 1500м западнее'
	},
	{
		societyId: 1,
		name: 'Канмаш АГРО',
		short: 'Канмаш АГРО',
		regionId: 567395,
		trade: 'w',
		legalAddr: 'ул.Красноармейская, д,72'
	}
]


const uniProducts: Prisma.ProductCreateInput[] = [
	{
		name: 'Пшеница', childs: {
			create: {
				name: 'Протеин'
			}
		}
	},
	{
		name: 'Плуг чизельный'
	},
]



const productsPrices: Record<number, [string, number][]> = {
	2: [
		['14.5', 14400],
		['14', 14400],
		['13.5', 14400],
		['13', 14400],
		['12.5', 14400],
		['12', 14400],
		['11.5', 14200],
		['11', 14000],
		['10.5', 14000]
	],
	3: [
		['14.5', 13300],
		['14', 12600],
		['13.5', 12400],
		['13', 12100],
		['12.5', 11900],
		['12', 11800],
		['11.5', 11600],
		['11', 11300],
		['10.5', 10100],
		['< 10.5', 9600]
	],
	4: [
		//['14.5', 13300],
		//['14', 12600],
		['13.5', 14200],
		['13', 14100],
		['12.5', 13900],
		['12', 13600],
		['11.5', 13200],
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



const createProductPrices = async (orgs: number[], parentId: number) => {
	for (const orgId of orgs)
		for (const [name, price] of productsPrices[orgId]) {
			const data: Prisma.ProductCreateInput = {
				name,
				parent: {
					connect: {id: parentId}
				},
				prices: {
					create: {
						orgId, price
					}
				}
			}

			await prisma.product.create({data})
		}
}

const main = async () => {
	const regions = await (new Promise<Region[]>(readRegions))

	try {
		await prisma.$executeRaw`SET foreign_key_checks = 0`
		await prisma.$executeRaw`truncate table product_attrs`
		await prisma.$executeRaw`truncate table prices`
		await prisma.$executeRaw`truncate table products`
		await prisma.$executeRaw`truncate table orgs`
		await prisma.$executeRaw`truncate table regions`
		await prisma.$executeRaw`truncate table societies`
		await prisma.$executeRaw`SET foreign_key_checks = 1`

		await prisma.region.createMany({
			data: regions
		})


		await prisma.society.createMany({
			data: societies
		})

		await prisma.org.createMany({
			data: orgs
		})

		for (const data of uniProducts)
			await prisma.product.create({ data })


		await createProductPrices([2, 3, 4], 2)
		await createProductPrices([5], 3)
	}
	finally {
		await prisma.$disconnect()
	}
}

main()