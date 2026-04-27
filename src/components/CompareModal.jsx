import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCompare } from '@/context/CompareContext'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { PRODUCTS } from '@/data/products'

function StarRow({ rating = 0, count = 0 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor" viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-muted">{rating.toFixed(1)} {count > 0 && `(${count.toLocaleString()})`}</span>
    </div>
  )
}

const ROW_KEYS = [
  { key: 'image',    labelKey: '' },
  { key: 'price',    labelKey: 'compare.price' },
  { key: 'rating',   labelKey: 'compare.rating' },
  { key: 'brand',    labelKey: 'compare.brand' },
  { key: 'category', labelKey: 'compare.category' },
  { key: 'spec',     labelKey: 'compare.specifications' },
  { key: 'badge',    labelKey: 'compare.badge' },
  { key: 'action',   labelKey: '' },
]

function Cell({ row, product }) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const { addToast } = useToast()

  switch (row.key) {
    case 'image':
      return (
        <div className="flex flex-col items-center gap-3 pb-2">
          <Link to={`/product/${product.id}`} className="block w-full">
            <img
              src={product.image}
              alt={product.title}
              className="w-full aspect-[4/3] object-cover rounded-xl hover:opacity-90 transition-opacity"
            />
          </Link>
          <Link
            to={`/product/${product.id}`}
            className="text-sm font-bold text-ink text-center leading-snug hover:underline line-clamp-2"
          >
            {product.title}
          </Link>
        </div>
      )
    case 'price':
      return (
        <div>
          <span className="text-lg font-black" style={{ color: '#0056b3' }}>{product.price}</span>
          {product.oldPrice && (
            <span className="block text-xs text-muted line-through">{product.oldPrice}</span>
          )}
          {product.saving && (
            <span className="text-xs font-bold" style={{ color: '#28a745' }}>Save {product.saving}</span>
          )}
        </div>
      )
    case 'rating':
      return <StarRow rating={product.rating ?? 0} count={product.reviews ?? 0} />
    case 'brand':
      return <span className="text-sm text-ink font-medium">{product.brand ?? '—'}</span>
    case 'category':
      return <span className="text-sm text-ink font-medium">{product.category ?? '—'}</span>
    case 'spec':
      return <span className="text-xs text-muted leading-relaxed">{product.spec ?? '—'}</span>
    case 'badge':
      return product.badge ? (
        <span className="inline-block text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: '#0056b3' }}>
          {product.badge}
        </span>
      ) : <span className="text-xs text-muted">—</span>
    case 'action':
      return (
        <button
          onClick={() => {
            addItem(product)
            addToast(`${product.title.slice(0, 28)} added to cart`, 'success')
          }}
          className="w-full py-2.5 rounded-xl text-sm font-black text-white transition-colors"
          style={{ backgroundColor: '#0056b3' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
        >
          {t('compare.addToCart')}
        </button>
      )
    default:
      return null
  }
}

export default function CompareModal({ isOpen, onClose }) {
  const { t } = useTranslation()
  const { ids, remove } = useCompare()
  const products = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('compare.title')}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-[90] bg-white rounded-2xl flex flex-col overflow-hidden max-w-5xl mx-auto"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#e0e0e0' }}>
              <div>
                <h2 className="text-base font-black text-ink">{t('compare.title')}</h2>
                <p className="text-xs text-muted mt-0.5">{t('compare.sub')}</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close comparison"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <div className="min-w-[480px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-32 sm:w-36" />
                      {products.map(p => (
                        <th key={p.id} className="pb-2 px-2 sm:px-3 relative" style={{ width: `${100 / products.length}%` }}>
                          <button
                            onClick={() => remove(p.id)}
                            className="absolute top-0 right-2 w-5 h-5 flex items-center justify-center rounded-full text-muted hover:text-red-500 hover:bg-red-50 transition-colors text-xs"
                            aria-label={`Remove ${p.title} from comparison`}
                          >
                            ✕
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROW_KEYS.map((row) => (
                      <tr key={row.key} className="border-t" style={{ borderColor: '#f0f0f0' }}>
                        {/* Row label */}
                        <td className="py-3 pr-4 text-right align-middle">
                          {row.labelKey && (
                            <span className="text-[11px] font-black tracking-wide uppercase text-muted whitespace-nowrap">
                              {t(row.labelKey)}
                            </span>
                          )}
                        </td>
                        {/* Product cells */}
                        {products.map(p => (
                          <td key={p.id} className="py-3 px-2 sm:px-3 align-middle">
                            <Cell row={row} product={p} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
