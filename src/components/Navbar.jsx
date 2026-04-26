import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '@/context/CartContext'

/* ── Nav data ─── */
const NAV_ITEMS = [
  {
    label: 'Systems',
    cols: [
      { heading: 'PC Builds',   links: ['Prebuilt PCs', 'Custom Builder', 'Mini ITX', 'Workstations'] },
      { heading: 'By Brand',    links: ['ASUS ROG',     'Corsair',        'NZXT',     'Fractal Design'] },
    ],
  },
  {
    label: 'Components',
    cols: [
      { heading: 'Processing',       links: ['Graphics Cards (GPU)', 'Processors (CPU)', 'Motherboards'] },
      { heading: 'Storage & Memory', links: ['NVMe SSDs', 'DDR5 RAM', 'SATA SSDs', 'Cooling'] },
    ],
  },
  {
    label: 'Peripherals',
    cols: [
      { heading: 'Display', links: ['4K Monitors', 'Ultrawide', '240Hz Gaming', 'Portable'] },
      { heading: 'Input',   links: ['Mechanical Keyboards', 'Gaming Mice', 'Headsets', 'Webcams'] },
    ],
  },
  {
    label: 'Accessories',
    cols: [
      { heading: 'Furniture', links: ['Standing Desks', 'Ergonomic Chairs', 'Monitor Arms'] },
      { heading: 'Extras',    links: ['Cable Management', 'LED Strips', 'Desk Mats', 'Controllers'] },
    ],
  },
]

/* ── Desktop MegaMenu ── */
function MegaMenu({ item }) {
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
            <div key={col.heading}>
              <p className="text-[10px] font-black tracking-[0.15em] uppercase text-muted mb-3">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-ink font-medium hover:text-primary-600 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-border group-hover:bg-primary-600 transition-colors" />
                      {link}
                    </a>
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
  const [activeMenu, setActiveMenu]       = useState(null)
  const [mobileOpen, setMobileOpen]       = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const { itemCount, setIsOpen: openCart } = useCart()

  function toggleMobileItem(label) {
    setMobileExpanded(prev => prev === label ? null : label)
  }

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 bg-white"
      onMouseLeave={() => setActiveMenu(null)}
    >

      {/* ── Row 1: Logo + Search + Icons ── */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-4">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#0056b3' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-black text-ink text-[15px] tracking-tight leading-none">
              Gaming<span style={{ color: '#0056b3' }}>Store</span>
            </span>
          </a>

          {/* Search bar — hidden on mobile */}
          <div
            className="hidden md:flex flex-1 items-stretch rounded-xl border overflow-hidden transition-all"
            style={{ borderColor: '#e0e0e0' }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#0056b3'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
          >
            <select
              className="bg-surface text-xs font-semibold text-muted px-3 border-r outline-none cursor-pointer hover:bg-gray-100 transition-colors"
              style={{ borderColor: '#e0e0e0' }}
            >
              <option>All Categories</option>
              <option>Systems</option>
              <option>Components</option>
              <option>Peripherals</option>
              <option>Accessories</option>
            </select>
            <input
              type="search"
              placeholder="Search products, brands, and categories…"
              className="flex-1 px-4 py-2.5 text-sm outline-none text-ink placeholder-muted bg-white"
            />
            <button
              className="px-5 text-white text-sm font-bold transition-colors"
              style={{ backgroundColor: '#0056b3' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto md:ml-0 shrink-0">
            {/* User — hidden on mobile */}
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted hover:text-ink hover:bg-surface transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-xs font-semibold hidden sm:inline">Account</span>
            </button>

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
              <span className="hidden sm:inline">Cart</span>
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
            <div key={item.label} onMouseEnter={() => setActiveMenu(item.label)}>
              <button
                className="px-4 h-10 text-sm font-semibold transition-colors flex items-center gap-1.5 rounded-none border-b-2 -mb-px"
                style={{
                  color:       activeMenu === item.label ? '#0056b3' : '#4a5568',
                  borderColor: activeMenu === item.label ? '#0056b3' : 'transparent',
                }}
              >
                {item.label}
                <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-4">
            <a href="#" className="text-xs font-bold text-muted hover:text-ink transition-colors">🔥 Deals</a>
            <a href="#" className="text-xs font-bold text-muted hover:text-ink transition-colors">⭐ New Arrivals</a>
            <a
              href="#"
              className="text-xs font-semibold px-3 py-1 rounded-full border transition-colors"
              style={{ color: '#28a745', borderColor: '#a7dfb7' }}
            >
              Games
            </a>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {activeMenu && (
            <MegaMenu item={NAV_ITEMS.find(i => i.label === activeMenu)} />
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
              <div
                className="flex items-stretch rounded-xl border overflow-hidden"
                style={{ borderColor: '#e0e0e0' }}
              >
                <input
                  type="search"
                  placeholder="Search products…"
                  className="flex-1 px-4 py-2.5 text-sm outline-none text-ink bg-white"
                />
                <button
                  className="px-4 text-white transition-colors"
                  style={{ backgroundColor: '#0056b3' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Nav items accordion */}
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="border-b border-border last:border-0">
                <button
                  onClick={() => toggleMobileItem(item.label)}
                  className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-bold text-ink hover:bg-surface transition-colors"
                >
                  {item.label}
                  <svg
                    className="w-4 h-4 text-muted transition-transform duration-200"
                    style={{ transform: mobileExpanded === item.label ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <AnimatePresence>
                  {mobileExpanded === item.label && (
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
                          <div key={col.heading}>
                            <p className="text-[10px] font-black tracking-widest uppercase text-muted mb-2">
                              {col.heading}
                            </p>
                            <ul className="space-y-2">
                              {col.links.map((link) => (
                                <li key={link}>
                                  <a href="#" className="text-sm text-ink hover:text-primary-600 transition-colors">
                                    {link}
                                  </a>
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
              <a href="#" className="text-xs font-bold text-muted hover:text-ink transition-colors">🔥 Deals</a>
              <a href="#" className="text-xs font-bold text-muted hover:text-ink transition-colors">⭐ New Arrivals</a>
              <a href="#" className="text-xs font-semibold" style={{ color: '#28a745' }}>Games</a>
              <a href="#" className="text-xs font-semibold text-muted hover:text-ink transition-colors ml-auto">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Account
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}
