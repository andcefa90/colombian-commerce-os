import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'

/** Progreso 0→1 de una escena sticky (de su inicio a su final). */
export function useSceneProgress(ref) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return scrollYProgress
}

/** Tamaño del viewport (para composiciones calculadas en px). */
export function useViewport() {
  const get = () => ({
    w: typeof window === 'undefined' ? 1440 : window.innerWidth,
    h: typeof window === 'undefined' ? 900 : window.innerHeight,
  })
  const [vp, setVp] = useState(get)
  useEffect(() => {
    let raf
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const next = get()
        // Ignora cambios pequeños de alto en móvil (barra de direcciones)
        setVp((prev) => (prev.w === next.w && Math.abs(prev.h - next.h) < 90 ? prev : next))
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

export function useIsMobile(bp = 768) {
  const { w } = useViewport()
  return w < bp
}

/** Contador que anima de 0 al valor cuando `start` es true. */
export function useCountUp(target, { start = true, duration = 1.8, delay = 0 } = {}) {
  const mv = useMotionValue(0)
  const [value, setValue] = useState(0)
  useMotionValueEvent(mv, 'change', setValue)
  useEffect(() => {
    if (!start) return
    const controls = animate(mv, target, { duration, delay, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [start, target, duration, delay, mv])
  return value
}

/** Booleano que se activa cuando un MotionValue supera un umbral. */
export function useThreshold(mv, threshold) {
  const [on, setOn] = useState(() => mv.get() >= threshold)
  useMotionValueEvent(mv, 'change', (v) => {
    const next = v >= threshold
    setOn((prev) => (prev === next ? prev : next))
  })
  return on
}

/** Mapea un tramo [a,b] del progreso a 0→1 recortado. */
export function useSegment(p, a, b) {
  return useTransform(p, [a, b], [0, 1], { clamp: true })
}

/** Opacidad / desplazamiento / blur de un bloque que entra y sale en un rango de scroll. */
export function useStage(p, [a, b, c, d], { y = 30, blur = 12, scaleFrom = 1, scaleTo = 1 } = {}) {
  const inOut = c === undefined ? [a, b] : [a, b, c, d]
  const opacity = useTransform(p, inOut, c === undefined ? [0, 1] : [0, 1, 1, 0])
  const yy = useTransform(p, inOut, c === undefined ? [y, 0] : [y, 0, 0, -y])
  const bl = useTransform(p, inOut, c === undefined ? [blur, 0] : [blur, 0, 0, blur])
  const filter = useTransform(bl, (v) => (v < 0.05 ? 'none' : `blur(${v}px)`))
  const scale = useTransform(p, inOut, c === undefined ? [scaleFrom, 1] : [scaleFrom, 1, 1, scaleTo])
  return { opacity, y: yy, filter, scale }
}

export function useOnceInView(options = { once: true, amount: 0.35 }) {
  const ref = useRef(null)
  const inView = useInView(ref, options)
  return [ref, inView]
}
