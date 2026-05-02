import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle'

const ADMIN_EMAIL = 'ikhaledi95@gmail.com'

const ORDER_STATUSES = ['paid', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS = {
  paid:       { bg: '#e6f4ea', color: '#1a7a35' },
  processing: { bg: '#fff3e0', color: '#b45309' },
  shipped:    { bg: '#e8f0fe', color: '#1a56db' },
  delivered:  { bg: '#e6f4ea', color: '#1a7a35' },
  cancelled:  { bg: '#fce8e6', color: '#c0392b' },
}

function StatCard({ icon, label, value, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </motion.div>
  )
}

function Badge({ status }) {
  const s = STATUS_COLORS[status] ?? { bg: '#f3f4f6', color: '#6b7280' }
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  )
}

function OrdersTab() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId)
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    setUpdating(null)
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  )

  if (!orders.length) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-4xl mb-3">📦</p>
      <p className="font-medium">No orders yet</p>
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {['Order', 'Customer', 'Date', 'Total', 'Status', 'Items', ''].map(h => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const addr = order.shipping_address ?? {}
            const customerName = [addr.firstName, addr.lastName].filter(Boolean).join(' ') || '—'
            const date = new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            const isExpanded = expanded === order.id

            return [
              <tr
                key={order.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : order.id)}
              >
                <td className="py-3 px-4 font-mono text-xs text-gray-500">{order.order_number ?? order.id.slice(0, 8)}</td>
                <td className="py-3 px-4 font-medium text-gray-800">{customerName}</td>
                <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{date}</td>
                <td className="py-3 px-4 font-semibold text-gray-900">{order.total}</td>
                <td className="py-3 px-4">
                  <select
                    value={order.status}
                    disabled={updating === order.id}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer"
                    style={{
                      backgroundColor: (STATUS_COLORS[order.status] ?? { bg: '#f3f4f6' }).bg,
                      color: (STATUS_COLORS[order.status] ?? { color: '#6b7280' }).color,
                    }}
                  >
                    {ORDER_STATUSES.map(s => (
                      <option key={s} value={s} className="bg-white text-gray-800">{s}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 text-gray-500">{(order.order_items ?? []).length} item(s)</td>
                <td className="py-3 px-4">
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </td>
              </tr>,
              isExpanded && (
                <tr key={order.id + '-items'}>
                  <td colSpan={7} className="px-4 pb-4 bg-gray-50">
                    <div className="pt-3 space-y-2">
                      {(order.order_items ?? []).map(item => (
                        <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-800 truncate">{item.title}</p>
                            <p className="text-xs text-gray-400">Qty: {item.qty} · {item.price}</p>
                          </div>
                        </div>
                      ))}
                      {order.shipping_address && (
                        <div className="text-xs text-gray-500 pt-1 px-1">
                          <span className="font-medium">Ship to: </span>
                          {[addr.address, addr.city, addr.country].filter(Boolean).join(', ')}
                          {order.coupon_code && <span className="ml-3 font-medium text-green-600">Coupon: {order.coupon_code}</span>}
                        </div>
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
  )
}

function ReviewsTab() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    setReviews(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function deleteReview(id) {
    if (!window.confirm('Delete this review?')) return
    setDeleting(id)
    await supabase.from('reviews').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
    setDeleting(null)
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  )

  if (!reviews.length) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-4xl mb-3">💬</p>
      <p className="font-medium">No reviews yet</p>
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
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-sm text-gray-800">{r.user_name ?? 'Anonymous'}</span>
                <span className="flex text-amber-400 text-sm">
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </span>
                <span className="text-xs text-gray-400 font-mono">{r.product_id}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">
                  {new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>
            </div>
            <button
              onClick={() => deleteReview(r.id)}
              disabled={deleting === r.id}
              className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              {deleting === r.id
                ? <div className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                )
              }
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default function AdminPage() {
  usePageTitle('Admin Panel')
  const { user, loading } = useAuth()
  const [tab, setTab]       = useState('orders')
  const [stats, setStats]   = useState(null)

  useEffect(() => {
    async function loadStats() {
      const [{ count: orderCount }, { data: revenue }, { count: reviewCount }] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total'),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
      ])
      const totalRevenue = (revenue ?? []).reduce((sum, o) => {
        const num = parseFloat(String(o.total ?? '0').replace(/[^0-9.]/g, ''))
        return sum + (isNaN(num) ? 0 : num)
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
    { id: 'orders',  label: 'Orders' },
    { id: 'reviews', label: 'Reviews' },
  ]

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🛠</span>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <p className="text-gray-400 text-sm">Manage orders and content for GamingStore.</p>
      </motion.div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon="📦" label="Total Orders" value={stats.orderCount} />
          <StatCard
            icon="💰"
            label="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            sub="simulated"
          />
          <StatCard icon="💬" label="Reviews" value={stats.reviewCount} />
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-4 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {tab === 'orders'  && <OrdersTab />}
              {tab === 'reviews' && <ReviewsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
