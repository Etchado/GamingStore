import { useEffect, useState } from 'react'

const KEY = 'recently_viewed'
const MAX = 5

export function useRecentlyViewed(currentId) {
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
  })

  useEffect(() => {
    if (!currentId) return
    setIds(prev => {
      const next = [currentId, ...prev.filter(id => id !== currentId)].slice(0, MAX)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [currentId])

  // Return ids excluding the current product (for display purposes)
  return ids.filter(id => id !== currentId)
}
