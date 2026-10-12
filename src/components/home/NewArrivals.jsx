import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { asset } from '../../assets/asset'

// Add a `price` (e.g. 'Rs. 2,499') to any item and it will render under the name.
const arrivals = [
  { image: asset.blackBluetoothEarbuds, name: 'Black Bluetooth earbuds', category: 'Earbuds' },
  { image: asset.overEarHeadphones, name: 'Over-ear headphones', category: 'Headphones' },
  { image: asset.compactBackpack, name: 'Compact backpack', category: 'Bags' },
  { image: asset.powerBank, name: 'Portable power bank', category: 'Power' },
  { image: asset.rgbDesktopMicrophone, name: 'RGB desktop microphone', category: 'Microphones' },
  { image: asset.wirelessEarbudsSet, name: 'Wireless earbuds set', category: 'Earbuds' },
  { image: asset.pinkCatEarHeadphones, name: 'Pink cat-ear headphones', category: 'Headphones' },
  { image: asset.leatherMessengerBag, name: 'Leather messenger bag', category: 'Bags' },
  { image: asset.wirelessMicrophoneSet, name: 'Wireless microphone set', category: 'Microphones' },
  { image: asset.wirelessChargingStation, name: 'Wireless charging station', category: 'Charging' },
]

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ArrowIcon = ({ direction }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-5 w-5 ${direction === 'left' ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const NewArrivals = () => {
  const scrollerRef = useRef(null)
  const thumbRef = useRef(null)
  const targetScrollRef = useRef(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  // Smoothly move the scroller to a clamped position.
  const scrollToPosition = useCallback((value) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const maxScroll = scroller.scrollWidth - scroller.clientWidth
    const next = Math.max(0, Math.min(value, maxScroll))
    targetScrollRef.current = next
    gsap.to(scroller, {
      scrollLeft: next,
      duration: reduceMotion() ? 0 : 0.6,
      ease: 'power3.out',
      overwrite: true,
    })
  }, [])

  const scrollByPage = (direction) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    scrollToPosition(
      targetScrollRef.current + direction * scroller.clientWidth * 0.8
    )
  }

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return undefined

    targetScrollRef.current = scroller.scrollLeft

    // Keeps the arrow buttons and the progress bar in sync with the scroll position.
    const updateIndicators = () => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth
      const progress = maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0
      const visibleRatio =
        scroller.scrollWidth > 0 ? scroller.clientWidth / scroller.scrollWidth : 1
      const thumbWidth = Math.min(visibleRatio * 100, 100)

      if (thumbRef.current) {
        thumbRef.current.style.width = `${thumbWidth}%`
        thumbRef.current.style.left = `${progress * (100 - thumbWidth)}%`
      }
      setCanPrev(scroller.scrollLeft > 4)
      setCanNext(maxScroll - scroller.scrollLeft > 4)
    }

    const handleScroll = () => {
      // If the user scrolled by touch, keyboard or drag, resync the wheel target
      // so the next wheel tick does not jump back to an old position.
      if (!gsap.isTweening(scroller)) {
        targetScrollRef.current = scroller.scrollLeft
      }
      updateIndicators()
    }

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

      // At either end, let the page scroll normally.
      if (nextTarget === currentTarget) return

      event.preventDefault()
      scrollToPosition(nextTarget)
    }

    const handleResize = () => {
      targetScrollRef.current = Math.min(
        targetScrollRef.current,
        Math.max(0, scroller.scrollWidth - scroller.clientWidth)
      )
      updateIndicators()
    }

    // Click-and-drag scrolling for mouse users (touch already scrolls natively).
    let isDragging = false
    let startX = 0
    let startScroll = 0
    let lastX = 0
    let lastTime = 0
    let velocity = 0 // px per ms

    const handlePointerDown = (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      isDragging = true
      startX = event.clientX
      startScroll = scroller.scrollLeft
      lastX = event.clientX
      lastTime = performance.now()
      velocity = 0
      gsap.killTweensOf(scroller)
      scroller.setPointerCapture(event.pointerId)
      scroller.classList.add('cursor-grabbing')
    }

    const handlePointerMove = (event) => {
      if (!isDragging) return
      const now = performance.now()
      const elapsed = now - lastTime
      if (elapsed > 0) velocity = (event.clientX - lastX) / elapsed
      lastX = event.clientX
      lastTime = now

      scroller.scrollLeft = startScroll - (event.clientX - startX)
      targetScrollRef.current = scroller.scrollLeft
    }

    const endDrag = (event) => {
      if (!isDragging) return
      isDragging = false
      scroller.classList.remove('cursor-grabbing')
      if (scroller.hasPointerCapture(event.pointerId)) {
        scroller.releasePointerCapture(event.pointerId)
      }

      // Ignore stale velocity if the pointer rested before release.
      if (performance.now() - lastTime > 100) velocity = 0

      // Short glide after release for a natural feel.
      if (!reduceMotion() && Math.abs(velocity) > 0.1) {
        scrollToPosition(scroller.scrollLeft - velocity * 300)
      }
    }

    updateIndicators()
    scroller.addEventListener('wheel', handleWheel, { passive: false })
    scroller.addEventListener('scroll', handleScroll, { passive: true })
    scroller.addEventListener('pointerdown', handlePointerDown)
    scroller.addEventListener('pointermove', handlePointerMove)
    scroller.addEventListener('pointerup', endDrag)
    scroller.addEventListener('pointercancel', endDrag)
    window.addEventListener('resize', handleResize)

    return () => {
      scroller.removeEventListener('wheel', handleWheel)
      scroller.removeEventListener('scroll', handleScroll)
      scroller.removeEventListener('pointerdown', handlePointerDown)
      scroller.removeEventListener('pointermove', handlePointerMove)
      scroller.removeEventListener('pointerup', endDrag)
      scroller.removeEventListener('pointercancel', endDrag)
      window.removeEventListener('resize', handleResize)
      gsap.killTweensOf(scroller)
    }
  }, [scrollToPosition])

  const buttonClass =
    'flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:border-primary hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 disabled:hover:bg-transparent disabled:hover:text-slate-300'

  return (
    <section
      className="mx-auto w-[90%] py-10 sm:py-14"
      aria-labelledby="new-arrivals-title"
    >
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <h2
            id="new-arrivals-title"
            className="text-2xl font-bold tracking-tight text-primary sm:text-3xl"
          >
            New arrivals
          </h2>
          <p className="mt-1.5 max-w-md text-sm text-slate-500 sm:text-base">
            Earbuds, headphones, power and more, just added to the store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canPrev}
            className={buttonClass}
            aria-label="Previous products"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canNext}
            className={buttonClass}
            aria-label="Next products"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      <ul
        ref={scrollerRef}
        className="flex cursor-grab select-none gap-3 overflow-x-auto overscroll-x-contain rounded-xl pb-2 [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-4 [&::-webkit-scrollbar]:hidden"
        aria-label="New arrival products. Scroll horizontally to see more."
        tabIndex={0}
      >
        {arrivals.map(({ image, name, category, price }, index) => (
          <li
            key={name}
            className="group basis-[calc((100%-0.75rem)/2)] shrink-0 sm:basis-[calc((100%-2rem)/3)] lg:basis-[calc((100%-4rem)/5)]"
          >
            <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl bg-slate-100 p-5 transition-colors duration-300 group-hover:bg-slate-200/70">
              <img
                src={image}
                alt={name}
                loading={index < 5 ? 'eager' : 'lazy'}
                draggable="false"
                className="h-full w-full select-none object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>

            <div className="mt-3 px-1">
              <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                {name}
              </h3>
              <p className="text-xs text-slate-500 sm:text-sm">{category}</p>
              {price && (
                <p className="mt-1 text-sm font-semibold text-primary">{price}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div
        className="relative mt-5 h-0.5 overflow-hidden rounded-full bg-slate-200"
        aria-hidden="true"
      >
        <div
          ref={thumbRef}
          className="absolute inset-y-0 rounded-full bg-primary"
          style={{ width: '30%', left: 0 }}
        />
      </div>
    </section>
  )
}

export default NewArrivals