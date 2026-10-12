import { useState } from 'react'
import { Plus } from 'lucide-react'

const faqs = [
  {
    question: "What is TFiPro's return policy?",
    answer: "We offer a 7-day easy return policy for all our products. If you're not fully satisfied, you can return your item in its original, unopened condition for a full refund or exchange. T&Cs apply."
  },
  {
    question: "How long does shipping take within Pakistan?",
    answer: "Our standard delivery takes 3-5 business days across Pakistan. We also offer express delivery in major cities like Karachi, Lahore, and Islamabad, which typically takes 1-2 business days."
  },
  {
    question: "Do your products come with a warranty?",
    answer: "Yes, all TFiPro electronics come with a standard 6-month brand warranty covering manufacturing defects. If you face any issues, our support team is ready to assist you."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is dispatched, you will receive an SMS and email with a tracking link. You can use that link to monitor your delivery status in real-time."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We offer Cash on Delivery (COD) nationwide. We also accept direct bank transfers, JazzCash, EasyPaisa, and all major credit/debit cards via secure payment gateways."
  },
  {
    question: "Are TFiPro earbuds compatible with both iOS and Android?",
    answer: "Absolutely! Our wireless earbuds and headphones use universal Bluetooth 5.3 connectivity, ensuring seamless, zero-lag pairing with both Apple iOS and Android devices."
  }
]

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-10 sm:py-16 md:py-24">
      <div className="mx-auto w-[90%] max-w-5xl">
        <h2 className="mb-12 text-center text-4xl font-semibold text-[#001B2D] md:text-5xl">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div key={index} className="flex flex-col text-[#001B2D]">
                <button
                  onClick={() => toggleFaq(index)}
                  className="group flex w-full items-center justify-between bg-slate-100 p-6 text-left transition-colors hover:bg-slate-200 md:px-8 md:py-7"
                >
                  <span className="text-xl font-medium tracking-wide md:text-2xl">
                    {faq.question}
                  </span>
                  <Plus
                    size={40}
                    strokeWidth={1}
                    className={`shrink-0 text-[#001B2D] transition-transform duration-300 ease-[cubic-bezier(0.5,0,0.1,1)] ${
                      isOpen ? 'rotate-45' : 'rotate-0'
                    }`}
                  />
                </button>

                {/* CSS Grid hack for smooth accordion expansion */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.5,0,0.1,1)] ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden bg-slate-100 border-t-2 border-white">
                    <div className="p-6 text-lg font-medium leading-relaxed text-slate-600 md:px-8 md:py-8 md:text-xl">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Faqs
