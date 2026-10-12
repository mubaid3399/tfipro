import { useEffect, useRef, useState } from 'react'
import { Quote } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const opinions = [
  {
    quote: "The sound quality of TFiPro is truly majestic. They have genuinely redefined the standards of luxury audio in Pakistan.",
    author: "Muhammad Ubaid",
    role: "Audio Enthusiast"
  },
  {
    quote: "Exceptional build quality and crystal clear highs. The bass response is unlike anything I've experienced at this price point.",
    author: "Sarah Khan",
    role: "Music Producer"
  },
  {
    quote: "My daily commute has been completely transformed. The active noise cancellation creates a perfect silent sanctuary.",
    author: "Omer Tariq",
    role: "Daily Commuter"
  }
]

const ParallaxQuote = () => {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const innerContentRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Scroll Parallax Animation
  useEffect(() => {
    const textEl = textRef.current
    const sectionEl = sectionRef.current
    if (!textEl || !sectionEl) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    })

    tl.fromTo(
      textEl,
      { y: -150, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }
    )

    tl.to(textEl, { y: 0, duration: 0.5 })

    tl.to(
      textEl,
      { y: 150, autoAlpha: 0, duration: 1, ease: 'power2.in' }
    )

    return () => {
      tl.kill()
    }
  }, [])

  // Carousel Swap Animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!innerContentRef.current) return

      gsap.to(innerContentRef.current, {
        autoAlpha: 0,
        y: -10,
        duration: 0.4,
        onComplete: () => {
          setActiveIndex((current) => (current + 1) % opinions.length)
          gsap.fromTo(
            innerContentRef.current,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }
          )
        }
      })
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  const currentOpinion = opinions[activeIndex]

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[80vh] w-full items-center justify-center bg-black"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      <video
        src="/videos/video1.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="fixed left-0 top-0 h-[100vh] w-[100vw] object-cover opacity-30"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />

      <div
        ref={textRef}
        className="relative z-10 flex w-[90%] max-w-4xl flex-col items-center text-center"
      >
        <div ref={innerContentRef} className="flex flex-col items-center">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
            <Quote fill="white" size={24} className="text-white" />
          </div>

          <h2 className="mb-10 font-serif text-2xl italic leading-relaxed text-white sm:text-3xl md:text-4xl lg:text-5xl lg:leading-normal">
            "{currentOpinion.quote}"
          </h2>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white">
              {currentOpinion.author}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              {currentOpinion.role}
            </span>
          </div>
        </div>

        {/* Carousel indicators (dots/lines) outside the fade container so they don't jump */}
        <div className="mt-8 flex gap-2">
          {opinions.map((_, idx) => (
            <div
              key={idx}
              className={`h-[2px] w-8 transition-colors duration-500 ${idx === activeIndex ? 'bg-white/80' : 'bg-white/20'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ParallaxQuote
