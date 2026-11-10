import Lenis from 'lenis'

let lenis = null

export function initSmoothScroll() {
  if (typeof window === 'undefined' || lenis) return lenis
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return null
  lenis = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
  const raf = (time) => {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  return lenis
}

export function destroySmoothScroll() {
  lenis?.destroy()
  lenis = null
}

export function scrollToY(y, { duration = 1.6 } = {}) {
  if (lenis) lenis.scrollTo(y, { duration, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}
