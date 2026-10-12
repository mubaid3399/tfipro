import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import gsap from 'gsap'

const ToastNotification = ({ message, isVisible, onHide }) => {
  const toastRef = useRef(null)
  const containerRef = useRef(null)

  const onHideRef = useRef(onHide)

  useEffect(() => {
    onHideRef.current = onHide
  }, [onHide])

  useEffect(() => {
    if (isVisible) {
      // Ensure the container is visible
      gsap.set(containerRef.current, { display: 'flex' })

      // Swing from back to front (3D effect)
      gsap.fromTo(
        toastRef.current,
        { 
          autoAlpha: 0, 
          scale: 0.5, 
          rotationX: -60,
          z: -100,
          y: -50 
        },
        { 
          autoAlpha: 1, 
          scale: 1, 
          rotationX: 0,
          z: 0,
          y: 0, 
          duration: 0.7, 
          ease: "back.out(2)" // Adds a nice bounce to the swing
        }
      )

      const timer = setTimeout(() => {
        // Swing back in the opposite direction
        gsap.to(toastRef.current, {
          autoAlpha: 0,
          scale: 0.5,
          rotationX: 60,
          z: -100,
          y: -50,
          duration: 0.5,
          ease: "back.in(2)",
          onComplete: () => {
            gsap.set(containerRef.current, { display: 'none' })
            if (onHideRef.current) {
              onHideRef.current()
            }
          }
        })
      }, 2500) // Show for 2.5 seconds

      return () => {
        clearTimeout(timer)
        gsap.killTweensOf(toastRef.current)
      }
    }
  }, [isVisible])

  return (
    <div 
      ref={containerRef}
      className="pointer-events-none fixed inset-x-0 top-12 z-[150] hidden justify-center"
      style={{ perspective: 1000 }} // Required for 3D rotationX and z to work beautifully
    >
      <div 
        ref={toastRef}
        className="flex items-center gap-3 rounded-[20px] bg-white px-6 py-4 shadow-2xl shadow-black/10 ring-1 ring-slate-100"
        style={{ transformOrigin: 'top center' }}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4ade80]">
          <Check size={18} strokeWidth={4} className="text-white" />
        </div>
        <span className="text-base font-medium text-slate-700">
          {message}
        </span>
      </div>
    </div>
  )
}

export default ToastNotification
