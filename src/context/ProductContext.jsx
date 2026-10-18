/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { products as initialProducts } from '../data/products'
import ToastNotification from '../components/common/ToastNotification'

export const ProductContext = createContext(null)

const CART_STORAGE_KEY = 'tfipro_cart'

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts)
  
  // Initialize cart from localStorage so items persist on reload
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.warn('Could not load cart from localStorage:', e)
      return []
    }
  })

  // Automatically sync cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (e) {
      console.warn('Could not save cart to localStorage:', e)
    }
  }, [cart])

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [isToastVisible, setIsToastVisible] = useState(false)

  const showToast = (message = 'Item added to your bag') => {
    setToastMessage(message)
    setIsToastVisible(false)
    setTimeout(() => {
      setIsToastVisible(true)
    }, 20)
  }

  const addToCart = (product, quantity = 1, selectedColor = null, selectedImage = null) => {
    // Clear any previous order confirmation receipt so user can checkout new items
    try {
      sessionStorage.removeItem('tfipro_last_completed_order')
    } catch {
      // Ignore
    }

    const resolvedColor =
      selectedColor ||
      product.selectedColor ||
      (product.colors && product.colors.length > 0 ? product.colors[0].name : null)
    const cartItemId = resolvedColor ? `${product.id}-${resolvedColor}` : product.id
    const resolvedImage =
      selectedImage ||
      (resolvedColor && product.colors?.find((c) => c.name === resolvedColor)?.image) ||
      product.image

    const itemProduct = {
      ...product,
      id: cartItemId,
      baseId: product.baseId || product.id,
      selectedColor: resolvedColor,
      image: resolvedImage,
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === cartItemId)
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity, selectedColor: resolvedColor, color: resolvedColor }
            : item
        )
      }
      return [...prevCart, { product: itemProduct, quantity, selectedColor: resolvedColor, color: resolvedColor }]
    })

    const colorMsg = resolvedColor ? ` (${resolvedColor})` : ''
    showToast(`Added ${product.title}${colorMsg} to your bag`)
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

  const clearCart = () => {
    setCart([])
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch {
      // Ignore
    }
  }

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
    if (!id) return null
    return (
      products.find(
        (p) =>
          p.id === id ||
          p.legacyId === id ||
          p.id.toLowerCase() === id.toLowerCase() ||
          (p.legacyId && p.legacyId.toLowerCase() === id.toLowerCase())
      ) || null
    )
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
    () => products.filter((p) => p.id.startsWith('accessory') || p.id.startsWith('stand')),
    [products]
  )

  const watches = useMemo(
    () => products.filter((p) => p.id.startsWith('watch')),
    [products]
  )

  const stands = useMemo(
    () => products.filter((p) => p.id.startsWith('stand')),
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
    watches,
    stands,
    showToast,


    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    currency: 'Rs.',
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
      <ToastNotification 
        message={toastMessage} 
        isVisible={isToastVisible} 
        onHide={() => setIsToastVisible(false)} 
      />
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
