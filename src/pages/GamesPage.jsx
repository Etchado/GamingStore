import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSEO } from '@/hooks/useSEO'

const GAME_GENRES = [
  { icon: '🎯', label: 'FPS & Action' },
  { icon: '⚔️', label: 'RPG & Adventure' },
  { icon: '🏎️', label: 'Racing & Sports' },
  { icon: '🧠', label: 'Strategy' },
  { icon: '🌍', label: 'Open World' },
  { icon: '👥', label: 'Multiplayer' },
]

export default function GamesPage() {
  const { t } = useTranslation()
  useSEO({ title: t('pages.games'), description: 'Browse the latest PC game titles and gaming software at GamingStore.' })

  return (
    <div className="min-h-[80vh] px-6 py-16" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted mb-10">
          <Link to="/" className="hover:text-ink transition-colors">{t('product.home')}</Link>
          <span>/</span>
          <span className="text-ink font-semibold">{t('pages.games')}</span>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="text-7xl mb-6">🎮</div>
          <p className="text-[11px] font-black tracking-[0.2em] uppercase mb-3" style={{ color: '#0056b3' }}>
            ◈ {t('nav.games')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-ink mb-4 tracking-tight">
            {t('pages.gamesTitle')}
          </h1>
          <p className="text-base text-muted max-w-lg mx-auto leading-relaxed">
            {t('pages.gamesSub')}
          </p>
        </motion.div>

        {/* Genre grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12"
        >
          {GAME_GENRES.map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border bg-white cursor-pointer group transition-all hover:-translate-y-0.5"
              style={{ borderColor: '#e0e0e0' }}
            >
              <span className="text-4xl">{icon}</span>
              <span className="text-sm font-bold text-ink group-hover:text-blue-700 transition-colors">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Coming soon banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, #0056b3 0%, #003d80 100%)' }}
        >
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-xl font-black text-white mb-2">{t('pages.comingSoon')}</h2>
          <p className="text-sm text-white/70 mb-6 max-w-sm mx-auto">{t('pages.gamesComingSoonSub')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-8 py-3 rounded-xl bg-white text-sm font-black transition-colors"
              style={{ color: '#0056b3' }}
            >
              {t('notFound.backToStore')}
            </Link>
            <Link
              to="/?badge=NEW"
              className="px-8 py-3 rounded-xl border-2 border-white/40 text-white text-sm font-black hover:bg-white/10 transition-colors"
            >
              {t('products.newArrivalsTitle')} →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
