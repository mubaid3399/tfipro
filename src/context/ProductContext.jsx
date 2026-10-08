/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react'
import { products as initialProducts } from '../data/products'

export const ProductContext = createContext(null)

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts)
  const [cart, setCart] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevCart, { product, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setCart([])

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  )

  const cartTotal = useMemo(
    () =>
      cart.reduce((total, item) => {
        const price = item.product.discountedPrice ?? item.product.actualPrice ?? 0
        return total + price * item.quantity
      }, 0),
    [cart]
  )

  const getProductById = (id) => {
    return products.find((p) => p.id === id)
  }

  const earbuds = useMemo(
    () => products.filter((p) => p.id.startsWith('earbud')),
    [products]
  )

  const headphones = useMemo(
    () => products.filter((p) => p.id.startsWith('headphone')),
    [products]
  )

  const bags = useMemo(
    () => products.filter((p) => p.id.startsWith('bag')),
    [products]
  )

  const microphones = useMemo(
    () => products.filter((p) => p.id.startsWith('microphone')),
    [products]
  )

  const accessories = useMemo(
    () => products.filter((p) => p.id.startsWith('accessory')),
    [products]
  )

  const value = {
    products,
    setProducts,
    getProductById,
    earbuds,
    headphones,
    bags,
    microphones,
    accessories,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    searchQuery,
    setSearchQuery,
    currency: 'Rs.',
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export default ProductProvider
