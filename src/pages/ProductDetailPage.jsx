import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useAuth } from '@/context/AuthContext'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { useSEO } from '@/hooks/useSEO'
import { onImgError } from '@/lib/imgFallback'
import { useProducts } from '@/context/ProductsContext'
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
        <span className="text-sm text-muted">({count.toLocaleString()} {t('product.reviews.label')})</span>
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
      <p className="text-sm text-muted leading-relaxed">{t(`product.reviews.${review.textKey}`)}</p>
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
          {reviewCount > 0 && <p className="text-xs text-muted">{reviewCount.toLocaleString()} {t('product.reviews.label')}</p>}
        </div>
        <div className="flex-1 w-full space-y-2">
          {bars.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-xs text-muted w-6 text-end shrink-0">{stars}★</span>
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
  const { formatPrice, parseUSD } = useCurrency()

  const { isAuthenticated, user } = useAuth()
  const { products } = useProducts()
  const product = products.find(p => p.id === id)
  useSEO({ title: product?.title, description: product?.description, image: product?.image })
  const inWishlist = has(id)
  const recentIds = useRecentlyViewed(id)
  const [qty, setQty] = useState(1)
  const gallery = product?.images?.length > 1 ? product.images : product ? [product.image] : []
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifySent, setNotifySent] = useState(false)

  function handleZoomMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    setZoom({ active: true, x, y })
  }

  function handleNotifySubmit() {
    if (!notifyEmail) return
    addToast(t('product.notifyMeSuccess', { email: notifyEmail }), 'success')
    setNotifySent(true)
  }

  useEffect(() => {
    if (user?.email) setNotifyEmail(user.email)
  }, [user])

  useEffect(() => {
    if (!lightbox) return
    function onKey(e) {
      if (e.key === 'Escape') { setLightbox(false); return }
      if (e.key === 'ArrowRight') setActiveImg(i => (i + 1) % gallery.length)
      if (e.key === 'ArrowLeft') setActiveImg(i => (i - 1 + gallery.length) % gallery.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, gallery.length])

  const recentProducts = recentIds.map(rid => products.find(p => p.id === rid)).filter(Boolean)
  const related = products.filter(p => p.id !== id && p.category === product?.category).slice(0, 4)
  const fallbackRelated = products.filter(p => p.id !== id).slice(0, 4)

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
    addToast(`${label} — ${t('products.addedToCart')}`, 'success')
  }

  function handleWishlist() {
    toggle(product.id)
    const label = product.title.slice(0, 28) + (product.title.length > 28 ? '…' : '')
    addToast(`${label} — ${inWishlist ? t('products.removedFromWishlist') : t('products.savedToWishlist')}`, 'wishlist')
  }

  const relatedToShow = related.length > 0 ? related : fallbackRelated

  const trustChips = [
    { icon: '🛡️', label: t('product.warranty') },
    { icon: '🚚', label: t('product.freeShipping') },
    { icon: '↩️', label: t('product.returns') },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      className="pt-36 lg:pt-44 pb-20 lg:pb-0">

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

          {/* Left: Image gallery */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="relative">

            {/* Main image */}
            <div
              className="group relative rounded-3xl overflow-hidden border cursor-zoom-in"
              onClick={() => setLightbox(true)}
              onMouseMove={handleZoomMove}
              onMouseLeave={() => setZoom(z => ({ ...z, active: false }))}
              style={{ aspectRatio: '4/3', borderColor: '#e0e0e0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={gallery[activeImg]}
                  alt={`${product.title} — view ${activeImg + 1}`}
                  loading="lazy"
                  onError={onImgError}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                />
              </AnimatePresence>

              {/* Hover zoom overlay — desktop only, pointer-events-none so clicks pass through */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none transition-opacity duration-150 hidden sm:block"
                style={{
                  opacity: zoom.active ? 1 : 0,
                  backgroundImage: `url(${gallery[activeImg]})`,
                  backgroundSize: '260%',
                  backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                }}
              />

              {/* Badge — glassmorphism, top-right */}
              {product.badge && (
                <span
                  className="absolute top-4 end-4 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    textShadow: '0 1px 3px rgba(0,0,0,0.55)',
                  }}
                >
                  {product.badge}
                </span>
              )}

              {/* Expand icon */}
              <button
                onClick={e => { e.stopPropagation(); setLightbox(true) }}
                className="absolute top-3 start-3 w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                style={{ backgroundColor: 'rgba(0,0,0,0.35)', color: '#fff' }}
                aria-label="View fullscreen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M15 3h6m0 0v6m0-6-7 7M9 21H3m0 0v-6m0 6 7-7" />
                </svg>
              </button>

              {/* Prev/Next arrows — only when gallery has >1 image */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + gallery.length) % gallery.length) }}
                    className="absolute start-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 transition-opacity opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
                    style={{ backgroundColor: 'rgba(255,255,255,0.20)', color: '#fff' }}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % gallery.length) }}
                    className="absolute end-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 transition-opacity opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
                    style={{ backgroundColor: 'rgba(255,255,255,0.20)', color: '#fff' }}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {gallery.length > 1 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all"
                    style={{
                      borderColor: activeImg === i ? '#0056b3' : '#e0e0e0',
                      opacity: activeImg === i ? 1 : 0.65,
                    }}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={activeImg === i}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      onError={onImgError}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust chips */}
            <div className="mt-4 grid grid-cols-3 gap-3">
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
              <span className="text-4xl font-black" style={{ color: '#0056b3' }}>{formatPrice(parseUSD(product.price))}</span>
              {product.oldPrice && <span className="text-lg text-muted line-through">{formatPrice(parseUSD(product.oldPrice))}</span>}
              {product.saving && (
                <span className="text-sm font-black px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#e9f7ed', color: '#1e8035' }}>
                  {t('product.save', { amount: formatPrice(parseUSD(product.saving)) })}
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
                      <span className="ms-1 font-medium text-muted">
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
                onClick={() => { navigator.clipboard.writeText(window.location.href); addToast(t('product.linkCopied'), 'success') }}
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

            {/* ── Notify Me — only when out of stock ── */}
            {!product.inStock && (
              <div className="rounded-2xl border p-4" style={{ borderColor: '#fde68a', backgroundColor: '#fffbeb' }}>
                {isAuthenticated && user ? (
                  notifySent ? (
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-[11px] font-black" style={{ backgroundColor: '#1e8035' }}>✓</span>
                      <p className="text-sm font-semibold text-ink">{t('product.notifyMeSuccess', { email: notifyEmail })}</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-black text-ink mb-3">{t('product.notifyMeTitle')}</p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={notifyEmail}
                          onChange={e => setNotifyEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none transition-colors"
                          style={{ borderColor: '#e0e0e0' }}
                          onFocus={e => { e.target.style.borderColor = '#0056b3' }}
                          onBlur={e => { e.target.style.borderColor = '#e0e0e0' }}
                        />
                        <button
                          onClick={handleNotifySubmit}
                          className="px-4 py-2 rounded-xl text-sm font-bold text-white shrink-0 transition-opacity hover:opacity-90"
                          style={{ backgroundColor: '#0056b3' }}
                        >
                          {t('product.notifyMeBtn')}
                        </button>
                      </div>
                      <p className="text-[11px] text-muted mt-2">{t('product.notifyMeDesc')}</p>
                    </>
                  )
                ) : (
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-sm font-bold text-ink">{t('product.notifyMeTitle')}</p>
                      <p className="text-xs text-muted mt-0.5">{t('product.notifyMeSignIn')}</p>
                    </div>
                    <Link
                      to="/account"
                      className="text-sm font-black px-4 py-2 rounded-xl text-white shrink-0"
                      style={{ backgroundColor: '#0056b3' }}
                    >
                      {t('account.signIn')} →
                    </Link>
                  </div>
                )}
              </div>
            )}

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

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(false)}
              className="fixed inset-0 z-[95] bg-black/90 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[96] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="relative pointer-events-auto"
                style={{ maxWidth: 'min(90vw, 900px)', width: '100%' }}
                onClick={e => e.stopPropagation()}
              >
                {/* Close */}
                <button
                  onClick={() => setLightbox(false)}
                  className="absolute -top-12 end-0 w-9 h-9 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>

                {/* Image */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImg}
                    src={gallery[activeImg]}
                    alt={`${product.title} — view ${activeImg + 1}`}
                    onError={onImgError}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.22 }}
                    className="w-full rounded-2xl object-contain"
                    style={{ maxHeight: '75vh' }}
                  />
                </AnimatePresence>

                {/* Arrows */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg(i => (i - 1 + gallery.length) % gallery.length)}
                      className="absolute start-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-black/50 text-white hover:bg-black/70 transition-colors text-xl"
                      aria-label="Previous image"
                    >‹</button>
                    <button
                      onClick={() => setActiveImg(i => (i + 1) % gallery.length)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-black/50 text-white hover:bg-black/70 transition-colors text-xl"
                      aria-label="Next image"
                    >›</button>
                  </>
                )}

                {/* Dot indicators */}
                {gallery.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-4">
                    {gallery.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className="w-2 h-2 rounded-full transition-all"
                        style={{ backgroundColor: i === activeImg ? '#fff' : 'rgba(255,255,255,0.35)', transform: i === activeImg ? 'scale(1.3)' : 'scale(1)' }}
                        aria-label={`View image ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t px-4 py-3 flex items-center gap-3"
        style={{ borderColor: '#e0e0e0', boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-ink truncate">{product.title}</p>
          <p className="text-base font-black" style={{ color: '#0056b3' }}>{formatPrice(parseUSD(product.price))}</p>
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
