import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PRODUCTS as LOCAL_PRODUCTS } from '@/data/products'

const ProductsContext = createContext(null)

/* Normalise a Supabase row → the shape the app expects */
function mapRow(row) {
  return {
    id:              row.id,
    title:           row.title ?? '',
    brand:           row.brand ?? '',
    category:        row.category ?? '',
    // price stored as numeric in DB; all consumers use parseFloat-based helpers so plain number works
    price:           row.price,
    oldPrice:        row.old_price   ?? undefined,
    saving:          row.saving      ?? undefined,
    rating:          row.rating      ?? 0,
    reviews:         row.reviews     ?? 0,
    image:           row.image       ?? '',
    images:          Array.isArray(row.images) ? row.images : [],
    badge:           row.badge       ?? undefined,
    spec:            row.spec        ?? undefined,
    description:     row.description ?? '',
    longDescription: row.long_description ?? '',
    specs:           Array.isArray(row.specs) ? row.specs : [],
    inStock:         row.in_stock    ?? true,
    stockCount:      row.stock_count ?? undefined,
  }
}

export function ProductsProvider({ children }) {
  // Seed immediately with local data → zero loading flash, zero regression
  const [products, setProducts] = useState(LOCAL_PRODUCTS)
  const [fromDB, setFromDB]     = useState(false)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data?.length > 0) {
          setProducts(data.map(mapRow))
          setFromDB(true)
        }
        // DB empty or unreachable → keep local fallback silently
      })
  }, [])

  return (
    <ProductsContext.Provider value={{ products, fromDB }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
