// ** Demo Components Imports
import ProductForm from 'src/views/catalog/products/ProductForm'

// ** Services Import
import { getCategories } from 'src/services/categories'
import { getCollections } from 'src/services/collections'

const ProductAdd = ({ categories, collections }) => {
  return <ProductForm product={null} categories={categories} collections={collections} />
}

export const getStaticProps = async () => {
  const categoriesData = await getCategories()
  const collectionsData = await getCollections()

  return {
    props: {
      categories: categoriesData.categories,
      collections: collectionsData.collections
    }
  }
}

export default ProductAdd
