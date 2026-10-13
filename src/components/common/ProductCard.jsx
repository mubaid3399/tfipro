import { ShoppingBag, Eye, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'

const ProductCard = ({ product, onAddToCart, onQuickView }) => {
  const { addToCart } = useProducts()

  if (!product) return null

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product)
    } else {
      addToCart(product)
    }
  }

  const {
    id,
    title,
    actualPrice,
    discountedPrice,
    bestseller,
    image,
  } = product

  const discountPercent =
    actualPrice && discountedPrice && actualPrice > discountedPrice
      ? Math.round(((actualPrice - discountedPrice) / actualPrice) * 100)
      : null

  return (
    <div
      className="group relative flex flex-col items-center text-center transition-all duration-300"
      data-product-id={id}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-100/80 p-3 transition-shadow duration-300 group-hover:shadow-lg sm:p-4">
        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1 items-start">
          {bestseller && (
            <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
              Bestseller
            </span>
          )}
          {discountPercent && (
            <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite / Wishlist button - visible on mobile touch, hover on desktop */}
        <button
          type="button"
          aria-label={`Save ${title} to wishlist`}
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-all duration-200 hover:bg-white hover:text-rose-600"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <Heart size={14} />
        </button>

        {/* Product Image */}
        <Link
          to={`/products/${id}`}
          className="flex h-full w-full cursor-pointer items-center justify-center overflow-hidden"
          tabIndex={-1}
        >
          <img
            src={image}
            alt={title}
            loading="lazy"
            draggable="false"
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 select-none"
          />
        </Link>

        {/* Quick Action Drawer - Always visible on mobile touch, slide-up hover on desktop */}
        <div className="absolute inset-x-2 bottom-2 z-10 flex items-center justify-center gap-1.5 opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0 transition-all duration-300 ease-out sm:inset-x-3 sm:bottom-3 sm:gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="group/btn flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-2 py-2 text-[11px] font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 active:scale-95 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
            aria-label={`Add ${title} to cart`}
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/btn:scale-110 sm:h-4 sm:w-4" />
            <span className="whitespace-nowrap">Add to Cart</span>
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onQuickView(product)
              }}
              className="group/btn2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 active:scale-95 sm:h-10 sm:w-10 sm:rounded-xl"
              aria-label={`Quick view ${title}`}
            >
              <Eye className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn2:scale-110 sm:h-[18px] sm:w-[18px]" />
            </button>
          )}
        </div>
      </div>

      {/* Product Details (matches the reference screenshot) */}
      <div className="mt-2.5 w-full px-1 flex flex-col items-center">

        {/* Title with single-line truncate ellipsis */}
        <Link
          to={`/products/${id}`}
          className="mt-0.5 block max-w-full text-sm font-medium text-slate-800 transition-colors hover:text-primary truncate"
          title={title}
        >
          {title}
        </Link>

        {/* Prices: Bold discounted price + strikethrough actual price */}
        <div className="mt-1 flex items-baseline justify-center gap-2">
          <span className="text-sm font-bold text-slate-900 sm:text-base">
            Rs.{discountedPrice?.toLocaleString() ?? actualPrice?.toLocaleString()}
          </span>
          {actualPrice && discountedPrice && actualPrice > discountedPrice && (
            <span className="text-xs text-slate-400 line-through sm:text-sm">
              Rs.{actualPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
