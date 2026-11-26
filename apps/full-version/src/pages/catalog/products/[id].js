// ** Demo Components Imports
import ProductDetail from 'src/views/catalog/products/ProductDetail'

// ** Services Import
import { getProductById } from 'src/services/products'
import { getCategories } from 'src/services/categories'
import { data as productData } from 'src/@fake-db/apps/products'

const ProductDetailPage = ({ product, category }) => {
  return <ProductDetail product={product} category={category} />
}

export const getStaticPaths = async () => {
  const paths = productData.products.map(item => ({ params: { id: `${item.id}` } }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params }) => {
  const [product, categoriesData] = await Promise.all([getProductById(params.id), getCategories()])
  const category = categoriesData.categories.find(c => c.id === product.categoryId) || null

  return {
    props: {
      product,
      category
    }
  }
}

export default ProductDetailPage
