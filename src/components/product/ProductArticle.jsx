import { useState } from 'react'
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Truck,
  MapPin,
  CheckCircle2,
  Cpu,
  Layers,
  Palette,
  Eye,
  Shirt,
  Wrench,
  Compass,
} from 'lucide-react'

const ProductArticle = ({ product, seoData }) => {
  const [openFaq, setOpenFaq] = useState(0)

  if (!product || !seoData) return null

  const {
    baseTitle,
    activeColor,
    colorProfile,
    aeoFacts,
    technicalSpecs,
    faqs,
    geoData,
  } = seoData

  const price = product.discountedPrice ?? product.actualPrice ?? 0

  return (
    <article className="mt-14 space-y-12 border-t border-slate-200/90 pt-10 sm:mt-20 sm:space-y-16 sm:pt-14">
      {/* 1. AEO (Answer Engine Optimization) & Quick Answer Executive Summary */}
      <section
        id="aeo-overview"
        aria-labelledby="aeo-heading"
        className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 p-6 shadow-sm sm:p-9"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
              <Sparkles size={16} />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                AEO Fact Sheet & Quick Summary
              </span>
              <h2 id="aeo-heading" className="text-lg font-extrabold text-slate-900 sm:text-2xl">
                {baseTitle} — Quick Facts & Buying Guide
              </h2>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Verified TFiPro Catalog 2026
          </span>
        </div>

        {/* TL;DR Direct Answer for AI Answer Engines & Search Engines */}
        <div className="mt-6 rounded-2xl bg-white p-5 border border-slate-200/70 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Executive Summary / TL;DR
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">
            The <strong>{baseTitle}</strong>{activeColor ? ` in ${activeColor}` : ''} is available at TFiPro for{' '}
            <strong className="text-primary font-bold">Rs. {price.toLocaleString()}</strong>. Built with premium materials, high-precision engineering, and everyday moisture resistance, it comes with nationwide <strong>Cash on Delivery (COD)</strong> across Pakistan, a <strong>7-day replacement warranty</strong>, and express courier dispatch (1–3 business days).
          </p>
        </div>

        {/* Key Metrics Quick Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
            <span className="text-[11px] font-medium text-slate-500">Official Price</span>
            <p className="mt-1 text-base font-extrabold text-slate-900 sm:text-lg">
              Rs. {price.toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">Best Price in Pakistan</span>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
            <span className="text-[11px] font-medium text-slate-500">Nationwide Delivery</span>
            <p className="mt-1 text-base font-extrabold text-slate-900 sm:text-lg">
              1–3 Days
            </p>
            <span className="text-[10px] text-slate-500 font-medium">TCS, Trax & PostEx</span>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
            <span className="text-[11px] font-medium text-slate-500">Payment Modes</span>
            <p className="mt-1 text-base font-extrabold text-slate-900 sm:text-lg">
              COD & Raast
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Doorstep Cash or Online</span>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
            <span className="text-[11px] font-medium text-slate-500">Warranty Protection</span>
            <p className="mt-1 text-base font-extrabold text-slate-900 sm:text-lg">
              7-Day Checking
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">100% Replacement Cover</span>
          </div>
        </div>

        {/* Natural Language Q&A Snippets for Voice Search & AI Engines */}
        <div className="mt-6 space-y-3">
          {aeoFacts.map((fact, idx) => (
            <div key={idx} className="rounded-xl border border-slate-100 bg-white/80 p-4">
              <h3 className="text-xs font-bold text-slate-900 sm:text-sm">
                Q: {fact.question}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                A: {fact.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. DEDICATED COLOR VARIANT SPOTLIGHT ARTICLE (Dynamically changes with selected color!) */}
      {activeColor && colorProfile && (
        <section
          id="color-variant-article"
          aria-labelledby="color-variant-heading"
          className="rounded-3xl border-2 border-primary/20 bg-white p-6 shadow-md sm:p-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Palette size={20} />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Dedicated Color Variant Spotlight
                </span>
                <h2 id="color-variant-heading" className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {colorProfile.title}
                </h2>
              </div>
            </div>

            <span className="rounded-full bg-primary px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {activeColor} Variant
            </span>
          </div>

          <p className="mt-5 text-base font-semibold text-slate-800 sm:text-lg">
            "{colorProfile.headline}"
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {colorProfile.description}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Aesthetics & Personality */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Eye size={17} />
                <span>Dial Contrast & Legibility</span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {colorProfile.dialDetail}
              </p>
            </div>

            {/* Wardrobe & Styling */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Shirt size={17} />
                <span>Styling & Wardrobe Guide</span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {colorProfile.stylingGuide}
              </p>
            </div>

            {/* Finish & Care */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Wrench size={17} />
                <span>Maintenance & Finish Care</span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {colorProfile.finishCare}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 3. IN-DEPTH PRODUCT & ENGINEERING ARTICLE */}
      <section
        id="product-deep-dive"
        aria-labelledby="deep-dive-heading"
        className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Layers size={18} />
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              In-Depth Product Review
            </span>
            <h2 id="deep-dive-heading" className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Why the {baseTitle} Outperforms Its Class
            </h2>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 sm:text-base space-y-4">
          <p>
            When searching for reliable, design-forward tech and lifestyle gear in Pakistan, consumers frequently encounter a trade-off between astronomical luxury prices and unreliable generic alternatives. The <strong>{baseTitle}</strong> was curated to bridge that exact divide, uniting uncompromising aesthetic execution with dependable everyday reliability.
          </p>

          <h3 className="text-base font-bold text-slate-900 sm:text-lg pt-2">
            1. Precision Engineering & Tactile Architecture
          </h3>
          <p>
            Every contour of the {baseTitle} has been balanced to distribute weight naturally across the user, minimizing pressure points during extended wear or commute. The case profile and bezel treatments resist everyday friction against shirt cuffs and pockets, while the high-clarity lens protects against microscopic abrasions.
          </p>

          <h3 className="text-base font-bold text-slate-900 sm:text-lg pt-2">
            2. Calibrated for Pakistani Climate & Conditions
          </h3>
          <p>
            Summer heat, monsoon humidity, and daily road dust place unique demands on electronics and personal accessories in Pakistan. The {baseTitle} incorporates sealed chassis points and sweat-resistant coatings to maintain structural integrity and color vibrancy through high-heat environments.
          </p>

          <h3 className="text-base font-bold text-slate-900 sm:text-lg pt-2">
            3. Who Should Buy This Model?
          </h3>
          <p>
            This model is ideal for corporate professionals, university students, and fashion enthusiasts seeking a sophisticated statement piece that transitions effortlessly between casual gatherings and formal celebratory events.
          </p>
        </div>
      </section>

      {/* 4. VERIFIED TECHNICAL SPECIFICATIONS MATRIX */}
      <section
        id="technical-specs"
        aria-labelledby="specs-heading"
        className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white">
            <Cpu size={18} />
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Full Hardware Sheet
            </span>
            <h2 id="specs-heading" className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Technical Specifications & Matrix
            </h2>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs sm:text-sm">
            <tbody className="divide-y divide-slate-100">
              {technicalSpecs.map((spec, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'} hover:bg-slate-100/60`}
                >
                  <th
                    scope="row"
                    className="w-1/3 py-3.5 px-4 font-semibold text-slate-700 sm:px-6"
                  >
                    {spec.label}
                  </th>
                  <td className="py-3.5 px-4 font-medium text-slate-900 sm:px-6">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. PAKISTAN GEO & LOCAL DELIVERY TARGETING */}
      <section
        id="geo-delivery-pakistan"
        aria-labelledby="geo-heading"
        className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl sm:p-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
              <MapPin size={22} />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Local GEO Fulfillment Intelligence
              </span>
              <h2 id="geo-heading" className="text-xl font-extrabold sm:text-2xl">
                Nationwide Courier Delivery Across Pakistan
              </h2>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            Dispatched from Lahore Hub
          </span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
          TFiPro delivers securely to all 150+ districts across Pakistan through partnerships with TCS, Trax, and PostEx. Every parcel is safely wrapped with shock-absorbent protective padding.
        </p>

        {/* Hub Delivery Schedule Grid */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {geoData.hubs.map((hub, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-white/5 px-4 py-3 text-xs"
            >
              <span className="font-semibold text-slate-200">{hub.city}</span>
              <span className="font-medium text-emerald-400">{hub.deliveryTime}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/10 p-5 border border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white">Need Urgent Delivery or Help in Your City?</h3>
            <p className="text-xs text-slate-300">
              Speak directly with our Lahore dispatch desk on WhatsApp.
            </p>
          </div>
          <a
            href={geoData.officialWhatsApp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition-transform hover:scale-105 active:scale-95"
          >
            <span>WhatsApp Support ({geoData.supportHotline})</span>
          </a>
        </div>
      </section>

      {/* 6. INTERACTIVE FAQS SECTION (FAQPage Schema backed) */}
      <section
        id="product-faqs"
        aria-labelledby="faqs-heading"
        className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white">
            <HelpCircle size={18} />
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Frequently Asked Questions
            </span>
            <h2 id="faqs-heading" className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Common Questions About {baseTitle}
            </h2>
          </div>
        </div>

        <div className="mt-6 divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between text-left text-sm font-bold text-slate-900 transition-colors hover:text-primary sm:text-base"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm pr-6 animate-fadeIn">
                    {faq.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </article>
  )
}

export default ProductArticle
