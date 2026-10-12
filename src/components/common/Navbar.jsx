import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ShoppingBag, Search, X, TrendingUp } from 'lucide-react'
import gsap from 'gsap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { asset } from '../../assets/asset'
import { useProducts } from '../../context/ProductContext'

const navItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Products', to: '/products' },
  { label: 'About us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const Navbar = () => {
  const { cartCount, products, setIsCartOpen } = useProducts()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const searchBarRef = useRef(null)
  const searchInputRef = useRef(null)
  const searchFirstRunRef = useRef(true)
  const mobileMenuRef = useRef(null)
  const menuTweenRef = useRef(null)
  const lowerNavRef = useRef(null)
  const isStickyRef = useRef(false)
  const suggestionsRef = useRef(null)

  // Animate suggestions when they change
  useEffect(() => {
    if (query.trim() && suggestionsRef.current) {
      const items = suggestionsRef.current.children
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { autoAlpha: 0, x: -10 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.04,
            ease: 'power2.out',
            overwrite: 'auto',
          }
        )
      }
    }
  }, [query])

  /* ---------- Sticky lower nav ---------- */
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
            { yPercent: -100, boxShadow: '0 0 0 rgba(0,0,0,0)' },
            {
              yPercent: 0,
              boxShadow: '0 10px 25px -5px rgba(0, 26, 46, 0.45)',
              duration: 0.4,
              ease: 'power3.out',
              overwrite: 'auto',
            }
          )
        } else {
          gsap.set(el, {
            yPercent: 0,
            boxShadow: '0 10px 25px -5px rgba(0, 26, 46, 0.45)',
          })
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

  /* ---------- Mobile menu open animation ---------- */
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

  /* ---------- Search bar open/close animation ---------- */
  useLayoutEffect(() => {
    const el = searchBarRef.current
    if (!el) return

    // Initial render: set the hidden state without animating
    if (searchFirstRunRef.current) {
      searchFirstRunRef.current = false
      gsap.set(el, { yPercent: -100, autoAlpha: 0 })
      return
    }

    if (searchOpen) {
      gsap.fromTo(
        el,
        { yPercent: -100, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto',
          onComplete: () => searchInputRef.current?.focus(),
        }
      )
    } else {
      gsap.to(el, {
        yPercent: -100,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.in',
        overwrite: 'auto',
      })
    }
  }, [searchOpen])

  /* ---------- Close search with Escape or Outside Click ---------- */
  useEffect(() => {
    if (!searchOpen) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }

    const onClickOutside = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('touchstart', onClickOutside)
    
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('touchstart', onClickOutside)
    }
  }, [searchOpen])

  /* ---------- Handlers ---------- */
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    navigate(`/products?search=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setQuery('')
  }

  const filteredSuggestions = query.trim()
    ? products
        .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : []

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
      {/* Search bar (GSAP controls transform and visibility) */}
      <div
        ref={searchBarRef}
        className="fixed inset-x-0 top-0 z-[60] flex flex-col items-center bg-white px-4 pb-8 pt-6 shadow-xl md:px-10"
        style={{ visibility: 'hidden', opacity: 0 }}
        aria-hidden={!searchOpen}
      >
        <form
          onSubmit={handleSearchSubmit}
          role="search"
          className="flex w-full max-w-3xl items-center gap-4 rounded-full bg-slate-100 px-6 py-3 transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20"
        >
          <button
            type="submit"
            className="text-slate-400 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Submit search"
            tabIndex={searchOpen ? 0 : -1}
          >
            <Search size={22} />
          </button>
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            tabIndex={searchOpen ? 0 : -1}
            className="w-full bg-transparent text-base font-medium text-slate-800 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            className="text-slate-500 transition-colors hover:text-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            tabIndex={searchOpen ? 0 : -1}
          >
            <X size={22} />
          </button>
        </form>

        {/* Suggestions & Trending */}
        {/* We use a grid template row transition for incredibly smooth height changes */}
        <div className="mt-8 grid w-full max-w-3xl transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.5,0,0.1,1)]" style={{ gridTemplateRows: '1fr' }}>
          <div className="flex w-full flex-col gap-8 overflow-hidden sm:flex-row sm:gap-12">
            {query.trim() ? (
              <div className="flex-1">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Products matching "{query}"
                </h3>
                {filteredSuggestions.length > 0 ? (
                  <ul ref={suggestionsRef} className="flex flex-col gap-2">
                    {filteredSuggestions.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/products/${product.id}`}
                          tabIndex={searchOpen ? 0 : -1}
                          onClick={() => {
                            setSearchOpen(false)
                            setQuery('')
                          }}
                          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50 hover:text-primary focus-visible:outline-primary"
                        >
                          <img src={product.image} alt={product.title} className="h-10 w-10 rounded-md object-cover" />
                          <span className="text-sm font-medium text-slate-700">{product.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">No products found for "{query}".</p>
                )}
              </div>
            ) : (
            <>
              {/* Trending Searches */}
              <div className="flex-1">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  <TrendingUp size={16} />
                  Trending
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Wireless Earbuds', 'Power Bank', 'Smartwatch', 'Gaming Headset', 'RGB Mic'].map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        tabIndex={searchOpen ? 0 : -1}
                        onClick={() => {
                          setQuery(item)
                          searchInputRef.current?.focus()
                        }}
                        className="rounded-full bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-primary"
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Suggested Products */}
              <div className="flex-1">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Suggestions
                </h3>
                <ul className="flex flex-col gap-3">
                  {[
                    { label: 'Black Wireless Earbuds', to: '/products/earbudProduct4' },
                    { label: 'RGB Desktop Microphone', to: '/products/microphoneProduct2' },
                    { label: 'Ultra 7 in 1 Strap Smartwatch', to: '/products/accessoryProduct3' },
                  ].map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        tabIndex={searchOpen ? 0 : -1}
                        onClick={() => {
                          setSearchOpen(false)
                          setQuery('')
                        }}
                        className="flex items-center gap-2.5 text-sm font-medium text-slate-700 transition-colors hover:text-primary focus-visible:outline-primary"
                      >
                        <Search size={14} className="text-slate-400" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Top nav */}
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
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? 'top-3 rotate-45' : 'top-[5px]'
                  }`}
              />
              <span
                className={`absolute left-0 top-3 h-px w-4 bg-current transition-opacity duration-200 ${menuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? 'top-3 -rotate-45' : 'top-[19px]'
                  }`}
              />
            </span>
          </button>

          <Link
            to="/"
            className="col-start-2 flex items-center justify-center md:col-start-1 md:justify-start"
            aria-label="TFiPro home"
          >
            <img
              src={asset.favicon}
              alt="TFiPro"
              className="h-10 w-10 object-contain md:hidden"
            />
            <img
              src={asset.logo}
              alt="TFiPro"
              className="hidden h-14 w-32 object-contain sm:w-40 md:block"
            />
          </Link>

          <div className="col-start-3 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-full p-2 transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              aria-label="Search products"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={23} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full p-2 transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              aria-label={`Shopping bag${cartCount > 0 ? `, ${cartCount} items` : ''}`}
            >
              <ShoppingBag size={25} strokeWidth={1.8} aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Sticky lower nav (desktop) */}
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

      {/* Mobile menu */}
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
                  `flex min-h-12 items-center border-b border-white/15 px-3 text-base font-semibold transition-colors hover:bg-white/10 ${isActive ? 'text-white' : 'text-white/80'
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