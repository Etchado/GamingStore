import { useState, useRef, useEffect } from 'react'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSEO } from '@/hooks/useSEO'
import { useCurrency } from '@/context/CurrencyContext'
import { useAuth } from '@/context/AuthContext'
import { stripArabic, stripName } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

/* ── Zod schemas ─────────────────────────────────── */
const NAME_RULE = z.string()
  .min(1, 'required')
  .regex(/^[a-zA-Z\s'\-]+$/, 'nameInvalid')

const signInSchema = z.object({
  email:    z.string().min(1, 'required').email('emailInvalid'),
  password: z.string().min(1, 'required'),
})

const registerSchema = z.object({
  firstName: NAME_RULE,
  lastName:  NAME_RULE,
  email:     z.string().min(1, 'required').email('emailInvalid'),
  password:  z.string()
    .min(8, 'passwordTooShort')
    .regex(/[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/, 'passwordNeedsSymbol'),
  confirm: z.string().min(1, 'required'),
}).refine(d => d.password === d.confirm, {
  message: 'passwordMismatch',
  path: ['confirm'],
})

const forgotSchema = z.object({
  email: z.string().min(1, 'required').email('emailInvalid'),
})

/* Maps Zod error keys → t() translation keys */
function zodErrors(result, t) {
  if (result.success) return {}
  const out = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0]
    if (!field || out[field]) continue
    const key = issue.message
    const tKey = {
      required:            'checkout.errRequired',
      emailInvalid:        'account.emailInvalid',
      nameInvalid:         'account.nameInvalid',
      passwordTooShort:    'account.passwordTooShort',
      passwordNeedsSymbol: 'account.passwordNeedsSymbol',
      passwordMismatch:    'account.passwordMismatch',
    }[key] ?? 'checkout.errRequired'
    out[field] = t(tKey)
  }
  return out
}

const STATUS_STYLE = {
  delivered:  { bg: '#e9f7ed', color: '#1e8035' },
  shipped:    { bg: '#e6f0fa', color: '#004494' },
  processing: { bg: '#fffbeb', color: '#92400e' },
  confirmed:  { bg: '#f3f0ff', color: '#5521b5' },
}

const PHONE_RE = /^[0-9]{9}$/

/* ── Shared field components ── */
function FieldInput({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-xs font-bold text-ink mb-1.5">{label}</label>
      <input
        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
        style={{ borderColor: error ? '#e53e3e' : '#e0e0e0' }}
        onFocus={e => { e.target.style.borderColor = '#0056b3' }}
        onBlur={e => { e.target.style.borderColor = error ? '#e53e3e' : '#e0e0e0' }}
        {...props}
      />
      {error && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{error}</p>}
    </div>
  )
}

function PasswordInput({ label, error, value, onChange, ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-xs font-bold text-ink mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="w-full border rounded-xl px-4 py-2.5 pe-10 text-sm outline-none transition-colors"
          style={{ borderColor: error ? '#e53e3e' : '#e0e0e0' }}
          onFocus={e => { e.target.style.borderColor = '#0056b3' }}
          onBlur={e => { e.target.style.borderColor = error ? '#e53e3e' : '#e0e0e0' }}
          {...props}
        />
        <button
          type="button" tabIndex={-1}
          onClick={() => setShow(s => !s)}
          className="absolute inset-y-0 end-0 flex items-center px-3 text-muted hover:text-ink transition-colors"
        >
          {show ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <path d="M1 1l22 22" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{error}</p>}
    </div>
  )
}

/* 6-digit OTP boxes */
function OTPInput({ value, onChange, error }) {
  const refs = Array.from({ length: 6 }, () => useRef(null))

  function handleKey(i, e) {
    if (e.key === 'Backspace' && !e.target.value && i > 0) refs[i - 1].current?.focus()
  }

  function handleChange(i, e) {
    const digit = e.target.value.replace(/\D/g, '').slice(-1)
    const arr = value.split('')
    arr[i] = digit
    const next = arr.join('').padEnd(6, ' ').slice(0, 6)
    onChange(next.trimEnd())
    if (digit && i < 5) refs[i + 1].current?.focus()
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted)
    refs[Math.min(pasted.length, 5)].current?.focus()
    e.preventDefault()
  }

  return (
    <div>
      <div className="flex gap-2 justify-center">
        {Array.from({ length: 6 }, (_, i) => (
          <input
            key={i} ref={refs[i]}
            type="text" inputMode="numeric" maxLength={1}
            value={value[i] || ''}
            onChange={e => handleChange(i, e)}
            onKeyDown={e => handleKey(i, e)}
            onPaste={handlePaste}
            className="w-11 h-12 text-center text-lg font-black border-2 rounded-xl outline-none transition-colors"
            style={{ borderColor: error ? '#e53e3e' : '#e0e0e0' }}
            onFocus={e => { e.target.style.borderColor = '#0056b3' }}
            onBlur={e => { e.target.style.borderColor = error ? '#e53e3e' : '#e0e0e0' }}
          />
        ))}
      </div>
      {error && <p className="text-xs mt-2 text-center" style={{ color: '#e53e3e' }}>{error}</p>}
    </div>
  )
}

/* ── Social button ── */
function SocialBtn({ icon, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl border text-sm font-bold text-ink hover:bg-gray-50 transition-colors disabled:opacity-60"
      style={{ borderColor: '#e0e0e0' }}
    >
      {icon}
      {label}
    </button>
  )
}

/* ── Spinner ── */
function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

/* ── Profile Editor ── */
function ProfileEditor({ user }) {
  const { t } = useTranslation()
  const [name, setName]           = useState(user.name ?? '')
  const [saving, setSaving]       = useState(false)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState('')
  const [newEmail, setNewEmail]   = useState('')
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.display_name) setName(data.display_name)
      })
  }, [user.id])

  async function handleSave(e) {
    e.preventDefault()
    if (!name.trim()) { setError(t('checkout.errRequired')); return }
    setSaving(true)
    setError('')
    setSuccess(false)
    const { error: err } = await supabase
      .from('profiles')
      .upsert({ id: user.id, display_name: name.trim(), updated_at: new Date().toISOString() })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  async function handleEmailChange(e) {
    e.preventDefault()
    if (!newEmail.trim()) { setEmailError('Please enter a new email address.'); return }
    if (newEmail.trim() === user.email) { setEmailError('This is already your current email.'); return }
    setEmailSaving(true)
    setEmailError('')
    const { error: err } = await supabase.auth.updateUser({ email: newEmail.trim() })
    setEmailSaving(false)
    if (err) { setEmailError(err.message); return }
    setEmailSent(true)
    setNewEmail('')
  }

  return (
    <div className="space-y-8 max-w-md">
      {/* Display name */}
      <form onSubmit={handleSave} className="space-y-5">
      <div>
        <p className="text-[11px] font-black tracking-[0.15em] uppercase mb-4" style={{ color: '#0056b3' }}>
          {t('account.editProfile')}
        </p>
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-ink uppercase tracking-wide">{t('account.displayName')}</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-white"
              style={{ borderColor: error ? '#f87171' : '#e0e0e0' }}
              onFocus={e => { e.target.style.borderColor = '#0056b3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,86,179,0.10)' }}
              onBlur={e => { e.target.style.borderColor = error ? '#f87171' : '#e0e0e0'; e.target.style.boxShadow = 'none' }}
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-black text-white transition-colors disabled:opacity-60 flex items-center gap-2"
          style={{ backgroundColor: '#0056b3' }}
        >
          {saving && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {saving ? t('account.saving') : t('account.saveChanges')}
        </motion.button>
        {success && (
          <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-bold" style={{ color: '#1e8035' }}>
            ✓ {t('account.saved')}
          </motion.span>
        )}
      </div>

    </form>

      {/* Email change */}
      <form onSubmit={handleEmailChange} className="space-y-4 pt-6 border-t" style={{ borderColor: '#f0f0f0' }}>
        <p className="text-[11px] font-black tracking-[0.15em] uppercase" style={{ color: '#0056b3' }}>
          Change Email
        </p>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-ink uppercase tracking-wide">Current Email</label>
          <input
            type="email"
            value={user.email ?? ''}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 text-muted cursor-not-allowed"
            style={{ borderColor: '#e0e0e0' }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-ink uppercase tracking-wide">New Email Address</label>
          <input
            type="email"
            value={newEmail}
            onChange={e => { setNewEmail(e.target.value); setEmailError(''); setEmailSent(false) }}
            placeholder="Enter new email"
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-white"
            style={{ borderColor: emailError ? '#f87171' : '#e0e0e0' }}
            onFocus={e => { e.target.style.borderColor = '#0056b3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,86,179,0.10)' }}
            onBlur={e => { e.target.style.borderColor = emailError ? '#f87171' : '#e0e0e0'; e.target.style.boxShadow = 'none' }}
          />
          {emailError && <p className="text-xs text-red-500 font-medium">{emailError}</p>}
          {emailSent && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold" style={{ color: '#1e8035' }}>
              ✓ Verification link sent — check your new inbox and click the link to confirm.
            </motion.p>
          )}
        </div>
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={emailSaving}
          className="px-6 py-2.5 rounded-xl text-sm font-black text-white transition-colors disabled:opacity-60 flex items-center gap-2"
          style={{ backgroundColor: '#0056b3' }}
        >
          {emailSaving && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {emailSaving ? 'Sending...' : 'Send Verification Link'}
        </motion.button>
      </form>

      <div className="pt-6 border-t space-y-3" style={{ borderColor: '#f0f0f0' }}>
        {[
          { icon: '📍', label: t('account.savedAddresses') },
          { icon: '💳', label: t('account.paymentMethods') },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-3 p-4 rounded-xl border" style={{ borderColor: '#e0e0e0', backgroundColor: '#fafafa' }}>
            <span className="text-xl">{icon}</span>
            <div>
              <p className="text-sm font-bold text-ink">{label}</p>
              <p className="text-xs text-muted mt-0.5">{t('account.featureComingSoon')}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full ms-auto" style={{ backgroundColor: '#e6f0fa', color: '#0056b3' }}>
              Soon
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Dashboard ── */
function Dashboard({ user, onSignOut }) {
  const { t } = useTranslation()
  const { formatPrice, parseUSD } = useCurrency()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? [])
        setOrdersLoading(false)
      })
  }, [])

  const tabs = [
    { key: 'orders',  label: t('account.myOrders') },
    { key: 'profile', label: t('account.profile') },
  ]

  const methodBadge = { phone: '📱', google: '🔵', apple: '⚫', email: '✉️' }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}
        className="bg-white rounded-2xl border p-6 mb-6 flex items-center gap-5"
        style={{ borderColor: '#e0e0e0' }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0" style={{ backgroundColor: '#0056b3' }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted font-medium">{t('account.welcomeBack')}</p>
          <h2 className="text-lg font-black text-ink truncate">{user.name}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs font-bold" style={{ color: '#0056b3' }}>{t('account.member')}</p>
            {user.method && (
              <span className="text-[10px] text-muted">· {t('account.signedVia')} {methodBadge[user.method] ?? '✉️'}</span>
            )}
          </div>
        </div>
        <button onClick={onSignOut} className="text-xs font-bold text-muted hover:text-ink transition-colors shrink-0 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          {t('account.signOut')}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: 0.05 }}
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: '#e0e0e0' }}
      >
        <div className="flex border-b" style={{ borderColor: '#e0e0e0' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
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
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl border animate-pulse" style={{ borderColor: '#f0f0f0', backgroundColor: '#fafafa' }}>
                        <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-2/3" />
                          <div className="h-2 bg-gray-200 rounded w-1/3" />
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3" style={{ backgroundColor: '#e6f0fa' }}>📦</div>
                    <p className="text-sm font-bold text-ink">{t('account.noOrders')}</p>
                    <p className="text-xs text-muted mt-1 mb-4">{t('account.noOrdersSub')}</p>
                    <Link to="/" className="text-sm font-bold px-5 py-2.5 rounded-xl text-white" style={{ backgroundColor: '#0056b3' }}>
                      {t('checkout.continueShopping')}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order, i) => {
                      const firstItem = order.order_items?.[0]
                      const itemCount = order.order_items?.length ?? 0
                      const style = STATUS_STYLE[order.status] ?? STATUS_STYLE.confirmed
                      const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      return (
                        <motion.div
                          key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                          className="flex items-center gap-4 p-4 rounded-xl border"
                          style={{ borderColor: '#f0f0f0', backgroundColor: '#fafafa' }}
                        >
                          <img
                            src={firstItem?.image || 'https://placehold.co/80x80?text=📦'}
                            alt={firstItem?.title ?? 'Order'}
                            loading="lazy"
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border"
                            style={{ borderColor: '#e0e0e0' }}
                            onError={e => { e.target.src = 'https://placehold.co/80x80?text=📦' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-ink line-clamp-1">
                              {firstItem?.title ?? 'Order'}
                              {itemCount > 1 && <span className="text-muted font-normal"> +{itemCount - 1} more</span>}
                            </p>
                            <p className="text-xs text-muted mt-0.5">{order.order_number} · {date}</p>
                          </div>
                          <div className="flex flex-col items-end sm:flex-row sm:items-center gap-1 sm:gap-3 shrink-0">
                            <span className="text-sm font-black" style={{ color: '#0056b3' }}>{formatPrice(order.total)}</span>
                            <span className="text-[11px] font-black px-2.5 py-1 rounded-full" style={{ backgroundColor: style.bg, color: style.color }}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </motion.div>
                      )
                    })}
                    <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: '#f0f0f0' }}>
                      <Link to="/" className="text-sm font-bold" style={{ color: '#0056b3' }}>
                        {t('checkout.continueShopping')} →
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <ProfileEditor user={user} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Main ── */
export default function AccountPage() {
  const { t } = useTranslation()
  const {
    isAuthenticated, user, pendingPhone,
    signInWithEmail, register: authRegister,
    requestOTP, verifyOTP,
    signInWithGoogle, signInWithApple,
    resetPassword, signOut,
  } = useAuth()

  // tab: 'signin' | 'register' | 'forgot'
  // signinView: 'main' | 'phone' | 'otp'
  const [tab, setTab]               = useState('signin')
  const [signinView, setSigninView] = useState('main')
  const [signinForm, setSigninForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [forgotEmail, setForgotEmail]   = useState('')
  const [forgotSent, setForgotSent]     = useState(false)
  const [registerSent, setRegisterSent] = useState(false)
  const [phoneNum, setPhoneNum]         = useState('')
  const [otpCode, setOtpCode]           = useState('')
  const [errors, setErrors]             = useState({})
  const [serverError, setServerError]   = useState('')
  const [submitting, setSubmitting]     = useState(false)

  useSEO({ title: t('pages.account') })

  function clearServerError() { setServerError('') }

  async function handleSignin(e) {
    e.preventDefault()
    const result = signInSchema.safeParse(signinForm)
    const errs = zodErrors(result, t)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    clearServerError()
    const { error } = await signInWithEmail(signinForm.email, signinForm.password)
    setSubmitting(false)
    if (error) setServerError(error.message)
  }

  async function handleRegister(e) {
    e.preventDefault()
    const result = registerSchema.safeParse(registerForm)
    const errs = zodErrors(result, t)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    clearServerError()
    const { error } = await authRegister(registerForm.firstName, registerForm.lastName, registerForm.email, registerForm.password)
    setSubmitting(false)
    if (error) { setServerError(error.message); return }
    setRegisterSent(true)
  }

  async function handleForgot(e) {
    e.preventDefault()
    const result = forgotSchema.safeParse({ email: forgotEmail })
    const errs = zodErrors(result, t)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    clearServerError()
    const { error } = await resetPassword(forgotEmail)
    setSubmitting(false)
    if (error) { setServerError(error.message); return }
    setForgotSent(true)
  }

  async function handlePhoneSend(e) {
    e.preventDefault()
    if (!PHONE_RE.test(phoneNum)) { setErrors({ phone: t('account.phoneInvalid') }); return }
    setSubmitting(true)
    clearServerError()
    const { error } = await requestOTP(phoneNum)
    setSubmitting(false)
    if (error) { setServerError(error.message); return }
    setSigninView('otp')
    setErrors({})
  }

  async function handleOTPVerify(e) {
    e.preventDefault()
    if (otpCode.length < 6) { setErrors({ otp: t('account.otpIncomplete') }); return }
    setSubmitting(true)
    clearServerError()
    const { error } = await verifyOTP(otpCode)
    setSubmitting(false)
    if (error) { setErrors({ otp: t('account.otpInvalid') }) }
  }

  function switchTab(next) {
    setTab(next)
    setSigninView('main')
    setErrors({})
    setServerError('')
    setForgotSent(false)
    setRegisterSent(false)
    setForgotEmail('')
    setPhoneNum('')
    setOtpCode('')
  }

  /* ── Authenticated: show dashboard ── */
  if (isAuthenticated && user) {
    return (
      <div className="min-h-[80vh] px-4 pt-36 lg:pt-44 pb-16" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Link to="/" className="hover:text-ink transition-colors">{t('product.home')}</Link>
            <span>/</span>
            <span className="text-ink font-semibold">{t('pages.account')}</span>
          </div>
        </div>
        <Dashboard user={user} onSignOut={signOut} />
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 pt-36 lg:pt-44" style={{ backgroundColor: '#f8fafc' }}>
      <div className="w-full max-w-md">

        <div className="flex items-center gap-1.5 text-xs text-muted mb-8">
          <Link to="/" className="hover:text-ink transition-colors">{t('product.home')}</Link>
          <span>/</span>
          <span className="text-ink font-semibold">{t('pages.account')}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border overflow-hidden"
          style={{ borderColor: '#e0e0e0' }}
        >
          {/* Tab bar */}
          {tab !== 'forgot' && signinView === 'main' && !registerSent && (
            <div className="flex border-b" style={{ borderColor: '#e0e0e0' }}>
              {['signin', 'register'].map(t_ => (
                <button key={t_} onClick={() => switchTab(t_)}
                  className="flex-1 py-4 text-sm font-bold transition-colors relative"
                  style={{ color: tab === t_ ? '#0056b3' : '#718096' }}
                >
                  {t_ === 'signin' ? t('account.signIn') : t('account.createAccount')}
                  {tab === t_ && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#0056b3' }} />}
                </button>
              ))}
            </div>
          )}

          <div className="p-6">
            {/* Server-level error banner */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl px-4 py-3 mb-4 text-sm"
                style={{ backgroundColor: '#fff5f5', border: '1px solid #feb2b2' }}
              >
                <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#e53e3e' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                <p className="font-medium" style={{ color: '#c53030' }}>{serverError}</p>
              </motion.div>
            )}

            <AnimatePresence mode="wait">

              {/* ── SIGN IN ── */}
              {tab === 'signin' && signinView === 'main' && (
                <motion.div key="signin-main" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-3">
                  <SocialBtn
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13 1 .39 1.97.74 2.91a2 2 0 0 1-.45 2.11L7.7 9.16a16 16 0 0 0 6.29 6.29l1.2-1.2a2 2 0 0 1 2.11-.45c.94.35 1.91.61 2.91.74a2 2 0 0 1 1.79 2.08z"/></svg>}
                    label={<span className="flex items-center gap-2">{t('account.continueWithPhone')}<span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#e6f0fa', color: '#0056b3' }}>Coming Soon</span></span>}
                    disabled
                  />
                  <SocialBtn
                    icon={<svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
                    label={t('account.continueWithGoogle')}
                    onClick={signInWithGoogle}
                  />
                  <SocialBtn
                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>}
                    label={t('account.continueWithApple')}
                    onClick={signInWithApple}
                  />

                  <div className="relative flex items-center gap-3 text-xs text-muted">
                    <div className="flex-1 h-px" style={{ backgroundColor: '#e0e0e0' }} />
                    {t('account.orWithEmail')}
                    <div className="flex-1 h-px" style={{ backgroundColor: '#e0e0e0' }} />
                  </div>

                  <form onSubmit={handleSignin} className="space-y-3" noValidate>
                    <FieldInput label={t('checkout.email')} type="email" value={signinForm.email} error={errors.email}
                      onChange={e => { setSigninForm(p => ({ ...p, email: stripArabic(e.target.value) })); setErrors(p => ({ ...p, email: '' })); clearServerError() }}
                      placeholder="you@example.com"
                    />
                    <PasswordInput label={t('account.password')} value={signinForm.password} error={errors.password}
                      onChange={e => { setSigninForm(p => ({ ...p, password: stripArabic(e.target.value) })); setErrors(p => ({ ...p, password: '' })); clearServerError() }}
                      placeholder="••••••••"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer text-muted">
                        <input type="checkbox" style={{ accentColor: '#0056b3' }} />
                        {t('account.rememberMe')}
                      </label>
                      <button type="button" className="font-bold" style={{ color: '#0056b3' }} onClick={() => switchTab('forgot')}>
                        {t('account.forgotPassword')}
                      </button>
                    </div>
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      disabled={submitting}
                      className="w-full py-3 rounded-xl text-white text-sm font-black flex items-center justify-center gap-2 disabled:opacity-70"
                      style={{ backgroundColor: '#0056b3' }}
                    >
                      {submitting && <Spinner />}
                      {t('account.signIn')}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* ── PHONE INPUT ── */}
              {tab === 'signin' && signinView === 'phone' && (
                <motion.div key="phone" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <button onClick={() => setSigninView('main')} className="flex items-center gap-1.5 text-xs font-bold text-muted mb-5 hover:text-ink transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    {t('account.back')}
                  </button>
                  <h3 className="text-base font-black text-ink mb-1">{t('account.enterPhone')}</h3>
                  <p className="text-xs text-muted mb-5">{t('account.otpWillBeSent')}</p>
                  <form onSubmit={handlePhoneSend} className="space-y-4" noValidate>
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1.5">{t('account.phoneNumber')}</label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-e-0 rounded-s-xl text-sm font-bold text-ink bg-gray-50 shrink-0" style={{ borderColor: '#e0e0e0' }}>
                          🇸🇦 +966
                        </div>
                        <input
                          type="tel" inputMode="numeric" maxLength={9}
                          value={phoneNum}
                          onChange={e => { setPhoneNum(e.target.value.replace(/\D/g, '').slice(0, 9)); setErrors(p => ({ ...p, phone: '' })); clearServerError() }}
                          placeholder="5X XXX XXXX"
                          className="flex-1 border rounded-e-xl px-4 py-2.5 text-sm outline-none transition-colors"
                          style={{ borderColor: errors.phone ? '#e53e3e' : '#e0e0e0' }}
                          onFocus={e => { e.target.style.borderColor = '#0056b3' }}
                          onBlur={e => { e.target.style.borderColor = errors.phone ? '#e53e3e' : '#e0e0e0' }}
                        />
                      </div>
                      {errors.phone && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{errors.phone}</p>}
                    </div>
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      disabled={submitting}
                      className="w-full py-3 rounded-xl text-white text-sm font-black flex items-center justify-center gap-2 disabled:opacity-70"
                      style={{ backgroundColor: '#0056b3' }}
                    >
                      {submitting && <Spinner />}
                      {t('account.sendOTP')}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* ── OTP VERIFY ── */}
              {tab === 'signin' && signinView === 'otp' && (
                <motion.div key="otp" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <button onClick={() => setSigninView('phone')} className="flex items-center gap-1.5 text-xs font-bold text-muted mb-5 hover:text-ink transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    {t('account.back')}
                  </button>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3" style={{ backgroundColor: '#e6f0fa' }}>📱</div>
                    <h3 className="text-base font-black text-ink">{t('account.enterOTP')}</h3>
                    <p className="text-xs text-muted mt-1">
                      {t('account.otpSentTo')} <span className="font-bold text-ink">+966 {phoneNum}</span>
                    </p>
                  </div>
                  <form onSubmit={handleOTPVerify} className="space-y-5" noValidate>
                    <OTPInput value={otpCode} onChange={v => { setOtpCode(v); setErrors(p => ({ ...p, otp: '' })); clearServerError() }} error={errors.otp} />
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      disabled={otpCode.length < 6 || submitting}
                      className="w-full py-3 rounded-xl text-white text-sm font-black flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: '#0056b3' }}
                    >
                      {submitting && <Spinner />}
                      {t('account.verifyOTP')}
                    </motion.button>
                  </form>
                  <p className="text-xs text-center text-muted mt-4">
                    {t('account.noCode')}{' '}
                    <button className="font-bold" style={{ color: '#0056b3' }}
                      onClick={() => { setOtpCode(''); setErrors({}); clearServerError(); requestOTP(phoneNum) }}
                    >
                      {t('account.resend')}
                    </button>
                  </p>
                </motion.div>
              )}

              {/* ── REGISTER ── */}
              {tab === 'register' && signinView === 'main' && !registerSent && (
                <motion.div key="register" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                  <SocialBtn
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13 1 .39 1.97.74 2.91a2 2 0 0 1-.45 2.11L7.7 9.16a16 16 0 0 0 6.29 6.29l1.2-1.2a2 2 0 0 1 2.11-.45c.94.35 1.91.61 2.91.74a2 2 0 0 1 1.79 2.08z"/></svg>}
                    label={<span className="flex items-center gap-2">{t('account.continueWithPhone')}<span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#e6f0fa', color: '#0056b3' }}>Coming Soon</span></span>}
                    disabled
                  />
                  <SocialBtn
                    icon={<svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
                    label={t('account.continueWithGoogle')}
                    onClick={signInWithGoogle}
                  />
                  <SocialBtn
                    icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>}
                    label={t('account.continueWithApple')}
                    onClick={signInWithApple}
                  />

                  <div className="relative flex items-center gap-3 text-xs text-muted">
                    <div className="flex-1 h-px" style={{ backgroundColor: '#e0e0e0' }} />
                    {t('account.orWithEmail')}
                    <div className="flex-1 h-px" style={{ backgroundColor: '#e0e0e0' }} />
                  </div>

                  <form onSubmit={handleRegister} className="space-y-3" noValidate>
                    <div className="grid grid-cols-2 gap-3">
                      <FieldInput label={t('checkout.firstName')} value={registerForm.firstName} error={errors.firstName}
                        onChange={e => { setRegisterForm(p => ({ ...p, firstName: stripName(e.target.value) })); setErrors(p => ({ ...p, firstName: '' })); clearServerError() }}
                      />
                      <FieldInput label={t('checkout.lastName')} value={registerForm.lastName} error={errors.lastName}
                        onChange={e => { setRegisterForm(p => ({ ...p, lastName: stripName(e.target.value) })); setErrors(p => ({ ...p, lastName: '' })); clearServerError() }}
                      />
                    </div>
                    <FieldInput label={t('checkout.email')} type="email" value={registerForm.email} error={errors.email}
                      onChange={e => { setRegisterForm(p => ({ ...p, email: stripArabic(e.target.value) })); setErrors(p => ({ ...p, email: '' })); clearServerError() }}
                      placeholder="you@example.com"
                    />
                    <PasswordInput label={t('account.password')} value={registerForm.password} error={errors.password}
                      onChange={e => { setRegisterForm(p => ({ ...p, password: stripArabic(e.target.value) })); setErrors(p => ({ ...p, password: '' })); clearServerError() }}
                      placeholder="Min 8 chars, include a symbol"
                    />
                    <PasswordInput label={t('account.confirmPassword')} value={registerForm.confirm} error={errors.confirm}
                      onChange={e => { setRegisterForm(p => ({ ...p, confirm: stripArabic(e.target.value) })); setErrors(p => ({ ...p, confirm: '' })); clearServerError() }}
                      placeholder="Re-enter password"
                    />
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      disabled={submitting}
                      className="w-full py-3 rounded-xl text-white text-sm font-black flex items-center justify-center gap-2 disabled:opacity-70"
                      style={{ backgroundColor: '#0056b3' }}
                    >
                      {submitting && <Spinner />}
                      {t('account.createAccount')}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* ── REGISTER SUCCESS: check email ── */}
              {tab === 'register' && registerSent && (
                <motion.div key="register-sent" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: '#e9f7ed' }}>✉️</div>
                  <div>
                    <h3 className="text-base font-black text-ink">{t('account.checkEmailTitle')}</h3>
                    <p className="text-sm text-muted mt-1 leading-relaxed">{t('account.checkEmailSub', { email: registerForm.email })}</p>
                  </div>
                  <button onClick={() => switchTab('signin')} className="text-sm font-bold" style={{ color: '#0056b3' }}>
                    ← {t('account.backToSignIn')}
                  </button>
                </motion.div>
              )}

              {/* ── FORGOT PASSWORD ── */}
              {tab === 'forgot' && (
                <motion.div key="forgot" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.22 }}>
                  {forgotSent ? (
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: '#e9f7ed' }}>✉️</div>
                      <div>
                        <h3 className="text-base font-black text-ink">{t('account.resetSentTitle')}</h3>
                        <p className="text-sm text-muted mt-1 leading-relaxed">{t('account.resetSentSub', { email: forgotEmail })}</p>
                      </div>
                      <button onClick={() => switchTab('signin')} className="text-sm font-bold" style={{ color: '#0056b3' }}>
                        ← {t('account.backToSignIn')}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgot} className="space-y-4" noValidate>
                      <div>
                        <h3 className="text-base font-black text-ink">{t('account.forgotTitle')}</h3>
                        <p className="text-xs text-muted mt-1">{t('account.forgotSub')}</p>
                      </div>
                      <FieldInput label={t('checkout.email')} type="email" value={forgotEmail} error={errors.forgotEmail}
                        onChange={e => { setForgotEmail(stripArabic(e.target.value)); setErrors(p => ({ ...p, forgotEmail: '' })); clearServerError() }}
                        placeholder="you@example.com"
                      />
                      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        disabled={submitting}
                        className="w-full py-3 rounded-xl text-white text-sm font-black flex items-center justify-center gap-2 disabled:opacity-70"
                        style={{ backgroundColor: '#0056b3' }}
                      >
                        {submitting && <Spinner />}
                        {t('account.sendResetLink')}
                      </motion.button>
                      <button type="button" onClick={() => switchTab('signin')}
                        className="w-full text-center text-sm font-bold transition-colors" style={{ color: '#718096' }}
                      >
                        ← {t('account.backToSignIn')}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
