import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'

const ANNOUNCEMENTS = [
  { id: 1, text: '🚚 Free shipping on all orders over $150', cta: null },
  { id: 2, text: '🔥 Limited-time deals — up to 30% off selected products', cta: { label: 'Shop Deals', href: '/?sort=deals' } },
  { id: 3, text: '⭐ New arrivals just dropped — explore the latest gear', cta: { label: 'View New', href: '/?badge=NEW' } },
]

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)
  const [idx, setIdx] = useState(0)

  if (dismissed) return null

  const item = ANNOUNCEMENTS[idx]

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden"
          style={{ backgroundColor: '#0056b3' }}
        >
          <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 justify-center">
              <button
                onClick={() => setIdx(i => (i - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)}
                className="text-white/60 hover:text-white transition-colors shrink-0 hidden sm:block"
              >
                ‹
              </button>
              <p className="text-xs font-semibold text-white text-center">
                {item.text}
                {item.cta && (
                  <Link
                    to={item.cta.href}
                    className="ml-2 underline underline-offset-2 font-bold hover:text-white/80 transition-colors"
                  >
                    {item.cta.label} →
                  </Link>
                )}
              </p>
              <button
                onClick={() => setIdx(i => (i + 1) % ANNOUNCEMENTS.length)}
                className="text-white/60 hover:text-white transition-colors shrink-0 hidden sm:block"
              >
                ›
              </button>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-white/60 hover:text-white transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
