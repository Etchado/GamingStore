import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { items, isOpen, setIsOpen, removeItem, updateQty, itemCount, total } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — pointerEvents disabled immediately on exit so it can't ghost-block clicks */}
          <motion.div
            initial={{ opacity: 0, pointerEvents: 'none' }}
            animate={{ opacity: 1, pointerEvents: 'auto' }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-[70] bg-white flex flex-col"
            style={{ boxShadow: '-8px 0 40px rgba(0,0,0,0.12)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-black text-ink">{t('cart.title')}</h2>
                {itemCount > 0 && (
                  <span
                    className="w-5 h-5 rounded-full text-[11px] font-black text-white flex items-center justify-center"
                    style={{ backgroundColor: '#0056b3' }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: '#e6f0fa' }}
                  >
                    <svg className="w-7 h-7" fill="none" stroke="#0056b3" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-ink text-sm">{t('cart.empty')}</p>
                    <p className="text-xs text-muted mt-1">{t('cart.emptySub')}</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: '#0056b3' }}
                  >
                    {t('cart.continueShopping')}
                  </button>
                </div>
              ) : (
                items.map(({ product, qty }) => (
                  <div key={product.id ?? product.title} className="flex gap-3 pb-4 border-b border-border last:border-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-surface"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-ink line-clamp-2 leading-snug">{product.title}</p>
                      {product.spec && (
                        <p className="text-[11px] text-muted mt-0.5 truncate">{product.spec}</p>
                      )}
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-sm font-black" style={{ color: '#0056b3' }}>{product.price}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQty(product.id ?? product.title, qty - 1)}
                              className="w-7 h-7 flex items-center justify-center text-muted hover:bg-surface transition-colors text-sm font-bold"
                            >
                              −
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-ink">{qty}</span>
                            <button
                              onClick={() => updateQty(product.id ?? product.title, qty + 1)}
                              className="w-7 h-7 flex items-center justify-center text-muted hover:bg-surface transition-colors text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(product.id ?? product.title)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path d="M3 6h18M19 6l-1 14H6L5 6m5 0V4h4v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-3">
                {/* Free shipping progress */}
                {(() => {
                  const FREE_THRESHOLD = 150
                  const remaining = Math.max(0, FREE_THRESHOLD - total)
                  const pct = Math.min(100, (total / FREE_THRESHOLD) * 100)
                  return remaining > 0 ? (
                    <div>
                      <p
                        className="text-xs text-muted mb-1.5"
                        dangerouslySetInnerHTML={{ __html: t('cart.freeShippingMore', { amount: remaining.toFixed(0) }) }}
                      />
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e0e0e0' }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: '#28a745' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#1e8035' }}>
                      {t('cart.freeShippingQualify')}
                    </div>
                  )
                })()}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted font-medium">{t('cart.subtotal')} ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span className="text-base font-black text-ink">${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <p className="text-xs text-muted">{t('cart.taxes')}</p>
                <button
                  onClick={() => { setIsOpen(false); navigate('/checkout') }}
                  className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-colors"
                  style={{ backgroundColor: '#0056b3' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
                >
                  {t('cart.checkout')} — ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-muted hover:text-ink transition-colors"
                >
                  {t('cart.continueShopping')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
