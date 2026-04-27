import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSEO } from '@/hooks/useSEO'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useToast } from '@/context/ToastContext'
import { onImgError } from '@/lib/imgFallback'

const GAMES = [
  {
    id: 'game-001',
    titleKey: 'Nexus: Void Protocol',
    genre: 'fps',
    price: 59.99,
    salePrice: null,
    rating: 4.8,
    ratingCount: 2841,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'Orbital Games',
  },
  {
    id: 'game-002',
    titleKey: 'Eldenmyst Chronicles',
    genre: 'rpg',
    price: 49.99,
    salePrice: 34.99,
    rating: 4.9,
    ratingCount: 5120,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'Silverwood Studios',
  },
  {
    id: 'game-003',
    titleKey: 'Apex Velocity',
    genre: 'racing',
    price: 39.99,
    salePrice: null,
    rating: 4.6,
    ratingCount: 1892,
    badge: null,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'Redline Interactive',
  },
  {
    id: 'game-004',
    titleKey: 'Ironclad Dominion',
    genre: 'strategy',
    price: 44.99,
    salePrice: null,
    rating: 4.7,
    ratingCount: 3204,
    badge: 'TOP RATED',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'Bastion Works',
  },
  {
    id: 'game-005',
    titleKey: 'The Wilds of Kalamar',
    genre: 'openworld',
    price: 59.99,
    salePrice: 47.99,
    rating: 4.8,
    ratingCount: 7831,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'Frontier Labs',
  },
  {
    id: 'game-006',
    titleKey: 'Hyperlink Online',
    genre: 'multiplayer',
    price: 0,
    salePrice: null,
    rating: 4.5,
    ratingCount: 18420,
    badge: 'FREE',
    image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'NeonNet Studios',
  },
  {
    id: 'game-007',
    titleKey: 'Delta Force: Reborn',
    genre: 'fps',
    price: 54.99,
    salePrice: null,
    rating: 4.7,
    ratingCount: 4102,
    badge: null,
    image: 'https://images.unsplash.com/photo-1614313958851-d7ac08892ee7?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'GrayMatter Dev',
  },
  {
    id: 'game-008',
    titleKey: 'Starbound Legacy',
    genre: 'rpg',
    price: 34.99,
    salePrice: null,
    rating: 4.6,
    ratingCount: 2240,
    badge: null,
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'Cosmic Forge',
  },
  {
    id: 'game-009',
    titleKey: 'Neon Drift',
    genre: 'racing',
    price: 29.99,
    salePrice: 19.99,
    rating: 4.4,
    ratingCount: 1103,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca6bfd?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'Pulse Arcade',
  },
  {
    id: 'game-010',
    titleKey: 'Cipher Protocol',
    genre: 'strategy',
    price: 39.99,
    salePrice: null,
    rating: 4.5,
    ratingCount: 988,
    badge: null,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'Enigma Workshop',
  },
  {
    id: 'game-011',
    titleKey: 'Terra Magna',
    genre: 'openworld',
    price: 49.99,
    salePrice: null,
    rating: 4.9,
    ratingCount: 6550,
    badge: 'TOP RATED',
    image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'Atlas Studios',
  },
  {
    id: 'game-012',
    titleKey: 'Warfront 2147',
    genre: 'multiplayer',
    price: 44.99,
    salePrice: null,
    rating: 4.7,
    ratingCount: 9210,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=400&h=550&q=80',
    developer: 'Iron Sky Games',
  },
]

const GENRES = [
  { key: 'all',        icon: '🎮', tKey: 'all' },
  { key: 'fps',        icon: '🎯', tKey: 'genreFps' },
  { key: 'rpg',        icon: '⚔️', tKey: 'genreRpg' },
  { key: 'racing',     icon: '🏎️', tKey: 'genreRacing' },
  { key: 'strategy',   icon: '🧠', tKey: 'genreStrategy' },
  { key: 'openworld',  icon: '🌍', tKey: 'genreOpenWorld' },
  { key: 'multiplayer',icon: '👥', tKey: 'genreMultiplayer' },
]

const SORT_OPTIONS = ['sortNew', 'sortRating', 'sortPrice']

const BADGE_STYLE = {
  NEW:        { bg: '#0056b3', text: '#fff' },
  SALE:       { bg: '#e53e3e', text: '#fff' },
  FREE:       { bg: '#1e8035', text: '#fff' },
  'TOP RATED':{ bg: '#d97706', text: '#fff' },
}

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className="w-3 h-3" viewBox="0 0 20 20" fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function GameCard({ game, onAdd }) {
  const { t } = useTranslation()
  const { toggle, has } = useWishlist()
  const saved = has(game.id)

  const displayPrice = game.salePrice ?? game.price
  const isFree = game.price === 0
  const badgeStyle = game.badge ? BADGE_STYLE[game.badge] : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-2xl border overflow-hidden flex flex-col"
      style={{ borderColor: '#e0e0e0' }}
    >
      {/* Cover */}
      <div className="relative overflow-hidden aspect-[3/4] shrink-0">
        <img
          src={game.image}
          alt={game.titleKey}
          loading="lazy"
          onError={onImgError}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {badgeStyle && (
          <span
            className="absolute top-2.5 start-2.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: badgeStyle.bg, color: badgeStyle.text }}
          >
            {game.badge}
          </span>
        )}
        <button
          onClick={() => toggle(game.id)}
          className="absolute top-2.5 end-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: saved ? '#0056b3' : 'rgba(255,255,255,0.85)' }}
          aria-label="toggle wishlist"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={saved ? '#fff' : 'none'} stroke={saved ? '#fff' : '#374151'} strokeWidth={2}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-8">
          <p className="text-[10px] text-white/70">{game.developer}</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <p className="text-sm font-black text-ink leading-tight line-clamp-2">{game.titleKey}</p>
        <div className="flex items-center gap-1.5">
          <StarRow rating={game.rating} />
          <span className="text-[10px] text-muted">({game.ratingCount.toLocaleString()})</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            {isFree ? (
              <span className="text-base font-black" style={{ color: '#1e8035' }}>{t('gamesPage.free')}</span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black" style={{ color: '#0056b3' }}>${displayPrice.toFixed(2)}</span>
                {game.salePrice && (
                  <span className="text-xs text-muted line-through">${game.price.toFixed(2)}</span>
                )}
              </div>
            )}
          </div>
          <span className="text-[9px] font-bold text-muted uppercase bg-gray-100 px-1.5 py-0.5 rounded">{t('gamesPage.digital')}</span>
        </div>

        <button
          onClick={() => onAdd(game)}
          className="w-full py-2.5 rounded-xl text-xs font-black text-white transition-colors"
          style={{ backgroundColor: '#0056b3' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#004494' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0056b3' }}
        >
          {isFree ? '↓ ' : '+ '}{t('gamesPage.addToCart')}
        </button>
      </div>
    </motion.div>
  )
}

export default function GamesPage() {
  const { t } = useTranslation()
  useSEO({ title: t('pages.games'), description: 'Browse top PC game titles, exclusives, and digital downloads at GamingStore.' })

  const { addItem } = useCart()
  const { addToast } = useToast()

  const [activeGenre, setActiveGenre] = useState('all')
  const [sort, setSort] = useState('sortNew')

  function handleAdd(game) {
    addItem({
      id: game.id,
      title: game.titleKey,
      description: `${game.developer} · ${t('gamesPage.digital')}`,
      price: game.price === 0 ? '$0.00' : `$${(game.salePrice ?? game.price).toFixed(2)}`,
      image: game.image,
      category: 'Game',
      inStock: true,
    })
    addToast(`${game.titleKey} — ${t('gamesPage.addedToast')}`, 'success')
  }

  const filtered = useMemo(() => {
    let list = activeGenre === 'all' ? [...GAMES] : GAMES.filter(g => g.genre === activeGenre)
    if (sort === 'sortRating') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'sortPrice') list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
    return list
  }, [activeGenre, sort])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pt-25 lg:pt-35 min-h-screen"
      style={{ backgroundColor: '#f8fafc' }}
    >
      {/* Header */}
      <div className="border-b bg-white" style={{ borderColor: '#e0e0e0' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-1.5 text-xs text-muted mb-4">
            <Link to="/" className="hover:text-ink transition-colors">{t('product.home')}</Link>
            <span>/</span>
            <span className="text-ink font-semibold">{t('pages.games')}</span>
          </div>
          <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-1" style={{ color: '#0056b3' }}>
            ◈ {t('gamesPage.sub')}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">{t('gamesPage.title')}</h1>
          <p className="text-sm text-muted mt-1.5">{t('gamesPage.desc')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Genre chips + sort */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1 scrollbar-hide">
            {GENRES.map(({ key, icon, tKey }) => {
              const label = t(`gamesPage.${tKey}`)
              return (
                <button
                  key={key}
                  onClick={() => setActiveGenre(key)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 border"
                  style={{
                    backgroundColor: activeGenre === key ? '#0056b3' : '#fff',
                    color: activeGenre === key ? '#fff' : '#4a5568',
                    borderColor: activeGenre === key ? '#0056b3' : '#e0e0e0',
                  }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted font-semibold whitespace-nowrap">
              {t('gamesPage.results', { count: filtered.length })}
            </span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-xs font-bold border rounded-xl px-3 py-2 bg-white cursor-pointer"
              style={{ borderColor: '#e0e0e0', color: '#374151' }}
            >
              {SORT_OPTIONS.map(s => (
                <option key={s} value={s}>{t(`gamesPage.${s}`)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-4xl mb-4">🎮</p>
              <p className="font-bold text-ink">{t('gamesPage.noResults')}</p>
              <button
                onClick={() => setActiveGenre('all')}
                className="mt-3 text-sm font-bold transition-colors"
                style={{ color: '#0056b3' }}
              >
                {t('gamesPage.clearFilter')}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeGenre + sort}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
            >
              {filtered.map(game => (
                <GameCard key={game.id} game={game} onAdd={handleAdd} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
