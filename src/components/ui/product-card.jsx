import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useWishlist } from '@/context/WishlistContext'

/* ── Star Rating ──────────────────────────────── */
function StarRating({ rating = 4.8, count = 0 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled  = i < Math.floor(rating)
          const partial = !filled && i < rating
          return (
            <svg
              key={i}
              className={cn(
                'w-3 h-3',
                filled  ? 'text-amber-400' : partial ? 'text-amber-300' : 'text-gray-200'
              )}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )
        })}
      </div>
      <span className="text-xs text-muted font-medium leading-none">
        {rating.toFixed(1)}
        {count > 0 && <span className="ml-0.5 text-gray-400">({count.toLocaleString()})</span>}
      </span>
    </div>
  )
}

/* ── Badge palette ────────────────────────────── */
const badges = {
  System:   { bg: '#e6f0fa', text: '#004494' },
  GPU:      { bg: '#f3f0ff', text: '#5521b5' },
  CPU:      { bg: '#fff3e0', text: '#c2410c' },
  Monitor:  { bg: '#e9f7ed', text: '#1e8035' },
  Mouse:    { bg: '#fef2f2', text: '#b91c1c' },
  Desk:     { bg: '#fffbeb', text: '#92400e' },
  Chair:    { bg: '#fdf4ff', text: '#7e22ce' },
  Storage:  { bg: '#f0fdf4', text: '#166534' },
  Keyboard: { bg: '#eff6ff', text: '#1d4ed8' },
}

/* ── ProductCard ──────────────────────────────── */
export function ProductCard({ product, onQuickView }) {
  const { addItem } = useCart()
  const { addToast } = useToast()
  const { toggle, has } = useWishlist()
  const badge = badges[product.category] ?? badges.System
  const inWishlist = has(product.id)

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    const label = product.title.length > 32 ? product.title.slice(0, 32) + '…' : product.title
    addToast(`${label} added to cart`, 'success')
  }

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
    const label = product.title.slice(0, 28) + (product.title.length > 28 ? '…' : '')
    addToast(inWishlist ? `${label} removed from wishlist` : `${label} saved to wishlist`, 'wishlist')
  }

  function handleQuickView(e) {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative group bg-white rounded-2xl border overflow-hidden flex flex-col h-full"
      style={{
        borderColor: '#e0e0e0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,86,179,0.10), 0 2px 8px rgba(0,0,0,0.06)'
        e.currentTarget.style.borderColor = '#cce1f5'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
        e.currentTarget.style.borderColor = '#e0e0e0'
      }}
    >
      {/*
        Invisible full-card link sitting at z-0.
        Interactive elements (buttons) are in z-10 containers so they sit above this link.
        Clicking any non-button area of the card navigates to the detail page.
        Clicking a button calls preventDefault + stopPropagation to cancel the link.
      */}
      {product.id && (
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-0 z-0 rounded-2xl"
          aria-label={`View details for ${product.title}`}
          tabIndex={-1}
        />
      )}

      {/* ── Image ── */}
      <div className="relative z-10 overflow-hidden bg-surface" style={{ aspectRatio: '4/3' }}>
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />

        {/* Badge top-left */}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full text-white shadow-sm" style={{ backgroundColor: '#0056b3' }}>
            {product.badge}
          </span>
        )}

        {/* Wishlist top-right — always visible when wishlisted, hover-only otherwise */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-opacity shadow-sm border border-border opacity-0 group-hover:opacity-100"
          style={{ opacity: inWishlist ? 1 : undefined }}
        >
          <svg
            className="w-3.5 h-3.5 transition-colors"
            style={{ color: inWishlist ? '#ef4444' : '#9ca3af' }}
            fill={inWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick View overlay */}
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <button
              onClick={handleQuickView}
              className="w-full py-2.5 text-xs font-bold text-white bg-black/70 backdrop-blur-sm hover:bg-black/85 transition-colors"
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="relative z-10 p-4 flex flex-col flex-1 gap-2">

        {/* Category + Brand row */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full"
            style={{ background: badge.bg, color: badge.text }}
          >
            {product.category}
          </span>
          {product.brand && (
            <span className="text-[11px] font-semibold text-muted">{product.brand}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-ink leading-snug line-clamp-2 flex-1">
          {product.title}
        </h3>

        {/* Spec */}
        {product.spec && (
          <p className="text-[11px] text-muted font-medium leading-none">{product.spec}</p>
        )}

        {/* Stars */}
        <StarRating rating={product.rating} count={product.reviews} />

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-black" style={{ color: '#0056b3' }}>
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-muted line-through">{product.oldPrice}</span>
          )}
          {product.saving && (
            <span className="text-[11px] font-bold" style={{ color: '#28a745' }}>Save {product.saving}</span>
          )}
        </div>

        {/* Add to Cart */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          className="relative z-10 mt-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
          style={{ backgroundColor: '#0056b3' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.article>
  )
}
