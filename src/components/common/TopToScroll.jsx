import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const TopToScroll = () => {
  const { pathname, search } = useLocation()
  const prevPathnameRef = useRef(pathname)
  const prevCategoryRef = useRef(new URLSearchParams(search).get('category'))

  // Prevent browser's default scroll restoration from conflicting with page transitions
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Instantly scroll to the top on page route or category change, but ignore search query typing
  useLayoutEffect(() => {
    const currentCategory = new URLSearchParams(search).get('category')
    const pathChanged = prevPathnameRef.current !== pathname
    const categoryChanged = prevCategoryRef.current !== currentCategory

    prevPathnameRef.current = pathname
    prevCategoryRef.current = currentCategory

    // Do not trigger page scroll resets while user is typing in the search bar
    if (!pathChanged && !categoryChanged) {
      return
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      })
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
      }
      if (document.body) {
        document.body.scrollTop = 0
      }
    }

    scrollToTop()
    const rafId = requestAnimationFrame(scrollToTop)
    const timer1 = setTimeout(scrollToTop, 0)
    const timer2 = setTimeout(scrollToTop, 60)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [pathname, search])

  return null
}

export default TopToScroll
