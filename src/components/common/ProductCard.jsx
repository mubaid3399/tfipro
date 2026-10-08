import { ShoppingBag, Eye, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'

const ProductCard = ({ product, onAddToCart, onQuickView }) => {
  const { addToCart } = useProducts()

  if (!product) return null

  const handleAddToCart = (e) => {
    e.preventDefault()
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

        {/* Favorite / Wishlist button */}
        <button
          type="button"
          aria-label={`Save ${title} to wishlist`}
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm opacity-0 transition-all duration-200 hover:bg-white hover:text-rose-600 group-hover:opacity-100"
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

        {/* Hover Quick Action Drawer */}
        <div className="absolute inset-x-2 bottom-2 z-10 flex items-center justify-center gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary py-2 px-3 text-xs font-semibold text-white shadow-md transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Add ${title} to cart`}
          >
            <ShoppingBag size={13} />
            <span>Add to Cart</span>
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onQuickView(product)
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white text-slate-700 shadow-md transition-colors hover:bg-slate-100"
              aria-label={`Quick view ${title}`}
            >
              <Eye size={14} />
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
