// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Demo Components Imports
import ProductForm from 'src/views/catalog/products/ProductForm'

// ** Services Import
import { getProductById } from 'src/services/products'
import { getCategories } from 'src/services/categories'
import { getCollections } from 'src/services/collections'

// Data loads in the browser, so any real product id works (not only the old demo ids).
const ProductEdit = () => {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!router.isReady) return
    Promise.all([getProductById(id), getCategories(), getCollections()])
      .then(([product, categoriesData, collectionsData]) => {
        if (!product) return router.replace('/404')
        setData({ product, categories: categoriesData.categories, collections: collectionsData.collections })
      })
      .catch(() => router.replace('/404'))
  }, [router, router.isReady, id])

  if (!data) return null

  return <ProductForm key={data.product.id} product={data.product} categories={data.categories} collections={data.collections} />
}

export default ProductEdit
