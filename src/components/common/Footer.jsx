import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { asset } from '../../assets/asset'

const Facebook = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
const Instagram = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
const Twitter = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
const Youtube = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>

const Footer = () => {
  return (
    <footer className="bg-[#001B2D] pt-24 text-white">
      <div className="mx-auto w-[90%] max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 lg:pr-6">
            <Link to="/">
              {/* Using CSS invert to make the dark logo white on the dark background */}
              <img 
                src={asset.logo} 
                alt="TFiPro" 
                className="h-14 w-auto object-contain brightness-0 invert" 
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-300">
              Redefining the standards of luxury audio. Experience pure high-fidelity sound designed for the modern soul in Pakistan and beyond.
            </p>
            <div className="mt-2 flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#001B2D]">
                <Facebook />
              </a>
              <a href="#" aria-label="Instagram" className="rounded-full bg-white/10 p-2.5 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#001B2D]">
                <Instagram />
              </a>
              <a href="#" aria-label="Twitter" className="rounded-full bg-white/10 p-2.5 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#001B2D]">
                <Twitter />
              </a>
              <a href="#" aria-label="YouTube" className="rounded-full bg-white/10 p-2.5 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#001B2D]">
                <Youtube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Quick Links</h3>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-300">
              <li><Link to="/" className="transition-colors hover:text-white">Home</Link></li>
              <li><Link to="/products" className="transition-colors hover:text-white">All Products</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-white">Contact Support</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Categories</h3>
            <ul className="flex flex-col gap-4 text-sm font-medium text-slate-300">
              <li><Link to="/products?category=earbuds" className="transition-colors hover:text-white">Wireless Earbuds</Link></li>
              <li><Link to="/products?category=headphones" className="transition-colors hover:text-white">Over-Ear Headphones</Link></li>
              <li><Link to="/products?category=microphones" className="transition-colors hover:text-white">Microphones</Link></li>
              <li><Link to="/products?category=accessories" className="transition-colors hover:text-white">Accessories</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Stay Updated</h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-300">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="relative mt-2 flex items-center" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-full bg-white/10 px-6 py-3.5 pr-14 text-sm font-medium text-white placeholder-slate-400 outline-none transition-all focus:bg-white/15 focus:ring-2 focus:ring-white/20"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#001B2D] transition-transform hover:scale-105"
              >
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between border-t border-white/10 py-8 text-xs font-medium tracking-wide text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} TFiPro. All rights reserved.</p>
          <div className="mt-4 flex gap-6 sm:mt-0">
            <Link to="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link to="/terms-of-service" className="transition-colors hover:text-white">Terms of Service</Link>
            <Link to="/shipping-policy" className="transition-colors hover:text-white">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
