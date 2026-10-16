import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useProducts } from '../../context/ProductContext'

const Reminder = () => {
  const { cart, cartCount, isCartOpen } = useProducts()
  const location = useLocation()

  const pillRef = useRef(null)
  const buttonRef = useRef(null)
  const wiggleTlRef = useRef(null)

  // Get the most recently added item in the cart
  const latestItem = cart.length > 0 ? cart[cart.length - 1] : null
  const product = latestItem?.product

  const shouldRender =
    cart.length > 0 &&
    location.pathname !== '/checkout' &&
    Boolean(product)

  // GSAP animation for springy button wiggle
  useEffect(() => {
    if (!shouldRender || !buttonRef.current) return

    const ctx = gsap.context(() => {
      // Springy left-right wiggle animation on the CHECKOUT button
      wiggleTlRef.current = gsap.timeline({
        repeat: -1,
        repeatDelay: 2.2,
        delay: 0.8,
      })

      wiggleTlRef.current
        .to(buttonRef.current, { x: -8, duration: 0.1, ease: 'power2.out' })
        .to(buttonRef.current, { x: 8, duration: 0.12, ease: 'power2.inOut' })
        .to(buttonRef.current, { x: -5, duration: 0.1, ease: 'power2.inOut' })
        .to(buttonRef.current, { x: 5, duration: 0.1, ease: 'power2.inOut' })
        .to(buttonRef.current, { x: -2, duration: 0.08, ease: 'power2.inOut' })
        .to(buttonRef.current, {
          x: 0,
          duration: 0.35,
          ease: 'elastic.out(1.2, 0.4)',
        })
    })

    return () => ctx.revert()
  }, [shouldRender, product?.id])

  // GSAP animation for sliding down with low opacity when cart sidebar is opened
  useEffect(() => {
    if (!pillRef.current) return

    if (isCartOpen) {
      // Auto go down with low opacity when sidebar is opened
      gsap.to(pillRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.92,
        duration: 0.35,
        ease: 'power2.in',
        pointerEvents: 'none',
        overwrite: 'auto',
      })
      wiggleTlRef.current?.pause()
    } else if (shouldRender) {
      // Return to normal centered position
      gsap.to(pillRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.4)',
        pointerEvents: 'auto',
        overwrite: 'auto',
      })
      wiggleTlRef.current?.resume()
    }
  }, [isCartOpen, shouldRender])

  if (!shouldRender || !product) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-6 z-[55] flex justify-center pointer-events-none px-4">
      <div
        ref={pillRef}
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex w-fit max-w-[94vw] select-none items-center gap-3.5 rounded-full border border-slate-100 bg-white p-2 pl-2.5 pr-2.5 shadow-[0_14px_45px_rgba(0,0,0,0.18)] will-change-transform sm:gap-4 sm:pl-3 sm:pr-3"
      >
        {/* Product Circular Thumbnail */}
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-200/70 bg-slate-50 p-0.5 sm:h-12 sm:w-12">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full rounded-full object-cover"
          />
        </div>

        {/* Info Column */}
        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-[11px]">
            IN YOUR CART
          </span>
          <div className="flex items-center gap-1.5">
            <p
              title={product.title}
              className="max-w-[130px] truncate text-xs font-bold text-slate-900 sm:max-w-[210px] sm:text-sm"
            >
              {product.title}
            </p>
            {cartCount > 1 && (
              <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-500">
                +{cartCount - 1}
              </span>
            )}
          </div>
        </div>

        {/* Springy Animated Checkout Button in TFiPro Primary Color Scheme */}
        <Link
          to="/checkout"
          ref={buttonRef}
          className="inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-[#002842] hover:shadow-xl active:scale-95 will-change-transform"
        >
          CHECKOUT
        </Link>
      </div>
    </div>
  )
}

export default Reminder
