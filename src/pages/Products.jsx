import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/common/ProductCard'

const Products = () => {
  const { products } = useProducts()

  return (
    <main className="mx-auto min-h-[60vh] w-[90%] py-10 sm:py-14">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          All Products
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Explore our complete collection of {products.length} audio, backpack, and tech essentials
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}

export default Products