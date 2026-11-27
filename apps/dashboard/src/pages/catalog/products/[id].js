// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Demo Components Imports
import ProductDetail from 'src/views/catalog/products/ProductDetail'

// ** Services Import
import { getProductById } from 'src/services/products'
import { getCategories } from 'src/services/categories'

// Data loads in the browser, so any real product id works (not only the old demo ids).
const ProductDetailPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!router.isReady) return
    Promise.all([getProductById(id), getCategories()])
      .then(([product, categoriesData]) => {
        if (!product) return router.replace('/404')
        const category = categoriesData.categories.find(c => c.id === product.categoryId) || null
        setData({ product, category })
      })
      .catch(() => router.replace('/404'))
  }, [router, router.isReady, id])

  if (!data) return null

  return <ProductDetail product={data.product} category={data.category} />
}

export default ProductDetailPage
