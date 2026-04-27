import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12, pointerEvents: 'none' }}
          animate={{ opacity: 1, y: 0, pointerEvents: 'auto' }}
          exit={{ opacity: 0, y: 12, pointerEvents: 'none' }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 end-6 z-50 w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors"
          style={{ backgroundColor: '#0056b3' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
          aria-label="Back to top"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
