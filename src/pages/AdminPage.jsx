import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTheme } from '@/context/ThemeContext'

const ADMIN_EMAIL = 'ikhaledi95@gmail.com'
const ORDER_STATUSES = ['paid', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_CFG = {
  paid:       { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  processing: { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  shipped:    { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
  delivered:  { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
}

/* ── Icons ─────────────────────────────────────────────────────── */
function IconBox({ Icon, color }) {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '22' }}>
      <Icon style={{ color }} className="w-5 h-5" />
    </div>
  )
}
function OrdersIcon(p)  { return <svg {...p} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> }
function RevenueIcon(p) { return <svg {...p} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> }
function ReviewsIcon(p) { return <svg {...p} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> }
function ChevronIcon(p) { return <svg {...p} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg> }
function TrashIcon(p)   { return <svg {...p} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg> }
function ShieldIcon(p)  { return <svg {...p} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> }

/* ── Stat card ──────────────────────────────────────────────────── */
function StatCard({ Icon, label, value, sub, accent, delay }) {
  const { dark } = useTheme()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      style={{
        backgroundColor: dark ? '#161b22' : '#ffffff',
        borderColor: dark ? '#30363d' : '#e5e7eb',
      }}
      className="rounded-2xl border p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <IconBox Icon={Icon} color={accent} />
        <span style={{ color: dark ? '#30363d' : '#e5e7eb' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </span>
      </div>
      <div>
        <p style={{ color: dark ? '#e6edf3' : '#111827' }} className="text-3xl font-black tracking-tight">{value}</p>
        <p style={{ color: dark ? '#8b949e' : '#6b7280' }} className="text-sm font-medium mt-0.5">{label}</p>
        {sub && <p style={{ color: dark ? '#484f58' : '#9ca3af' }} className="text-xs mt-1">{sub}</p>}
      </div>
      <div className="h-0.5 rounded-full" style={{ backgroundColor: accent + '33' }}>
        <div className="h-full rounded-full w-2/3" style={{ backgroundColor: accent }} />
      </div>
    </motion.div>
  )
}

/* ── Status badge ───────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] ?? { bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af' }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
      {status}
    </span>
  )
}

const PAGE_SIZE = 15

/* ── Orders tab ─────────────────────────────────────────────────── */
function OrdersTab() {
  const { dark } = useTheme()
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [page, setPage]         = useState(0)
  const [total, setTotal]       = useState(0)

  const load = useCallback(async (p = 0) => {
    setLoading(true)
    const from = p * PAGE_SIZE
    const to   = from + PAGE_SIZE - 1
    const { data, count } = await supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    setOrders(data ?? [])
    setTotal(count ?? 0)
    setExpanded(null)
    setLoading(false)
  }, [])

  useEffect(() => { load(page) }, [load, page])

  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId)
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    setUpdating(null)
  }

  const c = {
    border:  dark ? '#30363d' : '#f3f4f6',
    muted:   dark ? '#8b949e' : '#6b7280',
    normal:  dark ? '#c9d1d9' : '#374151',
    strong:  dark ? '#e6edf3' : '#111827',
    rowHov:  dark ? '#21262d' : '#f9fafb',
    subBg:   dark ? '#0d1117' : '#f9fafb',
    itemBg:  dark ? '#161b22' : '#ffffff',
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      <p style={{ color: c.muted }} className="text-sm">Loading orders…</p>
    </div>
  )

  if (!orders.length) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: dark ? '#21262d' : '#f3f4f6' }}>
        <OrdersIcon style={{ color: c.muted }} className="w-8 h-8" />
      </div>
      <div className="text-center">
        <p style={{ color: c.strong }} className="font-semibold">No orders yet</p>
        <p style={{ color: c.muted }} className="text-sm mt-1">Orders will appear here once customers start buying.</p>
      </div>
    </div>
  )

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottomColor: c.border }} className="border-b">
              {['Order', 'Customer', 'Date', 'Total', 'Status', 'Items', ''].map(h => (
                <th key={h} style={{ color: c.muted }} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const addr = order.shipping_address ?? {}
              const name = [addr.firstName, addr.lastName].filter(Boolean).join(' ') || '—'
              const date = new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              const isOpen = expanded === order.id

              return [
                <tr
                  key={order.id}
                  style={{ borderBottomColor: c.border }}
                  className="border-b transition-colors cursor-pointer"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = c.rowHov}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                >
                  <td className="py-3.5 px-4">
                    <span style={{ color: '#0056b3' }} className="font-mono text-xs font-semibold">#{order.order_number ?? order.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td style={{ color: c.normal }} className="py-3.5 px-4 font-medium">{name}</td>
                  <td style={{ color: c.muted }} className="py-3.5 px-4 whitespace-nowrap text-xs">{date}</td>
                  <td style={{ color: c.strong }} className="py-3.5 px-4 font-bold">{order.total}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      disabled={updating === order.id}
                      onClick={e => e.stopPropagation()}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className="border-0 outline-none cursor-pointer text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: (STATUS_CFG[order.status] ?? { bg: '#f3f4f6' }).bg,
                        color: (STATUS_CFG[order.status] ?? { color: '#6b7280' }).color,
                      }}
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s} value={s} style={{ backgroundColor: dark ? '#161b22' : '#fff', color: dark ? '#e6edf3' : '#1f2937' }}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ color: c.muted }} className="py-3.5 px-4 text-xs">{(order.order_items ?? []).length} item{(order.order_items ?? []).length !== 1 ? 's' : ''}</td>
                  <td className="py-3.5 px-4">
                    <ChevronIcon style={{ color: c.muted }} className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </td>
                </tr>,
                isOpen && (
                  <tr key={order.id + '-exp'}>
                    <td colSpan={7} style={{ backgroundColor: c.subBg }} className="px-6 pb-5 pt-4">
                      <div className="space-y-2">
                        {(order.order_items ?? []).map(item => (
                          <div key={item.id} style={{ backgroundColor: c.itemBg, borderColor: c.border }} className="flex items-center gap-4 rounded-xl p-3.5 border">
                            {item.image && <img src={item.image} alt={item.title} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p style={{ color: c.normal }} className="font-semibold text-sm truncate">{item.title}</p>
                              <p style={{ color: c.muted }} className="text-xs mt-0.5">Qty: {item.qty} · {item.price}</p>
                            </div>
                          </div>
                        ))}
                        {order.shipping_address && (
                          <p style={{ color: c.muted }} className="text-xs pt-1 px-1">
                            <span style={{ color: c.normal }} className="font-semibold">Ship to: </span>
                            {[addr.address, addr.city, addr.country].filter(Boolean).join(', ')}
                            {order.coupon_code && <span className="ml-3 font-semibold text-green-500">Coupon: {order.coupon_code}</span>}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ),
              ]
            })}
          </tbody>
        </table>
      </div>

      {total > PAGE_SIZE && (
        <div style={{ borderTopColor: c.border }} className="flex items-center justify-between px-4 pt-4 mt-1 border-t">
          <p style={{ color: c.muted }} className="text-xs">
            Showing <span style={{ color: c.normal }} className="font-semibold">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)}</span> of {total} orders
          </p>
          <div className="flex gap-2">
            {[{ label: '← Prev', disabled: page === 0, action: () => setPage(p => p - 1) },
              { label: 'Next →', disabled: (page + 1) * PAGE_SIZE >= total, action: () => setPage(p => p + 1) }
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.action}
                disabled={btn.disabled}
                style={{ borderColor: c.border, color: c.muted }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border hover:opacity-75 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Reviews tab ────────────────────────────────────────────────── */
function ReviewsTab() {
  const { dark } = useTheme()
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    setReviews(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function del(id) {
    if (!window.confirm('Delete this review?')) return
    setDeleting(id)
    await supabase.from('reviews').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
    setDeleting(null)
  }

  const c = {
    muted:  dark ? '#8b949e' : '#6b7280',
    normal: dark ? '#c9d1d9' : '#374151',
    strong: dark ? '#e6edf3' : '#111827',
    border: dark ? '#30363d' : '#f3f4f6',
    cardBg: dark ? '#161b22' : '#ffffff',
    divider: dark ? '#484f58' : '#d1d5db',
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      <p style={{ color: c.muted }} className="text-sm">Loading reviews…</p>
    </div>
  )

  if (!reviews.length) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: dark ? '#21262d' : '#f3f4f6' }}>
        <ReviewsIcon style={{ color: c.muted }} className="w-8 h-8" />
      </div>
      <div className="text-center">
        <p style={{ color: c.strong }} className="font-semibold">No reviews yet</p>
        <p style={{ color: c.muted }} className="text-sm mt-1">Customer reviews will appear here.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {reviews.map(r => (
          <motion.div
            key={r.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            style={{ backgroundColor: c.cardBg, borderColor: c.border }}
            className="rounded-xl border p-4 flex gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                <span style={{ color: c.strong }} className="font-semibold text-sm">{r.user_name ?? 'Anonymous'}</span>
                <span className="text-amber-400 text-sm tracking-tight">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span style={{ color: c.divider }} className="text-xs">·</span>
                <span style={{ color: c.muted }} className="text-xs font-mono">{r.product_id}</span>
                <span style={{ color: c.divider }} className="text-xs">·</span>
                <span style={{ color: c.muted }} className="text-xs">
                  {new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p style={{ color: c.normal }} className="text-sm leading-relaxed">{r.body}</p>
            </div>
            <button
              onClick={() => del(r.id)}
              disabled={deleting === r.id}
              style={{ color: c.muted }}
              className="flex-shrink-0 p-2 rounded-lg hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              {deleting === r.id
                ? <div className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                : <TrashIcon className="w-4 h-4" />
              }
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ── Admin page ─────────────────────────────────────────────────── */
export default function AdminPage() {
  usePageTitle('Admin Panel')
  const { user, loading } = useAuth()
  const { dark } = useTheme()
  const [tab, setTab]     = useState('orders')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function loadStats() {
      const [{ count: orderCount }, { data: revenue }, { count: reviewCount }] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total'),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
      ])
      const totalRevenue = (revenue ?? []).reduce((sum, o) => {
        const n = parseFloat(String(o.total ?? '0').replace(/[^0-9.]/g, ''))
        return sum + (isNaN(n) ? 0 : n)
      }, 0)
      setStats({ orderCount: orderCount ?? 0, totalRevenue, reviewCount: reviewCount ?? 0 })
    }
    if (user?.email === ADMIN_EMAIL) loadStats()
  }, [user])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-9 h-9 rounded-full border-[3px] border-blue-600 border-t-transparent animate-spin" />
    </div>
  )

  if (!user || user.email !== ADMIN_EMAIL) return <Navigate to="/" replace />

  const TABS = [
    { id: 'orders',  label: 'Orders',  Icon: OrdersIcon,  count: stats?.orderCount },
    { id: 'reviews', label: 'Reviews', Icon: ReviewsIcon, count: stats?.reviewCount },
  ]

  const panelBg     = dark ? '#161b22' : '#ffffff'
  const panelBorder = dark ? '#30363d' : '#e5e7eb'
  const pageBg      = dark ? '#0d1117' : '#f6f8fa'
  const textStrong  = dark ? '#e6edf3' : '#111827'
  const textMuted   = dark ? '#8b949e' : '#6b7280'
  const dividerColor = dark ? '#30363d' : '#e5e7eb'

  return (
    <div style={{ backgroundColor: pageBg }} className="min-h-screen pt-52 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0056b3' }}>
              <ShieldIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 style={{ color: textStrong }} className="text-xl font-black tracking-tight">Admin Panel</h1>
              <p style={{ color: textMuted }} className="text-xs mt-0.5">GamingStore · {user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ backgroundColor: '#0056b322', color: '#0056b3' }} className="text-xs font-bold px-3 py-1.5 rounded-full">
              ● Live
            </span>
          </div>
        </motion.div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            Icon={OrdersIcon}
            label="Total Orders"
            value={stats?.orderCount ?? '—'}
            accent="#0056b3"
            delay={0}
          />
          <StatCard
            Icon={RevenueIcon}
            label="Total Revenue"
            value={stats ? `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '—'}
            sub="simulated"
            accent="#10b981"
            delay={0.05}
          />
          <StatCard
            Icon={ReviewsIcon}
            label="Customer Reviews"
            value={stats?.reviewCount ?? '—'}
            accent="#f59e0b"
            delay={0.1}
          />
        </div>

        {/* ── Content panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{ backgroundColor: panelBg, borderColor: panelBorder }}
          className="rounded-2xl border overflow-hidden"
        >
          {/* Tab bar */}
          <div style={{ borderBottomColor: dividerColor }} className="flex items-center border-b px-2">
            {TABS.map(t => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-2 px-4 py-4 text-sm font-semibold transition-colors relative"
                  style={{ color: active ? '#0056b3' : textMuted }}
                >
                  <t.Icon className="w-4 h-4" />
                  {t.label}
                  {t.count !== undefined && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{
                        backgroundColor: active ? '#0056b322' : (dark ? '#21262d' : '#f3f4f6'),
                        color: active ? '#0056b3' : textMuted,
                      }}
                    >
                      {t.count}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: '#0056b3' }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
              >
                {tab === 'orders'  && <OrdersTab />}
                {tab === 'reviews' && <ReviewsTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
