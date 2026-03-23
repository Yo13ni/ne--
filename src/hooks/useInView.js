import { useEffect, useRef, useState } from 'react'

// threshold 0 = any pixel visible (safe for very tall sections). 0.15 breaks tall galleries.
export function useInView({ once = true, threshold = 0 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold])

  return [ref, inView]
}
