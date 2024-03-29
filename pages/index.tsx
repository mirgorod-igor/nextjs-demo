import {useEffect} from 'react'
import {GetServerSideProps, NextPage} from 'next'
import Link from 'next/link'

import {NewItem, Input, Select, List, OrgList, TreeList} from 'components'

import {region, product, org, fetchData} from 'stores/home'
import {regionList} from 'stores'


import sty from 'styles/home.module.sass'



const changeHandlerFactory = <T,>(store: store.Edit<T>, fieldName: keyof T, asNumber?: boolean) =>
	e => store.value[fieldName] = (asNumber ? parseInt(e.target.value) : e.target.value) as T[keyof T]



const NewRegion = () =>
	<NewItem name='region' store={region.edit}>
		<Input placeholder='ИД' edit={region.edit}
		       onChange={changeHandlerFactory(region.edit, 'id', true)} asNumber />
		<Input placeholder='название' edit={region.edit}
		       onChange={changeHandlerFactory(region.edit, 'name')} />
		<Input placeholder='код' edit={region.edit}
		       onChange={changeHandlerFactory(region.edit, 'code')} />
	</NewItem>

const NewOrg = () =>
	<NewItem name='org' store={org.edit}>
		<Input placeholder='название' edit={org.edit}
		       onChange={changeHandlerFactory(org.edit, 'name')} />
		<Select edit={org.edit} list={regionList}
		        onChange={changeHandlerFactory(org.edit, 'regionId', true)} />
		<Input placeholder='юр. адрес' edit={org.edit}
		       onChange={changeHandlerFactory(org.edit, 'legalAddr')} />
		<Select edit={org.edit}
		        onChange={changeHandlerFactory(org.edit, 'trade')}
		>
			<option value='w' defaultChecked>опт</option>
			<option value='r'>роз</option>
		</Select>
	</NewItem>


const NewProduct = () =>
	<NewItem name='product' store={product.edit}>
		<Input placeholder='название' edit={product.edit}
		       onChange={changeHandlerFactory(product.edit, 'name')} />
	</NewItem>



/*
const NewPrice = () => {
	return <NewItem name='price' store={price.edit}>
		<Select edit={price.edit} list={regionList}
		        onChange={changeHandlerFactory(price.edit, 'regionId', true)} />
		<Select edit={price.edit} list={product.list}
		        onChange={changeHandlerFactory(price.edit, 'productId', true)} />
		<Input placeholder='введите цену' edit={price.edit}
		       onChange={changeHandlerFactory(price.edit, 'price', true)} asNumber />
	</NewItem>
}
*/



type Props = {

}


const TabButton = (p: { num, title }) => <>
	<input type='radio' defaultChecked={p.num == 0 || undefined} id={'toggler' + p.num} name='toggler' className='_T_' />
	<label htmlFor={'toggler' + p.num}>{p.title}</label>
</>


const ProductList = () => {
	return <TreeList href={it => `product/${it.id}`} store={product.list}>
		{
			(it, level) => <div key={it.id} className={sty.product}>
				{new Array(level).fill(<u />)}
				<Link href={`product/${it.id}`}>{it.name}</Link>
			</div>
		}
	</TreeList>
}

const Home: NextPage<Props> = p => {
	useEffect(() => {
		fetchData()
	}, [])

	return <main className={sty.main}>
		<div className={sty.tabs}>
			{
				['Регионы', 'Производители', 'Продукты'].map((it, i) =>
					<TabButton key={i} num={i} title={it} />
				)
			}

			<div>
				<List store={region.list}>{
					it => <span>{it.name}</span>
				}</List>
				<hr />
				<NewRegion />
			</div>
			<div>
				<OrgList />
				<hr />
				<NewOrg />
			</div>
			<div>
				<ProductList />
				<hr />
				<NewProduct />
			</div>
		</div>
	</main>
}


export default Home


export const getServerSideProps: GetServerSideProps<Props> = async () => {

	return {
		props: {

		}
	}
}