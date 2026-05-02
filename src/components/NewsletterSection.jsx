import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { EMAIL_RE } from '@/lib/utils'

const PERKS = ['perk1', 'perk2', 'perk3']

export default function NewsletterSection() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isValid = EMAIL_RE.test(email)

  function handleEmailChange(val) {
    setEmail(val)
    if (val.includes('@') && val.includes('.')) {
      if (!EMAIL_RE.test(val)) { setError(t('newsletter.errorTLD')); return }
    }
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) { setError(t('newsletter.errorEmpty')); return }
    if (!isValid) { setError(t('newsletter.errorInvalid')); return }
    setError('')
    setSubmitted(true)
  }

  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f2c 0%, #0056b3 60%, #1a8cff 100%)' }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-20 -end-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: '#60a5fa' }}
      />
      <div
        className="absolute -bottom-16 -start-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ backgroundColor: '#a78bfa' }}
      />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: '#93c5fd' }}>
            {t('newsletter.eyebrow')}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
            {t('newsletter.title')}
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.72)' }}>
            {t('newsletter.sub')}
          </p>
        </motion.div>

        {/* Perks row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {PERKS.map(key => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {t(`newsletter.${key}`)}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="max-w-lg mx-auto"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-6"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-base font-bold text-white text-center">{t('newsletter.success')}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
                noValidate
              >
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={e => handleEmailChange(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    className="w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none border-2 transition-colors"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.10)',
                      borderColor: error ? '#fca5a5' : 'rgba(255,255,255,0.20)',
                      color: '#fff',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = error ? '#fca5a5' : 'rgba(255,255,255,0.6)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = error ? '#fca5a5' : 'rgba(255,255,255,0.20)' }}
                  />
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs mt-1.5 ms-1 font-semibold"
                        style={{ color: '#fca5a5' }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  type="submit"
                  disabled={!isValid}
                  className="shrink-0 px-6 py-3.5 rounded-xl text-sm font-black text-white transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#e53e3e' }}
                  onMouseEnter={e => { if (isValid) e.currentTarget.style.backgroundColor = '#c53030' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#e53e3e' }}
                >
                  {t('newsletter.cta')}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {!submitted && (
            <p className="text-center text-[11px] mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {t('newsletter.privacy')}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
