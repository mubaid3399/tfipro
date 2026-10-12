import { PackageCheck, ThumbsUp, RotateCcw, Coins } from 'lucide-react'

const features = [
  {
    icon: <PackageCheck size={36} strokeWidth={1.5} />,
    title: 'Express Delivery',
    subtitle: 'All Over Pakistan',
  },
  {
    icon: <ThumbsUp size={36} strokeWidth={1.5} />,
    title: 'Positive Feedback',
    subtitle: '99% Customer Satisfaction Rate',
  },
  {
    icon: <RotateCcw size={36} strokeWidth={1.5} />,
    title: 'Easy Return & Refunds',
    subtitle: 'T&Cs Apply',
  },
  {
    icon: <Coins size={36} strokeWidth={1.5} />,
    title: 'Cost Saving',
    subtitle: 'Excellent Price & Sales',
  },
]

const Features = () => {
  return (
    <section className="mx-auto w-[90%] max-w-7xl py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-[#001a2e] md:text-4xl">
          Why Choose Us
        </h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-primary" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
          >
            {/* Subtle border effect */}
            <div className="absolute inset-0 rounded-2xl border border-slate-100 transition-colors duration-300 group-hover:border-primary/10" />
            
            <div className="mb-5 flex items-center justify-center text-[#001a2e] transition-transform duration-300 group-hover:scale-110">
              {feature.icon}
            </div>
            <h3 className="mb-2 text-base font-bold text-[#001a2e]">{feature.title}</h3>
            <p className="text-sm font-medium text-slate-500">{feature.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
