// ** Demo Components Imports
import ProductForm from 'src/views/catalog/products/ProductForm'

// ** Services Import
import { getProductById } from 'src/services/products'
import { getCategories } from 'src/services/categories'
import { getCollections } from 'src/services/collections'
import { data as productData } from 'src/@fake-db/apps/products'

const ProductEdit = ({ product, categories, collections }) => {
  return <ProductForm product={product} categories={categories} collections={collections} />
}

export const getStaticPaths = async () => {
  const paths = productData.products.map(item => ({ params: { id: `${item.id}` } }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params }) => {
  const [product, categoriesData, collectionsData] = await Promise.all([
    getProductById(params.id),
    getCategories(),
    getCollections()
  ])

  return {
    props: {
      product,
      categories: categoriesData.categories,
      collections: collectionsData.collections
    }
  }
}

export default ProductEdit
