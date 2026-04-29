import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/usePageTitle'

const stagger = (i) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.48, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
})

const STATS = [
  { n: '500+',  l: 'PC Builds Delivered' },
  { n: '10K+',  l: 'Happy Customers'     },
  { n: '5',     l: 'Years in Business'   },
  { n: '24/7',  l: 'Support Available'   },
]

const VALUES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Quality First',
    desc: 'Every component we sell is tested and verified. We only stock products from trusted brands like NVIDIA, AMD, ASUS, and Corsair.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: '48-Hour Delivery',
    desc: 'We know you can\'t wait to game. Orders ship within 24 hours and arrive fully assembled and ready to power on.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Expert Team',
    desc: 'Our team of PC enthusiasts and engineers have been building custom rigs since 2019. We live and breathe hardware.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Community Driven',
    desc: 'Built by gamers, for gamers. We sponsor local esports events and give back to the community that made us who we are.',
  },
]

export default function AboutPage() {
  const { t } = useTranslation()
  usePageTitle('About Us')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pt-36 lg:pt-44 min-h-screen"
      style={{ backgroundColor: '#f8fafc' }}
    >
      {/* ── Hero ── */}
      <div className="bg-white border-b" style={{ borderColor: '#e0e0e0' }}>
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.p {...stagger(0)} className="text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#0056b3' }}>
            ◈ Our Story
          </motion.p>
          <motion.h1
            {...stagger(1)}
            className="font-black text-ink tracking-tight leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
          >
            {t('nav.brandFirst')}<span style={{ color: '#0056b3' }}>{t('nav.brandSecond')}</span>
          </motion.h1>
          <motion.p {...stagger(2)} className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            We are the Gulf region's premier destination for custom gaming PCs, cutting-edge components, and ergonomic furniture — everything you need to build your dream setup.
          </motion.p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-white border-b" style={{ borderColor: '#e0e0e0' }}>
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div key={s.l} {...stagger(i)} className="text-center">
                <p className="text-3xl font-black text-ink">{s.n}</p>
                <p className="text-sm text-muted mt-1">{s.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Values ── */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-black text-ink mb-8 text-center">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              {...stagger(i)}
              className="bg-white rounded-2xl border p-6"
              style={{ borderColor: '#e0e0e0' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#e6f0fa', color: '#0056b3' }}
              >
                {v.icon}
              </div>
              <h3 className="text-base font-black text-ink mb-2">{v.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="max-w-4xl mx-auto px-6 pb-16 text-center">
        <div
          className="rounded-2xl px-8 py-12 border"
          style={{ backgroundColor: '#fff', borderColor: '#e0e0e0' }}
        >
          <h2 className="text-2xl font-black text-ink mb-3">Ready to Build?</h2>
          <p className="text-muted mb-6 max-w-md mx-auto">Browse our full catalog or configure your dream PC with our interactive builder.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="px-8 py-3 rounded-xl text-white text-sm font-bold"
              style={{ backgroundColor: '#0056b3' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
            >
              Browse Store
            </Link>
            <Link
              to="/builder"
              className="px-8 py-3 rounded-xl text-sm font-bold border-2"
              style={{ borderColor: '#28a745', color: '#1e8035' }}
            >
              PC Builder
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
