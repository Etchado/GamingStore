import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'

export default function TrustBar() {
  const { t } = useTranslation()
  const { dark } = useTheme()

  const items = [
    { icon: '🚚', title: t('trust.shipping'),  sub: t('trust.shippingSub')  },
    { icon: '🔧', title: t('trust.assembly'),  sub: t('trust.assemblySub')  },
    { icon: '🛡️', title: t('trust.warranty'),  sub: t('trust.warrantySub')  },
    { icon: '💬', title: t('trust.support'),   sub: t('trust.supportSub')   },
  ]

  return (
    <section
      className="border-y"
      style={{
        backgroundColor: dark ? '#161b22' : '#f8fafc',
        borderColor:     dark ? '#30363d' : '#e0e0e0',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#e6f0fa' }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: dark ? '#e6edf3' : '#1a202c' }}>{item.title}</p>
                <p className="text-xs mt-0.5"    style={{ color: dark ? '#8b949e' : '#718096' }}>{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
