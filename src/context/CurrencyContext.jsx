import { createContext, useContext, useState } from 'react'

export const CURRENCIES = [
  { code: 'BHD', label: 'Bahrain',     ar: 'البحرين',  symbol: 'BHD', rate: 0.377 },
  { code: 'JOD', label: 'Jordan',      ar: 'الاردن',   symbol: 'JOD', rate: 0.710 },
  { code: 'SAR', label: 'KSA',         ar: 'السعودية', symbol: 'SAR', rate: 3.750 },
  { code: 'KWD', label: 'Kuwait',      ar: 'الكويت',   symbol: 'KWD', rate: 0.307 },
  { code: 'OMR', label: 'Oman',        ar: 'عمان',     symbol: 'OMR', rate: 0.385 },
  { code: 'QAR', label: 'Qatar Riyal', ar: 'قطر',      symbol: 'QAR', rate: 3.640 },
  { code: 'AED', label: 'UAE',         ar: 'الامارات', symbol: 'AED', rate: 3.670 },
  { code: 'USD', label: 'Dollar',      ar: 'الدولار',  symbol: '$',   rate: 1.000 },
]

const CurrencyContext = createContext()

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(CURRENCIES.find(c => c.code === 'SAR'))

  // Parse "$1,299" or 1299 → raw USD number
  function parseUSD(price) {
    return parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0
  }

  // Convert a USD amount to the selected currency, formatted as "SAR 4,871"
  function formatPrice(usdAmount) {
    const converted = usdAmount * currency.rate
    const formatted = converted.toLocaleString('en-US', { maximumFractionDigits: 0 })
    return `${currency.symbol} ${formatted}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, parseUSD, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
