import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ProductCard } from '@/components/ui/product-card'
import SkeletonCard from '@/components/ui/SkeletonCard'
import QuickViewModal from '@/components/QuickViewModal'
import { useProducts } from '@/context/ProductsContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTheme } from '@/context/ThemeContext'

const FILTERS = ['All', 'System', 'GPU', 'CPU', 'Monitor', 'Mouse', 'Keyboard', 'Headset', 'Storage', 'Desk', 'Chair', 'Mouse Pad']

const SORT_KEYS = [
  { value: 'featured',   key: 'products.sort.featured' },
  { value: 'price-asc',  key: 'products.sort.priceAsc' },
  { value: 'price-desc', key: 'products.sort.priceDesc' },
  { value: 'rating',     key: 'products.sort.topRated' },
  { value: 'deals',      key: 'products.sort.deals' },
]

const PRICE_MIN = 0
const PRICE_MAX = 2500
const RATING_OPTIONS = [
  { value: 0,   label: null,    labelKey: 'products.advancedFilters.anyRating' },
  { value: 4,   label: '4★+',  labelKey: null },
  { value: 4.5, label: '4.5★+', labelKey: null },
  { value: 4.8, label: '4.8★+', labelKey: null },
]

function parsePrice(str) {
  return parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0
}

const slideUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.48, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
}

// ── Filter chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border"
      style={{ borderColor: '#0056b3', color: '#0056b3', backgroundColor: '#e6f0fa' }}
    >
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="ms-0.5 w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-blue-200 transition-colors"
      >
        ✕
      </button>
    </span>
  )
}

// ── Filter sidebar ───────────────────────────────────────────────────────────
function FilterSidebar({
  brands,
  minPrice, maxPrice, selectedBrands, minRating, inStock,
  onMinPrice, onMaxPrice, onToggleBrand, onMinRating, onInStock,
  onClear, activeCount, onClose,
}) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language?.startsWith('ar')

  return (
    <div className="space-y-6">
      {/* Header row — desktop only */}
      <div className="hidden lg:flex items-center justify-between">
        <h3 className="text-sm font-black text-ink">{t('products.advancedFilters.title')}</h3>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="text-xs font-bold transition-colors"
            style={{ color: '#0056b3' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            {t('products.advancedFilters.clearAll')}
          </button>
        )}
      </div>

      {/* ── Price Range ── */}
      <div>
        <h4 className="text-[10px] font-black text-ink mb-3 uppercase tracking-[0.1em]">
          {t('products.advancedFilters.priceRange')}
        </h4>
        <div className="flex justify-between text-xs font-semibold mb-3" style={{ color: '#555' }}>
          <span>${minPrice.toLocaleString()}</span>
          <span>${maxPrice.toLocaleString()}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted w-6">{t('products.advancedFilters.priceFrom')}</span>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={50}
              value={minPrice}
              onChange={e => onMinPrice(Math.min(+e.target.value, maxPrice - 50))}
              className="flex-1"
              style={{ accentColor: '#0056b3' }}
              aria-label="Minimum price"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted w-6">{t('products.advancedFilters.priceTo')}</span>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={50}
              value={maxPrice}
              onChange={e => onMaxPrice(Math.max(+e.target.value, minPrice + 50))}
              className="flex-1"
              style={{ accentColor: '#0056b3' }}
              aria-label="Maximum price"
            />
          </div>
        </div>
      </div>

      <div className="h-px" style={{ backgroundColor: '#e0e0e0' }} /* sidebar dividers — color handled via CSS dark override */ />

      {/* ── Brand ── */}
      <div>
        <h4 className="text-[10px] font-black text-ink mb-3 uppercase tracking-[0.1em]">
          {t('products.advancedFilters.brand')}
        </h4>
        <div className="space-y-2 max-h-52 overflow-y-auto pe-1">
          {(brands ?? []).map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.has(brand)}
                onChange={() => onToggleBrand(brand)}
                style={{ accentColor: '#0056b3' }}
              />
              <span className="text-xs text-ink group-hover:text-blue-700 transition-colors leading-tight">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px" style={{ backgroundColor: '#e0e0e0' }} /* sidebar dividers — color handled via CSS dark override */ />

      {/* ── Min Rating ── */}
      <div>
        <h4 className="text-[10px] font-black text-ink mb-3 uppercase tracking-[0.1em]">
          {t('products.advancedFilters.minRating')}
        </h4>
        <div className="space-y-2">
          {RATING_OPTIONS.map(({ value, label, labelKey }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="minRating"
                value={value}
                checked={minRating === value}
                onChange={() => onMinRating(value)}
                style={{ accentColor: '#0056b3' }}
              />
              <span className="text-xs text-ink">
                {labelKey ? t(labelKey) : label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px" style={{ backgroundColor: '#e0e0e0' }} /* sidebar dividers — color handled via CSS dark override */ />

      {/* ── In Stock toggle ── */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-ink cursor-pointer" htmlFor="inStockToggle">
          {t('products.advancedFilters.inStockOnly')}
        </label>
        <button
          id="inStockToggle"
          role="switch"
          aria-checked={inStock}
          onClick={() => onInStock(!inStock)}
          className="relative w-9 h-5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 overflow-hidden"
          style={{ backgroundColor: inStock ? '#0056b3' : '#d1d5db' }}
        >
          <span
            className="absolute top-0.5 start-0.5 w-4 h-4 bg-white rounded-full transition-transform"
            style={{ transform: inStock ? `translateX(${isRTL ? '-' : ''}1rem)` : 'translateX(0)' }}
          />
        </button>
      </div>

      {/* Mobile apply button */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden w-full py-3 text-sm font-black text-white rounded-xl mt-2"
          style={{ backgroundColor: '#0056b3' }}
        >
          {t('products.advancedFilters.close')}
          {activeCount > 0 && ` · ${t('products.advancedFilters.activeCount', { count: activeCount })}`}
        </button>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
const PAGE_SIZE = 8

export default function ProductGrid() {
  const { dark } = useTheme()
  const { products } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading]           = useState(true)
  const [quickView, setQuickView]       = useState(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const navigate  = useNavigate()
  const { t, i18n } = useTranslation()
  const BRANDS = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))].sort(), [products])
  const isRTL = i18n.language?.startsWith('ar')

  // ── URL params ──
  const categoryParam  = searchParams.get('category')
  const queryParam     = searchParams.get('q') ?? ''
  const sortParam      = searchParams.get('sort') ?? 'featured'
  const badgeParam     = searchParams.get('badge') ?? ''
  const minPriceParam  = Number(searchParams.get('minPrice') ?? PRICE_MIN)
  const maxPriceParam  = Number(searchParams.get('maxPrice') ?? PRICE_MAX)
  const brandsParam    = searchParams.get('brand') ?? ''
  const minRatingParam = Number(searchParams.get('minRating') ?? 0)
  const inStockParam   = searchParams.get('inStock') === '1'

  const selectedBrands = useMemo(
    () => (brandsParam ? new Set(brandsParam.split(',')) : new Set()),
    [brandsParam],
  )

  // Support comma-separated multi-category (e.g. GPU,CPU from CategoryShowcase)
  const activeCategories = useMemo(() => {
    if (!categoryParam) return []
    return categoryParam.split(',').filter(c => FILTERS.includes(c))
  }, [categoryParam])
  const active = activeCategories.length === 1 ? activeCategories[0] :
                 activeCategories.length > 1  ? 'multi' : 'All'

  const advancedFilterCount =
    (minPriceParam > PRICE_MIN || maxPriceParam < PRICE_MAX ? 1 : 0) +
    (selectedBrands.size > 0 ? 1 : 0) +
    (minRatingParam > 0 ? 1 : 0) +
    (inStockParam ? 1 : 0)

  usePageTitle(
    queryParam          ? `"${queryParam}"` :
    badgeParam === 'NEW'  ? t('products.newArrivalsTitle') :
    sortParam === 'deals' ? t('products.dealsTitle') :
    active === 'multi'    ? activeCategories.join(' & ') :
    active !== 'All'      ? active : null,
  )

  // ── URL setters ──
  function setActive(filter) {
    const next = new URLSearchParams()
    if (queryParam)              next.set('q', queryParam)
    if (sortParam !== 'featured') next.set('sort', sortParam)
    if (filter !== 'All')        next.set('category', filter)
    if (minPriceParam > PRICE_MIN) next.set('minPrice', minPriceParam)
    if (maxPriceParam < PRICE_MAX) next.set('maxPrice', maxPriceParam)
    if (brandsParam)             next.set('brand', brandsParam)
    if (minRatingParam > 0)      next.set('minRating', minRatingParam)
    if (inStockParam)            next.set('inStock', '1')
    setSearchParams(next, { replace: true })
  }

  function setSort(value) {
    const next = new URLSearchParams(searchParams)
    if (value === 'featured') next.delete('sort')
    else next.set('sort', value)
    setSearchParams(next, { replace: true })
  }

  function clearSearch() {
    const next = new URLSearchParams()
    if (categoryParam)             next.set('category', categoryParam)
    if (sortParam !== 'featured')  next.set('sort', sortParam)
    if (minPriceParam > PRICE_MIN) next.set('minPrice', minPriceParam)
    if (maxPriceParam < PRICE_MAX) next.set('maxPrice', maxPriceParam)
    if (brandsParam)               next.set('brand', brandsParam)
    if (minRatingParam > 0)        next.set('minRating', minRatingParam)
    if (inStockParam)              next.set('inStock', '1')
    setSearchParams(next, { replace: true })
  }

  function setAdvancedFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value === null || value === '' || value === undefined) next.delete(key)
    else next.set(key, String(value))
    setSearchParams(next, { replace: true })
  }

  function clearAdvancedFilters() {
    const next = new URLSearchParams(searchParams)
    next.delete('minPrice')
    next.delete('maxPrice')
    next.delete('brand')
    next.delete('minRating')
    next.delete('inStock')
    setSearchParams(next, { replace: true })
  }

  function toggleBrand(brand) {
    const next = new Set(selectedBrands)
    if (next.has(brand)) next.delete(brand)
    else next.add(brand)
    setAdvancedFilter('brand', next.size > 0 ? [...next].join(',') : null)
  }

  // ── Effects ──
  useEffect(() => {
    if (categoryParam || queryParam) {
      const el = document.getElementById('products')
      if (el) {
        const offset = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top: offset, behavior: 'smooth' })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!mobileFiltersOpen) return
    const handler = (e) => { if (e.key === 'Escape') setMobileFiltersOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [mobileFiltersOpen])

  // Reset pagination when any filter/sort/search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [categoryParam, queryParam, sortParam, badgeParam, minPriceParam, maxPriceParam, brandsParam, minRatingParam, inStockParam])

  // ── Filtered + sorted products ──
  const filtered = useMemo(() => products
    .filter(p => {
      if (active === 'multi' && !activeCategories.includes(p.category)) return false
      if (active !== 'All' && active !== 'multi' && p.category !== active) return false
      if (badgeParam && !p.badge?.toLowerCase().includes(badgeParam.toLowerCase())) return false
      if (sortParam === 'deals' && !p.oldPrice) return false
      const price = parsePrice(p.price)
      if (price < minPriceParam) return false
      if (price > maxPriceParam) return false
      if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) return false
      if (minRatingParam > 0 && (p.rating ?? 0) < minRatingParam) return false
      if (inStockParam && p.inStock === false) return false
      if (!queryParam) return true
      const q = queryParam.toLowerCase()
      return [p.title, p.description, p.spec, p.brand, p.category].some(f => f?.toLowerCase().includes(q))
    })
    .sort((a, b) => {
      if (sortParam === 'price-asc')  return parsePrice(a.price) - parsePrice(b.price)
      if (sortParam === 'price-desc') return parsePrice(b.price) - parsePrice(a.price)
      if (sortParam === 'rating')     return (b.rating ?? 0) - (a.rating ?? 0)
      if (sortParam === 'deals')      return parsePrice(b.saving ?? b.oldPrice ?? '0') - parsePrice(a.saving ?? a.oldPrice ?? '0')
      return 0
    }),
  [products, active, activeCategories, badgeParam, sortParam, minPriceParam, maxPriceParam, selectedBrands, minRatingParam, inStockParam, queryParam]
  )

  // ── Shared filter sidebar props ──
  const filterProps = {
    brands: BRANDS,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    selectedBrands,
    minRating: minRatingParam,
    inStock: inStockParam,
    onMinPrice:    v => setAdvancedFilter('minPrice', v <= PRICE_MIN ? null : v),
    onMaxPrice:    v => setAdvancedFilter('maxPrice', v >= PRICE_MAX ? null : v),
    onToggleBrand: toggleBrand,
    onMinRating:   v => setAdvancedFilter('minRating', v === 0 ? null : v),
    onInStock:     v => setAdvancedFilter('inStock', v ? '1' : null),
    onClear:       clearAdvancedFilters,
    activeCount:   advancedFilterCount,
  }

  return (
    <section id="products" className="py-20 px-6" style={{ backgroundColor: dark ? '#0d1117' : '#f8fafc' }}>
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
        >
          <div>
            {queryParam ? (
              <>
                <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-2" style={{ color: '#0056b3' }}>
                  ◈ {t('products.searchResultsSub')}
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                  "{queryParam}"
                </h2>
                {!loading && (
                  <p className="text-sm text-muted mt-1">
                    {t('products.results', { count: filtered.length })}
                  </p>
                )}
              </>
            ) : badgeParam === 'NEW' ? (
              <>
                <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-2" style={{ color: '#0056b3' }}>
                  ◈ {t('products.newArrivalsSub')}
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                  {t('products.newArrivalsTitle')}
                </h2>
                {!loading && (
                  <p className="text-sm text-muted mt-1">
                    {t('products.newProducts', { count: filtered.length })}
                  </p>
                )}
              </>
            ) : sortParam === 'deals' ? (
              <>
                <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-2" style={{ color: '#e53e3e' }}>
                  ◈ {t('products.dealsSub')}
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                  {t('products.dealsTitle')}
                </h2>
                {!loading && (
                  <p className="text-sm text-muted mt-1">
                    {t('products.dealsCount', { count: filtered.length })}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-2" style={{ color: '#0056b3' }}>
                  ◈ {t('products.featuredSub')}
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                  {t('products.featuredTitle')}
                </h2>
                {!loading && (
                  <p className="text-sm text-muted mt-1">
                    {t('products.productCount', { count: filtered.length })}
                    {active !== 'All' && <> {t('products.productCountIn', { cat: t(`products.filters.${active.toLowerCase()}`) })}</>}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {queryParam && (
              <button
                onClick={clearSearch}
                className="flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                {t('products.clearSearch')}
              </button>
            )}
            {(badgeParam || sortParam === 'deals') && !queryParam && (
              <button
                onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
                className="flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                {t('products.clearFilter')}
              </button>
            )}
            {!queryParam && (
              <button
                onClick={() => setActive('All')}
                className="hidden sm:inline text-sm font-bold transition-colors"
                style={{ color: '#0056b3' }}
              >
                {t('products.viewAll')}
              </button>
            )}

            {/* Mobile Filters button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-xs font-bold border rounded-lg px-3 py-1.5 transition-colors"
              style={{ backgroundColor: dark ? '#161b22' : '#ffffff', borderColor: dark ? '#30363d' : '#e0e0e0', color: dark ? '#e6edf3' : '#444' }}
              aria-label={t('products.advancedFilters.showFilters')}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
              </svg>
              {t('products.advancedFilters.showFilters')}
              {advancedFilterCount > 0 && (
                <span
                  className="text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none"
                  style={{ backgroundColor: '#0056b3' }}
                >
                  {advancedFilterCount}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            {!loading && filtered.length > 0 && (
              <select
                value={sortParam}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs font-semibold border rounded-lg px-3 py-1.5 outline-none cursor-pointer transition-colors"
                style={{ backgroundColor: dark ? '#161b22' : '#ffffff', color: dark ? '#e6edf3' : '#1a202c', borderColor: dark ? '#30363d' : '#e0e0e0' }}
                onFocus={(e)  => { e.target.style.borderColor = '#0056b3' }}
                onBlur={(e)   => { e.target.style.borderColor = dark ? '#30363d' : '#e0e0e0' }}
              >
                {SORT_KEYS.map(o => (
                  <option key={o.value} value={o.value}>{t(o.key)}</option>
                ))}
              </select>
            )}
          </div>
        </motion.div>

        {/* ── Category filter pills ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={
                active === f
                  ? { backgroundColor: '#0056b3', color: '#fff', borderColor: '#0056b3' }
                  : { backgroundColor: dark ? '#161b22' : '#fff', color: dark ? '#8b949e' : '#718096', borderColor: dark ? '#30363d' : '#e0e0e0' }
              }
            >
              {t(`products.filters.${f.toLowerCase()}`)}
            </button>
          ))}
        </motion.div>

        {/* ── Divider ── */}
        <div className="h-px mb-8" style={{ backgroundColor: dark ? '#30363d' : '#e0e0e0' }} />

        {/* ── Main layout: sidebar + grid ── */}
        <div className={`flex gap-8 items-start ${isRTL ? 'flex-row-reverse' : ''}`}>

          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block w-52 shrink-0 sticky top-24">
            <FilterSidebar {...filterProps} />
          </aside>

          {/* Product area */}
          <div className="flex-1 min-w-0">

            {/* Active filter chips */}
            <AnimatePresence>
              {advancedFilterCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mb-6 overflow-hidden"
                >
                  {(minPriceParam > PRICE_MIN || maxPriceParam < PRICE_MAX) && (
                    <FilterChip
                      label={`$${minPriceParam.toLocaleString()} – $${maxPriceParam.toLocaleString()}`}
                      onRemove={() => {
                        setAdvancedFilter('minPrice', null)
                        setAdvancedFilter('maxPrice', null)
                      }}
                    />
                  )}
                  {[...selectedBrands].map(brand => (
                    <FilterChip key={brand} label={brand} onRemove={() => toggleBrand(brand)} />
                  ))}
                  {minRatingParam > 0 && (
                    <FilterChip
                      label={`${minRatingParam}★+`}
                      onRemove={() => setAdvancedFilter('minRating', null)}
                    />
                  )}
                  {inStockParam && (
                    <FilterChip
                      label={t('products.advancedFilters.inStockOnly')}
                      onRemove={() => setAdvancedFilter('inStock', null)}
                    />
                  )}
                  {advancedFilterCount > 1 && (
                    <button
                      onClick={clearAdvancedFilters}
                      className="text-xs font-bold transition-colors"
                      style={{ color: '#718096' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#e53e3e')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#718096')}
                    >
                      {t('products.advancedFilters.clearAll')}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid / skeleton / empty */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-4 text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: '#e6f0fa' }}
                >
                  🔍
                </div>
                <div>
                  <p className="text-base font-bold text-ink">{t('products.notFound')}</p>
                  <p className="text-sm text-muted mt-1">
                    {queryParam ? (
                      <>
                        {t('products.notFoundQuery', { q: queryParam })}
                        {active !== 'All' && t('products.notFoundQueryIn', { cat: t(`products.filters.${active.toLowerCase()}`) })}
                      </>
                    ) : advancedFilterCount > 0 ? (
                      t('products.advancedFilters.clearAll')
                    ) : (
                      t('products.notFoundCat', { cat: t(`products.filters.${active.toLowerCase()}`) })
                    )}
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap justify-center">
                  {advancedFilterCount > 0 && (
                    <button
                      onClick={clearAdvancedFilters}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold border"
                      style={{ borderColor: '#e0e0e0', color: '#555' }}
                    >
                      {t('products.advancedFilters.clearAll')}
                    </button>
                  )}
                  {queryParam && (
                    <button
                      onClick={clearSearch}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold border"
                      style={{ borderColor: '#e0e0e0', color: '#555' }}
                    >
                      {t('products.clearSearchBtn')}
                    </button>
                  )}
                  <button
                    onClick={() => setActive('All')}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: '#0056b3' }}
                  >
                    {t('products.viewAllBtn')}
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div key={[categoryParam, queryParam, sortParam, badgeParam].join('|')} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.slice(0, visibleCount).map((product, i) => (
                    <motion.div
                      key={product.id}
                      custom={i}
                      variants={slideUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                    >
                      <ProductCard product={product} onQuickView={setQuickView} />
                    </motion.div>
                  ))}
                </div>

                {/* Load more */}
                {visibleCount < filtered.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3 mt-10"
                  >
                    <p className="text-xs text-muted">
                      {t('products.showing', { shown: Math.min(visibleCount, filtered.length), total: filtered.length })}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                      className="px-10 py-3 rounded-xl border-2 text-sm font-black transition-colors"
                      style={{ borderColor: '#0056b3', color: '#0056b3' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e6f0fa' }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      {t('products.loadMore')} ({filtered.length - visibleCount} {t('products.more')})
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Bottom CTAs ── */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              onClick={() => setActive('All')}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-10 py-3.5 rounded-xl text-white text-sm font-black shadow-sm transition-colors"
              style={{ backgroundColor: '#0056b3' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#004494' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0056b3' }}
            >
              {t('products.viewAllBtn')}
            </motion.button>
            <motion.button
              onClick={() => navigate('/builder')}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-10 py-3.5 rounded-xl text-sm font-black border-2 transition-colors"
              style={{ borderColor: '#28a745', color: '#1e8035' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e9f7ed' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {t('products.customBuilder')}
            </motion.button>
          </motion.div>
        )}

      </div>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-72 z-50 overflow-y-auto shadow-2xl lg:hidden`}
              style={{ backgroundColor: dark ? '#161b22' : '#ffffff' }}
              role="dialog"
              aria-modal="true"
              aria-label={t('products.advancedFilters.title')}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-black text-ink">
                    {t('products.advancedFilters.title')}
                    {advancedFilterCount > 0 && (
                      <span
                        className="ms-2 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: '#0056b3' }}
                      >
                        {advancedFilterCount}
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-gray-100 transition-colors"
                    aria-label="Close filters"
                  >
                    ✕
                  </button>
                </div>
                <FilterSidebar
                  {...filterProps}
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}
