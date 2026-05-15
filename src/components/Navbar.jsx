import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCurrency } from '@/context/CurrencyContext'
import AnnouncementBar from '@/components/AnnouncementBar'
import { useProducts } from '@/context/ProductsContext'
import { onImgError } from '@/lib/imgFallback'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

const ADMIN_EMAIL = 'ikhaledi95@gmail.com'

/* ── Support links ── */
const SUPPORT_LINKS = [
  { labelKey: 'nav.support.contact',  href: '/contact'     },
  { labelKey: 'nav.support.faq',      href: '/faq'         },
  { labelKey: 'nav.support.returns',  href: '/returns'     },
  { labelKey: 'nav.support.track',    href: '/track-order' },
]

/* ── Nav data (keys only — labels resolved via t()) ── */
const NAV_ITEMS = [
  {
    id: 'systems',
    labelKey: 'nav.systems',
    filter: 'System',
    cols: [
      { headingKey: 'nav.mega.pcBuilds', links: [
        { labelKey: 'nav.mega.prebuiltPCs',  filter: 'System' },
        { labelKey: 'nav.mega.customBuilder', filter: 'System', href: '/builder' },
      ]},
      { headingKey: 'nav.mega.processing', links: [
        { labelKey: 'nav.mega.graphicsCards', filter: 'GPU' },
        { labelKey: 'nav.mega.processors',    filter: 'CPU' },
        { labelKey: 'nav.mega.nvmeSsds',      filter: 'Storage' },
      ]},
    ],
  },
  {
    id: 'components',
    labelKey: 'nav.components',
    filter: 'GPU',
    cols: [
      { headingKey: 'nav.mega.processing', links: [
        { labelKey: 'nav.mega.graphicsCards', filter: 'GPU' },
        { labelKey: 'nav.mega.processors',    filter: 'CPU' },
      ]},
      { headingKey: 'nav.mega.storageMemory', links: [
        { labelKey: 'nav.mega.nvmeSsds',  filter: 'Storage' },
        { labelKey: 'nav.mega.sataSsds',  filter: 'Storage' },
      ]},
    ],
  },
  {
    id: 'peripherals',
    labelKey: 'nav.peripherals',
    filter: 'Monitor',
    cols: [
      { headingKey: 'nav.mega.display', links: [
        { labelKey: 'nav.mega.4kMonitors', filter: 'Monitor' },
        { labelKey: 'nav.mega.ultrawide',  filter: 'Monitor' },
        { labelKey: 'nav.mega.hz240',      filter: 'Monitor' },
      ]},
      { headingKey: 'nav.mega.input', links: [
        { labelKey: 'nav.mega.mechanicalKeyboards', filter: 'Keyboard' },
        { labelKey: 'nav.mega.gamingMice',          filter: 'Mouse' },
        { labelKey: 'nav.mega.headsets',            filter: 'Headset' },
      ]},
    ],
  },
  {
    id: 'accessories',
    labelKey: 'nav.accessories',
    filter: 'Desk',
    cols: [
      { headingKey: 'nav.mega.furniture', links: [
        { labelKey: 'nav.mega.standingDesks',   filter: 'Desk' },
        { labelKey: 'nav.mega.ergonomicChairs', filter: 'Chair' },
      ]},
      { headingKey: 'nav.mega.extras', links: [
        { labelKey: 'nav.mega.deskMats', filter: 'Mouse Pad' },
      ]},
    ],
  },
]

/* ── Compact floating dropdown — matches sportswear style ── */
function MegaMenu({ item, onLinkClick, dark }) {
  const { t } = useTranslation()
  const bg     = dark ? '#161b22' : '#ffffff'
  const border = dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'
  const shadow = dark ? '0 20px 48px rgba(0,0,0,0.55)' : '0 8px 32px rgba(0,0,0,0.12)'
  const heading = dark ? 'rgba(255,255,255,0.35)' : '#9ca3af'
  const linkColor = dark ? 'rgba(255,255,255,0.82)' : '#374151'
  const linkHoverColor = dark ? '#ffffff' : '#0056b3'
  const linkHoverBg = dark ? 'rgba(255,255,255,0.07)' : '#f0f7ff'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute top-full left-0 z-50 pt-1"
    >
      <div
        className="rounded-2xl p-5 min-w-[300px]"
        style={{ background: bg, border: `1px solid ${border}`, boxShadow: shadow }}
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
          {item.cols.map((col) => (
            <div key={col.headingKey}>
              <p className="text-[10px] font-black tracking-[0.12em] uppercase mb-2.5" style={{ color: heading }}>
                {t(col.headingKey)}
              </p>
              <ul className="space-y-0.5">
                {col.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.href ?? `/?category=${link.filter}`}
                      onClick={() => onLinkClick(link)}
                      className="text-sm font-medium block px-2.5 py-1.5 rounded-lg transition-all"
                      style={{ color: linkColor }}
                      onMouseEnter={e => { e.currentTarget.style.color = linkHoverColor; e.currentTarget.style.background = linkHoverBg }}
                      onMouseLeave={e => { e.currentTarget.style.color = linkColor; e.currentTarget.style.background = 'transparent' }}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Sun / Moon toggle icon ── */
function ThemeToggle() {
  const { dark, toggleDark } = useTheme()
  const btnBg     = dark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'
  const btnColor  = dark ? 'rgba(255,255,255,0.85)' : '#374151'
  const btnBorder = dark ? 'rgba(255,255,255,0.12)' : '#e0e0e0'
  const hoverBg   = dark ? 'rgba(255,255,255,0.15)' : '#e2e8f0'
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleDark}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
      style={{ background: btnBg, color: btnColor, border: `1px solid ${btnBorder}` }}
      onMouseEnter={e => { e.currentTarget.style.background = hoverBg }}
      onMouseLeave={e => { e.currentTarget.style.background = btnBg }}
    >
      {dark ? (
        /* Sun icon */
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        /* Moon icon */
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </motion.button>
  )
}

/* ── Navbar ── */
export default function Navbar() {
  const [activeMenu, setActiveMenu]         = useState(null)
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const [query, setQuery]                   = useState('')
  const [mobileQuery, setMobileQuery]       = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currencyOpen, setCurrencyOpen]     = useState(false)
  const [supportOpen, setSupportOpen]       = useState(false)
  const searchRef   = useRef(null)
  const currencyRef = useRef(null)
  const supportRef  = useRef(null)
  const { products } = useProducts()
  const { dark } = useTheme()

  const suggestions = query.trim().length >= 2
    ? products.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.brand?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  useEffect(() => {
    function onClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false)
      if (currencyRef.current && !currencyRef.current.contains(e.target)) setCurrencyOpen(false)
      if (supportRef.current && !supportRef.current.contains(e.target)) setSupportOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const { itemCount, setIsOpen: openCart }  = useCart()
  const { count: wishlistCount }            = useWishlist()
  const { currency, setCurrency, CURRENCIES } = useCurrency()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isAr = i18n.language?.startsWith('ar')
  const { user } = useAuth()
  const isAdmin = user?.email === ADMIN_EMAIL

  /* shared dark-aware styles */
  const row1Bg      = dark ? '#0d1117' : '#ffffff'
  const row1Border  = dark ? '#30363d' : '#e0e0e0'
  const inputBg     = dark ? '#161b22' : '#ffffff'
  const inputText   = dark ? '#e6edf3' : '#1a202c'
  const mutedText   = dark ? '#8b949e' : '#718096'
  const surfaceBg   = dark ? '#161b22' : '#f8fafc'
  const dropdownBg  = dark ? '#161b22' : '#ffffff'
  const dropdownBdr = dark ? '#30363d' : '#e0e0e0'

  function toggleMobileItem(id) {
    setMobileExpanded(prev => prev === id ? null : id)
  }

  function handleNavClick(filter) {
    setActiveMenu(null)
    navigate(`/?category=${filter}`)
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  function handleMegaClose(link) {
    setActiveMenu(null)
    if (!link?.href) {
      setTimeout(() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
  }

  function doSearch(q, closeMobile = false) {
    const trimmed = q.trim()
    if (!trimmed) return
    navigate(`/?q=${encodeURIComponent(trimmed)}`)
    setQuery('')
    setMobileQuery('')
    setShowSuggestions(false)
    if (closeMobile) setMobileOpen(false)
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <header
      className="fixed top-0 inset-x-0 z-50"
      style={{ background: row1Bg }}
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* ── TopBar ── */}
      <div className="hidden lg:block" style={{ backgroundColor: '#2471c8' }}>
        <div className="max-w-7xl mx-auto px-6 h-8 flex items-center text-[11px] font-semibold">

          {/* Left: Home, About Us, Support */}
          <div className="flex items-center divide-x divide-white/20" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <Link to="/" className="flex items-center gap-1 px-3 h-8 transition-colors hover:text-white">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              {t('nav.home')}
            </Link>
            <Link to="/about" className="flex items-center gap-1 px-3 h-8 transition-colors hover:text-white">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
              </svg>
              {t('nav.aboutUs')}
            </Link>
            <div ref={supportRef} className="relative">
              <button
                onClick={() => setSupportOpen(o => !o)}
                className="flex items-center gap-1 px-3 h-8 transition-colors hover:text-white"
                style={{ color: supportOpen ? '#fff' : undefined }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
                </svg>
                {t('nav.support.label')}
                <svg className="w-2.5 h-2.5 opacity-60 transition-transform" style={{ transform: supportOpen ? 'rotate(180deg)' : undefined }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <AnimatePresence>
                {supportOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.14 }}
                    className="absolute top-full start-0 mt-1 rounded-xl border shadow-lg z-[70] overflow-hidden min-w-[160px]"
                    style={{ background: dropdownBg, borderColor: dropdownBdr, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  >
                    {SUPPORT_LINKS.map((sl) => (
                      <Link
                        key={sl.labelKey}
                        to={sl.href}
                        onClick={() => setSupportOpen(false)}
                        className="flex items-center px-4 py-2.5 text-xs font-semibold transition-colors"
                        style={{ color: inputText }}
                        onMouseEnter={e => e.currentTarget.style.background = surfaceBg}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {t(sl.labelKey)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: quick links */}
          <div className="ms-auto flex items-center divide-x divide-white/20" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <Link to="/builder" className="flex items-center gap-1 px-3 h-8 transition-colors hover:text-white">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              {t('nav.pcBuilder')}
            </Link>
            <Link to="/deals" className="flex items-center gap-1 px-3 h-8 transition-colors hover:text-white">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
              </svg>
              {t('nav.deals')}
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1 px-3 h-8 transition-colors hover:text-white font-black">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Admin
              </Link>
            )}
          </div>

        </div>
      </div>

      <AnnouncementBar />

      {/* ── Row 1: Logo + Search + Icons ── */}
      <div style={{ borderBottom: `1px solid ${row1Border}`, background: row1Bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#0056b3' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-black text-[15px] tracking-tight leading-none" style={{ color: inputText }}>
              {t('nav.brandFirst')}<span style={{ color: '#0056b3' }}>{t('nav.brandSecond')}</span>
            </span>
          </Link>

          {/* Search bar — hidden on mobile */}
          <div ref={searchRef} className="hidden md:block flex-1 relative">
            <form
              onSubmit={(e) => { e.preventDefault(); doSearch(query) }}
              className="flex items-stretch rounded-xl border overflow-hidden transition-all"
              style={{ borderColor: showSuggestions && suggestions.length > 0 ? '#0056b3' : row1Border }}
            >
              <select
                className="text-xs font-semibold px-3 border-r outline-none cursor-pointer transition-colors"
                style={{ background: surfaceBg, color: mutedText, borderColor: row1Border }}
              >
                <option>{t('nav.allCategories')}</option>
                <option>{t('nav.systems')}</option>
                <option>{t('nav.components')}</option>
                <option>{t('nav.peripherals')}</option>
                <option>{t('nav.accessories')}</option>
              </select>
              <input
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t('nav.searchPlaceholder')}
                className="flex-1 px-4 py-2.5 text-sm outline-none"
                style={{ background: inputBg, color: inputText }}
              />
              <button
                type="submit"
                className="px-5 text-white text-sm font-bold transition-colors"
                style={{ backgroundColor: '#0056b3' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </form>

            {/* Autocomplete dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.14 }}
                  className="absolute top-full start-0 end-0 mt-1 rounded-xl border shadow-lg z-[60] overflow-hidden"
                  style={{ background: dropdownBg, borderColor: dropdownBdr, boxShadow: '0 8px 24px rgba(0,0,0,0.14)' }}
                >
                  {suggestions.map(p => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      onClick={() => { setQuery(''); setShowSuggestions(false) }}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                      onMouseEnter={e => e.currentTarget.style.background = surfaceBg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        onError={onImgError}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border"
                        style={{ borderColor: dropdownBdr }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: inputText }}>{p.title}</p>
                        <p className="text-xs" style={{ color: mutedText }}>{p.category} · {p.price}</p>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={() => doSearch(query)}
                    className="w-full px-4 py-2.5 text-xs font-bold text-start border-t transition-colors"
                    style={{ borderColor: dropdownBdr, color: '#0056b3' }}
                    onMouseEnter={e => e.currentTarget.style.background = surfaceBg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {t('nav.searchAll', { q: query })} →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-2 ms-auto md:ms-0 shrink-0">
            {/* User — hidden on mobile */}
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors"
              style={{ color: mutedText }}
              onMouseEnter={e => { e.currentTarget.style.color = inputText; e.currentTarget.style.background = surfaceBg }}
              onMouseLeave={e => { e.currentTarget.style.color = mutedText; e.currentTarget.style.background = 'transparent' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-xs font-semibold hidden sm:inline">{t('nav.account')}</span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors"
              style={{ color: mutedText }}
              onMouseEnter={e => { e.currentTarget.style.color = inputText; e.currentTarget.style.background = surfaceBg }}
              onMouseLeave={e => { e.currentTarget.style.color = mutedText; e.currentTarget.style.background = 'transparent' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="text-xs font-semibold">{t('nav.wishlist')}</span>
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-red-500 text-[10px] font-black text-white flex items-center justify-center"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => openCart(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold transition-colors"
              style={{ backgroundColor: '#0056b3' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="hidden sm:inline">{t('nav.cart')}</span>
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-red-500 text-[10px] font-black flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Language toggle */}
            <button
              onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-black transition-colors"
              style={{ borderColor: row1Border, color: mutedText, background: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = surfaceBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              title={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <span className="text-[11px]">{isAr ? '🇺🇸' : '🇸🇦'}</span>
              {isAr ? 'EN' : 'AR'}
            </button>

            {/* Currency dropdown */}
            <div ref={currencyRef} className="relative hidden sm:block">
              <button
                onClick={() => setCurrencyOpen(o => !o)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-black transition-colors"
                style={{ borderColor: currencyOpen ? '#0056b3' : row1Border, color: mutedText, background: 'transparent' }}
                onMouseEnter={e => { if (!currencyOpen) e.currentTarget.style.background = surfaceBg }}
                onMouseLeave={e => { if (!currencyOpen) e.currentTarget.style.background = 'transparent' }}
              >
                {currency.code} {currency.label}
                <svg className="w-2.5 h-2.5 opacity-60 transition-transform" style={{ transform: currencyOpen ? 'rotate(180deg)' : undefined }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <AnimatePresence>
                {currencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.14 }}
                    className="absolute top-full end-0 mt-1 rounded-xl border shadow-lg z-[70] overflow-hidden"
                    style={{ background: dropdownBg, borderColor: dropdownBdr, boxShadow: '0 8px 24px rgba(0,0,0,0.14)', minWidth: '200px' }}
                  >
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrency(c); setCurrencyOpen(false) }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-start transition-colors"
                        style={{
                          backgroundColor: currency.code === c.code ? (dark ? '#1e3a5f' : '#f0f7ff') : 'transparent',
                          color: currency.code === c.code ? '#0056b3' : inputText,
                        }}
                        onMouseEnter={(e) => { if (currency.code !== c.code) e.currentTarget.style.backgroundColor = surfaceBg }}
                        onMouseLeave={(e) => { if (currency.code !== c.code) e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <span className="font-bold">{c.code}  {c.label}</span>
                        <span style={{ color: mutedText }} className="font-medium">- {c.ar}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark mode toggle */}
            <ThemeToggle />

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
              style={{ color: mutedText }}
              onMouseEnter={e => { e.currentTarget.style.color = inputText; e.currentTarget.style.background = surfaceBg }}
              onMouseLeave={e => { e.currentTarget.style.color = mutedText; e.currentTarget.style.background = 'transparent' }}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {mobileOpen
                  ? <path d="M18 6 6 18M6 6l12 12" />
                  : <path d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Nav categories — desktop only ── */}
      <div
        className="relative hidden lg:block"
        style={{
          background: dark ? '#0A0F1E' : '#ffffff',
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#e0e0e0'}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeMenu === item.id
            const textColor = dark
              ? (isActive ? '#ffffff' : 'rgba(255,255,255,0.72)')
              : (isActive ? '#0056b3' : '#4a5568')
            const underlineColor = dark ? '#ffffff' : '#0056b3'
            return (
              <div
                key={item.id}
                className="relative h-11 flex items-center"
                onMouseEnter={() => setActiveMenu(item.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  onClick={() => handleNavClick(item.filter)}
                  className="px-4 h-11 text-sm font-semibold transition-all flex items-center gap-1.5 relative"
                  style={{ color: textColor }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: underlineColor }}
                    />
                  )}
                  {t(item.labelKey)}
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{ opacity: 0.5, transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <MegaMenu item={item} onLinkClick={handleMegaClose} dark={dark} />
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          <div className="ms-auto flex items-center gap-5">
            <Link
              to="/deals"
              className="text-xs font-bold transition-colors"
              style={{ color: '#e53e3e' }}
              onMouseEnter={e => e.currentTarget.style.color = '#c53030'}
              onMouseLeave={e => e.currentTarget.style.color = '#e53e3e'}
            >
              {t('nav.deals')}
            </Link>
            <Link
              to="/?badge=NEW"
              className="text-xs font-bold transition-colors"
              style={{ color: dark ? 'rgba(255,255,255,0.5)' : '#718096' }}
              onMouseEnter={e => e.currentTarget.style.color = dark ? '#fff' : '#1a202c'}
              onMouseLeave={e => e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.5)' : '#718096'}
            >
              {t('nav.newArrivals')}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden"
            style={{ background: row1Bg, borderBottom: `1px solid ${row1Border}` }}
          >
            {/* Mobile search */}
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${row1Border}` }}>
              <form
                onSubmit={(e) => { e.preventDefault(); doSearch(mobileQuery, true) }}
                className="flex items-stretch rounded-xl border overflow-hidden"
                style={{ borderColor: row1Border }}
              >
                <input
                  type="search"
                  value={mobileQuery}
                  onChange={(e) => setMobileQuery(e.target.value)}
                  placeholder={t('nav.searchMobilePlaceholder')}
                  className="flex-1 px-4 py-2.5 text-sm outline-none"
                  style={{ background: inputBg, color: inputText }}
                />
                <button
                  type="submit"
                  className="px-4 text-white transition-colors"
                  style={{ backgroundColor: '#0056b3' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Nav items accordion */}
            {NAV_ITEMS.map((item) => (
              <div key={item.id} style={{ borderBottom: `1px solid ${row1Border}` }}>
                <button
                  onClick={() => toggleMobileItem(item.id)}
                  className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-bold transition-colors"
                  style={{ color: inputText }}
                  onMouseEnter={e => e.currentTarget.style.background = surfaceBg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {t(item.labelKey)}
                  <svg
                    className="w-4 h-4 transition-transform duration-200"
                    style={{ color: mutedText, transform: mobileExpanded === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <AnimatePresence>
                  {mobileExpanded === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                      style={{ background: surfaceBg }}
                    >
                      <div className="px-5 py-4 grid grid-cols-2 gap-4">
                        {item.cols.map((col) => (
                          <div key={col.headingKey}>
                            <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: mutedText }}>
                              {t(col.headingKey)}
                            </p>
                            <ul className="space-y-2">
                              {col.links.map((link) => (
                                <li key={link.labelKey}>
                                  <Link
                                    to={link.href ?? `/?category=${link.filter}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-sm transition-colors"
                                    style={{ color: inputText }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#0056b3'}
                                    onMouseLeave={e => e.currentTarget.style.color = inputText}
                                  >
                                    {t(link.labelKey)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Mobile extras */}
            <div className="px-5 py-3 flex gap-4" style={{ borderTop: `1px solid ${row1Border}`, background: row1Bg }}>
              <Link to="/deals" className="text-xs font-bold transition-colors" style={{ color: '#e53e3e' }} onClick={() => setMobileOpen(false)}>{t('nav.deals')}</Link>
              <Link to="/?badge=NEW" className="text-xs font-bold transition-colors" style={{ color: mutedText }} onClick={() => setMobileOpen(false)}
                onMouseEnter={e => e.currentTarget.style.color = inputText} onMouseLeave={e => e.currentTarget.style.color = mutedText}
              >{t('nav.newArrivals')}</Link>
              <Link
                to="/wishlist"
                className="text-xs font-semibold transition-colors flex items-center gap-1"
                style={{ color: mutedText }}
                onClick={() => setMobileOpen(false)}
              >
                ♡ {t('nav.wishlist')}{wishlistCount > 0 && <span className="text-red-500 font-black">({wishlistCount})</span>}
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="text-xs font-semibold transition-colors ms-auto"
                style={{ color: mutedText }}
              >
                <svg className="w-4 h-4 inline me-1" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {t('nav.account')}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="text-xs font-bold transition-colors"
                  style={{ color: '#0056b3' }}
                >
                  Admin
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}
