import { Link } from 'react-router-dom'
import { asset } from '../assets/asset'

const stats = [
  { value: '50,000+', label: 'Customers across Pakistan' },
  { value: '36+', label: 'Cities delivered to' },
  { value: '24 months', label: 'Warranty on all products' },
  { value: '2021', label: 'Year founded' },
]

const values = [
  {
    title: 'Honest sound',
    desc: 'We tune our products to reproduce music as it was recorded, without exaggerated bass that hides vocals and detail.',
  },
  {
    title: 'Durable build',
    desc: 'We choose metal frames, reinforced cables and quality components so a product lasts for years of daily use, not months.',
  },
  {
    title: 'Fair pricing',
    desc: 'We design in-house and sell directly to customers, which keeps prices reasonable without cutting quality.',
  },
  {
    title: 'Local support',
    desc: 'Every product carries an official Pakistani warranty, backed by a support team you can reach when you need help.',
  },
]

const milestones = [
  {
    year: '2021',
    title: 'TFiPro is founded',
    desc: 'Started in Lahore with a simple aim: make well-built audio gear that people in Pakistan can afford and get supported locally.',
  },
  {
    year: '2022',
    title: 'First wireless earbuds',
    desc: 'Launched our first earbuds range, which gained a loyal following among music lovers, gamers and creators.',
  },
  {
    year: '2023',
    title: 'Over-ear headphones',
    desc: 'Introduced studio-style headphones and microphones for podcasters and content creators.',
  },
  {
    year: '2024',
    title: 'Wider product range',
    desc: 'Added smartwatches, bags and desk accessories to complement our audio line.',
  },
  {
    year: '2025',
    title: 'Next generation audio',
    desc: 'Working on improved Bluetooth performance, better battery life and more sustainable materials.',
  },
]

const promises = [
  { title: 'Official warranty', desc: 'Genuine replacement support on every product.' },
  { title: 'Fast delivery', desc: '2–4 business days anywhere in Pakistan.' },
  { title: '7-day inspection', desc: 'Check your order and return it if it is not right.' },
  { title: 'Real people', desc: 'Support from a team that knows the products.' },
]

const About = () => {
  return (
    <main className="bg-white text-neutral-800">
      {/* Hero */}
      <section className="mx-auto w-[90%] max-w-7xl py-16 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl">
              Quality audio, built for everyday listening
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              TFiPro designs headphones, earbuds and accessories for people who care about how things
              sound and how long they last. We sell directly to customers across Pakistan and stand
              behind every product with a warranty and real support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Shop products
              </Link>
              <Link
                to="/contact"
                className="rounded-md bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-200"
              >
                Contact us
              </Link>
            </div>
          </div>

          <img
            src={asset.aboutHero}
            alt="TFiPro audio products"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-neutral-100 py-12">
        <dl className="mx-auto grid w-[90%] max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-3xl font-bold text-neutral-900">{stat.value}</dt>
              <dd className="mt-1 text-sm text-neutral-600">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Our story */}
      <section className="mx-auto w-[90%] max-w-7xl py-16 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <img
            src={asset.aboutLab}
            alt="TFiPro team testing audio products"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Our story</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-600">
              <p>
                When we started in 2021, buyers in Pakistan had two options: imported products with
                high prices and no local support, or low-cost alternatives that failed within months.
              </p>
              <p>
                We started TFiPro to offer a third option: well-built products with good sound, sold
                at fair prices and covered by a warranty we honor.
              </p>
              <p>
                Today, customers from Karachi to Lahore, Islamabad and beyond use TFiPro products for
                music, work, gaming and content creation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-100 py-16 lg:py-24">
        <div className="mx-auto w-[90%] max-w-7xl">
          <h2 className="max-w-xl text-3xl font-bold text-neutral-900">What we stand for</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {values.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-2 max-w-md text-base leading-relaxed text-neutral-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto w-[90%] max-w-4xl py-16 lg:py-24">
        <h2 className="text-3xl font-bold text-neutral-900">Our journey</h2>
        <ul className="mt-10 divide-y divide-neutral-200">
          {milestones.map((item) => (
            <li key={item.year} className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[120px_1fr] sm:gap-8">
              <span className="text-lg font-semibold text-primary">{item.year}</span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-1 text-base leading-relaxed text-neutral-600">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Customer promises */}
      <section className="bg-neutral-100 py-16">
        <div className="mx-auto grid w-[90%] max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((item) => (
            <div key={item.title}>
              <h3 className="text-base font-semibold text-neutral-900">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-neutral-900 py-16 text-white">
        <div className="mx-auto w-[90%] max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Find the right pair for you</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-300">
            Browse our range of headphones, earbuds and accessories, or get in touch if you need help
            choosing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-opacity hover:opacity-90"
            >
              Shop products
            </Link>
            <Link
              to="/contact"
              className="rounded-md bg-neutral-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About