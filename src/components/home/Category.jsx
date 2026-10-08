import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Headphones, Mic, Briefcase, Zap, Music } from 'lucide-react'
import ProductCard from '../common/ProductCard'
import { products } from '../../data/products'

const CATEGORIES = [
  {
    id: 'all',
    label: 'All Products',
    icon: Sparkles,
    description: 'Browse our complete catalog of audio and tech gear',
    filter: () => true,
  },
  {
    id: 'earbuds',
    label: 'Wireless Earbuds',
    icon: Music,
    description: 'Crisp wireless audio, active noise cancellation & ergonomic comfort',
    filter: (p) => p.id.startsWith('earbud'),
  },
  {
    id: 'headphones',
    label: 'Headphones',
    icon: Headphones,
    description: 'Immersive soundstage, deep bass & plush over-ear padding',
    filter: (p) => p.id.startsWith('headphone'),
  },
  {
    id: 'bags',
    label: 'Backpacks & Bags',
    icon: Briefcase,
    description: 'Hard-shell protection, laptop sleeves & modern urban travel gear',
    filter: (p) => p.id.startsWith('bag'),
  },
  {
    id: 'microphones',
    label: 'Microphones',
    icon: Mic,
    description: 'Studio-grade vocal recording, podcasting & RGB gaming streaming mics',
    filter: (p) => p.id.startsWith('microphone'),
  },
  {
    id: 'accessories',
    label: 'Tech Accessories',
    icon: Zap,
    description: 'Fast wireless charging stations, high-capacity power banks & tools',
    filter: (p) => p.id.startsWith('accessory'),
  },
]

const Category = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('all')

  const currentCategoryMeta = useMemo(() => {
    return CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0]
  }, [activeCategory])

  const filteredProducts = useMemo(() => {
    const categoryConfig = CATEGORIES.find((c) => c.id === activeCategory)
    if (!categoryConfig) return products
    return products.filter(categoryConfig.filter)
  }, [activeCategory])

  return (
    <section
      className="mx-auto w-[90%] py-10 sm:py-16"
      aria-labelledby="categories-showcase-title"
    >
      {/* Section Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Curated Collections</span>
          </div>
          <h2
            id="categories-showcase-title"
            className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl lg:text-4xl"
          >
            Shop By Category
          </h2>
          <p className="mt-1 text-sm text-slate-500 max-w-xl">
            {currentCategoryMeta.description}
          </p>
        </div>

        <Link
          to="/products"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/70"
        >
          <span>View All Products</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Category Pills / Filter Tabs */}
      <div
        className="mt-8 flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Filter products by category"
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(cat.id)}
              className={`group inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <Icon
                size={15}
                className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'}
              />
              <span>{cat.label}</span>
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {cat.id === 'all'
                  ? products.length
                  : products.filter(cat.filter).length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Product Grid - Inspired by the User Reference Image */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary to-slate-900 p-6 text-white sm:flex-row sm:p-8">
        <div>
          <h3 className="text-lg font-bold sm:text-xl">
            Can't find what you are looking for?
          </h3>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            Check our full catalog with advanced filters, specs comparison, and warranty info.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-primary shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <span>Explore All Gear</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}

export default Category
