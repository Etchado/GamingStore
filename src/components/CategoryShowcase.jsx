import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'

const CAT_CONFIG = [
  { key: 'pcBuilds',   icon: '🖥️', filter: 'System',    lightBg: '#e6f0fa', lightBorder: '#99c3eb', lightText: '#004494', darkBg: 'rgba(0,86,179,0.15)',   darkBorder: 'rgba(0,86,179,0.3)',   darkText: '#6db3f2' },
  { key: 'gpuCpu',     icon: '⚡',  filter: 'GPU,CPU',   lightBg: '#f3f0ff', lightBorder: '#c4b5fd', lightText: '#5521b5', darkBg: 'rgba(85,33,181,0.15)',  darkBorder: 'rgba(85,33,181,0.3)',  darkText: '#c4b5fd' },
  { key: 'monitors',   icon: '🖱️', filter: 'Monitor',   lightBg: '#e9f7ed', lightBorder: '#a7dfb7', lightText: '#1e8035', darkBg: 'rgba(30,128,53,0.15)',  darkBorder: 'rgba(30,128,53,0.3)',  darkText: '#7dcf8e' },
  { key: 'furniture',  icon: '🪑', filter: 'Desk',      lightBg: '#fffbeb', lightBorder: '#fcd34d', lightText: '#92400e', darkBg: 'rgba(146,64,14,0.15)',  darkBorder: 'rgba(146,64,14,0.3)',  darkText: '#fcd34d' },
]

export default function CategoryShowcase() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { dark } = useTheme()

  function handleCategoryClick(filter) {
    navigate(`/?category=${filter}`)
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <section
      className="py-16 px-6"
      style={{ backgroundColor: dark ? '#0d1117' : '#ffffff' }}
    >
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#0056b3' }}>
              ◈ {t('categories.sub')}
            </p>
            <h2
              className="font-black tracking-tight leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', color: dark ? '#e6edf3' : '#1a202c' }}
            >
              {t('categories.title')}
            </h2>
          </div>
          <button
            onClick={() => navigate('/')}
            className="hidden sm:inline text-sm font-bold transition-colors"
            style={{ color: '#0056b3' }}
          >
            {t('categories.viewAll')} →
          </button>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CAT_CONFIG.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              <button
                onClick={() => handleCategoryClick(c.filter)}
                className="w-full text-start block rounded-2xl border p-6 transition-shadow hover:shadow-card-hover cursor-pointer"
                style={{
                  background:   dark ? c.darkBg     : c.lightBg,
                  borderColor:  dark ? c.darkBorder  : c.lightBorder,
                }}
              >
                <div className="text-4xl mb-4" aria-hidden="true">{c.icon}</div>
                <h3 className="text-base font-black mb-1" style={{ color: dark ? c.darkText : c.lightText }}>
                  {t(`categories.${c.key}`)}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: dark ? '#8b949e' : '#718096' }}>
                  {t(`categories.${c.key}Sub`)}
                </p>
                <span className="text-[11px] font-black tracking-wide" style={{ color: dark ? c.darkText : c.lightText }}>
                  {t(`categories.${c.key}Count`)} →
                </span>
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
