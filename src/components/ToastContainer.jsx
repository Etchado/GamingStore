import { motion, AnimatePresence } from 'motion/react'
import { useToast } from '@/context/ToastContext'

function Toast({ toast }) {
  const { dismiss } = useToast()
  const isWishlist = toast.type === 'wishlist'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.22 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg bg-white border min-w-[260px] max-w-sm"
      style={{ borderColor: isWishlist ? '#fecaca' : '#a7dfb7' }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: isWishlist ? '#fee2e2' : '#e9f7ed' }}
      >
        {isWishlist ? (
          <svg className="w-3.5 h-3.5" fill="#ef4444" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="#1e8035" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </div>
      <p className="text-sm font-semibold text-ink flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => dismiss(toast.id)}
        className="w-5 h-5 flex items-center justify-center text-muted hover:text-ink shrink-0 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}

export default function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 end-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
