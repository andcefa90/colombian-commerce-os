// Curvas y variantes compartidas. Movimiento lento, preciso, sin rebotes exagerados.
export const ease = [0.22, 1, 0.36, 1]
export const easeInOut = [0.65, 0, 0.35, 1]

export const spring = { type: 'spring', stiffness: 120, damping: 22, mass: 0.9 }
export const softSpring = { type: 'spring', stiffness: 70, damping: 20 }

export const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease, delay: i * 0.08 },
  }),
}

export const depthIn = {
  hidden: { opacity: 0, y: 40, scale: 0.94, rotateX: 14, filter: 'blur(8px)' },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease, delay: 0.1 + i * 0.09 },
  }),
}

export const stagger = (step = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
})
