import ProductCard from '../common/ProductCard'
import { useProducts } from '../../context/ProductContext'

const Accessories = () => {
  const { accessories } = useProducts()

  return (
    <section className="mx-auto w-[90%] py-6 sm:py-8" aria-labelledby="accessories-heading">
      <h2
        id="accessories-heading"
        className="mb-4 text-xl font-bold tracking-tight text-primary sm:text-2xl"
      >
        Tech Accessories
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {accessories.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default Accessories
