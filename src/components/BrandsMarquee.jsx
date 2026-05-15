import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'

const BRANDS = [
  'NVIDIA', 'AMD', 'Intel', 'ASUS ROG', 'Razer',
  'Logitech G', 'Samsung', 'Corsair', 'Secretlab',
  'SteelSeries', 'Seagate', 'Western Digital', 'LG', 'Autonomous',
]

const TRACK = [...BRANDS, ...BRANDS]

export default function BrandsMarquee() {
  const { t } = useTranslation()
  const { dark } = useTheme()

  const bg          = dark ? '#0d1117' : '#fafafa'
  const border      = dark ? '#30363d' : '#e0e0e0'
  const labelColor  = dark ? 'rgba(255,255,255,0.25)' : '#9ca3af'
  const brandColor  = dark ? 'rgba(255,255,255,0.35)' : '#9ca3af'

  return (
    <section
      className="py-8 border-b overflow-hidden"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <p
        className="text-center text-[10px] font-black tracking-[0.2em] uppercase mb-4"
        style={{ color: labelColor }}
      >
        {t('brands.trusted')}
      </p>

      <div className="relative">
        <div
          className="absolute start-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${bg}, transparent)` }}
        />
        <div
          className="absolute end-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${bg}, transparent)` }}
        />

        <div className="flex" style={{ animation: 'marquee 28s linear infinite' }}>
          {TRACK.map((brand, i) => (
            <div key={i} className="shrink-0 px-8 flex items-center">
              <span
                className="text-sm font-black tracking-wide whitespace-nowrap select-none"
                style={{ color: brandColor }}
              >
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
