import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSEO } from '@/hooks/useSEO'

const MOCK_ORDERS = [
  { id: 'GS-8F2A19', product: 'White Phantom Custom PC Build', price: '$2,499', date: 'Apr 10, 2026', status: 'delivered',  img: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=80&q=80' },
  { id: 'GS-3C7B44', product: 'LG UltraWide 34" Monitor',      price: '$899',  date: 'Mar 28, 2026', status: 'shipped',    img: 'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?auto=format&fit=crop&w=80&q=80' },
  { id: 'GS-1E5D02', product: 'Corsair K70 Mechanical Keyboard', price: '$149', date: 'Mar 15, 2026', status: 'delivered', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=80&q=80' },
]

const STATUS_STYLE = {
  delivered:  { bg: '#e9f7ed', color: '#1e8035' },
  shipped:    { bg: '#e6f0fa', color: '#004494' },
  processing: { bg: '#fffbeb', color: '#92400e' },
  confirmed:  { bg: '#f3f0ff', color: '#5521b5' },
}

function fieldBase(err) {
  return `w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${err ? 'border-red-400' : 'border-border'}`
}

function FieldInput({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-xs font-bold text-ink mb-1.5">{label}</label>
      <input
        className={fieldBase(error)}
        style={{ borderColor: error ? '#e53e3e' : '#e0e0e0' }}
        onFocus={e => { e.target.style.borderColor = '#0056b3' }}
        onBlur={e => { e.target.style.borderColor = error ? '#e53e3e' : '#e0e0e0' }}
        {...props}
      />
      {error && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{error}</p>}
    </div>
  )
}

/* ── Dashboard (after sign-in) ─────────────────────────────────── */
function Dashboard({ userName, onSignOut }) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('orders')

  const tabs = [
    { key: 'orders',  label: t('account.myOrders') },
    { key: 'profile', label: t('account.profile') },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
        className="bg-white rounded-2xl border p-6 mb-6 flex items-center gap-5"
        style={{ borderColor: '#e0e0e0' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0"
          style={{ backgroundColor: '#0056b3' }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted font-medium">{t('account.welcomeBack')}</p>
          <h2 className="text-lg font-black text-ink truncate">{userName}</h2>
          <p className="text-xs font-bold mt-0.5" style={{ color: '#0056b3' }}>{t('account.member')}</p>
        </div>
        <button
          onClick={onSignOut}
          className="text-xs font-bold text-muted hover:text-ink transition-colors shrink-0 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          {t('account.signOut')}
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.05 }}
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: '#e0e0e0' }}
      >
        <div className="flex border-b" style={{ borderColor: '#e0e0e0' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 sm:flex-none sm:px-6 py-4 text-sm font-bold relative transition-colors"
              style={{ color: activeTab === tab.key ? '#0056b3' : '#718096' }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div layoutId="dashboard-tab" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#0056b3' }} />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                {MOCK_ORDERS.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="font-black text-ink mb-1">{t('account.noOrders')}</h3>
                    <p className="text-sm text-muted">{t('account.noOrdersSub')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {MOCK_ORDERS.map((order, i) => {
                      const statusKey = `orderStatus${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`
                      const style = STATUS_STYLE[order.status] ?? STATUS_STYLE.confirmed
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center gap-4 p-4 rounded-xl border"
                          style={{ borderColor: '#f0f0f0', backgroundColor: '#fafafa' }}
                        >
                          <img
                            src={order.img}
                            alt={order.product}
                            loading="lazy"
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border"
                            style={{ borderColor: '#e0e0e0' }}
                            onError={e => { e.target.src = 'https://placehold.co/80x80?text=IMG' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-ink line-clamp-1">{order.product}</p>
                            <p className="text-xs text-muted mt-0.5">{order.id} · {order.date}</p>
                          </div>
                          <div className="flex flex-col items-end sm:flex-row sm:items-center gap-1 sm:gap-3 shrink-0">
                            <span className="text-sm font-black" style={{ color: '#0056b3' }}>{order.price}</span>
                            <span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ backgroundColor: style.bg, color: style.color }}>
                              {t(`account.${statusKey}`)}
                            </span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: '#f0f0f0' }}>
                  <Link to="/" className="text-sm font-bold" style={{ color: '#0056b3' }}>
                    {t('checkout.continueShopping')} →
                  </Link>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  {[
                    { icon: '✏️', label: t('account.editProfile') },
                    { icon: '📍', label: t('account.savedAddresses') },
                    { icon: '💳', label: t('account.paymentMethods') },
                  ].map(({ icon, label }) => (
                    <button
                      key={label}
                      className="flex items-center gap-3 p-4 rounded-xl border text-start hover:shadow-sm transition-shadow"
                      style={{ borderColor: '#e0e0e0', backgroundColor: '#fafafa' }}
                    >
                      <span className="text-xl">{icon}</span>
                      <div>
                        <p className="text-sm font-bold text-ink">{label}</p>
                        <p className="text-xs text-muted mt-0.5">{t('account.featureComingSoon')}</p>
                      </div>
                      <svg className="w-4 h-4 text-muted ms-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  ))}
                </div>
                <div className="rounded-xl p-4 text-xs text-muted text-center" style={{ backgroundColor: '#f8fafc', border: '1px solid #e0e0e0' }}>
                  {t('account.demoDisclaimer')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Main ──────────────────────────────────────────────────────── */
export default function AccountPage() {
  const { t } = useTranslation()
  const [tab, setTab]                 = useState('signin')
  const [signinForm, setSigninForm]   = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors]           = useState({})
  const [loggedInAs, setLoggedInAs]   = useState(null)

  useSEO({ title: t('pages.account') })

  function validateSignin() {
    const e = {}
    if (!signinForm.email)    e.email    = t('checkout.errRequired')
    if (!signinForm.password) e.password = t('checkout.errRequired')
    return e
  }

  function validateRegister() {
    const e = {}
    if (!registerForm.firstName) e.firstName = t('checkout.errRequired')
    if (!registerForm.lastName)  e.lastName  = t('checkout.errRequired')
    if (!registerForm.email)     e.email     = t('checkout.errRequired')
    if (!registerForm.password)  e.password  = t('checkout.errRequired')
    if (registerForm.password !== registerForm.confirm) e.confirm = t('account.passwordMismatch')
    return e
  }

  function handleSignin(e) {
    e.preventDefault()
    const errs = validateSignin()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const name = signinForm.email.split('@')[0].replace(/[._]/g, ' ')
    setLoggedInAs(name.charAt(0).toUpperCase() + name.slice(1))
  }

  function handleRegister(e) {
    e.preventDefault()
    const errs = validateRegister()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoggedInAs(`${registerForm.firstName} ${registerForm.lastName}`)
  }

  function switchTab(next) {
    setTab(next)
    setErrors({})
  }

  if (loggedInAs) {
    return (
      <div className="min-h-[80vh] px-4 pt-25 lg:pt-35 pb-16" style={{ backgroundColor: '#f8fafc' }}>
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Link to="/" className="hover:text-ink transition-colors">{t('product.home')}</Link>
            <span>/</span>
            <span className="text-ink font-semibold">{t('pages.account')}</span>
          </div>
        </div>
        <Dashboard userName={loggedInAs} onSignOut={() => setLoggedInAs(null)} />
        <p className="text-center text-xs text-muted mt-6">{t('account.demoDisclaimer')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 pt-25 lg:pt-35" style={{ backgroundColor: '#f8fafc' }}>
      <div className="w-full max-w-md">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted mb-8">
          <Link to="/" className="hover:text-ink transition-colors">{t('product.home')}</Link>
          <span>/</span>
          <span className="text-ink font-semibold">{t('pages.account')}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border overflow-hidden"
          style={{ borderColor: '#e0e0e0' }}
        >
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: '#e0e0e0' }}>
            {['signin', 'register'].map(t_ => (
              <button
                key={t_}
                onClick={() => switchTab(t_)}
                className="flex-1 py-4 text-sm font-bold transition-colors relative"
                style={{ color: tab === t_ ? '#0056b3' : '#718096' }}
              >
                {t_ === 'signin' ? t('account.signIn') : t('account.createAccount')}
                {tab === t_ && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#0056b3' }} />
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {tab === 'signin' ? (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSignin}
                  className="space-y-4"
                  noValidate
                >
                  <FieldInput label={t('checkout.email')} type="email" value={signinForm.email} error={errors.email}
                    onChange={e => { setSigninForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })) }}
                    placeholder="you@example.com"
                  />
                  <FieldInput label={t('account.password')} type="password" value={signinForm.password} error={errors.password}
                    onChange={e => { setSigninForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: '' })) }}
                    placeholder="••••••••"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-muted">
                      <input type="checkbox" style={{ accentColor: '#0056b3' }} />
                      {t('account.rememberMe')}
                    </label>
                    <button type="button" className="font-bold transition-colors" style={{ color: '#0056b3' }}>
                      {t('account.forgotPassword')}
                    </button>
                  </div>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl text-white text-sm font-black" style={{ backgroundColor: '#0056b3' }}
                  >
                    {t('account.signIn')}
                  </motion.button>
                  <div className="relative flex items-center gap-3 text-xs text-muted">
                    <div className="flex-1 h-px" style={{ backgroundColor: '#e0e0e0' }} />
                    {t('account.orContinueWith')}
                    <div className="flex-1 h-px" style={{ backgroundColor: '#e0e0e0' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Google', 'Apple'].map(provider => (
                      <button key={provider} type="button"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold text-ink hover:bg-gray-50 transition-colors"
                        style={{ borderColor: '#e0e0e0' }}
                        onClick={() => setLoggedInAs(provider + ' User')}
                      >
                        {provider === 'Google' ? '🔵' : '⚫'} {provider}
                      </button>
                    ))}
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                  noValidate
                >
                  <div className="grid grid-cols-2 gap-3">
                    <FieldInput label={t('checkout.firstName')} value={registerForm.firstName} error={errors.firstName}
                      onChange={e => { setRegisterForm(p => ({ ...p, firstName: e.target.value })); setErrors(p => ({ ...p, firstName: '' })) }}
                    />
                    <FieldInput label={t('checkout.lastName')} value={registerForm.lastName} error={errors.lastName}
                      onChange={e => { setRegisterForm(p => ({ ...p, lastName: e.target.value })); setErrors(p => ({ ...p, lastName: '' })) }}
                    />
                  </div>
                  <FieldInput label={t('checkout.email')} type="email" value={registerForm.email} error={errors.email}
                    onChange={e => { setRegisterForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })) }}
                    placeholder="you@example.com"
                  />
                  <FieldInput label={t('account.password')} type="password" value={registerForm.password} error={errors.password}
                    onChange={e => { setRegisterForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: '' })) }}
                    placeholder="Min 8 characters"
                  />
                  <FieldInput label={t('account.confirmPassword')} type="password" value={registerForm.confirm} error={errors.confirm}
                    onChange={e => { setRegisterForm(p => ({ ...p, confirm: e.target.value })); setErrors(p => ({ ...p, confirm: '' })) }}
                    placeholder="Re-enter password"
                  />
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl text-white text-sm font-black" style={{ backgroundColor: '#0056b3' }}
                  >
                    {t('account.createAccount')}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted mt-4">{t('account.demoDisclaimer')}</p>
      </div>
    </div>
  )
}
