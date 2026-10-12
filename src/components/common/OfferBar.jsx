import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const OFFERS = [
  'Free shipping on orders over $100',
  'Take 10% off your first order with code WELCOME10',
  'Discover our latest collection',
]

const SLIDE = 3.8

const OfferBar = () => {
  const rootRef = useRef(null)
  const tlRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        full: '(prefers-reduced-motion: no-preference)',
        reduced: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const { reduced } = ctx.conditions
        const slides = gsap.utils.toArray('.offer', root)
        const tl = gsap.timeline({ repeat: -1 })
        tlRef.current = tl

        gsap.set(slides, { autoAlpha: 0 })

        slides.forEach((slide, i) => {
          const chars = slide.querySelectorAll('.char')
          const at = i * SLIDE

          tl.call(() => setActive(i), null, at)
          tl.set(slide, { autoAlpha: 1 }, at)

          if (reduced) {
            tl.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.3 }, at)
            tl.to(chars, { opacity: 0, duration: 0.3 }, at + SLIDE - 0.3)
          } else {
            tl.fromTo(
              chars,
              { yPercent: 110, rotateX: -80, opacity: 0 },
              {
                yPercent: 0,
                rotateX: 0,
                opacity: 1,
                duration: 0.75,
                ease: 'expo.out',
                stagger: 0.016,
              },
              at
            )
            tl.to(
              chars,
              {
                yPercent: -110,
                rotateX: 60,
                opacity: 0,
                duration: 0.45,
                ease: 'power3.in',
                stagger: 0.007,
              },
              at + SLIDE - 0.75
            )
          }

          tl.set(slide, { autoAlpha: 0 }, at + SLIDE)
        })

        return () => tl.kill()
      }
    )

    return () => {
      mm.revert()
      tlRef.current = null
    }
  }, [])

  const pause = () => tlRef.current?.pause()
  const resume = () => tlRef.current?.resume()

  return (
    <header
      ref={rootRef}
      className="relative h-11 overflow-hidden bg-black text-white"
      aria-label="Promotional offers"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div
        className="relative mx-auto h-full max-w-7xl"
        role="group"
        aria-roledescription="carousel"
        aria-label="Offers"
      >
        {OFFERS.map((text, i) => {
          const words = text.split(' ')
          return (
            <p
              key={text}
              className="offer absolute inset-0 flex items-center justify-center px-4 text-center sm:text-xs text-[0.8rem] font-medium uppercase tracking-[0.2em] sm:text-xs"
              aria-hidden={active !== i}
            >
              <span className="sr-only">{text}</span>
              <span
                aria-hidden="true"
                className="inline-block overflow-hidden py-1"
                style={{ perspective: '600px' }}
              >
                {words.map((word, w) => (
                  <span key={w} className="inline-block whitespace-nowrap">
                    {word.split('').map((char, c) => (
                      <span
                        key={c}
                        className="char inline-block will-change-transform"
                        style={{ transformOrigin: '50% 100%' }}
                      >
                        {char}
                      </span>
                    ))}
                    {w < words.length - 1 && <span className="inline-block w-[0.6em]" />}
                  </span>
                ))}
              </span>
            </p>
          )
        })}
      </div>
    </header>
  )
}

export default OfferBar