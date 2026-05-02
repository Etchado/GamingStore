import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const WishlistCtx = createContext(null)

function localGet() {
  try { return JSON.parse(localStorage.getItem('wishlist') ?? '[]') } catch { return [] }
}
function localSet(ids) {
  localStorage.setItem('wishlist', JSON.stringify(ids))
}

export function WishlistProvider({ children }) {
  const [ids, setIds]       = useState(localGet)
  const [userId, setUserId] = useState(null)
  const synced = useRef(false)

  /* Watch auth state */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  /* When user signs in, load their wishlist from Supabase and merge with local */
  useEffect(() => {
    if (!userId) { synced.current = false; return }

    supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (!data) return
        const dbIds = data.map(r => r.product_id)
        const local = localGet()
        const merged = [...new Set([...dbIds, ...local])]

        /* Upload any local-only ids to Supabase */
        const newToDb = local.filter(id => !dbIds.includes(id))
        if (newToDb.length > 0) {
          supabase.from('wishlists').insert(
            newToDb.map(product_id => ({ user_id: userId, product_id }))
          )
        }

        setIds(merged)
        localSet(merged)
        synced.current = true
      })
  }, [userId])

  /* Persist every change */
  useEffect(() => {
    localSet(ids)
  }, [ids])

  const toggle = useCallback(async (id) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      return next
    })

    if (userId) {
      const { data } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', id)
        .maybeSingle()

      if (data) {
        await supabase.from('wishlists').delete().eq('id', data.id)
      } else {
        await supabase.from('wishlists').insert({ user_id: userId, product_id: id })
      }
    }
  }, [userId])

  const has   = useCallback((id) => ids.includes(id), [ids])
  const clear = useCallback(async () => {
    setIds([])
    if (userId) {
      await supabase.from('wishlists').delete().eq('user_id', userId)
    }
  }, [userId])

  return (
    <WishlistCtx.Provider value={{ ids, toggle, has, clear, count: ids.length }}>
      {children}
    </WishlistCtx.Provider>
  )
}

export const useWishlist = () => useContext(WishlistCtx)
