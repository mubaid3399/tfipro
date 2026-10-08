import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import { useProducts } from '../context/ProductContext'

const ProductsDetail = () => {
  const { Id } = useParams()
  const { getProductById, addToCart } = useProducts()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = getProductById(Id)

  if (!product) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-[90%] flex-col items-center justify-center py-16 text-center">
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
    <main className="mx-auto min-h-[60vh] w-[90%] py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-400">{subcategory || 'Products'}</span>
        <span>/</span>
        <span className="font-semibold text-primary truncate max-w-[200px] sm:max-w-none">
          {title}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
        {/* Product Image */}
        <div className="flex items-center justify-center rounded-2xl bg-slate-100/90 p-8 shadow-xs">
          <img
            src={image}
            alt={title}
            className="max-h-[420px] w-full object-contain drop-shadow-md select-none"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            {subcategory && (
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {subcategory}
              </span>
            )}
            {bestseller && (
              <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                Bestseller
              </span>
            )}
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          {/* Pricing */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Rs.{discountedPrice?.toLocaleString() ?? actualPrice?.toLocaleString()}
            </span>
            {actualPrice && discountedPrice && actualPrice > discountedPrice && (
              <span className="text-base text-slate-400 line-through sm:text-lg">
                Rs.{actualPrice.toLocaleString()}
              </span>
            )}
            {discountPercent && (
              <span className="rounded-md bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-sm leading-relaxed text-slate-600 sm:text-base">
            {description}
          </p>

          {/* Quantity Selector and Add to Cart Button */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-32 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="cursor-pointer text-base font-semibold text-slate-600 hover:text-slate-900"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="text-sm font-bold text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="cursor-pointer text-base font-semibold text-slate-600 hover:text-slate-900"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white shadow-md transition-all ${
                added
                  ? 'bg-emerald-600'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {added ? (
                <>
                  <Check size={18} />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Value Props / Guarantees */}
          <div className="mt-10 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <Truck size={18} className="shrink-0 text-primary" />
              <span>Free Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <ShieldCheck size={18} className="shrink-0 text-primary" />
              <span>Official Warranty</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <RefreshCw size={18} className="shrink-0 text-primary" />
              <span>Easy 7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductsDetail