import { useState, useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'

const FloatingCartButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { cartCount, setIsCartOpen, isCartOpen } = useProducts()
  const location = useLocation()

  // Track scroll position past the navbar
  useEffect(() => {
    const handleScroll = () => {
      // Navbar height (OfferBar + TopNav + Desktop LowerNav) is ~110px.
      // Show when the user scrolls past the navbar.
      const pastNavbar = window.scrollY > 110
      setIsVisible(pastNavbar)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hide when cart drawer is already open or on checkout page
  if (isCartOpen || location.pathname === '/checkout') {
    return null
  }

  // Lift the button on mobile screen above the reminder pill when items are in cart
  const isReminderActive = cartCount > 0

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      aria-label={`Open shopping cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
      className={`group fixed right-5 z-[60] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-110 hover:bg-slate-900 hover:shadow-2xl active:scale-95 sm:bottom-8 sm:right-8 ${
        isReminderActive ? 'bottom-[92px]' : 'bottom-6'
      } ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-8 opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative flex items-center justify-center">
        <ShoppingBag
          size={24}
          strokeWidth={2}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        {cartCount > 0 && (
          <span className="absolute -right-3 -top-3.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white shadow-md ring-2 ring-white">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </div>
    </button>
  )
}

export default FloatingCartButton
