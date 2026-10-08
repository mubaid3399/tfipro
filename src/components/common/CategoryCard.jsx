import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const CategoryCard = ({ title, itemCount, image, link, startingPrice }) => {
  return (
    <Link
      to={link || '/products'}
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-xl"
    >
      {/* Category Image with circular badge effect */}
      <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-xl bg-white p-3 shadow-inner">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      {/* Category Info */}
      <div className="mt-4 flex w-full flex-col items-center text-center">
        <div className="flex items-center gap-1">
          <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-primary">
            {title}
          </h3>
          <ArrowUpRight
            size={16}
            className="text-slate-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-primary"
          />
        </div>

        {itemCount !== undefined && (
          <span className="mt-0.5 text-xs font-medium text-slate-500">
            {itemCount} Products
          </span>
        )}

        {startingPrice && (
          <span className="mt-1 text-xs font-semibold text-primary">
            Starting at Rs.{startingPrice.toLocaleString()}
          </span>
        )}
      </div>
    </Link>
  )
}

export default CategoryCard
