import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSEO } from '@/hooks/useSEO'

export default function AccountPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('signin')
  const [signinForm, setSigninForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

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
    setErrors({})
    setSubmitted(true)
  }

  function handleRegister(e) {
    e.preventDefault()
    const errs = validateRegister()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitted(true)
  }

  function switchTab(next) {
    setTab(next)
    setErrors({})
    setSubmitted(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16" style={{ backgroundColor: '#f8fafc' }}>
      <div className="w-full max-w-md">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted mb-8">
          <Link to="/" className="hover:text-ink transition-colors">{t('product.home')}</Link>
          <span>/</span>
          <span className="text-ink font-semibold">{t('pages.account')}</span>
        </div>

        {/* Card */}
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
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#0056b3' }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-5xl mb-4">🎮</div>
                  <h2 className="text-xl font-black text-ink mb-2">{t('account.demoNote')}</h2>
                  <p className="text-sm text-muted mb-6">{t('account.demoSub')}</p>
                  <Link
                    to="/"
                    className="inline-block px-8 py-3 rounded-xl text-white text-sm font-black"
                    style={{ backgroundColor: '#0056b3' }}
                  >
                    {t('checkout.continueShopping')}
                  </Link>
                </motion.div>
              ) : tab === 'signin' ? (
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSignin}
                  className="space-y-4"
                  noValidate
                >
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">{t('checkout.email')}</label>
                    <input
                      type="email"
                      value={signinForm.email}
                      onChange={e => setSigninForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ borderColor: errors.email ? '#e53e3e' : '#e0e0e0' }}
                      onFocus={e => { e.target.style.borderColor = '#0056b3' }}
                      onBlur={e => { e.target.style.borderColor = errors.email ? '#e53e3e' : '#e0e0e0' }}
                    />
                    {errors.email && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">{t('account.password')}</label>
                    <input
                      type="password"
                      value={signinForm.password}
                      onChange={e => setSigninForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ borderColor: errors.password ? '#e53e3e' : '#e0e0e0' }}
                      onFocus={e => { e.target.style.borderColor = '#0056b3' }}
                      onBlur={e => { e.target.style.borderColor = errors.password ? '#e53e3e' : '#e0e0e0' }}
                    />
                    {errors.password && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{errors.password}</p>}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-muted">
                      <input type="checkbox" style={{ accentColor: '#0056b3' }} />
                      {t('account.rememberMe')}
                    </label>
                    <button type="button" className="font-bold transition-colors" style={{ color: '#0056b3' }}>
                      {t('account.forgotPassword')}
                    </button>
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl text-white text-sm font-black"
                    style={{ backgroundColor: '#0056b3' }}
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
                      <button
                        key={provider}
                        type="button"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold text-ink transition-colors hover:bg-gray-50"
                        style={{ borderColor: '#e0e0e0' }}
                        onClick={() => setSubmitted(true)}
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
                    {[
                      { field: 'firstName', label: t('checkout.firstName') },
                      { field: 'lastName',  label: t('checkout.lastName') },
                    ].map(({ field, label }) => (
                      <div key={field}>
                        <label className="block text-xs font-bold text-ink mb-1.5">{label}</label>
                        <input
                          type="text"
                          value={registerForm[field]}
                          onChange={e => setRegisterForm(p => ({ ...p, [field]: e.target.value }))}
                          className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
                          style={{ borderColor: errors[field] ? '#e53e3e' : '#e0e0e0' }}
                          onFocus={e => { e.target.style.borderColor = '#0056b3' }}
                          onBlur={e => { e.target.style.borderColor = errors[field] ? '#e53e3e' : '#e0e0e0' }}
                        />
                        {errors[field] && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{errors[field]}</p>}
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">{t('checkout.email')}</label>
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ borderColor: errors.email ? '#e53e3e' : '#e0e0e0' }}
                      onFocus={e => { e.target.style.borderColor = '#0056b3' }}
                      onBlur={e => { e.target.style.borderColor = errors.email ? '#e53e3e' : '#e0e0e0' }}
                    />
                    {errors.email && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">{t('account.password')}</label>
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Min 8 characters"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ borderColor: errors.password ? '#e53e3e' : '#e0e0e0' }}
                      onFocus={e => { e.target.style.borderColor = '#0056b3' }}
                      onBlur={e => { e.target.style.borderColor = errors.password ? '#e53e3e' : '#e0e0e0' }}
                    />
                    {errors.password && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">{t('account.confirmPassword')}</label>
                    <input
                      type="password"
                      value={registerForm.confirm}
                      onChange={e => setRegisterForm(p => ({ ...p, confirm: e.target.value }))}
                      placeholder="Re-enter password"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ borderColor: errors.confirm ? '#e53e3e' : '#e0e0e0' }}
                      onFocus={e => { e.target.style.borderColor = '#0056b3' }}
                      onBlur={e => { e.target.style.borderColor = errors.confirm ? '#e53e3e' : '#e0e0e0' }}
                    />
                    {errors.confirm && <p className="text-xs mt-1" style={{ color: '#e53e3e' }}>{errors.confirm}</p>}
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl text-white text-sm font-black"
                    style={{ backgroundColor: '#0056b3' }}
                  >
                    {t('account.createAccount')}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Demo note */}
        <p className="text-center text-xs text-muted mt-4">{t('account.demoDisclaimer')}</p>
      </div>
    </div>
  )
}
