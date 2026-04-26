import { createContext, useContext, useState, useCallback } from 'react'

const CartCtx = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product) => {
    const key = product.id ?? product.title
    setItems(prev => {
      const idx = prev.findIndex(i => (i.product.id ?? i.product.title) === key)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
        return next
      }
      return [...prev, { product, qty: 1 }]
    })
  }, [])

  const removeItem = useCallback((key) => {
    setItems(prev => prev.filter(i => (i.product.id ?? i.product.title) !== key))
  }, [])

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) { removeItem(key); return }
    setItems(prev => prev.map(i =>
      (i.product.id ?? i.product.title) === key ? { ...i, qty } : i
    ))
  }, [removeItem])

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => {
    const p = parseFloat(i.product.price.replace(/[^0-9.]/g, ''))
    return s + p * i.qty
  }, 0)

  return (
    <CartCtx.Provider value={{ items, addItem, removeItem, updateQty, clearCart, itemCount, total, isOpen, setIsOpen }}>
      {children}
    </CartCtx.Provider>
  )
}

export const useCart = () => useContext(CartCtx)
