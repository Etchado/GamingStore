import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'

function useCountUp(target, duration = 1800, active = false) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    const numeric = parseInt(String(target).replace(/\D/g, ''), 10)
    if (!numeric) return
    let start = null
    let frame

    function step(ts) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * numeric))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration])

  return value
}

const STAT_DEFS = [
  { valKey: 'productsVal',  labelKey: 'products',  icon: '🖥️', numeric: 500, suffix: '+' },
  { valKey: 'customersVal', labelKey: 'customers',  icon: '😊', numeric: 40000, suffix: 'K+', divisor: 1000, unit: 'K' },
  { valKey: 'brandsVal',    labelKey: 'brands',     icon: '🏷️', numeric: 30, suffix: '+' },
  { valKey: 'supportVal',   labelKey: 'support',    icon: '⭐', numeric: null },
]

function StatCard({ stat, index, active, dark }) {
  const { t } = useTranslation()
  const count = useCountUp(stat.numeric ?? 0, 1800, active && stat.numeric !== null)

  function displayValue() {
    if (stat.numeric === null) return t(`stats.${stat.valKey}`)
    if (stat.divisor) return `${(count / stat.divisor).toFixed(count >= stat.numeric ? 0 : 1)}${stat.unit}+`
    return `${count.toLocaleString()}+`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center px-4 py-6"
    >
      <span className="text-3xl mb-3" aria-hidden="true">{stat.icon}</span>
      <span className="text-4xl sm:text-5xl font-black tracking-tight tabular-nums" style={{ color: '#0056b3' }}>
        {displayValue()}
      </span>
      <span
        className="text-sm font-semibold mt-2 max-w-[120px] leading-snug"
        style={{ color: dark ? '#8b949e' : '#4a5568' }}
      >
        {t(`stats.${stat.labelKey}`)}
      </span>
    </motion.div>
  )
}

export default function StatsSection() {
  const { dark } = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="py-12 border-y"
      style={{
        backgroundColor: dark ? '#161b22' : '#f8fafc',
        borderColor: dark ? '#30363d' : '#e0e0e0',
      }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0"
          style={{ '--tw-divide-opacity': 1, borderColor: dark ? '#30363d' : '#e0e0e0' }}
        >
          {STAT_DEFS.map((stat, i) => (
            <StatCard key={stat.valKey} stat={stat} index={i} active={inView} dark={dark} />
          ))}
        </div>
      </div>
    </section>
  )
}
