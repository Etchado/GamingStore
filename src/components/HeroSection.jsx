import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '@/context/CurrencyContext'
import { useTheme } from '@/context/ThemeContext'
import { FocusCards } from '@/components/ui/focus-cards'

const heroCards = [
  { title: 'White Phantom Build',   src: 'https://images.unsplash.com/photo-1759836096334-e65e1706bb59?auto=format&fit=crop&w=600&q=80' },
  { title: 'GeForce RTX 4090',      src: 'https://images.unsplash.com/photo-1621164071312-67bb68821b3f?auto=format&fit=crop&w=600&q=80' },
  { title: 'Ultrawide 34" Monitor', src: 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?auto=format&fit=crop&w=600&q=80' },
  { title: 'Professional Desk',     src: 'https://images.unsplash.com/photo-1713618502575-213ce1b24922?auto=format&fit=crop&w=600&q=80' },
]

const brands = ['NVIDIA', 'AMD', 'Intel', 'ASUS', 'Corsair', 'Samsung']

const stagger = (i) => ({
  initial:    { opacity: 0, y: 28 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
})

export default function HeroSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const { dark } = useTheme()

  function handleBrowseSystems() {
    navigate('/?category=System')
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden pt-44 pb-24"
      style={{
        background: dark
          ? 'linear-gradient(135deg, #0a1628 0%, #0d1117 45%, #0a1225 100%)'
          : 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #eef5ff 100%)',
      }}
    >
      {/* Grid pattern — subtle in both modes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${dark ? 'rgba(0,86,179,0.045)' : 'rgba(0,86,179,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${dark ? 'rgba(0,86,179,0.045)' : 'rgba(0,86,179,0.03)'} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{ backgroundColor: dark ? 'rgba(0,86,179,0.18)' : 'rgba(0,86,179,0.08)' }} />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: dark ? 'rgba(0,86,179,0.10)' : 'rgba(0,86,179,0.05)' }} />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full relative z-10">

        {/* ── Left: Copy ────────────────────────── */}
        <div>
          {/* Badge */}
          <motion.span
            {...stagger(0)}
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full border"
            style={{
              background:   dark ? 'rgba(0,86,179,0.2)'  : '#e6f0fa',
              borderColor:  dark ? 'rgba(0,86,179,0.45)' : '#99c3eb',
              color:        dark ? '#6ba3d6'              : '#004494',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: dark ? '#4da3ff' : '#0056b3' }} />
            {t('hero.badge')}
          </motion.span>

          {/* Headline */}
          <motion.h1
            {...stagger(1)}
            className="mt-6 font-black tracking-tight leading-[1.05]"
            style={{ fontSize: 'clamp(3.2rem, 6vw, 5.5rem)', color: dark ? '#ffffff' : '#0f172a' }}
          >
            {t('hero.headline1')}
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: dark
                  ? 'linear-gradient(135deg, #4da3ff 0%, #0056b3 100%)'
                  : 'linear-gradient(135deg, #0056b3 0%, #003d80 100%)',
              }}
            >
              {t('hero.headline2')}
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            {...stagger(2)}
            className="mt-6 text-lg leading-relaxed max-w-[480px]"
            style={{ color: dark ? 'rgba(255,255,255,0.62)' : '#4a5568' }}
          >
            {t('hero.sub')}
          </motion.p>

          {/* CTAs */}
          <motion.div {...stagger(3)} className="mt-10 flex flex-wrap gap-4">
            <motion.a
              href="#products"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white text-base font-bold transition-colors"
              style={{
                backgroundColor: '#0056b3',
                boxShadow: dark ? '0 0 28px rgba(0,86,179,0.4)' : '0 4px 14px rgba(0,86,179,0.25)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
            >
              {t('hero.ctaPrimary')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBrowseSystems}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold border-2 transition-colors"
              style={{
                borderColor: dark ? 'rgba(255,255,255,0.22)' : '#b3d4f5',
                color:       dark ? 'rgba(255,255,255,0.82)' : '#0056b3',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = dark ? 'rgba(255,255,255,0.07)' : '#e6f0fa'
                e.currentTarget.style.borderColor     = dark ? 'rgba(255,255,255,0.38)' : '#0056b3'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor     = dark ? 'rgba(255,255,255,0.22)' : '#b3d4f5'
              }}
            >
              {t('hero.ctaSecondary')}
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div {...stagger(4)} className="mt-12 grid grid-cols-3 gap-10 max-w-[420px]">
            {[
              { n: t('hero.stat1n'), l: t('hero.stat1l') },
              { n: t('hero.stat2n'), l: t('hero.stat2l') },
              { n: t('hero.stat3n'), l: t('hero.stat3l') },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-3xl font-black" style={{ color: dark ? '#ffffff' : '#0f172a' }}>{s.n}</p>
                <p className="text-sm mt-1" style={{ color: dark ? 'rgba(255,255,255,0.5)' : '#718096' }}>{s.l}</p>
              </div>
            ))}
          </motion.div>

          {/* Brand bar */}
          <motion.div
            {...stagger(5)}
            className="mt-8 pt-8"
            style={{ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}
          >
            <p
              className="text-[10px] font-black tracking-[0.18em] uppercase mb-3"
              style={{ color: dark ? 'rgba(255,255,255,0.35)' : '#9ca3af' }}
            >
              {t('hero.authorizedReseller')}
            </p>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <span
                  key={b}
                  className="text-[11px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg border transition-colors cursor-default"
                  style={{
                    borderColor: dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                    color:       dark ? 'rgba(255,255,255,0.38)' : '#9ca3af',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = dark ? 'rgba(0,86,179,0.6)' : '#0056b3'
                    e.currentTarget.style.color       = dark ? '#6ba3d6' : '#0056b3'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'
                    e.currentTarget.style.color       = dark ? 'rgba(255,255,255,0.38)' : '#9ca3af'
                  }}
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
          transition={{ duration: 0.62, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Glow behind cards */}
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: dark ? 'rgba(0,86,179,0.3)' : 'rgba(0,86,179,0.12)' }} />
          <div className="absolute -bottom-10 -left-6 w-48 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: dark ? 'rgba(0,86,179,0.18)' : 'rgba(0,86,179,0.08)' }} />

          <FocusCards cards={heroCards} />

          {/* Floating: Starting price */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, x: 12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.72, type: 'spring', stiffness: 160 }}
            className="absolute top-4 end-4 rounded-2xl px-4 py-3 flex items-center gap-3 border backdrop-blur-sm"
            style={{
              backgroundColor: dark ? 'rgba(0,0,0,0.5)'   : 'rgba(255,255,255,0.88)',
              borderColor:     dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,86,179,0.15)',
            }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
              style={{ backgroundColor: dark ? 'rgba(0,86,179,0.35)' : '#e6f0fa' }}>
              🖥️
            </div>
            <div>
              <p className="text-xs font-black" style={{ color: dark ? '#ffffff' : '#0f172a' }}>
                {t('hero.floatStarting')} <span style={{ color: dark ? '#6ba3d6' : '#0056b3' }}>{formatPrice(1299)}</span>
              </p>
              <p className="text-[11px]" style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#718096' }}>{t('hero.floatBuilds')}</p>
            </div>
          </motion.div>

          {/* Floating: Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, x: -12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.88, type: 'spring', stiffness: 160 }}
            className="absolute top-4 start-4 rounded-2xl px-4 py-3 flex items-center gap-2.5 border backdrop-blur-sm"
            style={{
              backgroundColor: dark ? 'rgba(0,0,0,0.5)'       : 'rgba(255,255,255,0.88)',
              borderColor:     dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,86,179,0.15)',
            }}
          >
            <div className="text-amber-400 flex" aria-hidden="true">★★★★★</div>
            <div>
              <p className="text-xs font-black" style={{ color: dark ? '#ffffff' : '#0f172a' }}>{t('hero.floatRating')}</p>
              <p className="text-[11px]" style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#718096' }}>{t('hero.floatReviews')}</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
