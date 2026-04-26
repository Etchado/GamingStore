import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '@/components/ui/product-card'
import SkeletonCard from '@/components/ui/SkeletonCard'
import QuickViewModal from '@/components/QuickViewModal'
import { PRODUCTS } from '@/data/products'

const FILTERS = ['All', 'System', 'GPU', 'CPU', 'Monitor', 'Desk', 'Chair', 'Keyboard']

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

  const categoryParam = searchParams.get('category')
  const active = categoryParam && FILTERS.includes(categoryParam) ? categoryParam : 'All'

  function setActive(filter) {
    if (filter === 'All') {
      setSearchParams({}, { replace: true })
    } else {
      setSearchParams({ category: filter }, { replace: true })
    }
  }

  // Scroll to grid only on first mount when arriving with a pre-set category param
  // (e.g. clicking a CategoryShowcase card from another page).
  // We do NOT re-scroll on every filter pill click — that would fight the user's scroll position.
  useEffect(() => {
    if (categoryParam) {
      const el = document.getElementById('products')
      if (el) {
        const offset = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top: offset, behavior: 'smooth' })
      }
    }
    // Intentionally run only once on mount — eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const filtered = active === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === active)

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
            <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-2" style={{ color: '#0056b3' }}>
              ◈ Curated Collection
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              Featured Products
            </h2>
          </div>
          <button
            onClick={() => setActive('All')}
            className="hidden sm:inline text-sm font-bold transition-colors"
            style={{ color: '#0056b3' }}
          >
            View all products →
          </button>
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
                No products in the <strong>{active}</strong> category yet.
              </p>
            </div>
            <button
              onClick={() => setActive('All')}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: '#0056b3' }}
            >
              View All Products
            </button>
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
              onClick={() => setActive('System')}
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
