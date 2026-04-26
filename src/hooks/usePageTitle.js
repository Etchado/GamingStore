import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} — GamingStore`
      : 'GamingStore | Premium Gaming Hardware'
    return () => { document.title = 'GamingStore | Premium Gaming Hardware' }
  }, [title])
}
