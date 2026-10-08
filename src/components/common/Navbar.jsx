import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import gsap from 'gsap'
import { Link, NavLink } from 'react-router-dom'
import { asset } from '../../assets/asset'
import { useProducts } from '../../context/ProductContext'

const navItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Products', to: '/products' },
  { label: 'About us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const Navbar = () => {
  const { cartCount } = useProducts()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const mobileMenuRef = useRef(null)
  const menuTweenRef = useRef(null)
  const lowerNavRef = useRef(null)
  const isStickyRef = useRef(false)

  useEffect(() => {
    const el = lowerNavRef.current
    if (!el) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const handleScroll = () => {
      const scrollY = window.scrollY
      const threshold = 85

      if (scrollY > threshold && !isStickyRef.current) {
        isStickyRef.current = true
        if (!reduceMotion) {
          gsap.fromTo(
            el,
            {
              yPercent: -100,
              boxShadow: '0 0 0 rgba(0,0,0,0)',
            },
            {
              yPercent: 0,
              boxShadow: '0 10px 25px -5px rgba(0, 26, 46, 0.45)',
              duration: 0.4,
              ease: 'power3.out',
              overwrite: 'auto',
            }
          )
        } else {
          gsap.set(el, { yPercent: 0, boxShadow: '0 10px 25px -5px rgba(0, 26, 46, 0.45)' })
        }
      } else if (scrollY <= threshold && isStickyRef.current) {
        isStickyRef.current = false
        if (!reduceMotion) {
          gsap.to(el, {
            yPercent: 0,
            boxShadow: '0 0 0 rgba(0,0,0,0)',
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        } else {
          gsap.set(el, { yPercent: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      gsap.killTweensOf(el)
    }
  }, [])

  useLayoutEffect(() => {
    if (!menuMounted || !menuOpen || !mobileMenuRef.current) return undefined

    menuTweenRef.current?.kill()
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reduceMotion) {
      gsap.set(mobileMenuRef.current, { xPercent: 0 })
    } else {
      menuTweenRef.current = gsap.fromTo(
        mobileMenuRef.current,
        { xPercent: -105 },
        {
          xPercent: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.55)',
        }
      )
    }

    return () => menuTweenRef.current?.kill()
  }, [menuMounted, menuOpen])

  const toggleMenu = () => {
    if (menuOpen) {
      menuTweenRef.current?.kill()
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (!mobileMenuRef.current || reduceMotion) {
        setMenuOpen(false)
        setMenuMounted(false)
        return
      }

      menuTweenRef.current = gsap.to(mobileMenuRef.current, {
        xPercent: -105,
        duration: 1.1,
        ease: 'elastic.in(1, 0.55)',
        onComplete: () => {
          setMenuOpen(false)
          setMenuMounted(false)
        },
      })
      return
    }

    setMenuMounted(true)
    setMenuOpen(true)
  }

  return (
    <>
      <nav className="bg-transparent text-primary" aria-label="Main navigation">
        <div className="mx-auto grid h-16 w-[90%] grid-cols-3 items-center md:h-20">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-links"
            onClick={toggleMenu}
          >
            <span className="relative block h-6 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${
                  menuOpen ? 'top-3 rotate-45' : 'top-[5px]'
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-px w-4 bg-current transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${
                  menuOpen ? 'top-3 -rotate-45' : 'top-[19px]'
                }`}
              />
            </span>
          </button>

          <Link
            to="/"
            className="col-start-2 flex items-center justify-center md:col-start-1 md:justify-start"
            aria-label="TFiPro home"
          >
            <img src={asset.favicon} alt="TFiPro" className="h-10 w-10 object-contain md:hidden" />
            <img
              src={asset.logo}
              alt="TFiPro"
              className="hidden h-14 w-32 object-contain sm:w-40 md:block"
            />
          </Link>

          <Link
            to="/cart"
            className="relative col-start-3 justify-self-end rounded-full p-2 transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            aria-label={`Shopping bag${cartCount > 0 ? `, ${cartCount} items` : ''}`}
          >
            <ShoppingBag size={25} strokeWidth={1.8} aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <nav
        ref={lowerNavRef}
        className="sticky top-0 z-40 bg-primary/95 text-white backdrop-blur-md will-change-transform"
        aria-label="Main site navigation"
      >
        <div
          id="desktop-site-links"
          className="mx-auto hidden min-h-12 w-[90%] items-center justify-center gap-8 md:flex"
        >
          {navItems.map(({ label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'relative inline-flex min-h-11 items-center px-3 text-sm font-semibold tracking-wide transition-colors duration-300 md:min-h-12 md:px-1',
                  'after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-white md:after:inset-x-0',
                  'after:origin-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-out',
                  'hover:text-white hover:after:origin-left hover:after:scale-x-100',
                  'motion-reduce:after:transition-none',
                  'focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white',
                  isActive
                    ? 'text-white after:origin-left after:scale-x-100'
                    : 'text-white/80',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {menuMounted && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-x-0 bottom-0 top-[6.75rem] z-40 bg-black/40 md:hidden"
            onClick={toggleMenu}
          />
          <nav
            ref={mobileMenuRef}
            id="mobile-site-links"
            className="fixed bottom-0 left-0 top-[6.75rem] z-50 flex w-[min(82vw,22rem)] flex-col gap-2 overflow-y-auto bg-primary px-6 py-6 text-white shadow-2xl md:hidden"
            aria-label="Mobile site navigation"
            aria-hidden={!menuOpen}
          >
            {navItems.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={toggleMenu}
                tabIndex={menuOpen ? 0 : -1}
                className={({ isActive }) =>
                  `flex min-h-12 items-center border-b border-white/15 px-3 text-base font-semibold transition-colors hover:bg-white/10 ${
                    isActive ? 'text-white' : 'text-white/80'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </>
  )
}

export default Navbar