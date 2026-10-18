import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useProducts } from '../context/ProductContext'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } =
    useProducts()

  if (cart.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-[90%] flex-col items-center justify-center py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <ShoppingBag size={36} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-primary">Your Cart is Empty</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our collections and find what you love!
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90"
        >
          <ArrowLeft size={16} />
          <span>Continue Shopping</span>
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-[60vh] w-[90%] py-10 sm:py-14">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="cursor-pointer text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => {
            const price = product.discountedPrice ?? product.actualPrice ?? 0
            const lineTotal = price * quantity

            return (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:gap-6 sm:p-5"
              >
                {/* Product Thumbnail */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50 p-2 sm:h-24 sm:w-24">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col">
                  <Link
                    to={`/products/${product.baseId || product.id}`}
                    className="text-sm font-semibold text-slate-800 hover:text-primary transition-colors sm:text-base line-clamp-1"
                  >
                    {product.title}
                  </Link>
                  {product.selectedColor && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      Color: <span className="font-semibold text-slate-700">{product.selectedColor}</span>
                    </p>
                  )}

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      Rs.{price.toLocaleString()}
                    </span>
                    {product.actualPrice && product.discountedPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        Rs.{product.actualPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="mt-3 flex items-center justify-between sm:justify-start sm:gap-6">
                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="cursor-pointer p-1.5 text-slate-600 hover:text-slate-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-slate-800">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="cursor-pointer p-1.5 text-slate-600 hover:text-slate-900"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="cursor-pointer flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>

                {/* Line Total */}
                <div className="text-right font-bold text-slate-900 sm:text-base">
                  Rs.{lineTotal.toLocaleString()}
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-2xl border border-slate-200/80 bg-slate-50 p-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          <div className="mt-4 space-y-3 border-b border-slate-200 pb-4 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">
                Rs.{cartTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-semibold text-slate-900">Rs.200</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between text-base font-bold text-slate-900">
            <span>Total</span>
            <span className="text-xl text-primary">Rs.{(cartTotal + 200).toLocaleString()}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary py-3 px-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/"
            className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Cart
