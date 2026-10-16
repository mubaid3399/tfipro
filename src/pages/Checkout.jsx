import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Truck,
  Banknote,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tag,
  Trash2,
  Plus,
  Minus,
  Printer,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { asset } from '../assets/asset'

// Major Pakistani cities for quick selection
const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Wah Cantt',
  'Other',
]

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
]

// Available promo discount codes
const AVAILABLE_COUPONS = [
  { code: 'TFIPRO10', discountPercent: 10, label: '10% OFF Storewide' },
  { code: 'WELCOME500', fixedDiscount: 500, minOrder: 2500, label: 'Rs. 500 OFF (Orders > Rs. 2,500)' },
  { code: 'FREESHIP', freeShipping: true, label: 'Free Express Shipping' },
]

const Checkout = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    showToast,
    currency = 'Rs.',
  } = useProducts()

  // Form states
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: 'Lahore',
    customCity: '',
    province: 'Punjab',
    postalCode: '',
    phone: '',
    orderNotes: '',
    keepUpdated: true,
    saveInfo: true,
  })

  // Shipping & Payment selection
  const [shippingMethod, setShippingMethod] = useState('standard') // 'standard' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('cod') // 'cod' | 'bank'

  // Promo coupon
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  // UI States
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [orderComplete, setOrderComplete] = useState(null)
  const [copiedField, setCopiedField] = useState(null)

  // Load saved info from localStorage
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem('tfipro_customer_info')
      if (savedInfo) {
        const parsed = JSON.parse(savedInfo)
        setFormData((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  // Calculate pricing breakdown (Standard Delivery: Rs. 200)
  const shippingFee = useMemo(() => {
    if (appliedCoupon?.freeShipping) return 0
    if (shippingMethod === 'express') return 350
    return 200 // Standard Delivery is Rs. 200
  }, [shippingMethod, appliedCoupon])

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0
    if (appliedCoupon.discountPercent) {
      return Math.round((cartTotal * appliedCoupon.discountPercent) / 100)
    }
    if (appliedCoupon.fixedDiscount) {
      return Math.min(appliedCoupon.fixedDiscount, cartTotal)
    }
    return 0
  }, [appliedCoupon, cartTotal])

  const grandTotal = useMemo(() => {
    const total = cartTotal - discountAmount + shippingFee
    return Math.max(0, total)
  }, [cartTotal, discountAmount, shippingFee])

  // Handle Form changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Handle coupon application
  const handleApplyCoupon = (codeToApply = couponInput) => {
    const cleanCode = (codeToApply || '').trim().toUpperCase()
    setCouponError('')

    if (!cleanCode) {
      setCouponError('Please enter a coupon code.')
      return
    }

    const found = AVAILABLE_COUPONS.find((c) => c.code === cleanCode)
    if (!found) {
      setCouponError('Invalid promo code. Try TFIPRO10 for 10% off.')
      return
    }

    if (found.minOrder && cartTotal < found.minOrder) {
      setCouponError(`This code requires a minimum order of ${currency}${found.minOrder.toLocaleString()}.`)
      return
    }

    setAppliedCoupon(found)
    setCouponInput('')
    setCouponError('')
    showToast(`Coupon "${found.code}" applied successfully!`)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    showToast('Coupon removed.')
  }

  // Form Validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or mobile number is required'
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Street address is required'
    }

    if (formData.city === 'Other' && !formData.customCity.trim()) {
      newErrors.customCity = 'Please enter your city name'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for courier delivery'
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid Pakistani phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Copy helper
  const handleCopy = (text, fieldKey) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldKey)
    showToast('Copied to clipboard!')
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Handle Order Placement
  const handlePlaceOrder = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to top of form
      window.scrollTo({ top: 100, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    // Save info if opted
    if (formData.saveInfo) {
      try {
        const { emailOrPhone, firstName, lastName, address, apartment, city, customCity, province, postalCode, phone } = formData
        localStorage.setItem(
          'tfipro_customer_info',
          JSON.stringify({ emailOrPhone, firstName, lastName, address, apartment, city, customCity, province, postalCode, phone })
        )
      } catch {
        // Ignore
      }
    }

    // Simulate payment / order processing
    setTimeout(() => {
      const generatedOrderId = `TFI-${Math.floor(100000 + Math.random() * 900000)}`
      const orderDate = new Date().toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      const finalCity = formData.city === 'Other' ? formData.customCity : formData.city

      const completedOrder = {
        id: generatedOrderId,
        date: orderDate,
        items: [...cart],
        subtotal: cartTotal,
        discount: discountAmount,
        couponCode: appliedCoupon?.code || null,
        shippingFee,
        shippingMethod,
        total: grandTotal,
        customer: {
          ...formData,
          resolvedCity: finalCity,
        },
        paymentMethod,
        status: paymentMethod === 'cod' ? 'Cash on Delivery (Pending)' : 'Payment Verified (Processing)',
        estimatedDelivery: shippingMethod === 'express' ? '1 to 2 business days' : '3 to 4 business days',
      }

      // Persist order in local history
      try {
        const existingOrders = JSON.parse(localStorage.getItem('tfipro_orders') || '[]')
        existingOrders.unshift(completedOrder)
        localStorage.setItem('tfipro_orders', JSON.stringify(existingOrders))
      } catch {
        // Ignore
      }

      clearCart()
      setIsSubmitting(false)
      setOrderComplete(completedOrder)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1500)
  }

  // Render Empty State if no cart and no order complete
  if (cart.length === 0 && !orderComplete) {
    return (
      <main className="mx-auto flex min-h-[70vh] w-[90%] max-w-4xl flex-col items-center justify-center py-20 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 shadow-inner">
          <ShoppingBag size={42} strokeWidth={1.5} />
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            0
          </span>
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-primary">
          Your Checkout is Empty
        </h1>
        <p className="mt-2.5 max-w-md text-base text-slate-500">
          Looks like you don't have any items in your cart to check out. Discover our premium earbuds, smartwatches, bags, and audio gear!
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <ArrowLeft size={16} />
            <span>Explore Products</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Featured categories shortcut */}
        <div className="mt-14 w-full border-t border-slate-200/80 pt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Popular Categories
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              { label: 'Wireless Earbuds', path: '/products?category=earbuds' },
              { label: 'Smartwatches', path: '/products?category=watches' },
              { label: 'Bags & Backpacks', path: '/products?category=bags' },
              { label: 'Headphones', path: '/products?category=headphones' },
            ].map((cat) => (
              <Link
                key={cat.label}
                to={cat.path}
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-primary hover:text-white"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // Render Order Confirmation / Receipt Screen
  if (orderComplete) {
    const finalCity = orderComplete.customer.resolvedCity
    return (
      <main className="bg-slate-50/60 py-10 sm:py-16">
        <div className="mx-auto w-[92%] max-w-3xl">
          {/* Confirmed Banner Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
            {/* Header / Celebration */}
            <div className="bg-gradient-to-r from-primary to-slate-800 p-8 text-center text-white sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
                <CheckCircle2 size={38} />
              </div>
              <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                Order Confirmed!
              </h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                Thank you for shopping with TFiPro,{' '}
                <span className="font-semibold text-white">
                  {orderComplete.customer.firstName} {orderComplete.customer.lastName}
                </span>
                .
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-xs">
                <span>Order Reference:</span>
                <span className="font-mono font-bold tracking-wider text-emerald-400">
                  {orderComplete.id}
                </span>
              </div>
            </div>

            {/* Order Highlights Bar */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/70 p-4 text-center sm:grid-cols-4 sm:p-5">
              <div className="p-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Date Placed
                </span>
                <p className="mt-1 text-xs font-bold text-slate-800 sm:text-sm">
                  {orderComplete.date}
                </p>
              </div>
              <div className="p-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Total Amount
                </span>
                <p className="mt-1 text-xs font-bold text-primary sm:text-sm">
                  {currency}{orderComplete.total.toLocaleString()}
                </p>
              </div>
              <div className="p-2 border-t sm:border-t-0 border-slate-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Payment
                </span>
                <p className="mt-1 text-xs font-bold text-slate-800 sm:text-sm">
                  {orderComplete.paymentMethod === 'cod'
                    ? 'Cash on Delivery'
                    : 'Direct Bank Transfer'}
                </p>
              </div>
              <div className="p-2 border-t sm:border-t-0 border-slate-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Est. Delivery
                </span>
                <p className="mt-1 text-xs font-bold text-emerald-600 sm:text-sm">
                  {orderComplete.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Items Table */}
              <div>
                <h2 className="text-base font-bold text-slate-900">Items Ordered</h2>
                <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/40">
                  {orderComplete.items.map(({ product, quantity }) => {
                    const price = product.discountedPrice ?? product.actualPrice ?? 0
                    return (
                      <div key={product.id} className="flex items-center gap-4 p-4">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-16 w-16 shrink-0 rounded-xl bg-white object-contain p-1 border border-slate-200/60"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-800 truncate">
                            {product.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Qty: <span className="font-semibold text-slate-700">{quantity}</span> × {currency}{price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right text-sm font-bold text-slate-900">
                          {currency}{(price * quantity).toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    {currency}{orderComplete.subtotal.toLocaleString()}
                  </span>
                </div>
                {orderComplete.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({orderComplete.couponCode})</span>
                    <span>-{currency}{orderComplete.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping ({orderComplete.shippingMethod === 'express' ? 'Express Courier' : 'Standard Delivery'})</span>
                  <span className={orderComplete.shippingFee === 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-slate-800'}>
                    {orderComplete.shippingFee === 0 ? 'FREE' : `${currency}${orderComplete.shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t border-slate-200/80 pt-3 flex justify-between text-base font-bold text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-primary text-xl font-extrabold">
                    {currency}{orderComplete.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery & Contact Info */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/70 p-5 bg-white">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Truck size={17} />
                    <span>Shipping Address</span>
                  </div>
                  <div className="mt-3 text-xs leading-relaxed text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800 text-sm">
                      {orderComplete.customer.firstName} {orderComplete.customer.lastName}
                    </p>
                    <p>{orderComplete.customer.address}</p>
                    {orderComplete.customer.apartment && <p>{orderComplete.customer.apartment}</p>}
                    <p>
                      {finalCity}, {orderComplete.customer.province} {orderComplete.customer.postalCode}
                    </p>
                    <p className="font-medium text-slate-700">Phone: {orderComplete.customer.phone}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/70 p-5 bg-white">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <ShieldCheck size={17} />
                    <span>Customer Support & Updates</span>
                  </div>
                  <div className="mt-3 text-xs leading-relaxed text-slate-600 space-y-2">
                    <p>
                      A confirmation email and SMS dispatch updates will be sent to{' '}
                      <span className="font-semibold text-slate-800">{orderComplete.customer.emailOrPhone}</span>.
                    </p>
                    <p className="text-slate-500">
                      Our logistics partner (TCS / Trax Courier) will contact you prior to delivery.
                    </p>
                    <div className="pt-1">
                      <a
                        href={`https://wa.me/923000000000?text=${encodeURIComponent(
                          `Hi TFiPro, I have a question regarding my Order #${orderComplete.id}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        <Sparkles size={13} />
                        <span>Need help? WhatsApp Support</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
                >
                  <Printer size={15} />
                  <span>Print Receipt</span>
                </button>

                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <ShoppingBag size={15} />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-800">
      {/* Checkout Minimal Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-[92%] max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={asset.logo} alt="TFiPro" className="h-10 w-auto object-contain sm:h-12" />
            </Link>
            <span className="hidden sm:inline-block h-5 w-px bg-slate-200" />
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Secure Checkout
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-primary"
            >
              <ArrowLeft size={14} />
              <span>Back to Cart</span>
            </Link>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
              <Lock size={12} className="text-emerald-600" />
              <span>256-bit Encrypted</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Order Summary Bar */}
      <div className="border-b border-slate-200 bg-white lg:hidden">
        <button
          type="button"
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm"
        >
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <ShoppingBag size={18} className="text-primary" />
            <span>{mobileSummaryOpen ? 'Hide order summary' : 'Show order summary'}</span>
            {mobileSummaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          <span className="text-base font-bold text-primary">
            {currency}{grandTotal.toLocaleString()}
          </span>
        </button>

        {mobileSummaryOpen && (
          <div className="border-t border-slate-100 bg-slate-50/70 p-5 space-y-4">
            {/* Products List Mobile */}
            <div className="divide-y divide-slate-200/60 max-h-72 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => {
                const price = product.discountedPrice ?? product.actualPrice ?? 0
                return (
                  <div key={product.id} className="flex items-center gap-3 py-3">
                    <div className="relative h-14 w-14 shrink-0 rounded-xl bg-white p-1 border border-slate-200/70">
                      <img src={product.image} alt={product.title} className="h-full w-full object-contain" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs">
                        {quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{product.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {currency}{price.toLocaleString()} each
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {currency}{(price * quantity).toLocaleString()}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Promo Code Input Mobile */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Discount code (e.g. TFIPRO10)"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs uppercase placeholder:normal-case focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleApplyCoupon()}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-rose-600">{couponError}</p>}
            {appliedCoupon && (
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                <span className="font-medium">Applied: {appliedCoupon.code} ({appliedCoupon.label})</span>
                <button type="button" onClick={handleRemoveCoupon} className="font-bold text-rose-600">
                  Remove
                </button>
              </div>
            )}

            {/* Totals Mobile */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">{currency}{cartTotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-{currency}{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-semibold text-slate-800">{currency}{shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                <span>Total</span>
                <span className="text-primary text-base">{currency}{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="mx-auto w-[92%] max-w-7xl py-8 sm:py-12">
        {/* Breadcrumb Steps */}
        <nav aria-label="Checkout Progress" className="mb-8 flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link to="/cart" className="hover:text-primary transition-colors text-slate-600">
            Cart ({cartCount})
          </Link>
          <span>/</span>
          <span className="font-semibold text-primary">Information & Shipping</span>
          <span>/</span>
          <span>Payment</span>
          <span>/</span>
          <span>Confirmation</span>
        </nav>

        <form onSubmit={handlePlaceOrder} noValidate>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Section 1: Contact Information */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-7">
                <div className="flex items-center justify-between pb-4">
                  <h2 className="text-lg font-bold text-slate-900">1. Contact Information</h2>
                  <span className="text-xs text-slate-400">Required fields *</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="emailOrPhone" className="block text-xs font-semibold text-slate-700">
                      Email or Mobile Phone Number *
                    </label>
                    <input
                      id="emailOrPhone"
                      name="emailOrPhone"
                      type="text"
                      placeholder="e.g. ali.khan@example.com or 03001234567"
                      value={formData.emailOrPhone}
                      onChange={handleInputChange}
                      className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 ${
                        errors.emailOrPhone
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : 'border-slate-200 bg-slate-50/50 focus:border-primary focus:bg-white'
                      }`}
                    />
                    {errors.emailOrPhone && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle size={12} />
                        {errors.emailOrPhone}
                      </p>
                    )}
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      name="keepUpdated"
                      checked={formData.keepUpdated}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span>Email me with news, order tracking updates, and exclusive VIP offers</span>
                  </label>
                </div>
              </div>

              {/* Section 2: Delivery Address */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-7">
                <div className="flex items-center justify-between pb-4">
                  <h2 className="text-lg font-bold text-slate-900">2. Delivery Address</h2>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Truck size={14} className="text-emerald-600" />
                    <span>Nationwide Delivery</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Country Selector (Pre-fixed to Pakistan) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Country / Region
                    </label>
                    <div className="mt-1.5 flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-100/70 px-4 text-sm font-medium text-slate-700">
                      <span>Pakistan (PK)</span>
                      <span className="text-xs text-slate-400">Domestic Delivery</span>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-semibold text-slate-700">
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Ali"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 ${
                          errors.firstName
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                            : 'border-slate-200 bg-slate-50/50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-xs text-rose-500">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-xs font-semibold text-slate-700">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Khan"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 ${
                          errors.lastName
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                            : 'border-slate-200 bg-slate-50/50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-xs text-rose-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label htmlFor="address" className="block text-xs font-semibold text-slate-700">
                      Street Address & House / Building Number *
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="e.g. House 42-B, Sector G, Phase 5, DHA"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 ${
                        errors.address
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : 'border-slate-200 bg-slate-50/50 focus:border-primary focus:bg-white'
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-rose-500">{errors.address}</p>
                    )}
                  </div>

                  {/* Apartment / Suite (Optional) */}
                  <div>
                    <label htmlFor="apartment" className="block text-xs font-semibold text-slate-700">
                      Apartment, Suite, Unit, Floor (Optional)
                    </label>
                    <input
                      id="apartment"
                      name="apartment"
                      type="text"
                      placeholder="e.g. Apt 304, 3rd Floor"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white"
                    />
                  </div>

                  {/* City, Province & Postal Code */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="city" className="block text-xs font-semibold text-slate-700">
                        City *
                      </label>
                      <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:bg-white"
                      >
                        {PAKISTAN_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="province" className="block text-xs font-semibold text-slate-700">
                        Province / Territory *
                      </label>
                      <select
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:bg-white"
                      >
                        {PROVINCES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-xs font-semibold text-slate-700">
                        Postal Code
                      </label>
                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        placeholder="e.g. 54000"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* If "Other" city selected */}
                  {formData.city === 'Other' && (
                    <div>
                      <label htmlFor="customCity" className="block text-xs font-semibold text-slate-700">
                        Specify Your City / Town *
                      </label>
                      <input
                        id="customCity"
                        name="customCity"
                        type="text"
                        placeholder="Enter city or town name"
                        value={formData.customCity}
                        onChange={handleInputChange}
                        className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition-colors ${
                          errors.customCity
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                            : 'border-slate-200 bg-slate-50/50 focus:border-primary focus:bg-white'
                        }`}
                      />
                      {errors.customCity && (
                        <p className="mt-1 text-xs text-rose-500">{errors.customCity}</p>
                      )}
                    </div>
                  )}

                  {/* Phone for courier */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-700">
                      Mobile Phone (for Courier SMS & Rider Delivery Call) *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g. 0300 1234567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 ${
                        errors.phone
                          ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                          : 'border-slate-200 bg-slate-50/50 focus:border-primary focus:bg-white'
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
                  </div>

                  {/* Special Delivery Notes */}
                  <div>
                    <label htmlFor="orderNotes" className="block text-xs font-semibold text-slate-700">
                      Delivery Instructions / Landmark (Optional)
                    </label>
                    <textarea
                      id="orderNotes"
                      name="orderNotes"
                      rows={2}
                      placeholder="e.g. Near City School, please call before arriving or ring bell twice."
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 pt-1">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span>Save this information for instant checkout next time</span>
                  </label>
                </div>
              </div>

              {/* Section 3: Shipping Method */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-7">
                <div className="flex items-center justify-between pb-4">
                  <h2 className="text-lg font-bold text-slate-900">3. Shipping Method</h2>
                  <span className="text-xs text-slate-400">Insured Delivery</span>
                </div>

                <div className="space-y-3">
                  {/* Standard Delivery */}
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">Standard Delivery</p>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            Standard
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Estimated 3 to 4 business days nationwide (TCS / Trax Courier)
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {appliedCoupon?.freeShipping ? (
                        <>
                          <span className="text-slate-400 line-through mr-1 text-xs">{currency}200</span>
                          <span className="text-emerald-600">Free</span>
                        </>
                      ) : (
                        `${currency}200`
                      )}
                    </span>
                  </label>

                  {/* Express Courier */}
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      shippingMethod === 'express'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">Express Priority Courier</p>
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            Fastest
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Estimated 1 to 2 business days via Express Air Delivery
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {appliedCoupon?.freeShipping ? (
                        <>
                          <span className="text-slate-400 line-through mr-1 text-xs">{currency}350</span>
                          <span className="text-emerald-600">Free</span>
                        </>
                      ) : (
                        `${currency}350`
                      )}
                    </span>
                  </label>
                </div>
              </div>

              {/* Section 4: Payment Method */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-7">
                <div className="flex items-center justify-between pb-4">
                  <h2 className="text-lg font-bold text-slate-900">4. Payment Method</h2>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <ShieldCheck size={14} />
                    <span>Secure Transaction</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* COD */}
                  <div
                    className={`overflow-hidden rounded-xl border transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-primary ring-1 ring-primary bg-primary/[0.02]'
                        : 'border-slate-200'
                    }`}
                  >
                    <label className="flex cursor-pointer items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <div className="flex items-center gap-2">
                          <Banknote size={18} className="text-emerald-600" />
                          <span className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                        Most Popular
                      </span>
                    </label>

                    {paymentMethod === 'cod' && (
                      <div className="border-t border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-600 leading-relaxed">
                        <p>
                          Pay in cash when your parcel is delivered to your doorstep. Please make sure to have the exact amount ready of{' '}
                          <span className="font-bold text-primary">{currency}{grandTotal.toLocaleString()}</span> upon arrival.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Direct Bank Transfer */}
                  <div
                    className={`overflow-hidden rounded-xl border transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-primary ring-1 ring-primary bg-primary/[0.02]'
                        : 'border-slate-200'
                    }`}
                  >
                    <label className="flex cursor-pointer items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={paymentMethod === 'bank'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <div className="flex items-center gap-2">
                          <Building2 size={18} className="text-slate-700" />
                          <span className="text-sm font-bold text-slate-900">
                            Direct Bank Transfer / Raast
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">Zero Fees</span>
                    </label>

                    {paymentMethod === 'bank' && (
                      <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5 space-y-3 text-xs">
                        <p className="text-slate-600">
                          Make your payment directly into our bank account. Use your Order ID as the payment reference:
                        </p>
                        <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 font-mono text-[11px]">
                          <div className="flex justify-between items-center text-slate-700">
                            <span className="text-slate-400 font-sans">Bank:</span>
                            <span className="font-bold">Meezan Bank Ltd</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-700">
                            <span className="text-slate-400 font-sans">Title:</span>
                            <span className="font-bold">TFiPro Technologies PVT</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-700">
                            <span className="text-slate-400 font-sans">IBAN:</span>
                            <div className="flex items-center gap-1.5 font-bold">
                              <span>PK36MEZN0001020304050607</span>
                              <button
                                type="button"
                                onClick={() => handleCopy('PK36MEZN0001020304050607', 'iban')}
                                className="cursor-pointer text-primary hover:text-primary/70"
                                title="Copy IBAN"
                              >
                                {copiedField === 'iban' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-slate-700">
                            <span className="text-slate-400 font-sans">Raast ID:</span>
                            <div className="flex items-center gap-1.5 font-bold">
                              <span>03000000000</span>
                              <button
                                type="button"
                                onClick={() => handleCopy('03000000000', 'raast')}
                                className="cursor-pointer text-primary hover:text-primary/70"
                                title="Copy Raast"
                              >
                                {copiedField === 'raast' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Please send the payment receipt screenshot via WhatsApp to <span className="font-semibold text-slate-700">+92 300 0000000</span> along with your Order ID for instant verification.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Complete Order Button (Desktop & Mobile) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary py-4 px-6 text-base font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/95 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2.5">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Processing Your Order...</span>
                    </div>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>Complete Order • {currency}{grandTotal.toLocaleString()}</span>
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-slate-400">
                  By placing your order, you agree to TFiPro's{' '}
                  <Link to="/terms-of-service" className="underline hover:text-primary">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="underline hover:text-primary">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              {/* Trust badges footer */}
              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 text-center text-xs text-slate-600">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={20} className="text-primary" />
                  <span className="font-semibold text-slate-800">100% Original</span>
                  <span className="text-[10px] text-slate-400">Official Brand Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-slate-100">
                  <Clock size={20} className="text-primary" />
                  <span className="font-semibold text-slate-800">7-Day Returns</span>
                  <span className="text-[10px] text-slate-400">Easy Check Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Lock size={20} className="text-primary" />
                  <span className="font-semibold text-slate-800">Safe Checkout</span>
                  <span className="text-[10px] text-slate-400">SSL Encrypted</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Order Summary (5 cols) */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="sticky top-24 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
                  <span className="text-xs font-semibold text-slate-500">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Items List */}
                <div className="mt-4 max-h-[340px] divide-y divide-slate-100 overflow-y-auto pr-1">
                  {cart.map(({ product, quantity }) => {
                    const price = product.discountedPrice ?? product.actualPrice ?? 0
                    return (
                      <div key={product.id} className="flex items-center gap-4 py-3.5">
                        <div className="relative h-16 w-16 shrink-0 rounded-2xl bg-slate-50 p-1.5 border border-slate-200/60">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-full w-full object-contain"
                          />
                          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs">
                            {quantity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-semibold text-slate-800 truncate" title={product.title}>
                            {product.title}
                          </h3>
                          {product.subcategory && (
                            <p className="text-[10px] uppercase tracking-wider text-slate-400">
                              {product.subcategory}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {currency}{price.toLocaleString()}
                            </span>
                            {/* Quantity Controls inside summary */}
                            <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1 py-0.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="cursor-pointer text-slate-400 hover:text-slate-700"
                                title="Decrease"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="w-4 text-center text-[10px] font-bold text-slate-800">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="cursor-pointer text-slate-400 hover:text-slate-700"
                                title="Increase"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900">
                            {currency}{(price * quantity).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="block mt-1 cursor-pointer text-slate-300 hover:text-rose-500 transition-colors ml-auto"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Promo Code Input Module */}
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={15} className="absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Discount code or gift card"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2.5 text-xs uppercase placeholder:normal-case focus:border-primary focus:bg-white focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-800 active:scale-95"
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && (
                    <p className="mt-2 text-xs font-medium text-rose-500">{couponError}</p>
                  )}

                  {appliedCoupon && (
                    <div className="mt-2.5 flex items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-2 text-xs text-emerald-800 border border-emerald-100">
                      <div className="flex items-center gap-1.5">
                        <Tag size={13} className="text-emerald-600" />
                        <span className="font-bold">{appliedCoupon.code}</span>
                        <span className="text-emerald-600">({appliedCoupon.label})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="cursor-pointer font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Suggest Coupon Pills */}
                  {!appliedCoupon && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">Try code:</span>
                      {AVAILABLE_COUPONS.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleApplyCoupon(c.code)}
                          className="cursor-pointer rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Summary Breakdown */}
                <div className="mt-5 border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      {currency}{cartTotal.toLocaleString()}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-{currency}{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="font-semibold text-slate-900">
                      {currency}{shippingFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Sales Tax</span>
                    <span>Included</span>
                  </div>

                  <div className="border-t border-slate-200/80 pt-3 flex justify-between items-baseline text-slate-900">
                    <div>
                      <span className="text-sm font-bold">Total</span>
                      <p className="text-[10px] text-slate-400">Including shipping & applicable taxes</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-primary">
                        {currency}{grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Service Help Box */}
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <HelpCircle size={15} className="text-primary" />
                    <span>Questions about your order?</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                    Our Lahore support team is available Mon-Sat (10 AM - 8 PM). Call{' '}
                    <a href="tel:+923000000000" className="font-semibold text-primary underline">
                      +92 300 0000000
                    </a>{' '}
                    or message us on WhatsApp for rapid assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
