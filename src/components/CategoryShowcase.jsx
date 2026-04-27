import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

const CAT_CONFIG = [
  { key: 'pcBuilds',  icon: '🖥️', filter: 'System',  bg: '#e6f0fa', border: '#99c3eb', text: '#004494' },
  { key: 'gpuCpu',   icon: '⚡',  filter: 'GPU,CPU', bg: '#f3f0ff', border: '#c4b5fd', text: '#5521b5' },
  { key: 'monitors', icon: '🖱️', filter: 'Monitor', bg: '#e9f7ed', border: '#a7dfb7', text: '#1e8035' },
  { key: 'furniture',icon: '🪑', filter: 'Desk',    bg: '#fffbeb', border: '#fcd34d', text: '#92400e' },
]

export default function CategoryShowcase() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  function handleCategoryClick(filter) {
    navigate(`/?category=${filter}`)
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

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
              {t('categories.sub')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              {t('categories.title')}
            </h2>
          </div>
          <button
            onClick={() => navigate('/')}
            className="hidden sm:inline text-sm font-bold transition-colors"
            style={{ color: '#0056b3' }}
          >
            {t('categories.viewAll')}
          </button>
        </motion.div>

        {/* Grid */}
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
                className="w-full text-left block rounded-2xl border p-5 transition-shadow hover:shadow-card-hover cursor-pointer"
                style={{ background: c.bg, borderColor: c.border }}
              >
                <div className="text-3xl mb-3" aria-hidden="true">{c.icon}</div>
                <h3 className="text-sm font-black mb-0.5" style={{ color: c.text }}>
                  {t(`categories.${c.key}`)}
                </h3>
                <p className="text-xs text-muted leading-relaxed mb-3">
                  {t(`categories.${c.key}Sub`)}
                </p>
                <span className="text-[11px] font-black tracking-wide" style={{ color: c.text }}>
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
