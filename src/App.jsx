import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
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
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import WishlistPage from './pages/WishlistPage'
import BuilderPage from './pages/BuilderPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

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

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <WishlistProvider>
        <CartProvider>
          <div className="min-h-screen bg-white text-ink">
            <ScrollToTop />
            <Navbar />
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/builder" element={<BuilderPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ErrorBoundary>
            <Footer />
            <CartDrawer />
            <ToastContainer />
            <BackToTop />
          </div>
        </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
