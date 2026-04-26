import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { WishlistProvider } from './context/WishlistContext'
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
import AnnouncementBar from './components/AnnouncementBar'
import './App.css'

const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CheckoutPage      = lazy(() => import('./pages/CheckoutPage'))
const WishlistPage      = lazy(() => import('./pages/WishlistPage'))
const BuilderPage       = lazy(() => import('./pages/BuilderPage'))
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'))

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
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <CategoryShowcase />
      <ProductGrid />
      <Testimonials />
    </main>
  )
}

function AppShell() {
  const { i18n } = useTranslation()
  const isAr = i18n.language?.startsWith('ar')

  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr'
    document.documentElement.lang = isAr ? 'ar' : 'en'
  }, [isAr])

  return (
    <div className="min-h-screen bg-white text-ink">
      <ScrollToTop />
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
      <CartDrawer />
      <ToastContainer />
      <BackToTop />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <AppShell />
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
