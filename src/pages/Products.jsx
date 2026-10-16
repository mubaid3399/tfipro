import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/common/ProductCard'
import {
  Sparkles,
  Watch,
  Headphones,
  Mic,
  Briefcase,
  Zap,
  Music,
  Smartphone,
  X,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Flame,
  ChevronRight,
  ChevronDown,
  Check,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 12

const CATEGORY_TABS = [
  {
    id: 'all',
    label: 'All Products',
    icon: Sparkles,
    description: 'Browse the full TFiPro range of audio gear, watches, bags and accessories.',
  },
  {
    id: 'bags',
    label: 'Bags & Backpacks',
    icon: Briefcase,
    description: 'Laptop backpacks and hard-shell bags built for daily carry and travel.',
  },
  {
    id: 'watches',
    label: 'Smartwatches',
    icon: Watch,
    description: 'AMOLED and luxury smartwatches with fitness tracking and calling.',
  },
  {
    id: 'earbuds',
    label: 'Wireless Earbuds',
    icon: Music,
    description: 'True wireless earbuds and neckbands with clear sound and long battery life.',
  },
  {
    id: 'headphones',
    label: 'Headphones',
    icon: Headphones,
    description: 'Over-ear and gaming headsets for music, calls and long sessions.',
  },
  {
    id: 'microphones',
    label: 'Microphones',
    icon: Mic,
    description: 'Wireless microphones for audio recording, streaming, calls and speaking.',
  },
  {
    id: 'stands',
    label: 'Stands & Mounts',
    icon: Smartphone,
    description: 'Laptop risers and swivel mounts for a more comfortable desk setup.',
  },
  {
    id: 'accessories',
    label: 'Tech Accessories',
    icon: Zap,
    description: 'Fast chargers, power banks and everyday tech essentials.',
  },
]

const PRICE_RANGES = [
  { id: 'all', label: 'All prices' },
  { id: 'under-2000', label: 'Under Rs. 2,000', min: 0, max: 2000 },
  { id: '2000-3000', label: 'Rs. 2,000 – Rs. 3,000', min: 2000, max: 3000 },
  { id: '3000-5000', label: 'Rs. 3,000 – Rs. 5,000', min: 3000, max: 5000 },
  { id: 'above-5000', label: 'Above Rs. 5,000', min: 5000, max: Infinity },
]

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-low', label: 'Price: low to high' },
  { id: 'price-high', label: 'Price: high to low' },
  { id: 'bestseller', label: 'Bestsellers first' },
]

// Values that mean "no filter" and are removed from the URL
const DEFAULTS = { category: 'all', price: 'all', sort: 'featured' }

const getPrice = (p) => p.discountedPrice ?? p.actualPrice ?? 0

const matchesCategory = (product, category) => {
  if (!category || category === 'all') return true
  switch (category) {
    case 'bags':
      return product.id.startsWith('bag')
    case 'watches':
      return product.id.startsWith('watch') || product.subcategory === 'Smartwatches'
    case 'earbuds':
      return product.id.startsWith('earbud')
    case 'headphones':
      return product.id.startsWith('headphone')
    case 'microphones':
      return product.id.startsWith('microphone')
    case 'stands':
      return product.id.startsWith('stand')
    case 'accessories':
      return product.id.startsWith('accessory') && product.subcategory !== 'Smartwatches'
    default:
      return true
  }
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Products = () => {
  const { products } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()

  // All filter state lives in the URL so it survives refresh, back button and sharing
  const rawCategory = searchParams.get('category') || 'all'
  const currentCategory = CATEGORY_TABS.some((t) => t.id === rawCategory) ? rawCategory : 'all'
  const currentSearch = searchParams.get('search') || ''
  const rawPrice = searchParams.get('price') || 'all'
  const priceRange = PRICE_RANGES.some((r) => r.id === rawPrice) ? rawPrice : 'all'
  const rawSort = searchParams.get('sort') || 'featured'
  const sortBy = SORT_OPTIONS.some((s) => s.id === rawSort) ? rawSort : 'featured'
  const onlyBestsellers = searchParams.get('bestsellers') === '1'

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [searchInput, setSearchInput] = useState(currentSearch)

  const activeChipRef = useRef(null)
  const sheetCloseRef = useRef(null)
  const sheetBackdropRef = useRef(null)
  const sheetPanelRef = useRef(null)
  const isClosingRef = useRef(false)

  // Keep local searchInput in sync when URL search param changes externally (e.g. from Navbar)
  useEffect(() => {
    setSearchInput(currentSearch)
  }, [currentSearch])

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === DEFAULTS[key]) {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })
    setSearchParams(next, { replace: true })
  }

  // Debounce syncing search input to URL query parameters
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== currentSearch.trim()) {
        updateParams({ search: searchInput.trim() })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const setCategory = (id) => updateParams({ category: id })
  const setPriceRange = (id) => updateParams({ price: id })
  const setSortBy = (id) => updateParams({ sort: id })
  const setOnlyBestsellers = (value) => updateParams({ bestsellers: value ? '1' : null })
  const setSearch = (value) => {
    setSearchInput(value)
    updateParams({ search: value })
  }

  const resetAllFilters = () => {
    setSearchInput('')
    setSearchParams({}, { replace: true })
  }

  /* ---------- Derived data ---------- */

  const categoryCounts = useMemo(() => {
    const counts = { all: products.length }
    CATEGORY_TABS.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = products.filter((p) => matchesCategory(p, cat.id)).length
      }
    })
    return counts
  }, [products])

  const filteredProducts = useMemo(() => {
    const selectedRange = PRICE_RANGES.find((r) => r.id === priceRange)
    const q = (searchInput || currentSearch).trim().toLowerCase()

    const list = products.filter((p) => {
      const matchCat = matchesCategory(p, currentCategory)

      const matchQuery = q
        ? (p.title || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.subcategory || '').toLowerCase().includes(q) ||
          (p.id || '').toLowerCase().includes(q)
        : true

      const price = getPrice(p)
      const matchPrice =
        !selectedRange || selectedRange.id === 'all'
          ? true
          : price >= selectedRange.min && price < selectedRange.max

      const matchBestseller = onlyBestsellers ? Boolean(p.bestseller) : true

      return matchCat && matchQuery && matchPrice && matchBestseller
    })

    switch (sortBy) {
      case 'price-low':
        return [...list].sort((a, b) => getPrice(a) - getPrice(b))
      case 'price-high':
        return [...list].sort((a, b) => getPrice(b) - getPrice(a))
      case 'bestseller':
        return [...list].sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0))
      default:
        return list
    }
  }, [products, currentCategory, searchInput, currentSearch, priceRange, sortBy, onlyBestsellers])

  const activeTabMeta = CATEGORY_TABS.find((t) => t.id === currentCategory) || CATEGORY_TABS[0]
  const priceLabel = PRICE_RANGES.find((r) => r.id === priceRange)?.label

  const activeChips = [
    currentCategory !== 'all' && {
      key: 'category',
      label: activeTabMeta.label,
      onRemove: () => setCategory('all'),
    },
    priceRange !== 'all' && {
      key: 'price',
      label: priceLabel,
      onRemove: () => setPriceRange('all'),
    },
    onlyBestsellers && {
      key: 'bestsellers',
      label: 'Bestsellers only',
      onRemove: () => setOnlyBestsellers(false),
    },
    (searchInput || currentSearch) && {
      key: 'search',
      label: `“${searchInput || currentSearch}”`,
      onRemove: () => setSearch(''),
    },
  ].filter(Boolean)

  // Filters that live inside the mobile sheet (category chips and search sit outside it)
  const sheetFilterCount = (priceRange !== 'all' ? 1 : 0) + (onlyBestsellers ? 1 : 0)

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  /* ---------- Effects ---------- */

  // Start from the first page whenever the result set changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [currentCategory, currentSearch, priceRange, sortBy, onlyBestsellers])

  // Keep the selected category chip in view on mobile
  useEffect(() => {
    activeChipRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [currentCategory])

  const openMobileFilter = () => {
    if (isClosingRef.current) return
    setMobileFilterOpen(true)
  }

  const closeMobileFilter = (callback) => {
    if (isClosingRef.current || !sheetPanelRef.current) {
      setMobileFilterOpen(false)
      if (callback) callback()
      return
    }

    isClosingRef.current = true

    // Animate panel smoothly downwards with GSAP
    gsap.to(sheetPanelRef.current, {
      yPercent: 100,
      duration: 0.35,
      ease: 'power3.in',
    })

    // Fade out backdrop and unmount
    gsap.to(sheetBackdropRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        isClosingRef.current = false
        setMobileFilterOpen(false)
        if (callback) callback()
      },
    })
  }

  // Mobile filter sheet: animate from bottom, lock scroll, close with Escape
  useEffect(() => {
    if (!mobileFilterOpen) return undefined

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Animate backdrop and sheet from down to up with GSAP
    if (sheetBackdropRef.current && sheetPanelRef.current) {
      gsap.fromTo(
        sheetBackdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(
        sheetPanelRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.4, ease: 'power3.out' }
      )
    }

    sheetCloseRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMobileFilter()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileFilterOpen])

  /* ---------- Reusable pieces ---------- */

  const renderCategoryList = (onSelect) => (
    <ul className="space-y-1">
      {CATEGORY_TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = currentCategory === tab.id
        return (
          <li key={tab.id}>
            <button
              type="button"
              onClick={() => {
                setCategory(tab.id)
                if (onSelect) onSelect(tab.id)
              }}
              aria-current={isActive ? 'true' : undefined}
              className={`group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isActive
                ? 'bg-primary font-semibold text-white shadow-sm shadow-primary/25'
                : 'text-slate-700 hover:bg-slate-100'
                }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <Icon
                  size={16}
                  className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'
                    }`}
                  aria-hidden="true"
                />
                <span className="truncate">{tab.label}</span>
              </span>
              <span
                className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
              >
                {categoryCounts[tab.id] || 0}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )

  const renderPriceFilters = (name, onSelect) => (
    <fieldset>
      <legend className="sr-only">Price range</legend>
      <div className="space-y-1">
        {PRICE_RANGES.map((r) => {
          const isSelected = priceRange === r.id
          return (
            <label
              key={r.id}
              className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-primary/40 ${isSelected
                ? 'bg-primary/5 font-semibold text-primary'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <input
                type="radio"
                name={name}
                value={r.id}
                checked={isSelected}
                onChange={() => {
                  setPriceRange(r.id)
                  if (onSelect) onSelect(r.id)
                }}
                className="sr-only"
              />
              <span>{r.label}</span>
              <span
                aria-hidden="true"
                className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-slate-300 bg-white'
                  }`}
              >
                {isSelected && <Check size={11} strokeWidth={3} className="text-white" />}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )

  const renderBestsellerToggle = (onToggle) => (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-primary/40 hover:bg-slate-50">
      <span className="flex items-center gap-2 font-medium text-slate-700">
        <Flame size={16} className="text-amber-500" aria-hidden="true" />
        Bestsellers only
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={onlyBestsellers}
        onChange={(e) => {
          setOnlyBestsellers(e.target.checked)
          if (onToggle) onToggle(e.target.checked)
        }}
        className="peer sr-only cursor-pointer"
      />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:h-5 after:h-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
  )

  const renderSortSelect = (id) => (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="hidden whitespace-nowrap text-sm text-slate-500 sm:inline">
        Sort by
      </label>
      <div className="relative">
        <select
          id={id}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </div>
  )

  const searchField = (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        updateParams({ search: searchInput.trim() })
      }}
      className="relative w-full sm:max-w-xs"
    >
      <label htmlFor="products-search" className="sr-only">
        Search products
      </label>
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        id="products-search"
        type="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
      />
      {searchInput && (
        <button
          type="button"
          onClick={() => {
            setSearchInput('')
            updateParams({ search: '' })
          }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={14} />
        </button>
      )}
    </form>
  )

  /* ---------- Render ---------- */

  const showingFrom = filteredProducts.length === 0 ? 0 : 1
  const showingTo = Math.min(visibleCount, filteredProducts.length)

  return (
    <main className="mx-auto min-h-[70vh] w-[92%] max-w-7xl py-6 sm:py-10">
      {/* Header */}
      <header className="border-b border-slate-200 pb-6">
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-1.5 text-sm text-slate-500">
            <li>
              <Link to="/" className="transition-colors hover:text-primary">
                Home
              </Link>
            </li>
            <ChevronRight size={14} className="text-slate-300" aria-hidden="true" />
            <li>
              {currentCategory === 'all' && !currentSearch ? (
                <span aria-current="page" className="font-medium text-slate-800">
                  Products
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="transition-colors hover:text-primary"
                >
                  Products
                </button>
              )}
            </li>
            {currentCategory !== 'all' && (
              <>
                <ChevronRight size={14} className="text-slate-300" aria-hidden="true" />
                <li aria-current="page" className="font-medium text-slate-800">
                  {activeTabMeta.label}
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              {(searchInput || currentSearch) ? `Results for “${searchInput || currentSearch}”` : activeTabMeta.label}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {(searchInput || currentSearch)
                ? `Searching ${currentCategory === 'all' ? 'all products' : activeTabMeta.label.toLowerCase()}.`
                : activeTabMeta.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {searchField}
            <div className="hidden lg:block">{renderSortSelect('sort-select-desktop')}</div>
          </div>
        </div>
      </header>

      {/* Mobile: category chips + filter / sort row */}
      <div className="mt-5 lg:hidden">
        <div
          className="-mx-[4.35%] overflow-x-auto px-[4.35%] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Product categories"
        >
          <div className="flex w-max gap-2">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = currentCategory === tab.id
              return (
                <button
                  key={tab.id}
                  ref={isActive ? activeChipRef : null}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setCategory(tab.id)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${isActive
                    ? 'border-primary bg-primary font-semibold text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  <Icon size={15} aria-hidden="true" />
                  {tab.label}
                  <span className={isActive ? 'text-white/70' : 'text-slate-400'}>
                    {categoryCounts[tab.id] || 0}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={openMobileFilter}
            aria-haspopup="dialog"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
          >
            <SlidersHorizontal size={16} className="text-primary" aria-hidden="true" />
            Filters
            {sheetFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                {sheetFilterCount}
              </span>
            )}
          </button>
          {renderSortSelect('sort-select-mobile')}
        </div>
      </div>

      {/* Layout: sidebar + results */}
      <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-4 xl:grid-cols-5">
        {/* Desktop sidebar */}
        <aside
          aria-label="Product filters"
          className="sticky top-28 hidden space-y-5 lg:col-span-1 lg:block"
        >
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
              Categories
            </h2>
            {renderCategoryList()}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Price</h2>
              {priceRange !== 'all' && (
                <button
                  type="button"
                  onClick={() => setPriceRange('all')}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            {renderPriceFilters('price-desktop')}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
              Highlights
            </h2>
            {renderBestsellerToggle()}
          </section>
        </aside>

        {/* Results */}
        <section aria-label="Product results" className="lg:col-span-3 xl:col-span-4">
          {/* Result summary + active filters */}
          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-sm text-slate-500" aria-live="polite">
              {filteredProducts.length === 0 ? (
                'No products to show'
              ) : (
                <>
                  Showing{' '}
                  <span className="font-semibold text-slate-800">
                    {showingFrom}–{showingTo}
                  </span>{' '}
                  of <span className="font-semibold text-slate-800">{filteredProducts.length}</span>{' '}
                  {filteredProducts.length === 1 ? 'product' : 'products'}
                </>
              )}
            </p>

            {activeChips.length > 0 && (
              <>
                <span className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden="true" />
                <ul className="flex flex-wrap items-center gap-2">
                  {activeChips.map((chip) => (
                    <li key={chip.key}>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-1.5 text-xs font-semibold text-primary">
                        {chip.label}
                        <button
                          type="button"
                          onClick={chip.onRemove}
                          aria-label={`Remove filter: ${chip.label}`}
                          className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-primary/15 hover:text-rose-600"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="inline-flex items-center gap-1 px-1 text-xs font-semibold text-slate-500 transition-colors hover:text-rose-600"
                    >
                      <RotateCcw size={12} aria-hidden="true" />
                      Clear all
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load more */}
              <div className="mt-10 flex flex-col items-center gap-3">
                <div
                  className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={filteredProducts.length}
                  aria-valuenow={showingTo}
                  aria-label="Products shown"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${(showingTo / filteredProducts.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  You have viewed {showingTo} of {filteredProducts.length} products
                </p>
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="rounded-xl border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    Load more products
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm">
                <Search size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">No matching products</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                We couldn’t find anything for the current filters. Remove a filter or try a
                different keyword.
              </p>

              {activeChips.length > 0 && (
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {activeChips.map((chip) => (
                    <li key={chip.key}>
                      <button
                        type="button"
                        onClick={chip.onRemove}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-200 hover:text-rose-600"
                      >
                        Remove {chip.label}
                        <X size={12} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
              >
                <RotateCcw size={14} aria-hidden="true" />
                Reset all filters
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter bottom sheet with GSAP slide-up / slide-down animation */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-[70] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          {/* Backdrop with fade animation */}
          <div
            ref={sheetBackdropRef}
            onClick={() => closeMobileFilter()}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            aria-label="Close filters"
          />

          {/* Bottom sheet panel with GSAP slide up / down animation */}
          <div
            ref={sheetPanelRef}
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-white shadow-2xl"
          >
            {/* Sheet grab handle */}
            <div className="flex items-center justify-center pt-3 pb-1">
              <span className="h-1.5 w-12 rounded-full bg-slate-200" />
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Filters & Categories</h2>
                <p className="text-xs text-slate-500">Tap any option to apply filter and close</p>
              </div>
              <button
                ref={sheetCloseRef}
                type="button"
                onClick={() => closeMobileFilter()}
                aria-label="Close filters"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5">
              {/* Categories */}
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Categories
                  </h3>
                  <span className="text-xs text-slate-400">{CATEGORY_TABS.length} total</span>
                </div>
                {renderCategoryList(() => closeMobileFilter())}
              </section>

              {/* Price Range */}
              <section className="border-t border-slate-100 pt-5">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Price Range
                </h3>
                {renderPriceFilters('price-mobile', () => closeMobileFilter())}
              </section>

              {/* Highlights */}
              <section className="border-t border-slate-100 pt-5">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Highlights
                </h3>
                {renderBestsellerToggle(() => closeMobileFilter())}
              </section>
            </div>

            <div className="flex gap-3 border-t border-slate-100 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {activeChips.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    resetAllFilters()
                    closeMobileFilter()
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-rose-600 cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={() => closeMobileFilter()}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90 cursor-pointer"
              >
                Show {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Products