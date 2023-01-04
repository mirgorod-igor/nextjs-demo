import * as fs from 'fs'
import * as path from 'path'
import * as csv from 'fast-csv'

import {Prisma, Region} from '@prisma/client'

import prisma from 'lib/prisma'


const regions: Prisma.RegionCreateManyInput[] = [

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

const orgs: Prisma.OrgCreateManyInput[] = [
	{
		name: 'ООО «Зерно-трейд»',
		regionId: 501165,
		trade: 'w',
		legalAddr: 'ул. Комсомольский Спуск, д.1, 4 этаж, комната 18'
	}
]


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


const main = async () => {
	const regions = await (new Promise<Region[]>(readRegions))

	try {
		await prisma.region.createMany({
			data: regions
		})

		await prisma.org.createMany({
			data: orgs
		})

	}
	finally {
		await prisma.$disconnect()
	}
}

main()