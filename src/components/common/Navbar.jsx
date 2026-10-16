import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ShoppingBag,
  Search,
  X,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import gsap from 'gsap'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { asset } from '../../assets/asset'
import { useProducts } from '../../context/ProductContext'

const navItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Products', to: '/products' },
  { label: 'About us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const megaMenuCategories = [
  {
    id: 'bags',
    label: 'Bags & Backpacks',
    sub: 'Hard-shell & laptop gear',
    to: '/products?category=bags',
    image: asset.twoToneUrbanLaptopBackpack,
    count: '9 Products',
    badge: 'Popular',
  },
  {
    id: 'watches',
    label: 'Smartwatches',
    sub: 'AMOLED & luxury sets',
    to: '/products?category=watches',
    image: asset.curvedAmoledSmartwatch,
    count: '12 Products',
    badge: 'Trending',
  },
  {
    id: 'earbuds',
    label: 'Wireless Earbuds',
    sub: 'ANC & neckbands',
    to: '/products?category=earbuds',
    image: asset.blackWirelessEarbuds,
    count: '15 Products',
  },
  {
    id: 'headphones',
    label: 'Headphones',
    sub: 'Over-ear & gaming headsets',
    to: '/products?category=headphones',
    image: asset.overEarHeadphones,
    count: '5 Products',
  },
  {
    id: 'microphones',
    label: 'Microphones',
    sub: 'Wireless recording & audio',
    to: '/products?category=microphones',
    image: asset.wirelessMicrophoneSet,
    count: '2 Products',
  },
  {
    id: 'stands',
    label: 'Stands & Mounts',
    sub: 'Laptop risers & 360° swivels',
    to: '/products?category=stands',
    image: asset.foldableLaptopRiserStand,
    count: '9 Products',
  },
  {
    id: 'accessories',
    label: 'Tech Accessories',
    sub: 'Fast chargers & power banks',
    to: '/products?category=accessories',
    image: asset.powerBank,
    count: '9 Products',
  },
]

const Navbar = () => {
  const { cartCount, products, setIsCartOpen } = useProducts()
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)

  const megaMenuTimeoutRef = useRef(null)
  const searchBarRef = useRef(null)
  const searchInputRef = useRef(null)
  const searchFirstRunRef = useRef(true)
  const mobileMenuRef = useRef(null)
  const menuTweenRef = useRef(null)
  const lowerNavRef = useRef(null)
  const topNavRef = useRef(null)
  const lastScrollYRef = useRef(0)
  const isTopNavHiddenRef = useRef(false)
  const isStickyRef = useRef(false)
  const suggestionsRef = useRef(null)
  const [isScrolledPastOffer, setIsScrolledPastOffer] = useState(false)

  const closeMobileMenuImmediately = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    menuTweenRef.current?.kill()
    if (mobileMenuRef.current) {
      gsap.killTweensOf(mobileMenuRef.current)
      gsap.set(mobileMenuRef.current, { xPercent: -105 })
    }
    setMenuOpen(false)
    setMenuMounted(false)
  }

  // Close menus immediately on route change
  useEffect(() => {
    setMegaMenuOpen(false)
    closeMobileMenuImmediately()
  }, [location.pathname, location.search])

  // Lock background screen scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const prevBodyOverflow = document.body.style.overflow
      const prevHtmlOverflow = document.documentElement.style.overflow
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevBodyOverflow
        document.documentElement.style.overflow = prevHtmlOverflow
      }
    }
  }, [menuOpen])

  useEffect(() => {
    return () => {
      if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current)
    }
  }, [])

  const handleProductsMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current)
    setMegaMenuOpen(true)
  }

  const handleProductsMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false)
    }, 150)
  }

  const handleMegaMenuMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current)
    setMegaMenuOpen(true)
  }

  const handleMegaMenuMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false)
    }, 150)
  }

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

  /* ---------- Mobile top nav hide on scroll down / show on scroll up ---------- */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current
      const isMobile = window.innerWidth < 768

      setIsScrolledPastOffer(scrollY > 44)

      if (isMobile && topNavRef.current) {
        // Keep navbar visible if mobile drawer or search is active
        if (menuOpen || searchOpen) {
          lastScrollYRef.current = scrollY
          return
        }

        const delta = scrollY - lastScrollY

        // When at or near top, always keep navbar fully visible
        if (scrollY <= 15) {
          if (isTopNavHiddenRef.current) {
            isTopNavHiddenRef.current = false
            gsap.to(topNavRef.current, {
              yPercent: 0,
              duration: 0.35,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          }
        }
        // Scroll down: hide navbar with GSAP
        else if (delta > 6 && scrollY > 60 && !isTopNavHiddenRef.current) {
          isTopNavHiddenRef.current = true
          gsap.to(topNavRef.current, {
            yPercent: -100,
            duration: 0.3,
            ease: 'power2.inOut',
            overwrite: 'auto',
          })
        }
        // Scroll up: reveal navbar with GSAP
        else if (delta < -6 && isTopNavHiddenRef.current) {
          isTopNavHiddenRef.current = false
          gsap.to(topNavRef.current, {
            yPercent: 0,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }
      } else if (!isMobile && topNavRef.current) {
        // Reset on desktop
        if (isTopNavHiddenRef.current) {
          isTopNavHiddenRef.current = false
          gsap.set(topNavRef.current, { yPercent: 0 })
        }
      }

      lastScrollYRef.current = scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (topNavRef.current) {
        gsap.killTweensOf(topNavRef.current)
      }
    }
  }, [menuOpen, searchOpen])

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
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      menuTweenRef.current?.kill()
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (!mobileMenuRef.current || reduceMotion) {
        closeMobileMenuImmediately()
        return
      }

      menuTweenRef.current = gsap.to(mobileMenuRef.current, {
        xPercent: -105,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          closeMobileMenuImmediately()
        },
      })
      return
    }

    // Make sure the top nav is fully visible before the drawer opens
    if (topNavRef.current) {
      isTopNavHiddenRef.current = false
      gsap.set(topNavRef.current, { yPercent: 0 })
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
        <div
          className="mt-8 grid w-full max-w-3xl transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.5,0,0.1,1)]"
          style={{ gridTemplateRows: '1fr' }}
        >
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
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-10 w-10 rounded-md object-cover"
                          />
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
                    {['Wireless Earbuds', 'Backpack', 'Smartwatch', 'Gaming Headset', 'Power Bank'].map(
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
                      { label: 'Two-Tone Urban Laptop Backpack', to: '/products/bagProduct6' },
                      { label: 'Apex Curved AMOLED Smartwatch', to: '/products/watchProduct1' },
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

      {/* Top nav (animates hide on scroll down / show on scroll up on mobile) */}
      <nav
        ref={topNavRef}
        className={`${menuMounted ? 'fixed inset-x-0 top-0' : 'sticky top-0'
          } z-40 transition-colors duration-200 md:static md:bg-transparent md:text-primary md:shadow-none will-change-transform ${menuOpen
            ? 'bg-primary text-white border-b border-white/10'
            : isScrolledPastOffer
              ? 'bg-white/95 text-primary backdrop-blur-md shadow-xs'
              : 'bg-transparent text-primary'
          }`}
        aria-label="Main navigation"
      >
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
              className={`h-10 w-10 object-contain transition-all duration-200 md:hidden ${menuOpen ? 'rounded-full bg-white p-1' : ''
                }`}
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

      {/* Keeps the page from jumping while the top nav is fixed (mobile menu open) */}
      {menuMounted && <div className="h-16 md:hidden" aria-hidden="true" />}

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
          {navItems.map(({ label, to, end }) => {
            const isProducts = label === 'Products'

            return (
              <div
                key={to}
                className="relative flex h-full items-center"
                onMouseEnter={isProducts ? handleProductsMouseEnter : undefined}
                onMouseLeave={isProducts ? handleProductsMouseLeave : undefined}
              >
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    [
                      'relative inline-flex min-h-11 items-center gap-1.5 px-3 text-sm font-semibold tracking-wide transition-colors duration-300 md:min-h-12 md:px-2',
                      'after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-white md:after:inset-x-0',
                      'after:origin-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-out',
                      'hover:text-white hover:after:origin-left hover:after:scale-x-100',
                      'motion-reduce:after:transition-none',
                      'focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white',
                      isActive || (isProducts && megaMenuOpen)
                        ? 'text-white after:origin-left after:scale-x-100'
                        : 'text-white/80',
                    ].join(' ')
                  }
                >
                  {label}
                  {isProducts && (
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${megaMenuOpen ? 'rotate-180 text-white' : 'text-white/70'
                        }`}
                    />
                  )}
                </NavLink>
              </div>
            )
          })}
        </div>

        {/* Mega Menu Dropdown across the complete navbar */}
        <div
          className={`absolute left-0 top-full w-full border-t border-slate-100 bg-white/98 text-slate-800 shadow-[0_25px_50px_-12px_rgba(0,26,46,0.35)] backdrop-blur-xl transition-all duration-300 ease-out ${megaMenuOpen
              ? 'visible translate-y-0 opacity-100'
              : 'pointer-events-none invisible -translate-y-2 opacity-0'
            }`}
          onMouseEnter={handleMegaMenuMouseEnter}
          onMouseLeave={handleMegaMenuMouseLeave}
        >
          <div className="mx-auto w-[92%] max-w-7xl py-6">
            {/* Top header row */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkles size={13} />
                  Categories
                </span>
                <span className="text-sm font-medium text-slate-500">
                  Select a category to explore audio gear, watches, bags and tech essentials
                </span>
              </div>
              <Link
                to="/products"
                onClick={() => setMegaMenuOpen(false)}
                className="group flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:text-primary/80"
              >
                <span>View all products ({products.length})</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Categories Grid (Bags, Watches, Earbuds, Headphones, Microphones, Stands, Accessories) */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {megaMenuCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.to}
                  onClick={() => setMegaMenuOpen(false)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {cat.badge && (
                      <span className="absolute right-2 top-2 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 transition-colors group-hover:text-primary">
                        {cat.label}
                      </h4>
                      <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                        {cat.sub}
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px] font-semibold text-slate-400">
                      <span>{cat.count}</span>
                      <ArrowRight
                        size={12}
                        className="text-primary opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom info strip */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="font-semibold text-slate-700">100% Genuine Tech Products</span>
                <span className="text-slate-400">•</span>
                <span>Fast nationwide delivery & verified warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Quick browse:</span>
                <Link
                  to="/products?category=bags"
                  onClick={() => setMegaMenuOpen(false)}
                  className="font-semibold text-primary hover:underline"
                >
                  New Backpacks
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  to="/products?category=watches"
                  onClick={() => setMegaMenuOpen(false)}
                  className="font-semibold text-primary hover:underline"
                >
                  AMOLED Watches
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu: top nav is fixed (h-16) while open, drawer starts right below it */}
      {menuMounted && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/40 md:hidden"
            onClick={toggleMenu}
            onTouchMove={(e) => e.preventDefault()}
          />
          <nav
            ref={mobileMenuRef}
            id="mobile-site-links"
            className="fixed bottom-0 left-0 top-16 z-50 flex w-[min(82vw,22rem)] flex-col gap-1 overflow-y-auto overscroll-contain bg-primary px-6 py-6 text-white shadow-2xl md:hidden"
            aria-label="Mobile site navigation"
          >
            {navItems.map(({ label, to, end }) => {
              const isProducts = label === 'Products'

              if (isProducts) {
                return (
                  <div key={to} className="flex flex-col border-b border-white/15">
                    <div className="flex items-center justify-between">
                      <NavLink
                        to={to}
                        end={end}
                        onClick={closeMobileMenuImmediately}
                        className={({ isActive }) =>
                          `flex min-h-12 flex-1 items-center px-3 text-base font-semibold transition-colors hover:bg-white/10 ${isActive ? 'text-white' : 'text-white/80'
                          }`
                        }
                      >
                        {label}
                      </NavLink>
                      <button
                        type="button"
                        onClick={() => setMobileCatOpen((prev) => !prev)}
                        className="p-3 text-white/70 hover:text-white"
                        aria-label="Toggle product categories"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${mobileCatOpen ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                    </div>

                    {mobileCatOpen && (
                      <div className="mb-2 flex flex-col gap-0.5 pl-6">
                        {megaMenuCategories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={cat.to}
                            onClick={closeMobileMenuImmediately}
                            className="flex items-center justify-between py-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
                          >
                            <span>{cat.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={closeMobileMenuImmediately}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center border-b border-white/15 px-3 text-base font-semibold transition-colors hover:bg-white/10 ${isActive ? 'text-white' : 'text-white/80'
                    }`
                  }
                >
                  {label}
                </NavLink>
              )
            })}
          </nav>
        </>
      )}
    </>
  )
}

export default Navbar