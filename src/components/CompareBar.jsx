import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useCompare } from '@/context/CompareContext'
import { PRODUCTS } from '@/data/products'

export default function CompareBar({ onOpen }) {
  const { t } = useTranslation()
  const { ids, remove, clear, count } = useCompare()

  if (count < 1) return null

  const products = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean)

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 inset-x-0 z-[50] bg-white border-t"
          style={{ borderColor: '#e0e0e0', boxShadow: '0 -8px 32px rgba(0,0,0,0.10)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4">
            {/* Products row */}
            <div className="flex-1 flex items-center gap-2 sm:gap-3 overflow-x-auto min-w-0">
              {/* Slot placeholders */}
              {[0, 1, 2].map(i => {
                const p = products[i]
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 min-w-[110px] sm:min-w-[140px] px-2.5 py-1.5 rounded-xl border flex-shrink-0"
                    style={{ borderColor: p ? '#0056b3' : '#e0e0e0', backgroundColor: p ? '#f0f7ff' : '#fafafa' }}
                  >
                    {p ? (
                      <>
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                        />
                        <p className="text-[11px] font-bold text-ink line-clamp-1 flex-1 min-w-0">{p.title}</p>
                        <button
                          onClick={() => remove(p.id)}
                          className="w-4 h-4 flex items-center justify-center rounded-full text-muted hover:text-red-500 flex-shrink-0 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <p className="text-[11px] text-muted text-center w-full">{t('compare.addProduct')}</p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={clear}
                className="text-xs font-bold text-muted hover:text-ink transition-colors whitespace-nowrap hidden sm:block"
              >
                {t('compare.clear')}
              </button>
              <button
                onClick={onOpen}
                disabled={count < 2}
                className="px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black text-white transition-all whitespace-nowrap disabled:opacity-40"
                style={{ backgroundColor: '#0056b3' }}
                onMouseEnter={(e) => { if (count >= 2) e.currentTarget.style.backgroundColor = '#004494' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
              >
                {t('compare.compareBtn', { count })}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
