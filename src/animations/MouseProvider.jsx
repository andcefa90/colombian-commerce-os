import { createContext, useContext, useEffect } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

const MouseContext = createContext(null)

/** Posición normalizada del mouse (-1 → 1) suavizada con spring. */
export function MouseProvider({ children }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 40, damping: 18 })
  const sy = useSpring(y, { stiffness: 40, damping: 18 })
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    const onMove = (e) => {
      x.set((e.clientX / window.innerWidth) * 2 - 1)
      y.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [x, y])
  return <MouseContext.Provider value={{ x: sx, y: sy }}>{children}</MouseContext.Provider>
}

export const useMouse = () => useContext(MouseContext)
