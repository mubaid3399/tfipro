import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext'
import OfferBar from './components/common/OfferBar'
import Navbar from './components/common/Navbar'
import About from './pages/About'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductsDetail from './pages/ProductsDetail'

const App = () => {
  return (
    <ProductProvider>
      <BrowserRouter>
        <OfferBar />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:Id" element={<ProductsDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProductProvider>
  )
}

export default App