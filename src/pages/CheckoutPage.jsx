import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useAuth } from '@/context/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { onImgError } from '@/lib/imgFallback'
import { supabase } from '@/lib/supabase'

function genOrderId() {
  return 'GS-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

/* ── Step indicator ── */
function StepBar({ current }) {
  const { t } = useTranslation()
  const STEPS = [t('checkout.step1'), t('checkout.step2'), t('checkout.step3')]

  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const idx    = i + 1
        const done   = idx < current
        const active = idx === current
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors"
                style={{
                  backgroundColor: done || active ? '#0056b3' : '#f0f0f0',
                  color:           done || active ? '#fff'     : '#aaa',
                }}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : idx}
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-wide"
                style={{ color: active ? '#0056b3' : done ? '#0056b3' : '#aaa' }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 mb-4 transition-colors"
                style={{ backgroundColor: done ? '#0056b3' : '#e0e0e0' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Field component ── */
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-ink uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}

const inputClass = (err) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-white ${
    err ? 'border-red-400' : 'border-border'
  }`

function Input({ error, ...props }) {
  return (
    <input
      className={inputClass(error)}
      onFocus={(e)  => { if (!error) e.target.style.borderColor = '#0056b3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,86,179,0.10)' }}
      onBlur={(e)   => { e.target.style.borderColor = error ? '#f87171' : '#e0e0e0'; e.target.style.boxShadow = 'none' }}
      {...props}
    />
  )
}

/* ── Order Summary sidebar ── */
function OrderSummary({ items, subtotal, shipping, vat, total, discount, coupon, couponInput, setCouponInput, couponError, onApply, onRemove }) {
  const { t } = useTranslation()
  const { formatPrice, parseUSD } = useCurrency()
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: '#e0e0e0', backgroundColor: '#fafafa' }}>
        <h3 className="text-sm font-black text-ink">{t('checkout.orderSummary')}</h3>
      </div>
      <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto">
        {items.map(({ product, qty }) => (
          <div key={product.id ?? product.title} className="flex items-center gap-3">
            <img
              src={product.image} alt={product.title}
              loading="lazy" onError={onImgError}
              className="w-12 h-12 rounded-xl object-cover shrink-0 bg-surface border"
              style={{ borderColor: '#e0e0e0' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-ink line-clamp-1">{product.title}</p>
              <p className="text-[11px] text-muted">{t('checkout.qty')} {qty}</p>
            </div>
            <span className="text-xs font-black shrink-0" style={{ color: '#0056b3' }}>
              {formatPrice(parseUSD(product.price) * qty)}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon input */}
      <div className="px-5 py-3 border-t" style={{ borderColor: '#e0e0e0' }}>
        {coupon ? (
          <div className="flex items-center justify-between rounded-xl px-3 py-2" style={{ backgroundColor: '#e9f7ed' }}>
            <div>
              <p className="text-xs font-black" style={{ color: '#1e8035' }}>🏷 {coupon.code}</p>
              <p className="text-[10px] text-muted">{t('checkout.couponApplied')}</p>
            </div>
            <button
              onClick={onRemove}
              className="text-xs font-bold transition-colors"
              style={{ color: '#ef4444' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#b91c1c' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#ef4444' }}
            >
              {t('checkout.removeCoupon')}
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && onApply()}
                placeholder={t('checkout.couponPlaceholder')}
                className="flex-1 min-w-0 border rounded-xl px-3 py-2 text-xs outline-none transition-colors font-bold tracking-wider"
                style={{ borderColor: couponError ? '#f87171' : '#e0e0e0' }}
                onFocus={e => { e.target.style.borderColor = '#0056b3' }}
                onBlur={e => { e.target.style.borderColor = couponError ? '#f87171' : '#e0e0e0' }}
              />
              <button
                onClick={onApply}
                className="px-3 py-2 rounded-xl text-xs font-black text-white shrink-0 transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#0056b3' }}
              >
                {t('checkout.apply')}
              </button>
            </div>
            {couponError && (
              <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{couponError}</p>
            )}
          </>
        )}
      </div>

      <div className="px-5 py-4 border-t space-y-2" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex justify-between text-sm text-muted">
          <span>{t('checkout.subtotal')}</span>
          <span className="text-ink font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted">
          <span>{t('checkout.shipping')}</span>
          <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-ink font-semibold'}>
            {shipping === 0 ? t('checkout.free') : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between text-sm" style={{ color: '#856404' }}>
          <span className="font-semibold">{t('checkout.vat')}</span>
          <span className="font-bold">{formatPrice(vat)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="font-semibold" style={{ color: '#1e8035' }}>{t('checkout.discount')}</span>
            <span className="font-bold" style={{ color: '#1e8035' }}>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="h-px" style={{ backgroundColor: '#e0e0e0' }} />
        <div className="flex justify-between">
          <div>
            <span className="text-sm font-black text-ink">{t('checkout.total')}</span>
            <p className="text-[10px] text-muted mt-0.5">{t('checkout.vatIncluded')}</p>
          </div>
          <span className="text-base font-black" style={{ color: '#0056b3' }}>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}

/* ── Step 1: Shipping ── */
function ShippingStep({ data, onChange, errors }) {
  const { t } = useTranslation()
  const field = (name) => ({
    value: data[name],
    error: errors[name],
    onChange: (e) => onChange(name, e.target.value),
  })

  const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Saudi Arabia', 'UAE', 'Other']

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-black tracking-[0.15em] uppercase mb-1" style={{ color: '#0056b3' }}>
          {t('checkout.contact')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t('checkout.firstName')} error={errors.firstName}>
            <Input placeholder="John" {...field('firstName')} />
          </Field>
          <Field label={t('checkout.lastName')} error={errors.lastName}>
            <Input placeholder="Doe" {...field('lastName')} />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Field label={t('checkout.email')} error={errors.email}>
            <Input placeholder="john@example.com" type="email" {...field('email')} />
          </Field>
          <Field label={t('checkout.phone')} error={errors.phone}>
            <Input placeholder="+966 5X XXX XXXX" type="tel" {...field('phone')} />
          </Field>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-black tracking-[0.15em] uppercase mb-1 mt-2" style={{ color: '#0056b3' }}>
          {t('checkout.shippingAddress')}
        </p>
        <div className="space-y-4">
          <Field label={t('checkout.address')} error={errors.address}>
            <Input placeholder="123 Main Street, Apt 4B" {...field('address')} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('checkout.city')} error={errors.city}>
              <Input placeholder="Riyadh" {...field('city')} />
            </Field>
            <Field label={t('checkout.stateProvince')} error={errors.state}>
              <Input placeholder="Riyadh Region" {...field('state')} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('checkout.zipCode')} error={errors.zip}>
              <Input placeholder="12345" {...field('zip')} />
            </Field>
            <Field label={t('checkout.country')} error={errors.country}>
              <select
                value={data.country}
                onChange={(e) => onChange('country', e.target.value)}
                className={inputClass(errors.country) + ' cursor-pointer'}
              >
                <option value="">{t('checkout.selectCountry')}</option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Step 2: Payment ── */
function PaymentStep({ data, onChange, errors }) {
  const { t } = useTranslation()

  function handleCardNumber(e) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim()
    onChange('cardNumber', formatted)
  }

  function handleExpiry(e) {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2)
    onChange('expiry', val)
  }

  return (
    <div className="space-y-5">
      <div
        className="rounded-2xl p-5 flex flex-col justify-between"
        style={{ background: 'linear-gradient(135deg, #0056b3 0%, #003375 100%)', minHeight: 160 }}
      >
        <div className="flex justify-between items-start">
          <svg className="w-10 h-10 opacity-70" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="white" fillOpacity="0.15" />
            <circle cx="15" cy="20" r="8" fill="white" fillOpacity="0.5" />
            <circle cx="25" cy="20" r="8" fill="white" fillOpacity="0.3" />
          </svg>
          <span className="text-white text-xs font-bold opacity-60 uppercase tracking-widest">{t('checkout.creditCard')}</span>
        </div>
        <div>
          <p className="text-white font-mono text-lg tracking-[0.2em] font-bold">
            {data.cardNumber
              ? data.cardNumber.padEnd(19, ' ').replace(/ /g, (_, i) => i > 0 && (i + 1) % 5 === 0 ? ' ' : (data.cardNumber[i] || '·'))
              : '·····  ·····  ·····  ·····'}
          </p>
          <div className="flex justify-between mt-3">
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">{t('checkout.cardholder')}</p>
              <p className="text-white text-sm font-bold">{data.cardName || 'FULL NAME'}</p>
            </div>
            <div className="text-end">
              <p className="text-white/50 text-[10px] uppercase tracking-widest">{t('checkout.expires')}</p>
              <p className="text-white text-sm font-bold">{data.expiry || 'MM/YY'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Field label={t('checkout.cardholderName')} error={errors.cardName}>
          <Input
            placeholder="John Doe"
            value={data.cardName}
            error={errors.cardName}
            onChange={(e) => onChange('cardName', e.target.value.toUpperCase())}
          />
        </Field>
        <Field label={t('checkout.cardNumber')} error={errors.cardNumber}>
          <Input
            placeholder="0000 0000 0000 0000"
            value={data.cardNumber}
            error={errors.cardNumber}
            onChange={handleCardNumber}
            maxLength={19}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('checkout.expiry')} error={errors.expiry}>
            <Input
              placeholder="MM/YY"
              value={data.expiry}
              error={errors.expiry}
              onChange={handleExpiry}
              maxLength={5}
            />
          </Field>
          <Field label={t('checkout.cvv')} error={errors.cvv}>
            <Input
              placeholder="•••"
              value={data.cvv}
              error={errors.cvv}
              onChange={(e) => onChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
            />
          </Field>
        </div>
      </div>

      <div
        className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-medium text-muted"
        style={{ backgroundColor: '#f8fafc', border: '1px solid #e0e0e0' }}
      >
        <svg className="w-4 h-4 shrink-0" style={{ color: '#28a745' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {t('checkout.securityNote')}
      </div>
    </div>
  )
}

/* ── Step 3: Confirmed ── */
function ConfirmedStep({ orderId, shipping, items }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { clearCart } = useCart()

  function handleContinue() {
    clearCart()
    navigate('/')
  }

  return (
    <div className="text-center py-6 flex flex-col items-center gap-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#e9f7ed' }}
      >
        <svg className="w-10 h-10" fill="none" stroke="#1e8035" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </motion.div>

      <div>
        <h2 className="text-2xl font-black text-ink">{t('checkout.orderConfirmed')}</h2>
        <p
          className="text-muted text-sm mt-2"
          dangerouslySetInnerHTML={{ __html: t('checkout.thankYou', { name: shipping.firstName }) }}
        />
      </div>

      <div
        className="w-full rounded-2xl px-6 py-4 text-start"
        style={{ backgroundColor: '#f8fafc', border: '1px solid #e0e0e0' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-widest text-muted">{t('checkout.orderId')}</span>
          <span className="text-sm font-black" style={{ color: '#0056b3' }}>{orderId}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-widest text-muted">{t('checkout.shipTo')}</span>
          <span className="text-sm font-semibold text-ink text-end max-w-[60%] leading-snug">
            {shipping.address}, {shipping.city}, {shipping.country}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-muted">{t('checkout.estDelivery')}</span>
          <span className="text-sm font-semibold text-ink">{t('checkout.deliveryTime')}</span>
        </div>
      </div>

      <div className="w-full space-y-2">
        {items.map(({ product, qty }) => (
          <div key={product.id ?? product.title} className="flex items-center gap-3">
            <img src={product.image} alt={product.title} loading="lazy" onError={onImgError} className="w-10 h-10 rounded-xl object-cover shrink-0 bg-surface" />
            <p className="text-xs font-semibold text-ink flex-1 text-start line-clamp-1">{product.title}</p>
            <span className="text-xs text-muted shrink-0">×{qty}</span>
          </div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleContinue}
        className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-colors"
        style={{ backgroundColor: '#0056b3' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
      >
        {t('checkout.continueShopping')}
      </motion.button>
    </div>
  )
}

/* ── Coupon codes ── */
const COUPONS = {
  GAMING10:  { type: 'percent',  value: 10 },
  SAVE50:    { type: 'flat',     value: 50 },
  WELCOME15: { type: 'percent',  value: 15 },
  FREESHIP:  { type: 'shipping', value: 0  },
  VIP20:     { type: 'percent',  value: 20 },
}

function calcDiscount(coupon, subtotal, shipping) {
  if (!coupon) return { discount: 0, freeShipping: false }
  if (coupon.type === 'percent')  return { discount: subtotal * coupon.value / 100, freeShipping: false }
  if (coupon.type === 'flat')     return { discount: Math.min(coupon.value, subtotal), freeShipping: false }
  if (coupon.type === 'shipping') return { discount: shipping, freeShipping: true }
  return { discount: 0, freeShipping: false }
}

/* ── Main CheckoutPage ── */
const SHIPPING_INIT = { firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: '' }
const PAYMENT_INIT  = { cardName: '', cardNumber: '', expiry: '', cvv: '' }

export default function CheckoutPage() {
  const { t } = useTranslation()
  const { items, total, setIsOpen } = useCart()
  const { formatPrice } = useCurrency()
  const { isAuthenticated, loading: authLoading, signInWithGoogle, signInWithApple, user } = useAuth()
  const navigate = useNavigate()

  const [searchParams]          = useSearchParams()
  const step                    = Math.min(Math.max(parseInt(searchParams.get('step') || '1', 10), 1), 3)
  usePageTitle(t(`checkout.step${step}`))
  const [shipping, setShipping] = useState(SHIPPING_INIT)
  const [payment, setPayment]   = useState(PAYMENT_INIT)
  const [errors, setErrors]     = useState({})
  const [orderId]               = useState(genOrderId)
  const [placing, setPlacing]   = useState(false)

  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponInput, setCouponInput]     = useState('')
  const [couponError, setCouponError]     = useState('')

  useEffect(() => {
    if (step > 1 && !shipping.firstName.trim()) {
      navigate('/checkout', { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const subtotal                    = total
  const shippingCost                = subtotal >= 199 ? 0 : 15
  const { discount, freeShipping }  = calcDiscount(appliedCoupon, subtotal, shippingCost)
  const effectiveShipping           = freeShipping ? 0 : shippingCost
  const vat                         = subtotal * 0.15
  const grandTotal                  = subtotal + effectiveShipping + vat - discount

  function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase()
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] })
      setCouponError('')
    } else {
      setCouponError(t('checkout.couponInvalid'))
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponError('')
  }

  function validateShipping() {
    const e = {}
    if (!shipping.firstName.trim()) e.firstName = t('checkout.errRequired')
    if (!shipping.lastName.trim())  e.lastName  = t('checkout.errRequired')
    if (!shipping.email.trim())     e.email     = t('checkout.errRequired')
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(shipping.email)) e.email = t('checkout.errEmail')
    if (!shipping.phone.trim())     e.phone     = t('checkout.errRequired')
    if (!shipping.address.trim())   e.address   = t('checkout.errRequired')
    if (!shipping.city.trim())      e.city      = t('checkout.errRequired')
    if (!shipping.state.trim())     e.state     = t('checkout.errRequired')
    if (!shipping.zip.trim())       e.zip       = t('checkout.errRequired')
    if (!shipping.country)          e.country   = t('checkout.errRequired')
    return e
  }

  function validatePayment() {
    const e = {}
    if (!payment.cardName.trim())  e.cardName   = t('checkout.errRequired')
    const digits = payment.cardNumber.replace(/\s/g, '')
    if (!digits)                   e.cardNumber = t('checkout.errRequired')
    else if (digits.length < 16)   e.cardNumber = t('checkout.errCard16')
    if (!payment.expiry)           e.expiry     = t('checkout.errRequired')
    else if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) e.expiry = t('checkout.errExpiryFormat')
    if (!payment.cvv)              e.cvv        = t('checkout.errRequired')
    else if (payment.cvv.length < 3) e.cvv      = t('checkout.errCvvMin')
    return e
  }

  function handleShippingNext() {
    const e = validateShipping()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    navigate('/checkout?step=2')
  }

  async function handlePlaceOrder() {
    const e = validatePayment()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setPlacing(true)

    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 1500))

    // Save order to Supabase
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          order_number: orderId,
          status: 'paid',
          total: grandTotal,
          subtotal,
          shipping: effectiveShipping,
          vat,
          discount,
          coupon_code: appliedCoupon?.code ?? null,
          shipping_address: shipping,
        })
        .select()
        .single()

      if (!orderError && order) {
        const orderItems = items.map(({ product, qty }) => ({
          order_id: order.id,
          product_id: String(product.id ?? ''),
          title: product.title,
          price: product.price,
          qty,
          image: product.image ?? null,
        }))
        await supabase.from('order_items').insert(orderItems)
      }
    } catch {
      // Supabase save failed silently — still show confirmation
    }

    setPlacing(false)
    navigate('/checkout?step=3', { replace: true })
  }

  /* ── Auth gate ── */
  if (authLoading) {
    return (
      <div className="pt-36 lg:pt-44 min-h-screen flex items-center justify-center">
        <div className="w-9 h-9 rounded-full border-[3px] animate-spin" style={{ borderColor: '#0056b3', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-36 lg:pt-44 min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f8fafc' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-sm border overflow-hidden"
          style={{ borderColor: '#e0e0e0' }}
        >
          <div className="px-6 py-5 border-b text-center" style={{ borderColor: '#e0e0e0', backgroundColor: '#fafafa' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mx-auto mb-2" style={{ backgroundColor: '#e6f0fa' }}>🔒</div>
            <h2 className="text-sm font-black text-ink">{t('checkout.signInRequired')}</h2>
            <p className="text-xs text-muted mt-0.5">{t('checkout.signInRequiredSub')}</p>
          </div>
          <div className="p-5 space-y-3">
            <button onClick={signInWithGoogle}
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl border text-sm font-bold text-ink hover:bg-gray-50 transition-colors"
              style={{ borderColor: '#e0e0e0' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              {t('account.continueWithGoogle')}
            </button>
            <button onClick={signInWithApple}
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl border text-sm font-bold text-ink hover:bg-gray-50 transition-colors"
              style={{ borderColor: '#e0e0e0' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              {t('account.continueWithApple')}
            </button>
            <div className="text-center">
              <Link to="/account" className="text-xs font-bold" style={{ color: '#0056b3' }}>
                {t('checkout.useEmailInstead')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0 && step !== 3) {
    return (
      <div className="pt-36 lg:pt-44 min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center px-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: '#e6f0fa' }}>
          🛒
        </div>
        <div>
          <h1 className="text-xl font-black text-ink">{t('checkout.emptyCart')}</h1>
          <p className="text-sm text-muted mt-1">{t('checkout.emptyCartSub')}</p>
        </div>
        <Link to="/" className="px-8 py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: '#0056b3' }}>
          {t('checkout.browseProducts')}
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-36 lg:pt-44 min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="border-b bg-white" style={{ borderColor: '#e0e0e0' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-muted font-medium">
          <Link to="/" className="hover:text-ink transition-colors">{t('checkout.home')}</Link>
          <span className="text-gray-300">›</span>
          <Link to="/" onClick={() => setIsOpen(true)} className="hover:text-ink transition-colors">{t('nav.cart')}</Link>
          <span className="text-gray-300">›</span>
          <span className="text-ink">{t('checkout.step2').replace('Payment', t('checkout.step1') === 'Shipping' ? 'Checkout' : 'الدفع')}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          <motion.div
            key={step}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl border p-6 sm:p-8"
            style={{ borderColor: '#e0e0e0' }}
          >
            <StepBar current={step} />

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="shipping" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <h2 className="text-lg font-black text-ink mb-6">{t('checkout.shippingInfo')}</h2>
                  <ShippingStep
                    data={shipping}
                    onChange={(k, v) => { setShipping(s => ({ ...s, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }}
                    errors={errors}
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleShippingNext}
                    className="mt-8 w-full py-3.5 rounded-xl text-sm font-black text-white transition-colors"
                    style={{ backgroundColor: '#0056b3' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#004494' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
                  >
                    {t('checkout.continueToPayment')}
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-ink">{t('checkout.step2')}</h2>
                    <button
                      onClick={() => { setErrors({}); navigate('/checkout') }}
                      className="text-xs font-bold transition-colors"
                      style={{ color: '#0056b3' }}
                    >
                      {t('checkout.editShipping')}
                    </button>
                  </div>
                  <PaymentStep
                    data={payment}
                    onChange={(k, v) => { setPayment(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }}
                    errors={errors}
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="mt-8 w-full py-3.5 rounded-xl text-sm font-black text-white transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#0056b3' }}
                    onMouseEnter={(e) => { if (!placing) e.currentTarget.style.backgroundColor = '#004494' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0056b3' }}
                  >
                    {placing ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('checkout.processing')}
                      </>
                    ) : (
                      t('checkout.placeOrder', { amount: formatPrice(grandTotal) })
                    )}
                  </motion.button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="confirmed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <ConfirmedStep orderId={orderId} shipping={shipping} items={items} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {step < 3 && (
            <div className="lg:sticky lg:top-28">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shipping={effectiveShipping}
                vat={vat}
                total={grandTotal}
                discount={discount}
                coupon={appliedCoupon}
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                couponError={couponError}
                onApply={handleApplyCoupon}
                onRemove={handleRemoveCoupon}
              />
              {subtotal < 199 && !freeShipping && (
                <p
                  className="mt-3 text-xs text-center text-muted"
                  dangerouslySetInnerHTML={{ __html: t('checkout.addMoreFreeShipping', { amount: formatPrice(199 - subtotal) }) }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
