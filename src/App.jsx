import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSEO } from './hooks/useSEO'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { WishlistProvider } from './context/WishlistContext'
import { CompareProvider } from './context/CompareContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'
import { ProductsProvider } from './context/ProductsContext'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import TrustBar from './components/TrustBar'
import CategoryShowcase from './components/CategoryShowcase'
import ProductGrid from './components/ProductGrid'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ToastContainer from './components/ToastContainer'
import BackToTop from './components/BackToTop'
import ErrorBoundary from './components/ErrorBoundary'
import NewsletterSection from './components/NewsletterSection'
import StatsSection from './components/StatsSection'
import BrandsMarquee from './components/BrandsMarquee'
import ScrollProgressBar from './components/ScrollProgressBar'
import AnnouncementBar from './components/AnnouncementBar'
import CompareBar from './components/CompareBar'
import CompareModal from './components/CompareModal'
import WhatsAppButton from './components/WhatsAppButton'
import CookieBanner from './components/CookieBanner'
import './App.css'

const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CheckoutPage      = lazy(() => import('./pages/CheckoutPage'))
const WishlistPage      = lazy(() => import('./pages/WishlistPage'))
const BuilderPage       = lazy(() => import('./pages/BuilderPage'))
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'))
const AccountPage       = lazy(() => import('./pages/AccountPage'))
const SupportPage       = lazy(() => import('./pages/SupportPage'))
const DealsPage         = lazy(() => import('./pages/DealsPage'))
const AboutPage         = lazy(() => import('./pages/AboutPage'))

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: '#0056b3', borderTopColor: 'transparent' }}
      />
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function HomePage() {
  const { t } = useTranslation()
  useSEO({ title: t('pages.home'), description: t('newsletter.sub') })
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <BrandsMarquee />
      <StatsSection />
      <CategoryShowcase />
      <ProductGrid />
      <Testimonials />
      <NewsletterSection />
    </main>
  )
}

function AuthLoadingGate({ children }) {
  const { loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-9 h-9 rounded-full border-[3px] animate-spin"
          style={{ borderColor: '#0056b3', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }
  return children
}

function AppShell() {
  const { i18n } = useTranslation()
  const { pathname } = useLocation()
  const isAr = i18n.language?.startsWith('ar')
  const [compareOpen, setCompareOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr'
    document.documentElement.lang = isAr ? 'ar' : 'en'
  }, [isAr])

  return (
    <div className="min-h-screen bg-white text-ink">
      <ScrollProgressBar />
      <ScrollToTop />
      <Navbar />
      <AuthLoadingGate>
      <ErrorBoundary key={pathname}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/about"   element={<AboutPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/faq"          element={<SupportPage />} />
            <Route path="/contact"      element={<SupportPage />} />
            <Route path="/returns"      element={<SupportPage />} />
            <Route path="/track-order"  element={<SupportPage />} />
            <Route path="/live-chat"    element={<SupportPage />} />
            <Route path="/builder-guide" element={<SupportPage />} />
            <Route path="/warranty"     element={<SupportPage />} />
            <Route path="/locations"    element={<SupportPage />} />
            <Route path="/privacy"      element={<SupportPage />} />
            <Route path="/terms"        element={<SupportPage />} />
            <Route path="/cookies"      element={<SupportPage />} />
            <Route path="/deals"        element={<DealsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
      <CartDrawer />
      <ToastContainer />
      <BackToTop />
      <WhatsAppButton />
      <CookieBanner />
      <CompareBar onOpen={() => setCompareOpen(true)} />
      <CompareModal isOpen={compareOpen} onClose={() => setCompareOpen(false)} />
      </AuthLoadingGate>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>
        <CurrencyProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <CompareProvider>
                  <AppShell />
                </CompareProvider>
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </CurrencyProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
