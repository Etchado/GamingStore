import { useTranslation } from 'react-i18next'

const BRANDS = [
  'NVIDIA', 'AMD', 'Intel', 'ASUS ROG', 'Razer',
  'Logitech G', 'Samsung', 'Corsair', 'Secretlab',
  'SteelSeries', 'Seagate', 'Western Digital', 'LG', 'Autonomous',
]

/* Duplicate the list so the seamless loop has enough content */
const TRACK = [...BRANDS, ...BRANDS]

export default function BrandsMarquee() {
  const { t } = useTranslation()

  return (
    <section className="py-8 border-b overflow-hidden" style={{ backgroundColor: '#fafafa', borderColor: '#e0e0e0' }}>
      <p className="text-center text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ color: '#9ca3af' }}>
        {t('brands.trusted')}
      </p>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute start-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #fafafa, transparent)' }}
        />
        <div
          className="absolute end-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #fafafa, transparent)' }}
        />

        <div className="flex" style={{ animation: 'marquee 28s linear infinite' }}>
          {TRACK.map((brand, i) => (
            <div
              key={i}
              className="shrink-0 px-8 flex items-center"
            >
              <span
                className="text-sm font-black tracking-wide whitespace-nowrap select-none"
                style={{ color: '#9ca3af' }}
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
