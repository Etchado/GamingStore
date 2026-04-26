import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { PRODUCTS } from '@/data/products'
import { ProductCard } from '@/components/ui/product-card'

const badges = {
  System:   { bg: '#e6f0fa', text: '#004494' },
  GPU:      { bg: '#f3f0ff', text: '#5521b5' },
  CPU:      { bg: '#fff3e0', text: '#c2410c' },
  Monitor:  { bg: '#e9f7ed', text: '#1e8035' },
  Desk:     { bg: '#fffbeb', text: '#92400e' },
  Chair:    { bg: '#fdf4ff', text: '#7e22ce' },
  Storage:  { bg: '#f0fdf4', text: '#166534' },
  Keyboard: { bg: '#eff6ff', text: '#1d4ed8' },
}

function StarRating({ rating = 4.8, count = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled  = i < Math.floor(rating)
          const partial = !filled && i < rating
          return (
            <svg
              key={i}
              className={`w-4 h-4 ${filled ? 'text-amber-400' : partial ? 'text-amber-300' : 'text-gray-200'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )
        })}
      </div>
      <span className="text-sm font-bold text-ink">{rating.toFixed(1)}</span>
      {count > 0 && (
        <span className="text-sm text-muted">({count.toLocaleString()} reviews)</span>
      )}
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { addToast } = useToast()

  const product = PRODUCTS.find(p => p.id === id)
  const related = PRODUCTS.filter(p => p.id !== id && p.category === product?.category).slice(0, 4)
  const fallbackRelated = PRODUCTS.filter(p => p.id !== id).slice(0, 4)

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: '#e6f0fa' }}>
          🔍
        </div>
        <h1 className="text-2xl font-black text-ink">Product not found</h1>
        <p className="text-muted text-sm">This product may have been removed or the link is incorrect.</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: '#0056b3' }}
        >
          Back to Store
        </button>
      </div>
    )
  }

  const badge = badges[product.category] ?? badges.System

  function handleAddToCart() {
    addItem(product)
    const label = product.title.length > 32 ? product.title.slice(0, 32) + '…' : product.title
    addToast(`${label} added to cart`, 'success')
  }

  function handleWishlist() {
    addToast(`${product.title.slice(0, 28)}… saved to wishlist`, 'wishlist')
  }

  const relatedToShow = related.length > 0 ? related : fallbackRelated

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Breadcrumb ── */}
      <div className="border-b" style={{ borderColor: '#e0e0e0', backgroundColor: '#fafafa' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-muted font-medium">
          <button onClick={() => navigate('/')} className="hover:text-ink transition-colors">Home</button>
          <span className="text-gray-300">›</span>
          <button onClick={() => navigate('/')} className="hover:text-ink transition-colors">Products</button>
          <span className="text-gray-300">›</span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide"
            style={{ background: badge.bg, color: badge.text }}
          >
            {product.category}
          </span>
          <span className="text-gray-300">›</span>
          <span className="text-ink truncate max-w-[200px]">{product.title}</span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* ── Left: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              className="rounded-3xl overflow-hidden border"
              style={{
                aspectRatio: '4/3',
                borderColor: '#e0e0e0',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span
                  className="absolute top-5 left-5 text-[11px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full text-white shadow"
                  style={{ backgroundColor: '#0056b3' }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Trust chips below image */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: '🛡️', label: '2-Year Warranty' },
                { icon: '🚚', label: 'Free Shipping' },
                { icon: '↩️', label: '30-Day Returns' },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border text-center"
                  style={{ borderColor: '#e0e0e0', backgroundColor: '#fafafa' }}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-[11px] font-bold text-muted leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="flex flex-col gap-5"
          >
            {/* Category + Brand */}
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-black tracking-wide uppercase px-2.5 py-1 rounded-full"
                style={{ background: badge.bg, color: badge.text }}
              >
                {product.category}
              </span>
              {product.brand && (
                <span className="text-sm font-semibold text-muted">{product.brand}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-ink leading-tight tracking-tight">
              {product.title}
            </h1>

            {/* Spec */}
            {product.spec && (
              <p className="text-sm font-medium text-muted -mt-2">{product.spec}</p>
            )}

            {/* Rating */}
            <StarRating rating={product.rating} count={product.reviews} />

            {/* Divider */}
            <div className="h-px" style={{ backgroundColor: '#e0e0e0' }} />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black" style={{ color: '#0056b3' }}>
                {product.price}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-muted line-through">{product.oldPrice}</span>
              )}
              {product.saving && (
                <span
                  className="text-sm font-black px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#e9f7ed', color: '#1e8035' }}
                >
                  Save {product.saving}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-semibold" style={{ color: '#1e8035' }}>
                    In Stock
                    {product.stockCount <= 10 && (
                      <span className="ml-1 font-medium text-muted">
                        — only {product.stockCount} left
                      </span>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-sm font-semibold text-red-500">Out of Stock</span>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-sm text-muted leading-relaxed">{product.longDescription}</p>

            {/* Add to Cart + Wishlist */}
            <div className="flex gap-3 mt-1">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40"
                style={{ backgroundColor: '#0056b3' }}
                onMouseEnter={(e) => { if (product.inStock) e.currentTarget.style.backgroundColor = '#004494' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleWishlist}
                className="w-12 h-12 rounded-xl border flex items-center justify-center transition-colors hover:border-red-300 hover:bg-red-50"
                style={{ borderColor: '#e0e0e0' }}
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── Specifications Table ── */}
        {product.specs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-16"
          >
            <h2 className="text-xl font-black text-ink mb-6">Specifications</h2>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
              {product.specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className="flex items-center px-6 py-4"
                  style={{
                    backgroundColor: i % 2 === 0 ? '#fafafa' : '#fff',
                    borderBottom: i < product.specs.length - 1 ? '1px solid #e0e0e0' : 'none',
                  }}
                >
                  <span className="w-40 text-xs font-black uppercase tracking-wider text-muted shrink-0">
                    {spec.label}
                  </span>
                  <span className="text-sm font-semibold text-ink">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Related Products ── */}
        {relatedToShow.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-16"
          >
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-1" style={{ color: '#0056b3' }}>
                  ◈ You Might Also Like
                </p>
                <h2 className="text-xl font-black text-ink">Related Products</h2>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-sm font-bold transition-colors hidden sm:block"
                style={{ color: '#0056b3' }}
              >
                View all →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedToShow.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
