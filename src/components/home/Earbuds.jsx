import ProductCard from '../common/ProductCard'
import { useProducts } from '../../context/ProductContext'

const Earbuds = () => {
  const { earbuds } = useProducts()

  return (
    <section className="mx-auto w-[90%] py-6 sm:py-8" aria-labelledby="earbuds-heading">
      <h2
        id="earbuds-heading"
        className="mb-4 text-xl font-bold tracking-tight text-primary sm:text-2xl"
      >
        Wireless Earbuds
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {earbuds.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default Earbuds
