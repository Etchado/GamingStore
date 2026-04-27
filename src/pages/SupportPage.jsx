import { motion } from 'motion/react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSEO } from '@/hooks/useSEO'

const PAGE_META = {
  '/faq':          { icon: '❓', titleKey: 'pages.faq',          descKey: 'pages.faqDesc' },
  '/contact':      { icon: '📬', titleKey: 'pages.contact',      descKey: 'pages.contactDesc' },
  '/returns':      { icon: '↩️', titleKey: 'pages.returns',      descKey: 'pages.returnsDesc' },
  '/track-order':  { icon: '📦', titleKey: 'pages.trackOrder',   descKey: 'pages.trackOrderDesc' },
  '/live-chat':    { icon: '💬', titleKey: 'pages.liveChat',     descKey: 'pages.liveChatDesc' },
  '/builder-guide':{ icon: '🔧', titleKey: 'pages.builderGuide', descKey: 'pages.builderGuideDesc' },
  '/warranty':     { icon: '🛡️', titleKey: 'pages.warranty',     descKey: 'pages.warrantyDesc' },
  '/locations':    { icon: '📍', titleKey: 'pages.locations',    descKey: 'pages.locationsDesc' },
  '/privacy':      { icon: '🔒', titleKey: 'pages.privacy',      descKey: 'pages.privacyDesc' },
  '/terms':        { icon: '📋', titleKey: 'pages.terms',        descKey: 'pages.termsDesc' },
  '/cookies':      { icon: '🍪', titleKey: 'pages.cookies',      descKey: 'pages.cookiesDesc' },
}

export default function SupportPage() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const meta = PAGE_META[pathname] ?? { icon: '📄', titleKey: 'pages.comingSoon', descKey: 'pages.comingSoonSub' }

  useSEO({ title: t(meta.titleKey) })

  return (
    <div className="min-h-[80vh] px-6 py-16" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-2xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted mb-10">
          <Link to="/" className="hover:text-ink transition-colors">{t('product.home')}</Link>
          <span>/</span>
          <span className="text-ink font-semibold">{t(meta.titleKey)}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center py-16"
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 shadow-sm"
            style={{ backgroundColor: '#e6f0fa' }}
          >
            {meta.icon}
          </div>

          <p className="text-[11px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: '#0056b3' }}>
            ◈ {t('pages.comingSoon')}
          </p>

          <h1 className="text-4xl font-black text-ink mb-4 tracking-tight">
            {t(meta.titleKey)}
          </h1>

          <p className="text-base text-muted leading-relaxed mb-10 max-w-md mx-auto">
            {t(meta.descKey)}
          </p>

          {/* Quick links */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              to="/"
              className="px-8 py-3 rounded-xl text-white text-sm font-black"
              style={{ backgroundColor: '#0056b3' }}
            >
              {t('notFound.backToStore')}
            </Link>
            {pathname !== '/contact' && (
              <Link
                to="/contact"
                className="px-8 py-3 rounded-xl border-2 text-sm font-black transition-colors"
                style={{ borderColor: '#0056b3', color: '#0056b3' }}
              >
                {t('pages.contact')}
              </Link>
            )}
          </div>

          {/* Quick support cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: '📧', label: t('pages.emailUs'),   value: 'support@gamingstore.com' },
              { icon: '📞', label: t('pages.callUs'),    value: '+1 (800) 123-4567' },
              { icon: '⏰', label: t('pages.hours'),     value: t('pages.hoursValue') },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-5 border"
                style={{ borderColor: '#e0e0e0' }}
              >
                <div className="text-2xl mb-2">{icon}</div>
                <p className="text-xs font-black text-ink mb-1">{label}</p>
                <p className="text-xs text-muted">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
