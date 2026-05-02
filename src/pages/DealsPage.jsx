import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useProducts } from '@/context/ProductsContext'
import { onImgError } from '@/lib/imgFallback'
import { useSEO } from '@/hooks/useSEO'

/* ── helpers ─────────────────────────────────────── */
function parseDollars(str) {
  return Number(String(str).replace(/[^0-9.]/g, '')) || 0
}

function discountPct(price, oldPrice) {
  const p = parseDollars(price)
  const o = parseDollars(oldPrice)
  if (!o || !p) return 0
  return Math.round(((o - p) / o) * 100)
}

/* deterministic 40–85 % "claimed" progress per product */
function claimedPct(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff
  return 40 + (Math.abs(h) % 46)
}

/* ── Countdown ────────────────────────────────────── */
function useCountdown() {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    function calc() {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      setRemaining(Math.floor((midnight - now) / 1000))
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])

  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60
  return { h, m, s }
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-2xl sm:text-3xl font-black tabular-nums leading-none"
        style={{ color: '#fff' }}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <span className="text-[10px] font-bold tracking-widest uppercase mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {label}
      </span>
    </div>
  )
}

function Separator() {
  return <span className="text-2xl font-black pb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>:</span>
}

/* ── Deal Card ────────────────────────────────────── */
function DealCard({ product }) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const { addToast } = useToast()
  const { toggle, has } = useWishlist()
  const { formatPrice, parseUSD } = useCurrency()
  const inWishlist = has(product.id)
  const pct = discountPct(product.price, product.oldPrice)
  const claimed = claimedPct(product.id)
  const isUrgent = claimed >= 75

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border overflow-hidden flex flex-col"
      style={{
        borderColor: '#e0e0e0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(229,62,62,0.10), 0 2px 8px rgba(0,0,0,0.06)'
        e.currentTarget.style.borderColor = '#fecaca'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'
        e.currentTarget.style.borderColor = '#e0e0e0'
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-surface" style={{ aspectRatio: '4/3' }}>
        <Link to={`/product/${product.id}`} tabIndex={-1} className="absolute inset-0" aria-hidden="true" />
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={onImgError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount badge */}
        {pct > 0 && (
          <span
            className="absolute top-3 start-3 text-xs font-black px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: '#e53e3e' }}
          >
            -{pct}% {t('dealsPage.off')}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => {
            toggle(product.id)
            const label = product.title.slice(0, 28)
            addToast(`${label} — ${inWishlist ? t('products.removedFromWishlist') : t('products.savedToWishlist')}`, 'wishlist')
          }}
          className="absolute top-3 end-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ opacity: inWishlist ? 1 : undefined }}
        >
          <svg
            className="w-3.5 h-3.5"
            style={{ color: inWishlist ? '#ef4444' : '#9ca3af' }}
            fill={inWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <Link
          to={`/product/${product.id}`}
          className="text-sm font-bold text-ink leading-snug line-clamp-2 hover:underline"
          style={{ textDecorationColor: '#0056b3' }}
        >
          {product.title}
        </Link>

        {/* Price row */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xl font-black" style={{ color: '#e53e3e' }}>{formatPrice(parseUSD(product.price))}</span>
          {product.oldPrice && <span className="text-sm text-muted line-through">{formatPrice(parseUSD(product.oldPrice))}</span>}
          {product.saving && (
            <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff0f0', color: '#c53030' }}>
              {t('dealsPage.saveBadge', { amount: formatPrice(parseUSD(product.saving)) })}
            </span>
          )}
        </div>

        {/* Urgency */}
        {isUrgent && (
          <p className="text-[11px] font-black tracking-wide" style={{ color: '#e53e3e' }}>
            ⚡ {t('dealsPage.urgencyFew')}
          </p>
        )}

        {/* Progress bar */}
        <div className="flex flex-col gap-1 mt-auto">
          <div className="flex justify-between text-[10px] font-semibold text-muted">
            <span>{claimed}% {t('dealsPage.claimed')}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f0f0f0' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${claimed}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: isUrgent ? '#e53e3e' : '#0056b3' }}
            />
          </div>
        </div>

        {/* Add to cart */}
        <button
          onClick={() => {
            addItem(product)
            const label = product.title.length > 32 ? product.title.slice(0, 32) + '…' : product.title
            addToast(`${label} — ${t('products.addedToCart')}`, 'success')
          }}
          className="w-full py-2.5 rounded-xl text-sm font-black text-white transition-colors mt-1"
          style={{ backgroundColor: '#e53e3e' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#c53030' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#e53e3e' }}
        >
          {t('dealsPage.addToCart')}
        </button>
      </div>
    </motion.article>
  )
}

/* ── Page ─────────────────────────────────────────── */
export default function DealsPage() {
  const { t } = useTranslation()
  const { h, m, s } = useCountdown()
  const [activeCategory, setActiveCategory] = useState('all')
  const { products } = useProducts()

  useSEO({ title: t('dealsPage.title'), description: t('dealsPage.sub') })

  const dealProducts = useMemo(() => products.filter(p => p.oldPrice), [products])

  const categories = useMemo(() => [
    'all',
    ...Array.from(new Set(dealProducts.map(p => p.category))),
  ], [dealProducts])

  const filtered = useMemo(() =>
    activeCategory === 'all'
      ? dealProducts
      : dealProducts.filter(p => p.category === activeCategory),
    [dealProducts, activeCategory]
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div
        className="pt-36 lg:pt-44 pb-10"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #c53030 60%, #e53e3e 100%)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link to="/" className="hover:text-white transition-colors">{t('pages.home')}</Link>
            <span>/</span>
            <span style={{ color: '#fff' }}>{t('dealsPage.breadcrumb')}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⚡</span>
                <h1 className="text-3xl sm:text-4xl font-black text-white">{t('dealsPage.title')}</h1>
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{t('dealsPage.sub')}</p>
            </div>

            {/* Countdown */}
            <div className="flex flex-col items-start lg:items-end gap-2">
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {t('dealsPage.endsIn')}
              </p>
              <div className="flex items-end gap-3">
                <CountdownUnit value={h} label={t('dealsPage.hours')} />
                <Separator />
                <CountdownUnit value={m} label={t('dealsPage.minutes')} />
                <Separator />
                <CountdownUnit value={s} label={t('dealsPage.seconds')} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Category filter + count */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
                style={{
                  backgroundColor: activeCategory === cat ? '#e53e3e' : '#f5f5f5',
                  color: activeCategory === cat ? '#fff' : '#555',
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat) e.currentTarget.style.backgroundColor = '#e0e0e0'
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat) e.currentTarget.style.backgroundColor = '#f5f5f5'
                }}
              >
                {cat === 'all' ? t('dealsPage.allDeals') : cat}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted font-semibold shrink-0">
            {t('dealsPage.totalDeals', { count: filtered.length })}
          </p>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 280, damping: 28 }}
                >
                  <DealCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <span className="text-5xl mb-4">🏷️</span>
              <p className="text-base font-bold text-ink">{t('dealsPage.noDeals')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
