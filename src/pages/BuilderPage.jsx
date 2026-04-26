import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { BUILDER_CATEGORIES, BUILDER_PARTS, TIER_LABELS } from '@/data/builderParts'

/* ── Tier badge ── */
function TierBadge({ tier }) {
  const t = TIER_LABELS[tier]
  if (!t) return null
  return (
    <span
      className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full"
      style={{ background: t.bg, color: t.text }}
    >
      {t.label}
    </span>
  )
}

/* ── Single part option card ── */
function PartCard({ part, selected, onSelect }) {
  const isSelected = selected?.id === part.id
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(part)}
      className="w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
      style={{
        borderColor:     isSelected ? '#0056b3' : '#e0e0e0',
        backgroundColor: isSelected ? '#f0f7ff' : '#fff',
      }}
      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#a8c8f0' }}
      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#e0e0e0' }}
    >
      <img
        src={part.image}
        alt={part.name}
        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-surface"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <TierBadge tier={part.tier} />
        </div>
        <p className="text-sm font-bold text-ink leading-snug">{part.name}</p>
        <p className="text-[11px] text-muted mt-0.5">{part.spec}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-base font-black" style={{ color: '#0056b3' }}>
          ${part.price.toLocaleString()}
        </p>
        {isSelected && (
          <div
            className="mt-1 w-5 h-5 rounded-full flex items-center justify-center ml-auto"
            style={{ backgroundColor: '#0056b3' }}
          >
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
  const hasSelection = !!selected

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all"
      style={{ borderColor: open ? '#0056b3' : hasSelection ? '#a8c8f0' : '#e0e0e0' }}
    >
      {/* Row header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors"
        style={{ backgroundColor: open ? '#f0f7ff' : '#fff' }}
      >
        <span className="text-2xl w-8 text-center shrink-0">{cat.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">{cat.label}</p>
          {hasSelection ? (
            <p className="text-sm font-bold text-ink mt-0.5 truncate">{selected.name}</p>
          ) : (
            <p className="text-sm text-muted mt-0.5">Click to choose a component</p>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-3">
          {hasSelection && (
            <span className="text-sm font-black" style={{ color: '#0056b3' }}>
              ${selected.price.toLocaleString()}
            </span>
          )}
          {!hasSelection && (
            <span
              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ backgroundColor: '#fff3cd', color: '#856404' }}
            >
              Required
            </span>
          )}
          <svg
            className="w-4 h-4 text-muted transition-transform duration-200"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Part picker */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 space-y-3 border-t" style={{ borderColor: '#e0e0e0', backgroundColor: '#fafcff' }}>
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
  const total = Object.values(selections).reduce((s, p) => s + (p?.price ?? 0), 0)
  const selected = Object.values(selections).filter(Boolean)
  const complete = selected.length === BUILDER_CATEGORIES.length
  const pct = Math.round((selected.length / BUILDER_CATEGORIES.length) * 100)

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: '#e0e0e0', backgroundColor: '#fafafa' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-ink">Your Build</h3>
          <span className="text-xs font-bold text-muted">{selected.length}/{BUILDER_CATEGORIES.length} parts</span>
        </div>
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: complete ? '#1e8035' : '#0056b3' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[11px] text-muted mt-1.5">
          {complete ? '✓ Build complete — ready to order!' : `${pct}% complete`}
        </p>
      </div>

      {/* Parts list */}
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
                  <p className="text-xs text-muted italic">Not selected</p>
                )}
              </div>
              {part && (
                <span className="text-xs font-bold shrink-0" style={{ color: '#0056b3' }}>
                  ${part.price.toLocaleString()}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Total + CTA */}
      <div className="px-5 py-4 border-t space-y-3" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-black text-ink">Total</span>
          <span className="text-xl font-black" style={{ color: '#0056b3' }}>
            ${total.toLocaleString()}
          </span>
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
              Adding…
            </>
          ) : complete ? (
            'Add Build to Cart →'
          ) : (
            `Select ${BUILDER_CATEGORIES.length - selected.length} more part${BUILDER_CATEGORIES.length - selected.length !== 1 ? 's' : ''}`
          )}
        </motion.button>

        {!complete && (
          <p className="text-[11px] text-center text-muted">
            Complete all required components to order.
          </p>
        )}
      </div>
    </div>
  )
}

/* ── Page ── */
export default function BuilderPage() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { addToast } = useToast()

  const [selections, setSelections] = useState({})
  const [openCat, setOpenCat]       = useState(BUILDER_CATEGORIES[0].key)
  const [adding, setAdding]         = useState(false)

  function handleSelect(catKey, part) {
    setSelections(prev => ({ ...prev, [catKey]: part }))
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
          price: `$${part.price.toLocaleString()}`,
          image: part.image,
          category: 'System',
          inStock: true,
        })
      })
      const total = parts.reduce((s, p) => s + p.price, 0)
      addToast(`Custom build (${parts.length} parts, $${total.toLocaleString()}) added to cart!`, 'success')
      setAdding(false)
      navigate('/checkout')
    }, 800)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pt-16 lg:pt-26 min-h-screen"
      style={{ backgroundColor: '#f8fafc' }}
    >
      {/* Hero header */}
      <div className="border-b bg-white" style={{ borderColor: '#e0e0e0' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-2" style={{ color: '#0056b3' }}>
            ◈ Custom PC Builder
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                Build Your Dream PC
              </h1>
              <p className="text-sm text-muted mt-2 max-w-lg">
                Pick every component. We handle assembly and shipping — every build is tested before it leaves.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="hidden sm:inline text-sm font-bold transition-colors shrink-0"
              style={{ color: '#0056b3' }}
            >
              ← Back to Store
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ── Left: Component rows ── */}
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

          {/* ── Right: Sticky summary ── */}
          <div className="lg:sticky lg:top-28">
            <BuildSummary
              selections={selections}
              onAddToCart={handleAddToCart}
              adding={adding}
            />

            {/* Trust row */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: '🛡️', label: '2-Year Warranty' },
                { icon: '🔧', label: 'Expert Assembly' },
                { icon: '🚚', label: 'Free Shipping' },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 py-3 rounded-2xl border text-center"
                  style={{ borderColor: '#e0e0e0', backgroundColor: '#fff' }}
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
