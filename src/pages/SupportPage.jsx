import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSEO } from '@/hooks/useSEO'

/* ── Shared breadcrumb ─────────────────────────────────────────── */
function Crumb({ label }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted mb-10">
      <Link to="/" className="hover:text-ink transition-colors">{t('product.home')}</Link>
      <span>/</span>
      <span className="text-ink font-semibold">{label}</span>
    </div>
  )
}

/* ── FAQ ───────────────────────────────────────────────────────── */
function FAQSection() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(null)
  useSEO({ title: t('pages.faq'), description: t('pages.faqDesc') })

  const items = Array.from({ length: 10 }, (_, i) => ({
    q: t(`faqPage.q${i + 1}`),
    a: t(`faqPage.a${i + 1}`),
  }))

  return (
    <div className="max-w-3xl mx-auto px-6 pt-4 pb-16">
      <Crumb label={t('pages.faq')} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#0056b3' }}>◈ {t('pages.faq')}</p>
        <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight mb-2">{t('faqPage.title')}</h1>
        <p className="text-sm text-muted mb-10">{t('pages.faqDesc')}</p>

        <div className="space-y-3">
          {items.map(({ q, a }, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden transition-shadow hover:shadow-sm"
              style={{ borderColor: open === i ? '#99c3eb' : '#e0e0e0', backgroundColor: open === i ? '#f8fbff' : '#fff' }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="text-sm font-bold text-ink">{q}</span>
                <motion.svg
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.22 }}
                  className="w-4 h-4 shrink-0 text-muted"
                  fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <p className="px-5 pb-5 text-sm text-muted leading-relaxed">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl p-6 text-center" style={{ backgroundColor: '#e6f0fa', border: '1px solid #99c3eb' }}>
          <p className="text-sm font-bold text-ink mb-2">{t('faqPage.stillHaveQuestions')}</p>
          <p className="text-xs text-muted mb-4">{t('contactPage.infoSub')}</p>
          <Link
            to="/contact"
            className="inline-block px-6 py-2.5 rounded-xl text-sm font-black text-white"
            style={{ backgroundColor: '#0056b3' }}
          >
            {t('pages.contact')}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Contact ───────────────────────────────────────────────────── */
function ContactSection() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  useSEO({ title: t('pages.contact'), description: t('pages.contactDesc') })

  const subjects = [1, 2, 3, 4, 5, 6].map(n => ({ value: String(n), label: t(`contactPage.subject${n}`) }))

  function validate() {
    const e = {}
    if (!form.name.trim())               e.name    = t('contactPage.errName')
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('checkout.errEmail')
    if (!form.subject)                   e.subject = t('contactPage.errSubject')
    if (form.message.trim().length < 20) e.message = t('contactPage.errMessage')
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true) }, 1200)
  }

  const fieldBase = (err) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-white ${err ? 'border-red-400' : 'border-border'}`

  const focusStyle = (e, err) => { e.target.style.borderColor = err ? '#e53e3e' : '#0056b3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,86,179,0.10)' }
  const blurStyle  = (e, err) => { e.target.style.borderColor = err ? '#e53e3e' : '#e0e0e0'; e.target.style.boxShadow = 'none' }

  return (
    <div className="max-w-5xl mx-auto px-6 pt-4 pb-16">
      <Crumb label={t('pages.contact')} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border p-6 sm:p-8" style={{ borderColor: '#e0e0e0' }}
        >
          <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-2" style={{ color: '#0056b3' }}>◈ {t('pages.contact')}</p>
          <h1 className="text-2xl font-black text-ink mb-6">{t('contactPage.infoTitle')}</h1>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e9f7ed' }}>
                  <svg className="w-8 h-8" fill="none" stroke="#1e8035" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                </div>
                <h2 className="text-xl font-black text-ink mb-2">{t('contactPage.successTitle')}</h2>
                <p className="text-sm text-muted mb-6">{t('contactPage.successSub')}</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="text-sm font-bold" style={{ color: '#0056b3' }}
                >
                  {t('contactPage.successBack')}
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">{t('contactPage.nameLabel')}</label>
                    <input value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })) }}
                      className={fieldBase(errors.name)} placeholder="John Doe"
                      onFocus={e => focusStyle(e, errors.name)} onBlur={e => blurStyle(e, errors.name)}
                      style={{ borderColor: errors.name ? '#e53e3e' : '#e0e0e0' }}
                    />
                    {errors.name && <p className="text-xs mt-1 text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">{t('checkout.email')}</label>
                    <input type="email" value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })) }}
                      className={fieldBase(errors.email)} placeholder="you@example.com"
                      onFocus={e => focusStyle(e, errors.email)} onBlur={e => blurStyle(e, errors.email)}
                      style={{ borderColor: errors.email ? '#e53e3e' : '#e0e0e0' }}
                    />
                    {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">{t('contactPage.subjectLabel')}</label>
                  <select value={form.subject} onChange={e => { setForm(p => ({ ...p, subject: e.target.value })); setErrors(p => ({ ...p, subject: '' })) }}
                    className={fieldBase(errors.subject) + ' cursor-pointer'}
                    style={{ borderColor: errors.subject ? '#e53e3e' : '#e0e0e0' }}
                  >
                    <option value="">{t('contactPage.subjectPlaceholder')}</option>
                    {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  {errors.subject && <p className="text-xs mt-1 text-red-500">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">{t('contactPage.messageLabel')}</label>
                  <textarea rows={5} value={form.message}
                    onChange={e => { setForm(p => ({ ...p, message: e.target.value })); setErrors(p => ({ ...p, message: '' })) }}
                    placeholder={t('contactPage.messagePlaceholder')}
                    className={fieldBase(errors.message) + ' resize-none'}
                    onFocus={e => focusStyle(e, errors.message)} onBlur={e => blurStyle(e, errors.message)}
                    style={{ borderColor: errors.message ? '#e53e3e' : '#e0e0e0' }}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.message ? <p className="text-xs text-red-500">{errors.message}</p> : <span />}
                    <span className="text-[11px] text-muted">{form.message.length}/500</span>
                  </div>
                </div>

                <motion.button type="submit" disabled={sending} whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl text-white text-sm font-black disabled:opacity-70 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#0056b3' }}
                  onMouseEnter={e => { if (!sending) e.currentTarget.style.backgroundColor = '#004494' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0056b3' }}
                >
                  {sending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('contactPage.sending')}
                    </>
                  ) : t('contactPage.submitBtn')}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info sidebar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }} className="space-y-4">
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e0e0e0' }}>
            <h3 className="text-sm font-black text-ink mb-4">{t('contactPage.infoTitle')}</h3>
            <p className="text-xs text-muted leading-relaxed mb-5">{t('contactPage.infoSub')}</p>
            {[
              { icon: '📧', label: t('pages.emailUs'),   val: 'support@gamingstore.com' },
              { icon: '📞', label: t('pages.callUs'),    val: '+1 (800) 123-4567' },
              { icon: '⏰', label: t('pages.hours'),     val: t('pages.hoursValue') },
            ].map(({ icon, label, val }) => (
              <div key={label} className="flex items-start gap-3 py-3 border-t" style={{ borderColor: '#f0f0f0' }}>
                <span className="text-lg mt-0.5">{icon}</span>
                <div>
                  <p className="text-xs font-bold text-ink">{label}</p>
                  <p className="text-xs text-muted mt-0.5">{val}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: '#e9f7ed', border: '1px solid #a7dfb7' }}>
            <p className="text-xs font-bold text-ink mb-1">{t('faqPage.needUrgentHelp')}</p>
            <p className="text-xs text-muted">
              <Link to="/faq" className="font-bold" style={{ color: '#1e8035' }}>{t('pages.faq')}</Link>
              {' — '}{t('pages.faqDesc')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ── Track Order ───────────────────────────────────────────────── */
const MOCK_ORDERS = {
  'GS-DEMO01': {
    id: 'GS-DEMO01', product: 'White Phantom Custom PC Build',
    status: 3, carrier: 'FedEx', tracking: '7489203847560',
    estDelivery: 'Apr 30, 2026',
    steps: ['Apr 22, 09:14', 'Apr 22, 14:30', 'Apr 23, 08:55', 'Apr 24, 11:20', null],
  },
  'GS-DEMO02': {
    id: 'GS-DEMO02', product: 'GeForce RTX 4090 24GB',
    status: 4, carrier: 'UPS', tracking: '1Z999AA10123456784',
    estDelivery: 'Apr 25, 2026',
    steps: ['Apr 20, 10:00', 'Apr 20, 15:45', 'Apr 21, 09:30', 'Apr 22, 13:00', 'Apr 23, 14:12'],
  },
}

function TrackOrderSection() {
  const { t } = useTranslation()
  const [orderId, setOrderId] = useState('')
  const [result, setResult]   = useState(null)
  const [notFound, setNotFound] = useState(false)
  useSEO({ title: t('pages.trackOrder'), description: t('pages.trackOrderDesc') })

  function handleTrack(e) {
    e.preventDefault()
    const key = orderId.trim().toUpperCase()
    if (MOCK_ORDERS[key]) {
      setResult(MOCK_ORDERS[key])
      setNotFound(false)
    } else {
      setResult(null)
      setNotFound(true)
    }
  }

  const stepLabels = [0, 1, 2, 3, 4].map(i => t(`trackOrderPage.s${i}`))
  const statusColors = ['#6366f1', '#f59e0b', '#0056b3', '#8b5cf6', '#1e8035']

  return (
    <div className="max-w-2xl mx-auto px-6 pt-4 pb-16">
      <Crumb label={t('pages.trackOrder')} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#0056b3' }}>◈ {t('pages.trackOrder')}</p>
        <h1 className="text-3xl font-black text-ink mb-2">{t('pages.trackOrder')}</h1>
        <p className="text-sm text-muted mb-8">{t('pages.trackOrderDesc')}</p>

        <form onSubmit={handleTrack} className="flex gap-3 mb-2">
          <input
            value={orderId}
            onChange={e => { setOrderId(e.target.value); setNotFound(false) }}
            placeholder={t('trackOrderPage.idPlaceholder')}
            className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white"
            style={{ borderColor: '#e0e0e0' }}
            onFocus={e => { e.target.style.borderColor = '#0056b3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,86,179,0.10)' }}
            onBlur={e =>  { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none' }}
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-white text-sm font-black shrink-0"
            style={{ backgroundColor: '#0056b3' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#004494' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0056b3' }}
          >
            {t('trackOrderPage.submitBtn')}
          </button>
        </form>
        <p className="text-[11px] text-muted mb-8">{t('trackOrderPage.demoHint')}</p>

        <AnimatePresence mode="wait">
          {notFound && (
            <motion.div key="notfound" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl border p-6 text-center" style={{ borderColor: '#fcd34d', backgroundColor: '#fffbeb' }}
            >
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-black text-ink mb-1">{t('trackOrderPage.notFound')}</h3>
              <p className="text-sm text-muted">{t('trackOrderPage.notFoundSub')}</p>
            </motion.div>
          )}

          {result && (
            <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e0e0e0' }}
            >
              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between gap-4" style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e0e0e0' }}>
                <div>
                  <p className="text-xs text-muted font-medium">{t('checkout.orderId')}</p>
                  <p className="text-sm font-black text-ink">{result.id}</p>
                </div>
                <span
                  className="text-xs font-black px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: statusColors[result.status] + '22', color: statusColors[result.status] }}
                >
                  {stepLabels[result.status]}
                </span>
              </div>

              <div className="px-6 py-5 space-y-5">
                <p className="text-sm font-semibold text-ink">{result.product}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  {[
                    { l: t('trackOrderPage.estDelivery'), v: result.estDelivery },
                    { l: t('trackOrderPage.carrier'),    v: result.carrier },
                    { l: t('trackOrderPage.trackingNum'), v: result.tracking.slice(-8) },
                  ].map(({ l, v }) => (
                    <div key={l} className="rounded-xl p-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #e0e0e0' }}>
                      <p className="text-[10px] text-muted uppercase tracking-wide mb-1">{l}</p>
                      <p className="text-xs font-black text-ink">{v}</p>
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-xs font-black text-ink mb-4 uppercase tracking-wide">{t('trackOrderPage.timeline')}</p>
                  <div className="space-y-0">
                    {stepLabels.map((label, i) => {
                      const done    = i <= result.status
                      const current = i === result.status
                      return (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10"
                              style={{
                                backgroundColor: done ? (current ? '#0056b3' : '#e9f7ed') : '#f0f0f0',
                                border: current ? '2px solid #0056b3' : 'none',
                              }}
                            >
                              {done && !current ? (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="#1e8035" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                              ) : current ? (
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#0056b3' }} />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-gray-300" />
                              )}
                            </div>
                            {i < stepLabels.length - 1 && (
                              <div className="w-0.5 h-8 mt-0.5" style={{ backgroundColor: i < result.status ? '#a7dfb7' : '#e0e0e0' }} />
                            )}
                          </div>
                          <div className="pb-8 pt-1 flex-1">
                            <p className={`text-sm font-bold ${done ? 'text-ink' : 'text-muted'}`}>{label}</p>
                            {result.steps[i] && <p className="text-[11px] text-muted mt-0.5">{result.steps[i]}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ── Returns ───────────────────────────────────────────────────── */
function ReturnsSection() {
  const { t } = useTranslation()
  useSEO({ title: t('pages.returns'), description: t('pages.returnsDesc') })

  const policies = [
    { icon: '📅', titleKey: 'p1Title', descKey: 'p1Desc' },
    { icon: '🚚', titleKey: 'p2Title', descKey: 'p2Desc' },
    { icon: '💳', titleKey: 'p3Title', descKey: 'p3Desc' },
    { icon: '🖥️', titleKey: 'p4Title', descKey: 'p4Desc' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 pt-4 pb-16">
      <Crumb label={t('pages.returns')} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#0056b3' }}>◈ {t('pages.returns')}</p>
        <h1 className="text-3xl font-black text-ink mb-2">{t('pages.returns')}</h1>
        <p className="text-sm text-muted mb-10">{t('returnsPage.sub')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {policies.map(({ icon, titleKey, descKey }) => (
            <div key={titleKey} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#e0e0e0' }}>
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="text-sm font-black text-ink mb-1.5">{t(`returnsPage.${titleKey}`)}</h3>
              <p className="text-xs text-muted leading-relaxed">{t(`returnsPage.${descKey}`)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border p-6 mb-6" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-base font-black text-ink mb-5">{t('returnsPage.stepsTitle')}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0" style={{ backgroundColor: '#0056b3' }}>{n}</div>
                <p className="text-sm text-muted leading-relaxed pt-0.5">{t(`returnsPage.step${n}`)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d' }}>
          <h3 className="text-sm font-black text-ink mb-1.5">{t('returnsPage.exceptionsTitle')}</h3>
          <p className="text-xs text-muted leading-relaxed">{t('returnsPage.exceptionsDesc')}</p>
        </div>

        <div className="mt-8 text-center">
          <Link to="/contact" className="inline-block px-8 py-3 rounded-xl text-white text-sm font-black" style={{ backgroundColor: '#0056b3' }}>
            {t('pages.contact')}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Warranty ──────────────────────────────────────────────────── */
function WarrantySection() {
  const { t } = useTranslation()
  useSEO({ title: t('pages.warranty'), description: t('pages.warrantyDesc') })

  const tiers = [
    { icon: '🖥️', titleKey: 'systemsTitle', descKey: 'systemsDesc', color: '#e6f0fa', border: '#99c3eb', text: '#004494' },
    { icon: '⚙️', titleKey: 'componentsTitle', descKey: 'componentsDesc', color: '#f3f0ff', border: '#c4b5fd', text: '#5521b5' },
    { icon: '🎮', titleKey: 'peripheralsTitle', descKey: 'peripheralsDesc', color: '#e9f7ed', border: '#a7dfb7', text: '#1e8035' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 pt-4 pb-16">
      <Crumb label={t('pages.warranty')} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#0056b3' }}>◈ {t('pages.warranty')}</p>
        <h1 className="text-3xl font-black text-ink mb-2">{t('pages.warranty')}</h1>
        <p className="text-sm text-muted mb-10">{t('warrantyPage.sub')}</p>

        <div className="space-y-4 mb-10">
          {tiers.map(({ icon, titleKey, descKey, color, border, text }) => (
            <div key={titleKey} className="rounded-2xl border p-5 flex gap-4 items-start" style={{ backgroundColor: color, borderColor: border }}>
              <div className="text-2xl shrink-0 mt-0.5">{icon}</div>
              <div>
                <h3 className="text-sm font-black mb-1" style={{ color: text }}>{t(`warrantyPage.${titleKey}`)}</h3>
                <p className="text-xs text-muted leading-relaxed">{t(`warrantyPage.${descKey}`)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border p-6 text-center" style={{ borderColor: '#e0e0e0' }}>
          <h2 className="text-base font-black text-ink mb-2">{t('warrantyPage.claimsTitle')}</h2>
          <p className="text-sm text-muted mb-5 max-w-md mx-auto">{t('warrantyPage.claimsDesc')}</p>
          <Link to="/contact" className="inline-block px-8 py-3 rounded-xl text-white text-sm font-black" style={{ backgroundColor: '#0056b3' }}>
            {t('warrantyPage.claimsBtn')}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Locations ─────────────────────────────────────────────────── */
function LocationsSection() {
  const { t } = useTranslation()
  useSEO({ title: t('pages.locations'), description: t('pages.locationsDesc') })

  const locs = [1, 2, 3].map(n => ({
    city: t(`locationsPage.loc${n}City`),
    address: t(`locationsPage.loc${n}Address`),
    hours: t(`locationsPage.loc${n}Hours`),
    phone: t(`locationsPage.loc${n}Phone`),
  }))

  return (
    <div className="max-w-4xl mx-auto px-6 pt-4 pb-16">
      <Crumb label={t('pages.locations')} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#0056b3' }}>◈ {t('pages.locations')}</p>
        <h1 className="text-3xl font-black text-ink mb-2">{t('pages.locations')}</h1>
        <p className="text-sm text-muted mb-10">{t('locationsPage.sub')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {locs.map(({ city, address, hours, phone }) => (
            <motion.div key={city}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white rounded-2xl border p-6 flex flex-col" style={{ borderColor: '#e0e0e0' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4" style={{ backgroundColor: '#e6f0fa' }}>📍</div>
              <h2 className="text-base font-black text-ink mb-3">{city}</h2>
              <p className="text-xs text-muted leading-relaxed mb-2">{address}</p>
              <div className="mt-auto space-y-2 pt-4 border-t" style={{ borderColor: '#f0f0f0' }}>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-muted font-bold shrink-0">{t('locationsPage.hours')}:</span>
                  <span className="text-xs text-muted">{hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted font-bold shrink-0">{t('locationsPage.phone')}:</span>
                  <span className="text-xs text-muted">{phone}</span>
                </div>
              </div>
              <a
                href="#"
                className="mt-4 text-xs font-black transition-colors"
                style={{ color: '#0056b3' }}
              >
                {t('locationsPage.getDirections')}
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ── Generic placeholder (live-chat, builder-guide, privacy, terms, cookies) ── */
const PAGE_META = {
  '/live-chat':     { icon: '💬', titleKey: 'pages.liveChat',     descKey: 'pages.liveChatDesc' },
  '/builder-guide': { icon: '🔧', titleKey: 'pages.builderGuide', descKey: 'pages.builderGuideDesc' },
  '/privacy':       { icon: '🔒', titleKey: 'pages.privacy',      descKey: 'pages.privacyDesc' },
  '/terms':         { icon: '📋', titleKey: 'pages.terms',        descKey: 'pages.termsDesc' },
  '/cookies':       { icon: '🍪', titleKey: 'pages.cookies',      descKey: 'pages.cookiesDesc' },
}

function GenericPlaceholder({ pathname }) {
  const { t } = useTranslation()
  const meta = PAGE_META[pathname] ?? { icon: '📄', titleKey: 'pages.comingSoon', descKey: 'pages.comingSoonSub' }
  useSEO({ title: t(meta.titleKey) })

  return (
    <div className="max-w-2xl mx-auto px-6 pt-4 pb-16">
      <Crumb label={t(meta.titleKey)} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="text-center py-10"
      >
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 shadow-sm" style={{ backgroundColor: '#e6f0fa' }}>
          {meta.icon}
        </div>
        <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#0056b3' }}>◈ {t('pages.comingSoon')}</p>
        <h1 className="text-3xl font-black text-ink mb-4">{t(meta.titleKey)}</h1>
        <p className="text-sm text-muted leading-relaxed mb-10 max-w-md mx-auto">{t(meta.descKey)}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="px-8 py-3 rounded-xl text-white text-sm font-black" style={{ backgroundColor: '#0056b3' }}>
            {t('notFound.backToStore')}
          </Link>
          <Link to="/contact" className="px-8 py-3 rounded-xl border-2 text-sm font-black transition-colors" style={{ borderColor: '#0056b3', color: '#0056b3' }}>
            {t('pages.contact')}
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-start">
          {[
            { icon: '📧', label: t('pages.emailUs'),  val: 'support@gamingstore.com' },
            { icon: '📞', label: t('pages.callUs'),   val: '+1 (800) 123-4567' },
            { icon: '⏰', label: t('pages.hours'),    val: t('pages.hoursValue') },
          ].map(({ icon, label, val }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border" style={{ borderColor: '#e0e0e0' }}>
              <div className="text-xl mb-2">{icon}</div>
              <p className="text-xs font-black text-ink mb-0.5">{label}</p>
              <p className="text-xs text-muted">{val}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ── Router ────────────────────────────────────────────────────── */
export default function SupportPage() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-[80vh] pt-25 lg:pt-35" style={{ backgroundColor: '#f8fafc' }}>
      {pathname === '/faq'          && <FAQSection />}
      {pathname === '/contact'      && <ContactSection />}
      {pathname === '/track-order'  && <TrackOrderSection />}
      {pathname === '/returns'      && <ReturnsSection />}
      {pathname === '/warranty'     && <WarrantySection />}
      {pathname === '/locations'    && <LocationsSection />}
      {!['/faq','/contact','/track-order','/returns','/warranty','/locations'].includes(pathname) && (
        <GenericPlaceholder pathname={pathname} />
      )}
    </div>
  )
}
