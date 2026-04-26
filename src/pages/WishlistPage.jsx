import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useWishlist } from '@/context/WishlistContext'
import { PRODUCTS } from '@/data/products'
import { ProductCard } from '@/components/ui/product-card'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function WishlistPage() {
  usePageTitle('Wishlist')
  const { ids, count } = useWishlist()
  const navigate = useNavigate()

  const items = PRODUCTS.filter(p => ids.includes(p.id))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pt-16 lg:pt-26 min-h-screen"
      style={{ backgroundColor: '#f8fafc' }}
    >
      {/* Header */}
      <div className="border-b bg-white" style={{ borderColor: '#e0e0e0' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-2" style={{ color: '#0056b3' }}>
            ◈ My Wishlist
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              Saved Items
              {count > 0 && (
                <span className="ml-3 text-xl font-bold text-muted">({count})</span>
              )}
            </h1>
            {count > 0 && (
              <button
                onClick={() => navigate('/')}
                className="hidden sm:inline text-sm font-bold transition-colors"
                style={{ color: '#0056b3' }}
              >
                Continue Shopping →
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 gap-6 text-center"
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: '#fdf4ff' }}
            >
              <svg className="w-9 h-9" fill="none" stroke="#9333ea" strokeWidth={1.6} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#0056b3' }}>
                ◈ Nothing saved yet
              </p>
              <h2 className="text-2xl font-black text-ink mb-2">Your wishlist is empty</h2>
              <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
                Click the heart icon on any product to save it here for later.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: '#0056b3' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
            >
              Browse Products
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
