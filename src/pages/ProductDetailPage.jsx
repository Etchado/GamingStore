import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useWishlist } from '@/context/WishlistContext'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PRODUCTS } from '@/data/products'
import { ProductCard } from '@/components/ui/product-card'

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

function StarRating({ rating = 4.8, count = 0 }) {
  const { t } = useTranslation()
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
              viewBox="0 0 20 20" fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )
        })}
      </div>
      <span className="text-sm font-bold text-ink">{rating.toFixed(1)}</span>
      {count > 0 && (
        <span className="text-sm text-muted">({count.toLocaleString()} {t('product.reviews')})</span>
      )}
    </div>
  )
}

const SAMPLE_REVIEWS = [
  { name: 'Marcus T.',   avatar: 'MT', rating: 5, date: 'March 2025',    verified: true,  textKey: 'review1' },
  { name: 'Sarah K.',    avatar: 'SK', rating: 5, date: 'February 2025', verified: true,  textKey: 'review2' },
  { name: 'DaveGaming',  avatar: 'DG', rating: 4, date: 'January 2025',  verified: false, textKey: 'review3' },
  { name: 'Alex M.',     avatar: 'AM', rating: 5, date: 'December 2024', verified: true,  textKey: 'review4' },
]

const REVIEW_TEXTS = {
  review1: "Absolutely incredible build quality. Sets up in minutes and the performance is exactly as advertised. Worth every penny — I've already recommended it to three friends.",
  review2: "I was skeptical about purchasing high-end gear online but the packaging was perfect and delivery was fast. Zero regrets. Customer support was also top notch when I had a question.",
  review3: "Great product overall. Took off one star only because setup documentation could be clearer for first-timers, but performance-wise this thing is an absolute beast.",
  review4: "Third purchase from GamingStore. Always reliable, always top-tier. The team helped me pick the right configuration for my needs and delivery was ahead of schedule.",
}

const AVATAR_COLORS = ['#0056b3', '#7e22ce', '#1e8035', '#c2410c']

function ReviewCard({ review, colorIndex }) {
  const { t } = useTranslation()
  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: '#e0e0e0', backgroundColor: '#fafafa' }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
            style={{ backgroundColor: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}
          >
            {review.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink">{review.name}</span>
              {review.verified && (
                <span
                  className="text-[9px] font-black tracking-wide uppercase px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: '#e9f7ed', color: '#1e8035' }}
                >
                  {t('product.verified')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`}
              viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted leading-relaxed">{REVIEW_TEXTS[review.textKey]}</p>
    </div>
  )
}

function ReviewsSection({ rating, reviewCount }) {
  const { t } = useTranslation()
  const ratingInt = Math.round(rating ?? 4.8)
  const bars = [
    { stars: 5, pct: 72 }, { stars: 4, pct: 18 }, { stars: 3, pct: 6 },
    { stars: 2, pct: 2 },  { stars: 1, pct: 2 },
  ]
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }} className="mt-16">
      <div className="mb-6">
        <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-1" style={{ color: '#0056b3' }}>
          ◈ {t('product.reviewsSub')}
        </p>
        <h2 className="text-xl font-black text-ink">{t('product.reviewsTitle')}</h2>
      </div>
      <div className="flex flex-col sm:flex-row items-start gap-8 mb-8 p-6 rounded-2xl border" style={{ borderColor: '#e0e0e0', backgroundColor: '#fafafa' }}>
        <div className="text-center shrink-0">
          <p className="text-5xl font-black text-ink">{(rating ?? 4.8).toFixed(1)}</p>
          <div className="flex justify-center gap-0.5 my-2">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < ratingInt ? 'text-amber-400' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {reviewCount > 0 && <p className="text-xs text-muted">{reviewCount.toLocaleString()} {t('product.reviews')}</p>}
        </div>
        <div className="flex-1 w-full space-y-2">
          {bars.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-xs text-muted w-6 text-right shrink-0">{stars}★</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e0e0e0' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#f59e0b' }} />
              </div>
              <span className="text-xs text-muted w-8 shrink-0">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_REVIEWS.map((review, i) => (
          <ReviewCard key={review.name} review={review} colorIndex={i} />
        ))}
      </div>
    </motion.div>
  )
}

export default function ProductDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { addToast } = useToast()
  const { toggle, has } = useWishlist()

  const product = PRODUCTS.find(p => p.id === id)
  usePageTitle(product?.title)
  const inWishlist = has(id)
  const recentIds = useRecentlyViewed(id)
  const [qty, setQty] = useState(1)
  const recentProducts = recentIds.map(rid => PRODUCTS.find(p => p.id === rid)).filter(Boolean)
  const related = PRODUCTS.filter(p => p.id !== id && p.category === product?.category).slice(0, 4)
  const fallbackRelated = PRODUCTS.filter(p => p.id !== id).slice(0, 4)

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: '#e6f0fa' }}>
          🔍
        </div>
        <h1 className="text-2xl font-black text-ink">{t('product.notFound')}</h1>
        <p className="text-muted text-sm">{t('product.notFoundSub')}</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: '#0056b3' }}
        >
          {t('product.backToStore')}
        </button>
      </div>
    )
  }

  const badge = badges[product.category] ?? badges.System

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) addItem(product)
    const label = product.title.length > 32 ? product.title.slice(0, 32) + '…' : product.title
    addToast(qty > 1 ? `${qty}× ${label} added to cart` : `${label} added to cart`, 'success')
  }

  function handleWishlist() {
    toggle(product.id)
    const label = product.title.slice(0, 28) + (product.title.length > 28 ? '…' : '')
    addToast(inWishlist ? `${label} removed from wishlist` : `${label} saved to wishlist`, 'wishlist')
  }

  const relatedToShow = related.length > 0 ? related : fallbackRelated

  const trustChips = [
    { icon: '🛡️', label: t('product.warranty') },
    { icon: '🚚', label: t('product.freeShipping') },
    { icon: '↩️', label: t('product.returns') },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      className="pt-25 lg:pt-35 pb-20 lg:pb-0">

      {/* Breadcrumb */}
      <div className="border-b" style={{ borderColor: '#e0e0e0', backgroundColor: '#fafafa' }}>
        <nav aria-label="breadcrumb" className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-muted font-medium">
          <button onClick={() => navigate('/')} className="hover:text-ink transition-colors">{t('product.home')}</button>
          <span className="text-gray-300" aria-hidden="true">›</span>
          <button onClick={() => navigate('/')} className="hover:text-ink transition-colors">{t('product.products')}</button>
          <span className="text-gray-300" aria-hidden="true">›</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide"
            style={{ background: badge.bg, color: badge.text }}>
            {product.category}
          </span>
          <span className="text-gray-300" aria-hidden="true">›</span>
          <span className="text-ink truncate max-w-[200px]" aria-current="page">{product.title}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* Left: Image */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="relative">
            <div className="relative rounded-3xl overflow-hidden border"
              style={{ aspectRatio: '4/3', borderColor: '#e0e0e0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              {product.badge && (
                <span className="absolute top-5 left-5 text-[11px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full text-white shadow"
                  style={{ backgroundColor: '#0056b3' }}>
                  {product.badge}
                </span>
              )}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {trustChips.map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border text-center"
                  style={{ borderColor: '#e0e0e0', backgroundColor: '#fafafa' }}>
                  <span className="text-lg" aria-hidden="true">{icon}</span>
                  <span className="text-[11px] font-bold text-muted leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="flex flex-col gap-5">

            {/* Category + Brand */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black tracking-wide uppercase px-2.5 py-1 rounded-full"
                style={{ background: badge.bg, color: badge.text }}>
                {product.category}
              </span>
              {product.brand && <span className="text-sm font-semibold text-muted">{product.brand}</span>}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-ink leading-tight tracking-tight">
              {product.title}
            </h1>
            {product.spec && <p className="text-sm font-medium text-muted -mt-2">{product.spec}</p>}

            <StarRating rating={product.rating} count={product.reviews} />
            <div className="h-px" style={{ backgroundColor: '#e0e0e0' }} />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black" style={{ color: '#0056b3' }}>{product.price}</span>
              {product.oldPrice && <span className="text-lg text-muted line-through">{product.oldPrice}</span>}
              {product.saving && (
                <span className="text-sm font-black px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#e9f7ed', color: '#1e8035' }}>
                  {t('product.save', { amount: product.saving })}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
                  <span className="text-sm font-semibold" style={{ color: '#1e8035' }}>
                    {t('product.inStock')}
                    {product.stockCount <= 10 && (
                      <span className="ml-1 font-medium text-muted">
                        {t('product.onlyLeft', { count: product.stockCount })}
                      </span>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-400" aria-hidden="true" />
                  <span className="text-sm font-semibold text-red-500">{t('product.outOfStock')}</span>
                </>
              )}
            </div>

            <p className="text-sm text-muted leading-relaxed">{product.longDescription}</p>

            {/* Qty selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-ink">{t('product.qty')}</span>
              <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity"
                  className="w-9 h-9 flex items-center justify-center text-muted hover:bg-surface transition-colors font-bold text-base">
                  −
                </button>
                <span className="w-10 text-center text-sm font-bold text-ink" aria-live="polite">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} aria-label="Increase quantity"
                  className="w-9 h-9 flex items-center justify-center text-muted hover:bg-surface transition-colors font-bold text-base">
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart + Wishlist + Share */}
            <div className="flex gap-3 mt-1">
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart} disabled={!product.inStock}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40"
                style={{ backgroundColor: '#0056b3' }}
                onMouseEnter={(e) => { if (product.inStock) e.currentTarget.style.backgroundColor = '#004494' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}>
                {qty > 1 ? t('product.addToCartQty', { qty }) : t('product.addToCart')}
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleWishlist}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={inWishlist}
                className="w-12 h-12 rounded-xl border flex items-center justify-center transition-colors"
                style={{ borderColor: inWishlist ? '#fca5a5' : '#e0e0e0', backgroundColor: inWishlist ? '#fff1f1' : 'transparent' }}
                onMouseEnter={(e) => { if (!inWishlist) { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.backgroundColor = '#fff5f5' } }}
                onMouseLeave={(e) => { if (!inWishlist) { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.backgroundColor = 'transparent' } }}>
                <svg className="w-5 h-5" style={{ color: inWishlist ? '#ef4444' : '#9ca3af' }}
                  fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => { navigator.clipboard.writeText(window.location.href); addToast('Link copied to clipboard!', 'success') }}
                aria-label="Share product"
                className="w-12 h-12 rounded-xl border flex items-center justify-center transition-colors text-muted hover:text-ink"
                style={{ borderColor: '#e0e0e0' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0056b3'; e.currentTarget.style.color = '#0056b3' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Specifications Table */}
        {product.specs && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="mt-16">
            <h2 className="text-xl font-black text-ink mb-6">{t('product.specifications')}</h2>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
              {product.specs.map((spec, i) => (
                <div key={spec.label} className="flex items-center px-6 py-4"
                  style={{ backgroundColor: i % 2 === 0 ? '#fafafa' : '#fff', borderBottom: i < product.specs.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                  <span className="w-40 text-xs font-black uppercase tracking-wider text-muted shrink-0">{spec.label}</span>
                  <span className="text-sm font-semibold text-ink">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <ReviewsSection rating={product.rating} reviewCount={product.reviews} />

        {/* Related Products */}
        {relatedToShow.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="mt-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-1" style={{ color: '#0056b3' }}>
                  ◈ {t('product.relatedSub')}
                </p>
                <h2 className="text-xl font-black text-ink">{t('product.relatedTitle')}</h2>
              </div>
              <button onClick={() => navigate('/')} className="text-sm font-bold transition-colors hidden sm:block"
                style={{ color: '#0056b3' }}>
                {t('product.viewAll')}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedToShow.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </motion.div>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="mt-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-1" style={{ color: '#718096' }}>
                  ◈ {t('product.recentSub')}
                </p>
                <h2 className="text-xl font-black text-ink">{t('product.recentTitle')}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </motion.div>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t px-4 py-3 flex items-center gap-3"
        style={{ borderColor: '#e0e0e0', boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-ink truncate">{product.title}</p>
          <p className="text-base font-black" style={{ color: '#0056b3' }}>{product.price}</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart} disabled={!product.inStock}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40 shrink-0"
          style={{ backgroundColor: '#0056b3' }}>
          {product.inStock ? t('product.addToCart') : t('product.outOfStock')}
        </motion.button>
      </div>
    </motion.div>
  )
}
