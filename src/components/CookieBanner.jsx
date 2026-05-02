import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie-consent', 'all')
    setVisible(false)
  }

  function essentialOnly() {
    localStorage.setItem('cookie-consent', 'essential')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="fixed bottom-0 start-0 end-0 z-[70] border-t shadow-2xl"
          style={{ backgroundColor: '#fff', borderColor: '#e0e0e0' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">🍪</span>
              <div>
                <p className="text-sm font-black text-ink">{t('cookie.title')}</p>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">
                  {t('cookie.desc')}{' '}
                  <Link
                    to="/cookies"
                    className="font-bold underline underline-offset-2"
                    style={{ color: '#0056b3' }}
                  >
                    {t('cookie.manage')}
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={essentialOnly}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border text-sm font-bold text-ink hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#e0e0e0' }}
              >
                {t('cookie.essential')}
              </button>
              <button
                onClick={accept}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: '#0056b3' }}
              >
                {t('cookie.acceptAll')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
