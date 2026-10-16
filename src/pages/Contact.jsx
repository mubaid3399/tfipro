import { useState } from 'react'
import { useProducts } from '../context/ProductContext'

const details = [
  { label: 'Phone', value: '+92 300 0000000', href: 'tel:+923000000000' },
  { label: 'Email', value: 'support@tfipro.com', href: 'mailto:support@tfipro.com' },
  { label: 'Address', value: 'Gulberg III, Lahore, Pakistan' },
  { label: 'Hours', value: 'Monday to Saturday, 10:00 AM – 8:00 PM' },
]

const inputClass =
  'mt-2 w-full rounded-md bg-neutral-100 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:bg-neutral-200/70 focus-visible:ring-2 focus-visible:ring-primary'

const Contact = () => {
  const { showToast } = useProducts()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Connect this to your backend or email service here.
    setSubmitted(true)
    showToast('Your message has been sent successfully!')
  }

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' })
    setSubmitted(false)
  }

  return (
    <main className="bg-white text-neutral-800">
      <section className="mx-auto w-[90%] max-w-6xl py-16 lg:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl">
            Contact us
          </h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
            Have a question about an order, a product or your warranty? Send us a message and we will
            reply as soon as possible.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-5 lg:gap-20">
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div role="status">
                <h2 className="text-2xl font-bold text-neutral-900">Thank you, {formData.name}.</h2>
                <p className="mt-3 max-w-md text-base leading-relaxed text-neutral-600">
                  We have received your message and will reply to {formData.email} shortly.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 rounded-md bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-200"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-neutral-900">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-neutral-900">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium text-neutral-900">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-primary px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Send message
                </button>
              </form>
            )}
          </div>

          {/* Contact details */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-neutral-900">Contact details</h2>
            <dl className="mt-6 space-y-6">
              {details.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm text-neutral-500">{item.label}</dt>
                  <dd className="mt-1 text-base text-neutral-900">
                    {item.href ? (
                      <a href={item.href} className="hover:text-primary">
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact