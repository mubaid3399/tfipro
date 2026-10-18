import { useLayoutEffect, useRef } from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useProducts } from '../../context/ProductContext'

const CartSidebar = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, currency, isCartOpen, setIsCartOpen } = useProducts()
  const sidebarRef = useRef(null)
  const overlayRef = useRef(null)

  useLayoutEffect(() => {
    if (sidebarRef.current && overlayRef.current) {
      gsap.set(sidebarRef.current, { xPercent: 100 })
      gsap.set(overlayRef.current, { autoAlpha: 0 })
    }
  }, [])

  useLayoutEffect(() => {
    const sidebar = sidebarRef.current
    const overlay = overlayRef.current
    if (!sidebar || !overlay) return

    if (isCartOpen) {
      gsap.to(overlay, { autoAlpha: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
      gsap.to(sidebar, { xPercent: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
    } else {
      gsap.to(overlay, { autoAlpha: 0, duration: 0.3, ease: 'power2.in', overwrite: 'auto' })
      gsap.to(sidebar, { xPercent: 100, duration: 0.4, ease: 'power3.in', overwrite: 'auto' })
    }
  }, [isCartOpen])

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
        aria-hidden={!isCartOpen}
        style={{ visibility: 'hidden', opacity: 0 }}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed right-0 top-0 z-[80] flex h-[100dvh] w-[90vw] max-w-[400px] flex-col bg-white shadow-2xl"
        aria-hidden={!isCartOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <ShoppingBag size={20} className="text-primary" />
            Your Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-500">
              <ShoppingBag size={48} strokeWidth={1} className="mb-4 text-slate-300" />
              <p className="text-lg font-medium text-slate-700">Your cart is empty</p>
              <p className="text-sm">Looks like you haven't added anything yet.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {cart.map((item) => {
                const { product, quantity } = item
                const price = product.discountedPrice ?? product.actualPrice ?? 0
                return (
                  <li key={product.id} className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-20 w-20 shrink-0 rounded-lg bg-slate-50 object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
                          {product.title}
                        </h3>
                        {product.selectedColor && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            Color: <span className="font-semibold text-slate-700">{product.selectedColor}</span>
                          </p>
                        )}
                        <p className="mt-1 text-sm font-bold text-primary">
                          {currency}{price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-2 py-1">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="text-slate-500 hover:text-primary"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-[1rem] text-center text-sm font-medium text-slate-700">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="text-slate-500 hover:text-primary"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="rounded p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Remove ${product.title} from cart`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50 p-6">
            <div className="mb-4 flex items-center justify-between text-base font-bold text-slate-800">
              <span>Subtotal</span>
              <span>{currency}{cartTotal.toLocaleString()}</span>
            </div>
            <p className="mb-4 text-xs text-slate-500">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default CartSidebar
