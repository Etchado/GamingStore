import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useCurrency } from '@/context/CurrencyContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { BUILDER_CATEGORIES, BUILDER_PARTS, TIER_LABELS } from '@/data/builderParts'
import { onImgError } from '@/lib/imgFallback'
import { useTheme } from '@/context/ThemeContext'

/* ── Tier badge ── */
function TierBadge({ tier }) {
  const tierData = TIER_LABELS[tier]
  if (!tierData) return null
  return (
    <span
      className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full"
      style={{ background: tierData.bg, color: tierData.text }}
    >
      {tierData.label}
    </span>
  )
}

/* ── Single part option card ── */
function PartCard({ part, selected, onSelect }) {
  const { formatPrice } = useCurrency()
  const { dark } = useTheme()
  const isSelected = selected?.id === part.id
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(part)}
      className="w-full text-start flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
      style={{
        borderColor:     isSelected ? '#0056b3' : (dark ? '#30363d' : '#e0e0e0'),
        backgroundColor: dark ? (isSelected ? 'rgba(0,86,179,0.15)' : '#161b22') : (isSelected ? '#f0f7ff' : '#fff'),
      }}
      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#a8c8f0' }}
      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = dark ? '#30363d' : '#e0e0e0' }}
    >
      <img src={part.image} alt={part.name} loading="lazy" onError={onImgError} className="w-16 h-16 rounded-xl object-cover shrink-0 bg-surface" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <TierBadge tier={part.tier} />
        </div>
        <p className="text-sm font-bold text-ink leading-snug">{part.name}</p>
        <p className="text-[11px] text-muted mt-0.5">{part.spec}</p>
      </div>
      <div className="shrink-0 text-end">
        <p className="text-base font-black" style={{ color: '#0056b3' }}>
          {formatPrice(part.price)}
        </p>
        {isSelected && (
          <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center ms-auto" style={{ backgroundColor: '#0056b3' }}>
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        )}
      </div>
    </motion.button>
  )
}

/* ── Category row ── */
function CategoryRow({ cat, selected, open, onToggle, onSelect }) {
  const { t } = useTranslation()
  const { dark } = useTheme()
  const { formatPrice } = useCurrency()
  const hasSelection = !!selected

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all"
      style={{ borderColor: open ? '#0056b3' : hasSelection ? '#a8c8f0' : (dark ? '#30363d' : '#e0e0e0') }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-start transition-colors"
        style={{ backgroundColor: open ? (dark ? 'rgba(0,86,179,0.15)' : '#f0f7ff') : (dark ? '#161b22' : '#fff') }}
      >
        <span className="text-2xl w-8 text-center shrink-0">{cat.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">{cat.label}</p>
          {hasSelection ? (
            <p className="text-sm font-bold text-ink mt-0.5 truncate">{selected.name}</p>
          ) : (
            <p className="text-sm text-muted mt-0.5">{t('builder.clickToChoose')}</p>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-3">
          {hasSelection && (
            <span className="text-sm font-black" style={{ color: '#0056b3' }}>
              {formatPrice(selected.price)}
            </span>
          )}
          {!hasSelection && (
            <span
              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#fff3cd', color: '#856404' }}
            >
              {t('builder.required')}
            </span>
          )}
          <svg
            className="w-4 h-4 text-muted transition-transform duration-200"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 space-y-3 border-t" style={{ borderColor: dark ? '#30363d' : '#e0e0e0', backgroundColor: dark ? '#161b22' : '#fafcff' }}>
              {BUILDER_PARTS[cat.key].map((part) => (
                <PartCard
                  key={part.id}
                  part={part}
                  selected={selected}
                  onSelect={(p) => { onSelect(cat.key, p); onToggle() }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Build summary sidebar ── */
function BuildSummary({ selections, onAddToCart, adding }) {
  const { t } = useTranslation()
  const { dark } = useTheme()
  const { formatPrice } = useCurrency()
  const total = Object.values(selections).reduce((s, p) => s + (p?.price ?? 0), 0)
  const selected = Object.values(selections).filter(Boolean)
  const complete = selected.length === BUILDER_CATEGORIES.length
  const pct = Math.round((selected.length / BUILDER_CATEGORIES.length) * 100)
  const remaining = BUILDER_CATEGORIES.length - selected.length

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: dark ? '#30363d' : '#e0e0e0' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: dark ? '#30363d' : '#e0e0e0', backgroundColor: dark ? '#161b22' : '#fafafa' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-ink">{t('builder.yourBuild')}</h3>
          <span className="text-xs font-bold text-muted">
            {t('builder.parts', { selected: selected.length, total: BUILDER_CATEGORIES.length })}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: dark ? '#30363d' : '#e5e7eb' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: complete ? '#1e8035' : '#0056b3' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[11px] text-muted mt-1.5">
          {complete ? t('builder.buildComplete') : t('builder.percentComplete', { pct })}
        </p>
      </div>

      <div className="px-5 py-4 space-y-2.5 max-h-72 overflow-y-auto">
        {BUILDER_CATEGORIES.map((cat) => {
          const part = selections[cat.key]
          return (
            <div key={cat.key} className="flex items-center gap-2.5">
              <span className="text-base w-5 text-center shrink-0">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wide text-muted">{cat.label.split(' ')[0]}</p>
                {part ? (
                  <p className="text-xs font-semibold text-ink truncate">{part.name}</p>
                ) : (
                  <p className="text-xs text-muted italic">{t('builder.notSelected')}</p>
                )}
              </div>
              {part && (
                <span className="text-xs font-bold shrink-0" style={{ color: '#0056b3' }}>
                  {formatPrice(part.price)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-5 py-4 border-t space-y-3" style={{ borderColor: dark ? '#30363d' : '#e0e0e0' }}>
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-black text-ink">{t('builder.total')}</span>
          <span className="text-xl font-black" style={{ color: '#0056b3' }}>{formatPrice(total)}</span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onAddToCart}
          disabled={!complete || adding}
          className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ backgroundColor: complete ? '#0056b3' : '#aaa' }}
          onMouseEnter={(e) => { if (complete && !adding) e.currentTarget.style.backgroundColor = '#004494' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = complete ? '#0056b3' : '#aaa' }}
        >
          {adding ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t('builder.adding')}
            </>
          ) : complete ? (
            t('builder.addBuildToCart')
          ) : (
            t('builder.selectMoreParts', { count: remaining })
          )}
        </motion.button>

        {!complete && (
          <p className="text-[11px] text-center text-muted">{t('builder.completeAll')}</p>
        )}
      </div>
    </div>
  )
}

/* ── Page ── */
export default function BuilderPage() {
  const { t } = useTranslation()
  const { dark } = useTheme()
  usePageTitle(t('builder.sub'))
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { addToast } = useToast()
  const { formatPrice } = useCurrency()

  const [selections, setSelections] = useState(() => {
    try {
      const stored = localStorage.getItem('builder_selections')
      return stored ? JSON.parse(stored) : {}
    } catch { return {} }
  })
  const [openCat, setOpenCat] = useState(() => {
    const firstEmpty = BUILDER_CATEGORIES.find(c => {
      try {
        const stored = localStorage.getItem('builder_selections')
        const s = stored ? JSON.parse(stored) : {}
        return !s[c.key]
      } catch { return true }
    })
    return firstEmpty?.key ?? null
  })
  const [adding, setAdding] = useState(false)

  function handleReset() {
    setSelections({})
    localStorage.removeItem('builder_selections')
    setOpenCat(BUILDER_CATEGORIES[0].key)
  }

  function handleSelect(catKey, part) {
    setSelections(prev => {
      const next = { ...prev, [catKey]: part }
      try { localStorage.setItem('builder_selections', JSON.stringify(next)) } catch {}
      return next
    })
    const next = BUILDER_CATEGORIES.find(c => !{ ...selections, [catKey]: part }[c.key])
    if (next) setOpenCat(next.key)
    else setOpenCat(null)
  }

  function handleToggle(catKey) {
    setOpenCat(prev => prev === catKey ? null : catKey)
  }

  function handleAddToCart() {
    const parts = Object.values(selections).filter(Boolean)
    if (parts.length < BUILDER_CATEGORIES.length) return

    setAdding(true)
    setTimeout(() => {
      parts.forEach(part => {
        addItem({
          id: part.id,
          title: part.name,
          description: part.spec,
          spec: part.spec,
          price: `$${part.price}`,
          image: part.image,
          category: 'System',
          inStock: true,
        })
      })
      const total = parts.reduce((s, p) => s + p.price, 0)
      addToast(`Custom build (${parts.length} parts, ${formatPrice(total)}) added to cart!`, 'success')
      localStorage.removeItem('builder_selections')
      setAdding(false)
      navigate('/checkout')
    }, 800)
  }

  const trustItems = [
    { icon: '🛡️', label: t('builder.warranty') },
    { icon: '🔧', label: t('builder.assembly') },
    { icon: '🚚', label: t('builder.freeShipping') },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pt-36 lg:pt-44 min-h-screen"
      style={{ backgroundColor: dark ? '#0d1117' : '#f8fafc' }}
    >
      <div className="border-b" style={{ backgroundColor: dark ? '#161b22' : '#ffffff', borderColor: dark ? '#30363d' : '#e0e0e0' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-2" style={{ color: '#0056b3' }}>
            ◈ {t('builder.sub')}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                {t('builder.title')}
              </h1>
              <p className="text-sm text-muted mt-2 max-w-lg">{t('builder.desc')}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {Object.keys(selections).length > 0 && (
                <button
                  onClick={handleReset}
                  className="text-sm font-bold transition-colors px-4 py-2 rounded-xl border"
                  style={{ borderColor: '#e0e0e0', color: '#718096' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#b91c1c' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#718096' }}
                >
                  {t('builder.resetBuild')}
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="hidden sm:inline text-sm font-bold transition-colors"
                style={{ color: '#0056b3' }}
              >
                {t('builder.backToStore')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          <div className="space-y-3">
            {BUILDER_CATEGORIES.map((cat) => (
              <CategoryRow
                key={cat.key}
                cat={cat}
                selected={selections[cat.key]}
                open={openCat === cat.key}
                onToggle={() => handleToggle(cat.key)}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <div className="lg:sticky lg:top-28">
            <BuildSummary selections={selections} onAddToCart={handleAddToCart} adding={adding} />

            <div className="mt-4 grid grid-cols-3 gap-2">
              {trustItems.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 py-3 rounded-2xl border text-center"
                  style={{ borderColor: dark ? '#30363d' : '#e0e0e0', backgroundColor: dark ? '#161b22' : '#fff' }}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-[10px] font-bold text-muted leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
