import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const WishlistCtx = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') ?? '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(ids))
  }, [ids])

  const toggle = useCallback((id) => {
    setIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }, [])

  const has = useCallback((id) => ids.includes(id), [ids])

  const clear = useCallback(() => setIds([]), [])

  return (
    <WishlistCtx.Provider value={{ ids, toggle, has, clear, count: ids.length }}>
      {children}
    </WishlistCtx.Provider>
  )
}

export const useWishlist = () => useContext(WishlistCtx)
