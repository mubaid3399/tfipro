import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext'
import OfferBar from './components/common/OfferBar'
import Navbar from './components/common/Navbar'
import About from './pages/About'
import CartSidebar from './components/common/CartSidebar'
import Footer from './components/common/Footer'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductsDetail from './pages/ProductsDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import ShippingPolicy from './pages/ShippingPolicy'
import FloatingCartButton from './components/common/FloatingCartButton'
import FlootWhatsapp from './components/common/FlootWhatsapp'
import Reminder from './components/common/Reminder'
import TopToScroll from './components/common/TopToScroll'

const App = () => {
  return (
    <ProductProvider>
      <BrowserRouter>
        <TopToScroll />
        <OfferBar />
        <Navbar />
        <CartSidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:Id" element={<ProductsDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FloatingCartButton />
        <FlootWhatsapp />
        <Reminder />
        <Footer />
      </BrowserRouter>
    </ProductProvider>
  )
}

export default App