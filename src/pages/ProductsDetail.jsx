import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/common/ProductCard'

const getCategoryKey = (prod) => {
  if (!prod || !prod.id) return 'all'
  if (prod.id.startsWith('bag')) return 'bags'
  if (prod.id.startsWith('watch') || prod.subcategory === 'Smartwatches') return 'watches'
  if (prod.id.startsWith('earbud')) return 'earbuds'
  if (prod.id.startsWith('headphone')) return 'headphones'
  if (prod.id.startsWith('microphone')) return 'microphones'
  if (prod.id.startsWith('stand')) return 'stands'
  if (prod.id.startsWith('accessory')) return 'accessories'
  return 'all'
}

const CATEGORY_NAMES = {
  bags: 'Bags & Backpacks',
  watches: 'Smartwatches',
  earbuds: 'Wireless Earbuds',
  headphones: 'Headphones',
  microphones: 'Microphones',
  stands: 'Stands & Mounts',
  accessories: 'Tech Accessories',
  all: 'Catalog',
}

const ProductsDetail = () => {
  const { Id } = useParams()
  const { products, getProductById, addToCart } = useProducts()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  // Reset quantity and notification whenever navigated to a different product
  useEffect(() => {
    setQuantity(1)
    setAdded(false)
  }, [Id])

  const product = getProductById(Id)

  const currentCategoryKey = useMemo(() => getCategoryKey(product), [product])

  // Compute related products based on subcategory or parent category
  const relatedProducts = useMemo(() => {
    if (!product || !products) return []

    // 1. Same subcategory (excluding current product)
    const exactSub = product.subcategory
      ? products.filter(
        (p) => p.id !== product.id && p.subcategory === product.subcategory
      )
      : []

    // 2. Same parent category (excluding already matched items)
    const sameCat = products.filter(
      (p) =>
        p.id !== product.id &&
        getCategoryKey(p) === currentCategoryKey &&
        !exactSub.some((item) => item.id === p.id)
    )

    let combined = [...exactSub, ...sameCat]

    // 3. Fallback fill if category has fewer than 4 items
    if (combined.length < 4) {
      const others = products.filter(
        (p) => p.id !== product.id && !combined.some((item) => item.id === p.id)
      )
      combined = [...combined, ...others]
    }

    return combined.slice(0, 4)
  }, [product, products, currentCategoryKey])

  if (!product) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">Product Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </main>
    )
  }

  const { title, actualPrice, discountedPrice, bestseller, subcategory, image, description } =
    product

  const discountPercent =
    actualPrice && discountedPrice && actualPrice > discountedPrice
      ? Math.round(((actualPrice - discountedPrice) / actualPrice) * 100)
      : null

  const handleAdd = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-14 lg:px-8">
      {/* Breadcrumb - horizontally scrollable without breaking on small screens */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs text-slate-500 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mb-6 sm:text-sm"
      >
        <Link to="/" className="shrink-0 transition-colors hover:text-primary">
          Home
        </Link>
        <span className="shrink-0 text-slate-300">/</span>
        <Link
          to={currentCategoryKey !== 'all' ? `/products?category=${currentCategoryKey}` : '/products'}
          className="shrink-0 transition-colors hover:text-primary"
        >
          {CATEGORY_NAMES[currentCategoryKey] || 'Products'}
        </Link>
        <span className="shrink-0 text-slate-300">/</span>
        <span className="shrink-0 font-semibold text-primary truncate max-w-[180px] sm:max-w-none">
          {title}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
        {/* Product Image */}
        <div className="flex aspect-4/3 sm:aspect-auto items-center justify-center rounded-2xl bg-slate-100/90 p-4 shadow-xs sm:p-8">
          <img
            src={image}
            alt={title}
            className="max-h-[300px] sm:max-h-[420px] w-full object-contain drop-shadow-md select-none transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            {subcategory && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                {subcategory}
              </span>
            )}
            {bestseller && (
              <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                Bestseller
              </span>
            )}
          </div>

          <h1 className="mt-1.5 text-xl font-bold tracking-tight text-primary sm:mt-2 sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          {/* Pricing */}
          <div className="mt-3 flex items-baseline gap-2.5 sm:mt-4 sm:gap-3">
            <span className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Rs.{discountedPrice?.toLocaleString() ?? actualPrice?.toLocaleString()}
            </span>
            {actualPrice && discountedPrice && actualPrice > discountedPrice && (
              <span className="text-sm text-slate-400 line-through sm:text-lg">
                Rs.{actualPrice.toLocaleString()}
              </span>
            )}
            {discountPercent && (
              <span className="rounded-md bg-rose-600 px-1.5 py-0.5 text-[11px] font-bold text-white sm:text-xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:mt-6 sm:text-base">
            {description}
          </p>

          {/* Quantity Selector and Add to Cart Button (side-by-side on mobile) */}
          <div className="mt-6 flex flex-row items-center gap-3 sm:mt-8 sm:gap-4">
            <div className="flex h-12 w-28 shrink-0 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-2 sm:w-32 sm:px-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 cursor-pointer items-center justify-center text-lg font-bold text-slate-600 transition-colors hover:text-slate-900 active:scale-95"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="text-sm font-bold text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center text-lg font-bold text-slate-600 transition-colors hover:text-slate-900 active:scale-95"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98] sm:px-6 ${added
                ? 'bg-emerald-600'
                : 'bg-primary hover:bg-primary/90'
                }`}
            >
              {added ? (
                <>
                  <Check size={18} />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Value Props / Guarantees - Compact 3-col card on mobile */}
          <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:mt-10 sm:gap-4 sm:rounded-none sm:border-t sm:border-x-0 sm:border-b-0 sm:border-slate-200 sm:bg-transparent sm:p-0 sm:pt-6">
            <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:text-left sm:gap-2.5">
              <Truck size={18} className="shrink-0 text-primary" />
              <span className="text-[11px] font-medium leading-tight text-slate-600 sm:text-xs">
                Free Fast Delivery
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:text-left sm:gap-2.5 border-x border-slate-200/60 sm:border-none">
              <ShieldCheck size={18} className="shrink-0 text-primary" />
              <span className="text-[11px] font-medium leading-tight text-slate-600 sm:text-xs">
                Official Warranty
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:text-left sm:gap-2.5">
              <RefreshCw size={18} className="shrink-0 text-primary" />
              <span className="text-[11px] font-medium leading-tight text-slate-600 sm:text-xs">
                7-Day Returns
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="mt-14 border-t border-slate-200/80 pt-8 sm:mt-20 sm:pt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                <Sparkles size={13} className="text-primary" />
                <span>Recommendations</span>
              </div>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-primary sm:text-3xl">
                Related Products
              </h2>
            </div>

            <Link
              to={currentCategoryKey !== 'all' ? `/products?category=${currentCategoryKey}` : '/products'}
              className="group inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary/70 sm:text-sm"
            >
              <span>View all</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Related Products Grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default ProductsDetail