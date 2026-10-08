import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { asset } from '../../assets/asset'

const arrivals = [
  { image: asset.blackBluetoothEarbuds, alt: 'Black Bluetooth earbuds' },
  { image: asset.overEarHeadphones, alt: 'Over-ear headphones' },
  { image: asset.compactBackpack, alt: 'Compact backpack' },
  { image: asset.powerBank, alt: 'Portable power bank' },
  { image: asset.rgbDesktopMicrophone, alt: 'RGB desktop microphone' },
  { image: asset.wirelessEarbudsSet, alt: 'Wireless earbuds set' },
  { image: asset.pinkCatEarHeadphones, alt: 'Pink cat-ear headphones' },
  { image: asset.leatherMessengerBag, alt: 'Leather messenger bag' },
  { image: asset.wirelessMicrophoneSet, alt: 'Wireless microphone set' },
  { image: asset.wirelessChargingStation, alt: 'Wireless charging station' },
]

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const NewArrivals = () => {
  const scrollerRef = useRef(null)
  const targetScrollRef = useRef(0)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return undefined

    targetScrollRef.current = scroller.scrollLeft

    const handleWheel = (event) => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth
      if (maxScroll <= 0) return

      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1
      const wheelDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX * unit
          : event.deltaY * unit
      const currentTarget = Math.max(
        0,
        Math.min(targetScrollRef.current, maxScroll)
      )
      const nextTarget = Math.max(
        0,
        Math.min(currentTarget + wheelDelta, maxScroll)
      )

      if (nextTarget === currentTarget) return

      event.preventDefault()
      targetScrollRef.current = nextTarget
      gsap.to(scroller, {
        scrollLeft: nextTarget,
        duration: reduceMotion() ? 0 : 0.6,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    const updateScrollLimit = () => {
      targetScrollRef.current = Math.min(
        targetScrollRef.current,
        scroller.scrollWidth - scroller.clientWidth
      )
    }

    scroller.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('resize', updateScrollLimit)

    return () => {
      scroller.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', updateScrollLimit)
      gsap.killTweensOf(scroller)
    }
  }, [])

  return (
    <section
      className="mx-auto w-[90%] py-8 sm:py-12"
      aria-labelledby="new-arrivals-title"
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Fresh picks
          </p>
          <h2
            id="new-arrivals-title"
            className="text-2xl font-bold tracking-tight text-primary sm:text-3xl"
          >
            New Arrivals
          </h2>
        </div>
        <p className="hidden text-sm text-slate-500 sm:block">
          Scroll to explore
        </p>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
        aria-label="New arrival products. Scroll horizontally to see more."
        tabIndex={0}
      >
        {arrivals.map(({ image, alt }, index) => (
          <div
            key={alt}
            className="flex aspect-[4/5] basis-[calc((100%-0.75rem)/2)] shrink-0 items-center justify-center overflow-hidden sm:basis-[calc((100%-2rem)/3)] lg:basis-[calc((100%-4rem)/5)]"
          >
            <img
              src={image}
              alt={alt}
              loading={index < 5 ? 'eager' : 'lazy'}
              draggable="false"
              className="h-full w-full select-none object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.2)]"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default NewArrivals