import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'

const REVIEW_META = [
  { name: 'Alex M.',  product: 'White Phantom Custom PC',    avatar: 'AM', lightBg: '#e6f0fa', darkBg: 'rgba(0,86,179,0.2)',    lightColor: '#004494', darkColor: '#6ba3d6', key: 'review1' },
  { name: 'Sarah K.', product: 'LG UltraWide 34" Monitor',  avatar: 'SK', lightBg: '#e9f7ed', darkBg: 'rgba(30,128,53,0.2)',   lightColor: '#1e8035', darkColor: '#4ade80', key: 'review2' },
  { name: 'James R.', product: 'Secretlab TITAN Evo 2025',  avatar: 'JR', lightBg: '#fdf4ff', darkBg: 'rgba(126,34,206,0.2)',  lightColor: '#7e22ce', darkColor: '#c084fc', key: 'review3' },
  { name: 'Nour A.',  product: 'RTX 4090 24GB',             avatar: 'NA', lightBg: '#fff3e0', darkBg: 'rgba(194,65,12,0.2)',   lightColor: '#c2410c', darkColor: '#fb923c', key: 'review4' },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const { t } = useTranslation()
  const { dark } = useTheme()

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: dark ? '#0d1117' : '#ffffff' }}
    >
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#0056b3' }}>
            ◈ {t('testimonials.sub')}
          </p>
          <h2
            className="font-black tracking-tight leading-tight"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', color: dark ? '#e6edf3' : '#1a202c' }}
          >
            {t('testimonials.title')}
          </h2>
          <p
            className="text-sm mt-3"
            style={{ color: dark ? '#8b949e' : '#718096' }}
            dangerouslySetInnerHTML={{ __html: t('testimonials.subtext') }}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEW_META.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
              style={{
                backgroundColor: dark ? '#161b22' : '#ffffff',
                borderColor:     dark ? '#30363d' : '#e0e0e0',
              }}
            >
              <Stars count={5} />
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: dark ? '#e6edf3' : '#1a202c' }}
              >
                "{t(`testimonials.${r.key}`)}"
              </p>
              <div
                className="border-t pt-3 flex items-center gap-3"
                style={{ borderColor: dark ? '#30363d' : '#f0f0f0' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                  style={{ backgroundColor: dark ? r.darkBg : r.lightBg, color: dark ? r.darkColor : r.lightColor }}
                >
                  {r.avatar}
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-bold leading-none"
                    style={{ color: dark ? '#e6edf3' : '#1a202c' }}
                  >
                    {r.name}
                  </p>
                  <p
                    className="text-[11px] mt-0.5 truncate"
                    style={{ color: dark ? '#8b949e' : '#718096' }}
                  >
                    {t('testimonials.bought')} {r.product}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
