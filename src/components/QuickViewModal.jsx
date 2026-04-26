import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useWishlist } from '@/context/WishlistContext'

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart()
  const { addToast } = useToast()
  const { toggle, has } = useWishlist()
  const inWishlist = product ? has(product.id) : false
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (!product) return
    setQty(1)
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product, onClose])

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) addItem(product)
    const label = product.title.length > 32 ? product.title.slice(0, 32) + '…' : product.title
    addToast(`${label} added to cart`, 'success')
    onClose()
  }

  function handleWishlist() {
    toggle(product.id)
    const label = product.title.slice(0, 28) + (product.title.length > 28 ? '…' : '')
    addToast(inWishlist ? `${label} removed from wishlist` : `${label} saved to wishlist`, 'wishlist')
  }

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop — pointerEvents disabled on exit immediately to prevent ghost overlay */}
          <motion.div
            initial={{ opacity: 0, pointerEvents: 'none' }}
            animate={{ opacity: 1, pointerEvents: 'auto' }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div
                  className="relative overflow-hidden rounded-tl-2xl rounded-bl-2xl bg-surface"
                  style={{ aspectRatio: '1/1', borderRadius: undefined }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <span className="absolute top-4 left-4 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#0056b3' }}>
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col gap-4">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-black tracking-wider uppercase text-muted mb-1">{product.brand}</p>
                      <h2 className="text-base font-black text-ink leading-snug">{product.title}</h2>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : i < product.rating ? 'text-amber-300' : 'text-gray-200'}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted">
                      {product.rating.toFixed(1)} ({product.reviews?.toLocaleString()} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black" style={{ color: '#0056b3' }}>{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-sm text-muted line-through">{product.oldPrice}</span>
                    )}
                    {product.saving && (
                      <span className="text-xs font-bold" style={{ color: '#28a745' }}>Save {product.saving}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted leading-relaxed">{product.description}</p>

                  {/* Spec chip */}
                  {product.spec && (
                    <div className="px-3 py-2 rounded-xl bg-surface border border-border">
                      <p className="text-[11px] font-semibold text-muted">{product.spec}</p>
                    </div>
                  )}

                  {/* Qty */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-ink">Qty:</span>
                    <div className="flex items-center border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center text-muted hover:bg-surface transition-colors font-bold text-base"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-ink">{qty}</span>
                      <button
                        onClick={() => setQty(q => q + 1)}
                        className="w-9 h-9 flex items-center justify-center text-muted hover:bg-surface transition-colors font-bold text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to cart + Wishlist */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3 rounded-xl text-sm font-black text-white transition-colors"
                      style={{ backgroundColor: '#0056b3' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
                    >
                      Add {qty > 1 ? `${qty} × ` : ''}to Cart
                    </button>
                    <button
                      onClick={handleWishlist}
                      className="w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-colors shrink-0"
                      style={{
                        borderColor: inWishlist ? '#fca5a5' : '#e0e0e0',
                        backgroundColor: inWishlist ? '#fff1f1' : 'transparent',
                      }}
                    >
                      <svg
                        className="w-4.5 h-4.5"
                        style={{ color: inWishlist ? '#ef4444' : '#9ca3af', width: 18, height: 18 }}
                        fill={inWishlist ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  {/* View full details */}
                  {product.id && (
                    <Link
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-center border-2 transition-colors block"
                      style={{ borderColor: '#e0e0e0', color: '#4a5568' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0056b3'; e.currentTarget.style.color = '#0056b3' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#4a5568' }}
                    >
                      View Full Details →
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
