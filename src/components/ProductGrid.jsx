import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ProductCard } from '@/components/ui/product-card'
import SkeletonCard from '@/components/ui/SkeletonCard'
import QuickViewModal from '@/components/QuickViewModal'
import { PRODUCTS } from '@/data/products'

const FILTERS = ['All', 'System', 'GPU', 'CPU', 'Monitor', 'Mouse', 'Keyboard', 'Desk', 'Chair']

const slideUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.48, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function ProductGrid() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading]           = useState(true)
  const [quickView, setQuickView]       = useState(null)
  const navigate = useNavigate()

  const categoryParam = searchParams.get('category')
  const queryParam    = searchParams.get('q') ?? ''
  const active = categoryParam && FILTERS.includes(categoryParam) ? categoryParam : 'All'

  function setActive(filter) {
    const next = new URLSearchParams()
    if (queryParam) next.set('q', queryParam)
    if (filter !== 'All') next.set('category', filter)
    setSearchParams(next, { replace: true })
  }

  function clearSearch() {
    const next = new URLSearchParams()
    if (categoryParam) next.set('category', categoryParam)
    setSearchParams(next, { replace: true })
  }

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
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const filtered = PRODUCTS.filter(p => {
    const matchCat = active === 'All' || p.category === active
    if (!matchCat) return false
    if (!queryParam) return true
    const q = queryParam.toLowerCase()
    return [p.title, p.description, p.spec, p.brand, p.category]
      .some(f => f?.toLowerCase().includes(q))
  })

  return (
    <section id="products" className="py-20 px-6" style={{ backgroundColor: '#f8fafc' }}>
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
                  ◈ Search Results
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                  "{queryParam}"
                </h2>
                {!loading && (
                  <p className="text-sm text-muted mt-1">
                    {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-2" style={{ color: '#0056b3' }}>
                  ◈ Curated Collection
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                  Featured Products
                </h2>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {queryParam && (
              <button
                onClick={clearSearch}
                className="flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                Clear search
              </button>
            )}
            {!queryParam && (
              <button
                onClick={() => setActive('All')}
                className="hidden sm:inline text-sm font-bold transition-colors"
                style={{ color: '#0056b3' }}
              >
                View all products →
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Filter pills ── */}
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
                  ? { backgroundColor: '#0056b3', color: '#fff',     borderColor: '#0056b3' }
                  : { backgroundColor: '#fff',     color: '#718096', borderColor: '#e0e0e0' }
              }
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* ── Divider ── */}
        <div className="h-px mb-10" style={{ backgroundColor: '#e0e0e0' }} />

        {/* ── Grid — skeleton / empty / products ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <p className="text-base font-bold text-ink">No products found</p>
              <p className="text-sm text-muted mt-1">
                {queryParam
                  ? <>No results for <strong>"{queryParam}"</strong>{active !== 'All' ? <> in <strong>{active}</strong></> : ''}.</>
                  : <>No products in the <strong>{active}</strong> category yet.</>
                }
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {queryParam && (
                <button
                  onClick={clearSearch}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold border"
                  style={{ borderColor: '#e0e0e0', color: '#555' }}
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={() => setActive('All')}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: '#0056b3' }}
              >
                View All Products
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
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
        )}

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
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
            >
              View All Products →
            </motion.button>
            <motion.button
              onClick={() => navigate('/builder')}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-10 py-3.5 rounded-xl text-sm font-black border-2 transition-colors"
              style={{ borderColor: '#28a745', color: '#1e8035' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e9f7ed' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              Custom PC Builder
            </motion.button>
          </motion.div>
        )}

      </div>

      {/* Quick View Modal — fixed position, renders above everything */}
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}
