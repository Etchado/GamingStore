import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import AnnouncementBar from '@/components/AnnouncementBar'

/* ── Nav data (keys only — labels resolved via t()) ── */
const NAV_ITEMS = [
  {
    id: 'systems',
    labelKey: 'nav.systems',
    filter: 'System',
    cols: [
      { headingKey: 'nav.mega.pcBuilds', links: [
        { labelKey: 'nav.mega.prebuiltPCs',   filter: 'System' },
        { labelKey: 'nav.mega.customBuilder',  filter: 'System', href: '/builder' },
        { labelKey: 'nav.mega.miniITX',        filter: 'System' },
        { labelKey: 'nav.mega.workstations',   filter: 'System' },
      ]},
      { headingKey: 'nav.mega.byBrand', links: [
        { labelKey: 'nav.mega.asusRog',        filter: 'System' },
        { labelKey: 'nav.mega.corsair',        filter: 'System' },
        { labelKey: 'nav.mega.nzxt',           filter: 'System' },
        { labelKey: 'nav.mega.fractalDesign',  filter: 'System' },
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
        { labelKey: 'nav.mega.motherboards',  filter: 'System' },
      ]},
      { headingKey: 'nav.mega.storageMemory', links: [
        { labelKey: 'nav.mega.nvmeSsds',  filter: 'Storage' },
        { labelKey: 'nav.mega.ddr5Ram',   filter: 'System' },
        { labelKey: 'nav.mega.sataSsds',  filter: 'Storage' },
        { labelKey: 'nav.mega.cooling',   filter: 'System' },
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
        { labelKey: 'nav.mega.portable',   filter: 'Monitor' },
      ]},
      { headingKey: 'nav.mega.input', links: [
        { labelKey: 'nav.mega.mechanicalKeyboards', filter: 'Keyboard' },
        { labelKey: 'nav.mega.gamingMice',          filter: 'Mouse' },
        { labelKey: 'nav.mega.headsets',            filter: 'Headset' },
        { labelKey: 'nav.mega.webcams',             filter: 'Keyboard' },
      ]},
    ],
  },
  {
    id: 'accessories',
    labelKey: 'nav.accessories',
    filter: 'Desk',
    cols: [
      { headingKey: 'nav.mega.furniture', links: [
        { labelKey: 'nav.mega.standingDesks',    filter: 'Desk' },
        { labelKey: 'nav.mega.ergonomicChairs',  filter: 'Chair' },
        { labelKey: 'nav.mega.monitorArms',      filter: 'Desk' },
      ]},
      { headingKey: 'nav.mega.extras', links: [
        { labelKey: 'nav.mega.cableManagement', filter: 'Desk' },
        { labelKey: 'nav.mega.ledStrips',       filter: 'Desk' },
        { labelKey: 'nav.mega.deskMats',        filter: 'Desk' },
        { labelKey: 'nav.mega.controllers',     filter: 'Keyboard' },
      ]},
    ],
  },
]

/* ── Desktop MegaMenu ── */
function MegaMenu({ item, onLinkClick }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute left-0 right-0 top-full z-50 pt-px"
    >
      <div
        className="bg-white border-t-2 shadow-lg"
        style={{ borderTopColor: '#0056b3', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-2 gap-8">
          {item.cols.map((col) => (
            <div key={col.headingKey}>
              <p className="text-[10px] font-black tracking-[0.15em] uppercase text-muted mb-3">
                {t(col.headingKey)}
              </p>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.href ?? `/?category=${link.filter}`}
                      onClick={onLinkClick}
                      className="text-sm text-ink font-medium transition-colors inline-flex items-center gap-2 group px-2 py-1 -mx-2 rounded-md hover:bg-primary-50 hover:text-primary-600"
                    >
                      <span className="w-1 h-1 rounded-full bg-border group-hover:bg-primary-600 transition-colors shrink-0" />
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

/* ── Navbar ── */
export default function Navbar() {
  const [activeMenu, setActiveMenu]         = useState(null)
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const [query, setQuery]                   = useState('')
  const [mobileQuery, setMobileQuery]       = useState('')
  const { itemCount, setIsOpen: openCart }  = useCart()
  const { count: wishlistCount }            = useWishlist()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isAr = i18n.language?.startsWith('ar')

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

  function handleMegaClose() {
    setActiveMenu(null)
  }

  function doSearch(q, closeMobile = false) {
    const trimmed = q.trim()
    if (!trimmed) return
    navigate(`/?q=${encodeURIComponent(trimmed)}`)
    setQuery('')
    setMobileQuery('')
    if (closeMobile) setMobileOpen(false)
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 bg-white"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <AnnouncementBar />

      {/* ── Row 1: Logo + Search + Icons ── */}
      <div className="border-b border-border">
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
            <span className="font-black text-ink text-[15px] tracking-tight leading-none">
              {t('nav.brandFirst')}<span style={{ color: '#0056b3' }}>{t('nav.brandSecond')}</span>
            </span>
          </Link>

          {/* Search bar — hidden on mobile */}
          <form
            onSubmit={(e) => { e.preventDefault(); doSearch(query) }}
            className="hidden md:flex flex-1 items-stretch rounded-xl border overflow-hidden transition-all"
            style={{ borderColor: '#e0e0e0' }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#0056b3'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
          >
            <select
              className="bg-surface text-xs font-semibold text-muted px-3 border-r outline-none cursor-pointer hover:bg-gray-100 transition-colors"
              style={{ borderColor: '#e0e0e0' }}
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="flex-1 px-4 py-2.5 text-sm outline-none text-ink placeholder-muted bg-white"
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

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-2 ms-auto md:ms-0 shrink-0">
            {/* User — hidden on mobile */}
            <Link to="/account" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted hover:text-ink hover:bg-surface transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-xs font-semibold hidden sm:inline">{t('nav.account')}</span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted hover:text-ink hover:bg-surface transition-colors"
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
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-[10px] font-black text-white flex items-center justify-center"
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
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-[10px] font-black flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Language toggle */}
            <button
              onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-black transition-colors hover:bg-surface"
              style={{ borderColor: '#e0e0e0', color: '#555' }}
              title={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <span className="text-[11px]">{isAr ? '🇺🇸' : '🇸🇦'}</span>
              {isAr ? 'EN' : 'AR'}
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-muted hover:text-ink hover:bg-surface transition-colors"
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
      <div className="relative border-b border-border bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 h-10 flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.id} onMouseEnter={() => setActiveMenu(item.id)}>
              <button
                onClick={() => handleNavClick(item.filter)}
                className="px-2 mx-1 h-10 text-sm font-semibold transition-colors flex items-center gap-1.5 rounded-none border-b-2 -mb-px"
                style={{
                  color:       activeMenu === item.id ? '#0056b3' : '#4a5568',
                  borderColor: activeMenu === item.id ? '#0056b3' : 'transparent',
                }}
              >
                {t(item.labelKey)}
                <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          ))}
          <div className="ms-auto flex items-center gap-4">
            <Link to="/?sort=deals" className="text-xs font-bold transition-colors" style={{ color: '#e53e3e' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#c53030' }} onMouseLeave={(e) => { e.currentTarget.style.color = '#e53e3e' }}>{t('nav.deals')}</Link>
            <Link to="/?badge=NEW" className="text-xs font-bold text-muted hover:text-ink transition-colors">{t('nav.newArrivals')}</Link>
            <Link
              to="/games"
              className="text-xs font-semibold px-3 py-1 rounded-full border transition-colors"
              style={{ color: '#28a745', borderColor: '#a7dfb7' }}
            >
              {t('nav.games')}
            </Link>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {activeMenu && (
            <MegaMenu
              item={NAV_ITEMS.find(i => i.id === activeMenu)}
              onLinkClick={handleMegaClose}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden border-b border-border bg-white overflow-hidden"
          >
            {/* Mobile search */}
            <div className="px-4 py-3 border-b border-border">
              <form
                onSubmit={(e) => { e.preventDefault(); doSearch(mobileQuery, true) }}
                className="flex items-stretch rounded-xl border overflow-hidden"
                style={{ borderColor: '#e0e0e0' }}
              >
                <input
                  type="search"
                  value={mobileQuery}
                  onChange={(e) => setMobileQuery(e.target.value)}
                  placeholder={t('nav.searchMobilePlaceholder')}
                  className="flex-1 px-4 py-2.5 text-sm outline-none text-ink bg-white"
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
              <div key={item.id} className="border-b border-border last:border-0">
                <button
                  onClick={() => toggleMobileItem(item.id)}
                  className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-bold text-ink hover:bg-surface transition-colors"
                >
                  {t(item.labelKey)}
                  <svg
                    className="w-4 h-4 text-muted transition-transform duration-200"
                    style={{ transform: mobileExpanded === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
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
                      style={{ backgroundColor: '#f8fafc' }}
                    >
                      <div className="px-5 py-4 grid grid-cols-2 gap-4">
                        {item.cols.map((col) => (
                          <div key={col.headingKey}>
                            <p className="text-[10px] font-black tracking-widest uppercase text-muted mb-2">
                              {t(col.headingKey)}
                            </p>
                            <ul className="space-y-2">
                              {col.links.map((link) => (
                                <li key={link.labelKey}>
                                  <Link
                                    to={link.href ?? `/?category=${link.filter}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-sm text-ink hover:text-primary-600 transition-colors"
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
            <div className="px-5 py-3 flex gap-4 border-t border-border bg-white">
              <Link to="/?sort=deals" className="text-xs font-bold transition-colors" style={{ color: '#e53e3e' }} onClick={() => setMobileOpen(false)}>{t('nav.deals')}</Link>
              <Link to="/?badge=NEW" className="text-xs font-bold text-muted hover:text-ink transition-colors" onClick={() => setMobileOpen(false)}>{t('nav.newArrivals')}</Link>
              <Link to="/games" className="text-xs font-semibold" style={{ color: '#28a745' }} onClick={() => setMobileOpen(false)}>{t('nav.games')}</Link>
              <Link
                to="/wishlist"
                className="text-xs font-semibold text-muted hover:text-ink transition-colors flex items-center gap-1"
                onClick={() => setMobileOpen(false)}
              >
                ♡ {t('nav.wishlist')}{wishlistCount > 0 && <span className="text-red-500 font-black">({wishlistCount})</span>}
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="text-xs font-semibold text-muted hover:text-ink transition-colors ms-auto"
              >
                <svg className="w-4 h-4 inline me-1" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {t('nav.account')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}
