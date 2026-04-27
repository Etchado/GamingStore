import { createContext, useContext, useCallback, useState } from 'react'

const CompareContext = createContext(null)

const MAX = 3

export function CompareProvider({ children }) {
  const [ids, setIds] = useState([])

  const add = useCallback((id) => {
    setIds(prev => {
      if (prev.includes(id) || prev.length >= MAX) return prev
      return [...prev, id]
    })
  }, [])

  const remove = useCallback((id) => {
    setIds(prev => prev.filter(x => x !== id))
  }, [])

  const toggle = useCallback((id) => {
    setIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < MAX ? [...prev, id] : prev
    )
  }, [])

  const has = useCallback((id) => ids.includes(id), [ids])

  const clear = useCallback(() => setIds([]), [])

  return (
    <CompareContext.Provider value={{ ids, add, remove, toggle, has, clear, count: ids.length, maxed: ids.length >= MAX }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be inside CompareProvider')
  return ctx
}
