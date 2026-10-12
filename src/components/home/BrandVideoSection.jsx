import { Volume2, Feather, Bluetooth, ShieldCheck } from 'lucide-react'

const BrandVideoSection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-6 sm:py-12 md:py-16 lg:py-24">
      {/* Massive Background Text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="whitespace-nowrap text-[20vw] font-black tracking-tighter text-slate-50 opacity-60 select-none">
          TFIPRO
        </span>
      </div>

      <div className="relative z-10 mx-auto grid w-[90%] max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-12 lg:gap-20">
        {/* Left Side: Video */}
        <div className="col-span-1 md:col-span-5 lg:col-span-4">
          <div className="relative aspect-[9/16] w-full max-w-sm mx-auto overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl shadow-primary/10">
            {/* Replace src with your actual generated video */}
            <video
              src="/videos/video2.mp4" 
              className="absolute inset-0 h-full w-full object-cover opacity-80"
              autoPlay
              loop
              muted
              playsInline
            />
            
            {/* Optional Overlay / Branding inside video */}
            <div className="absolute inset-x-0 top-12 flex justify-center">
              <span className="text-xl font-light tracking-[0.3em] text-white/90">
                TFIPRO
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="col-span-1 md:col-span-7 lg:col-span-8">
          <h2 className="mb-6 font-serif text-3xl italic text-slate-900 md:text-4xl lg:text-5xl lg:leading-tight">
            "Crafting audio that resonates, long after the song ends."
          </h2>
          
          <p className="mb-12 max-w-2xl text-base leading-relaxed text-slate-600">
            At TFiPro, we believe your sound is your silent sanctuary. Using premium materials and cutting-edge acoustics, we create long-lasting, luxury audio designed for the modern soul.
          </p>

          <div className="mb-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {/* Feature 1 */}
            <div>
              <Volume2 size={24} strokeWidth={1.5} className="mb-4 text-slate-800" />
              <h3 className="mb-1.5 text-xs font-bold tracking-[0.15em] text-slate-900 uppercase">
                Pure High-Fidelity
              </h3>
              <p className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                Immersive & Premium Drivers.
              </p>
            </div>

            {/* Feature 2 */}
            <div>
              <Feather size={24} strokeWidth={1.5} className="mb-4 text-slate-800" />
              <h3 className="mb-1.5 text-xs font-bold tracking-[0.15em] text-slate-900 uppercase">
                Crafted For Comfort
              </h3>
              <p className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                Redefining Ergonomic Design.
              </p>
            </div>

            {/* Feature 3 */}
            <div>
              <Bluetooth size={24} strokeWidth={1.5} className="mb-4 text-slate-800" />
              <h3 className="mb-1.5 text-xs font-bold tracking-[0.15em] text-slate-900 uppercase">
                Seamless Connectivity
              </h3>
              <p className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                Bluetooth 5.3 & Zero Lag.
              </p>
            </div>

            {/* Feature 4 */}
            <div>
              <ShieldCheck size={24} strokeWidth={1.5} className="mb-4 text-slate-800" />
              <h3 className="mb-1.5 text-xs font-bold tracking-[0.15em] text-slate-900 uppercase">
                Luxury Build Quality
              </h3>
              <p className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                Durable & Elegant Finish.
              </p>
            </div>
          </div>

          <hr className="mb-8 border-slate-100" />

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <button className="rounded-full bg-black px-8 py-4 text-xs font-bold tracking-[0.15em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg hover:shadow-black/20">
              Discover Your Sound
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">
                Standard Of Quality
              </span>
              <span className="text-[11px] font-bold tracking-widest text-slate-800 uppercase">
                TFiPro Premium Series
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandVideoSection
