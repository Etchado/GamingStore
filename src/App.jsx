import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
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
import './App.css'

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <div className="min-h-screen bg-white text-ink">
          <Navbar />
          <main>
            <HeroSection />
            <TrustBar />
            <CategoryShowcase />
            <ProductGrid />
            <Testimonials />
          </main>
          <Footer />
          <CartDrawer />
          <ToastContainer />
          <BackToTop />
        </div>
      </CartProvider>
    </ToastProvider>
  )
}

export default App
