import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { ProductCard } from '@/components/ui/product-card'
import SkeletonCard from '@/components/ui/SkeletonCard'
import QuickViewModal from '@/components/QuickViewModal'

const FILTERS = ['All', 'System', 'GPU', 'CPU', 'Monitor', 'Desk', 'Chair', 'Keyboard']

const PRODUCTS = [
  {
    title: 'White Phantom — Custom PC Build',
    description: 'RTX 4080 Super · Ryzen 9 7900X · 32GB DDR5 · 2TB NVMe · 360mm AIO · White build.',
    category: 'System',
    brand: 'Custom Build',
    spec: 'RTX 4080S / R9-7900X / 32GB DDR5',
    image: 'https://images.unsplash.com/photo-1759836096334-e65e1706bb59?auto=format&fit=crop&w=800&q=80',
    price: '$2,499',
    oldPrice: '$2,799',
    saving: '$300',
    rating: 4.9,
    reviews: 87,
    badge: 'BESTSELLER',
  },
  {
    title: 'NVIDIA GeForce RTX 4090 24GB',
    description: 'Ada Lovelace GPU — 16,384 CUDA cores, DLSS 3.5 Frame Generation, 24GB GDDR6X.',
    category: 'GPU',
    brand: 'NVIDIA',
    spec: '24GB GDDR6X · 450W · PCIe 5.0',
    image: 'https://images.unsplash.com/photo-1621164071312-67bb68821b3f?auto=format&fit=crop&w=800&q=80',
    price: '$1,599',
    rating: 4.8,
    reviews: 234,
    badge: 'NEW',
  },
  {
    title: 'LG UltraWide 34" Curved QHD',
    description: '3440×1440 IPS · 144Hz · 1ms GTG · HDR10 · USB-C 90W · Nano IPS panel.',
    category: 'Monitor',
    brand: 'LG',
    spec: '34" 3440×1440 · 144Hz · HDR10',
    image: 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?auto=format&fit=crop&w=800&q=80',
    price: '$899',
    oldPrice: '$1,099',
    saving: '$200',
    rating: 4.7,
    reviews: 156,
    badge: '-18%',
  },
  {
    title: 'AMD Ryzen 9 7950X Processor',
    description: '16 cores / 32 threads · 5.7 GHz boost clock · AM5 platform · PCIe 5.0.',
    category: 'CPU',
    brand: 'AMD',
    spec: '16C/32T · 5.7 GHz Boost · AM5',
    image: 'https://images.unsplash.com/photo-1674660601127-931afe4c85d9?auto=format&fit=crop&w=800&q=80',
    price: '$699',
    rating: 4.8,
    reviews: 312,
  },
  {
    title: 'ASUS ROG Swift 27" 240Hz',
    description: '1440p Fast IPS · 240Hz · 1ms GTG · G-Sync Compatible · DisplayHDR 600.',
    category: 'Monitor',
    brand: 'ASUS ROG',
    spec: '27" 2560×1440 · 240Hz · G-Sync',
    image: 'https://images.unsplash.com/photo-1593640495348-9f86d4e7a719?auto=format&fit=crop&w=800&q=80',
    price: '$549',
    rating: 4.6,
    reviews: 89,
  },
  {
    title: 'Corsair K70 RGB Pro Keyboard',
    description: 'Cherry MX Red switches · Per-key RGB · Aluminium frame · PBT double-shot keycaps.',
    category: 'Keyboard',
    brand: 'Corsair',
    spec: 'Cherry MX Red · Full-size · USB',
    image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=80',
    price: '$179',
    rating: 4.7,
    reviews: 445,
  },
  {
    title: 'Autonomous SmartDesk Pro',
    description: 'Electric sit-stand desk · 300 lb capacity · Dual motor · 4-program memory.',
    category: 'Desk',
    brand: 'Autonomous',
    spec: '60"×30" · Dual motor · 72" max',
    image: 'https://images.unsplash.com/photo-1713618502575-213ce1b24922?auto=format&fit=crop&w=800&q=80',
    price: '$599',
    rating: 4.6,
    reviews: 203,
  },
  {
    title: 'Secretlab TITAN Evo 2025',
    description: 'SoftWeave Plus fabric · 4D armrests · Cold-cure foam · Lumbar & neck support.',
    category: 'Chair',
    brand: 'Secretlab',
    spec: 'SoftWeave Plus · 4D Armrests',
    image: 'https://images.unsplash.com/photo-1716967318503-05b7064afa41?auto=format&fit=crop&w=800&q=80',
    price: '$449',
    rating: 4.8,
    reviews: 1024,
  },
]

const slideUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.48, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function ProductGrid() {
  const [active, setActive]       = useState('All')
  const [loading, setLoading]     = useState(true)
  const [quickView, setQuickView] = useState(null)

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
          <a href="#" className="hidden sm:inline text-sm font-bold transition-colors" style={{ color: '#0056b3' }}>
            View all products →
          </a>
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
                key={product.title}
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
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-10 py-3.5 rounded-xl text-white text-sm font-black shadow-sm transition-colors"
              style={{ backgroundColor: '#0056b3' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
            >
              View All Products →
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-10 py-3.5 rounded-xl text-sm font-black border-2 transition-colors"
              style={{ borderColor: '#28a745', color: '#1e8035' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e9f7ed' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              Custom PC Builder
            </motion.a>
          </motion.div>
        )}

      </div>

      {/* Quick View Modal — fixed position, renders above everything */}
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}
