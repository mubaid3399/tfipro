import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { asset } from '../../assets/asset'

const slides = [
  { image: asset.audioCollectionBanner, alt: 'Explore the TFiPro audio collection' },
  { image: asset.earbudsPromoBanner, alt: 'Discover TFiPro earbuds' },
  { image: asset.headphonesPromoBanner, alt: 'Discover TFiPro headphones' },
  { image: asset.travelBagsPromoBanner, alt: 'Explore bags and travel accessories' },
]

const AUTOPLAY_DELAY = 5000
const DRAG_THRESHOLD = 50
const SLIDE_DURATION = 1.1
const ZOOM_IN = 1.08 // idle / entering scale
const ZOOM_REST = 1.03 // settled scale of the active slide
const PARALLAX = 0.025 // how much the image lags behind its slide
const DOT_SIZE = 10
const DOT_ACTIVE_WIDTH = 32

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const Hero = () => {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const imageRefs = useRef([])
  const dotsRef = useRef(null)
  const dotRefs = useRef([])
  const fillRefs = useRef([])
  const dragRef = useRef(null)
  const progressRef = useRef(null)
  const pauseReasons = useRef(new Set())
  const [activeIndex, setActiveIndex] = useState(0)

  const goToSlide = useCallback((index) => {
    setActiveIndex((index + slides.length) % slides.length)
  }, [])

  // Pause autoplay for any number of independent reasons (hover, focus, drag)
  const setPause = useCallback((reason, on) => {
    const reasons = pauseReasons.current
    if (on) reasons.add(reason)
    else reasons.delete(reason)
    progressRef.current?.paused(reasons.size > 0)
  }, [])

  // Each image moves slightly slower than its slide, creating depth
  const applyParallax = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || prefersReducedMotion()) return
    const width = viewport.clientWidth
    const x = gsap.getProperty(track, 'x')
    imageRefs.current.forEach((img, i) => {
      if (img) gsap.set(img, { x: -(x + i * width) * PARALLAX })
    })
  }, [])

  // Entrance: centre-out reveal for the banner, staggered dots
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(imageRefs.current, { scale: ZOOM_IN })
      if (prefersReducedMotion()) return

      gsap.fromTo(
        viewportRef.current,
        { clipPath: 'inset(0% 50% 0% 50%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          ease: 'power4.inOut',
          clearProps: 'clipPath',
        },
      )
      gsap.from(dotsRef.current.children, {
        y: 14,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.6,
        ease: 'power3.out',
      })
    })
    return () => ctx.revert()
  }, [])

  // Slide transition, parallax and slow zoom on the active image
  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return undefined

    const reduce = prefersReducedMotion()
    let lastWidth = viewport.clientWidth

    gsap.to(track, {
      x: -activeIndex * lastWidth,
      duration: reduce ? 0 : SLIDE_DURATION,
      ease: 'power3.inOut',
      overwrite: true,
      onUpdate: applyParallax,
    })

    if (!reduce) {
      imageRefs.current.forEach((img, i) => {
        if (!img) return
        if (i === activeIndex) {
          gsap.to(img, {
            scale: ZOOM_REST,
            duration: 2.4,
            delay: 0.25,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        } else {
          gsap.to(img, {
            scale: ZOOM_IN,
            duration: SLIDE_DURATION,
            ease: 'power2.inOut',
            overwrite: 'auto',
          })
        }
      })
    }

    // Keep the track aligned on resize without re-animating
    const observer = new ResizeObserver(() => {
      const width = viewport.clientWidth
      if (width === lastWidth || dragRef.current) return
      lastWidth = width
      gsap.killTweensOf(track)
      gsap.set(track, { x: -activeIndex * width })
      applyParallax()
    })
    observer.observe(viewport)

    return () => observer.disconnect()
  }, [activeIndex, applyParallax])

  // Dot morphing + progress fill, which also drives autoplay
  useEffect(() => {
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return
      gsap.to(dot, {
        width: i === activeIndex ? DOT_ACTIVE_WIDTH : DOT_SIZE,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    })

    fillRefs.current.forEach((fill, i) => {
      if (fill && i !== activeIndex) {
        gsap.to(fill, { scaleX: 0, duration: 0.3, overwrite: true })
      }
    })

    const tween = gsap.fromTo(
      fillRefs.current[activeIndex],
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: 'left center',
        duration: AUTOPLAY_DELAY / 1000,
        ease: 'none',
        onComplete: () => goToSlide(activeIndex + 1),
      },
    )
    progressRef.current = tween
    tween.paused(pauseReasons.current.size > 0)

    return () => tween.kill()
  }, [activeIndex, goToSlide])

  // Clean up everything on unmount
  useEffect(() => {
    const track = trackRef.current
    const images = imageRefs.current
    const dots = dotRefs.current
    const fills = fillRefs.current
    return () => gsap.killTweensOf([track, ...images, ...dots, ...fills])
  }, [])

  const startDrag = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const width = viewportRef.current.clientWidth
    gsap.killTweensOf(trackRef.current)
    dragRef.current = {
      startX: event.clientX,
      startOffset: -activeIndex * width,
      moved: false,
    }
    setPause('drag', true)
    viewportRef.current.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event) => {
    if (!dragRef.current) return
    const delta = event.clientX - dragRef.current.startX
    if (Math.abs(delta) > 5) dragRef.current.moved = true
    gsap.set(trackRef.current, { x: dragRef.current.startOffset + delta })
    applyParallax()
  }

  const endDrag = (event) => {
    if (!dragRef.current) return
    const delta = event.clientX - dragRef.current.startX
    const moved = dragRef.current.moved
    dragRef.current = null
    setPause('drag', false)

    if (moved && Math.abs(delta) >= DRAG_THRESHOLD) {
      goToSlide(activeIndex + (delta < 0 ? 1 : -1))
    } else {
      const width = viewportRef.current.clientWidth
      gsap.to(trackRef.current, {
        x: -activeIndex * width,
        duration: 0.8,
        ease: 'elastic.out(1, 0.6)',
        overwrite: true,
        onUpdate: applyParallax,
      })
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToSlide(activeIndex + 1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToSlide(activeIndex - 1)
    }
  }

  return (
    <section
      className="w-full"
      aria-label="Featured promotions"
      aria-roledescription="carousel"
      onMouseEnter={() => setPause('hover', true)}
      onMouseLeave={() => setPause('hover', false)}
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible')) setPause('focus', true)
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPause('focus', false)
        }
      }}
    >
      <div
        ref={viewportRef}
        className="aspect-[3/1] w-full touch-pan-y cursor-grab overflow-hidden active:cursor-grabbing"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="group"
        aria-label={`Slide ${activeIndex + 1} of ${slides.length}`}
      >
        <div ref={trackRef} className="flex h-full w-full">
          {slides.map(({ image, alt }, index) => (
            <div
              key={image}
              className="h-full w-full shrink-0 select-none overflow-hidden"
              aria-hidden={activeIndex !== index}
            >
              <img
                ref={(el) => {
                  imageRefs.current[index] = el
                }}
                src={image}
                alt={alt}
                draggable="false"
                className="h-full w-full select-none object-cover will-change-transform"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={dotsRef}
        className="mt-4 flex items-center justify-center gap-2"
        aria-label="Choose a slide"
      >
        {slides.map(({ alt }, index) => (
          <button
            key={alt}
            ref={(el) => {
              dotRefs.current[index] = el
            }}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeIndex === index ? 'true' : undefined}
            className="relative h-2.5 w-2.5 overflow-hidden rounded-full bg-primary/25 transition-colors hover:bg-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span
              ref={(el) => {
                fillRefs.current[index] = el
              }}
              className="absolute inset-0 origin-left scale-x-0 rounded-full bg-primary"
            />
          </button>
        ))}
      </div>
    </section>
  )
}

export default Hero