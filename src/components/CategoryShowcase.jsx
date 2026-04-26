import { motion } from 'motion/react'

const cats = [
  { icon: '🖥️', label: 'Custom PCs',    sub: 'Pre-configured & bespoke',    count: '120+ systems', bg: '#e6f0fa', border: '#99c3eb', text: '#004494' },
  { icon: '⚡',  label: 'GPU & CPU',     sub: 'Latest-gen NVIDIA, AMD, Intel', count: '300+ parts', bg: '#f3f0ff', border: '#c4b5fd', text: '#5521b5' },
  { icon: '🖱️',  label: 'Monitors',      sub: '4K, Ultrawide & 240Hz panels', count: '80+ displays', bg: '#e9f7ed', border: '#a7dfb7', text: '#1e8035' },
  { icon: '🪑',  label: 'Furniture',     sub: 'Ergonomic desks & chairs',     count: '60+ pieces',  bg: '#fffbeb', border: '#fcd34d', text: '#92400e' },
]

export default function CategoryShowcase() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-2" style={{ color: '#0056b3' }}>
              Shop by Category
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Everything Your Setup Needs
            </h2>
          </div>
          <a href="#" className="hidden sm:inline text-sm font-bold transition-colors" style={{ color: '#0056b3' }}>
            All categories →
          </a>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cats.map((c, i) => (
            <motion.a
              key={c.label}
              href="#"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="block rounded-2xl border p-5 transition-shadow hover:shadow-card-hover"
              style={{ background: c.bg, borderColor: c.border }}
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="text-sm font-black mb-0.5" style={{ color: c.text }}>{c.label}</h3>
              <p className="text-xs text-muted leading-relaxed mb-3">{c.sub}</p>
              <span className="text-[11px] font-black tracking-wide" style={{ color: c.text }}>
                {c.count} →
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
