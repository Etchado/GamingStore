import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { FocusCards } from '@/components/ui/focus-cards'

/* Real Unsplash PC hardware images */
const heroCards = [
  { title: 'White Phantom Build',   src: 'https://images.unsplash.com/photo-1759836096334-e65e1706bb59?auto=format&fit=crop&w=600&q=80' },
  { title: 'GeForce RTX 4090',      src: 'https://images.unsplash.com/photo-1621164071312-67bb68821b3f?auto=format&fit=crop&w=600&q=80' },
  { title: 'Ultrawide 34" Monitor', src: 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?auto=format&fit=crop&w=600&q=80' },
  { title: 'Professional Desk',     src: 'https://images.unsplash.com/photo-1713618502575-213ce1b24922?auto=format&fit=crop&w=600&q=80' },
]

const brands = ['NVIDIA', 'AMD', 'Intel', 'ASUS', 'Corsair', 'Samsung']

const stagger = (i) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.52, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
})

export default function HeroSection() {
  return (
    <section className="bg-white pt-35 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">

        {/* ── Left: Copy ────────────────────────── */}
        <div>
          {/* Badge */}
          <motion.span {...stagger(0)} className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full border"
            style={{ background: '#e6f0fa', borderColor: '#99c3eb', color: '#004494' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#0056b3' }} />
            Premium PC Hardware
          </motion.span>

          {/* Headline */}
          <motion.h1
            {...stagger(1)}
            className="mt-6 font-black text-ink tracking-tight leading-[1.06]"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.75rem)' }}
          >
            Build Your
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #0056b3 0%, #28a745 100%)' }}
            >
              Dream Setup
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p {...stagger(2)} className="mt-5 text-base text-muted leading-relaxed max-w-[440px]">
            Premium Custom PCs, cutting-edge components, and ergonomic furniture —
            everything configured, tested, and delivered ready to perform.
          </motion.p>

          {/* CTAs */}
          <motion.div {...stagger(3)} className="mt-8 flex flex-wrap gap-3">
            <motion.a
              href="#products"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-bold shadow-sm transition-colors"
              style={{ backgroundColor: '#0056b3' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
            >
              Configure Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/?category=System"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold border-2 transition-colors"
                style={{ borderColor: '#28a745', color: '#1e8035' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e9f7ed' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                Browse Systems
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div {...stagger(4)} className="mt-10 grid grid-cols-3 gap-8 max-w-[360px]">
            {[
              { n: '500+',  l: 'PC Builds'   },
              { n: '10K+',  l: 'Components'  },
              { n: '48hr',  l: 'Delivery'    },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-black text-ink">{s.n}</p>
                <p className="text-xs text-muted mt-0.5">{s.l}</p>
              </div>
            ))}
          </motion.div>

          {/* Brand bar */}
          <motion.div {...stagger(5)} className="mt-8 pt-8 border-t border-border">
            <p className="text-[10px] font-black tracking-[0.18em] text-muted uppercase mb-3">
              Authorized Reseller
            </p>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <span
                  key={b}
                  className="text-[11px] font-black tracking-widest text-muted uppercase px-3 py-1.5 rounded-lg border border-border hover:border-primary-200 hover:text-ink cursor-default transition-colors"
                >
                  {b}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right: FocusCards image grid ──────── */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.62, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30"
            style={{ backgroundColor: '#e6f0fa' }} />
          <div className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30"
            style={{ backgroundColor: '#e9f7ed' }} />

          <FocusCards cards={heroCards} />

          {/* Floating: Starting price */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 160 }}
            className="absolute -bottom-5 -left-5 bg-white rounded-2xl border border-border px-4 py-3 flex items-center gap-3"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ backgroundColor: '#e6f0fa' }}>
              🖥️
            </div>
            <div>
              <p className="text-xs font-black text-ink">Starting at <span style={{ color: '#0056b3' }}>$1,299</span></p>
              <p className="text-[11px] text-muted">Custom PC Builds</p>
            </div>
          </motion.div>

          {/* Floating: Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -12 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            transition={{ delay: 0.85, type: 'spring', stiffness: 160 }}
            className="absolute -top-5 -right-5 bg-white rounded-2xl border border-border px-4 py-3 flex items-center gap-2.5"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
          >
            <div className="text-amber-400 flex">★★★★★</div>
            <div>
              <p className="text-xs font-black text-ink">4.9 / 5.0</p>
              <p className="text-[11px] text-muted">2,400+ Reviews</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
