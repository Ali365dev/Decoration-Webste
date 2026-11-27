// ** React Imports
import { useEffect, useState } from 'react'

// ** Demo Components Imports
import ProductForm from 'src/views/catalog/products/ProductForm'

// ** Services Import
import { getCategories } from 'src/services/categories'
import { getCollections } from 'src/services/collections'

// Data loads in the browser: the admin API is reached through this app's own proxy route.
const ProductAdd = () => {
  const [categories, setCategories] = useState([])
  const [collections, setCollections] = useState([])

  useEffect(() => {
    getCategories().then(d => setCategories(d.categories)).catch(() => setCategories([]))
    getCollections().then(d => setCollections(d.collections)).catch(() => setCollections([]))
  }, [])

  return <ProductForm product={null} categories={categories} collections={collections} />
}

export default ProductAdd
