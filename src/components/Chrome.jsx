import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { scenes } from '../data/content'
import { scrollToY } from '../animations/smoothScroll'
import { Wordmark } from './Logo'

function sceneElements() {
  return [...document.querySelectorAll('[data-scene]')]
}

export function goToScene(id) {
  const el = document.querySelector(`[data-scene="${id}"]`)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY
  scrollToY(y)
}

function useActiveScene() {
  const [active, setActive] = useState('01')
  useEffect(() => {
    let raf
    const update = () => {
      const mid = window.innerHeight * 0.5
      let current = '01'
      for (const el of sceneElements()) {
        if (el.getBoundingClientRect().top <= mid) current = el.dataset.scene
      }
      setActive((prev) => (prev === current ? prev : current))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return active
}

/** Navegación por teclado: ← → / PageUp PageDown entre escenas, 1–8 directo. */
function useKeyboardNav(active) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return
      const idx = scenes.findIndex((s) => s.id === active)
      if (['ArrowRight', 'PageDown'].includes(e.key)) {
        e.preventDefault()
        const next = scenes[idx + 1]
        if (next) goToScene(next.id)
        else scrollToY(document.documentElement.scrollHeight)
      } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        // Si estamos dentro de una escena, primero vuelve a su inicio
        const el = document.querySelector(`[data-scene="${active}"]`)
        const top = el ? el.getBoundingClientRect().top : 0
        if (top < -40) goToScene(active)
        else if (scenes[idx - 1]) goToScene(scenes[idx - 1].id)
      } else if (/^[1-8]$/.test(e.key)) {
        goToScene(`0${e.key}`)
      } else if (e.key === 'Home') {
        e.preventDefault()
        scrollToY(0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])
}

export function Chrome() {
  const active = useActiveScene()
  useKeyboardNav(active)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [hint, setHint] = useState(true)
  const light = active === '03'

  useEffect(() => {
    const off = () => window.scrollY > 120 && setHint(false)
    window.addEventListener('scroll', off, { passive: true })
    return () => window.removeEventListener('scroll', off)
  }, [])

  return (
    <>
      {/* Barra de progreso */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/[0.04]">
        <motion.div className="tri-gradient h-full origin-left" style={{ scaleX: progress }} />
      </div>

      {/* Header */}
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 pt-5 md:px-8 md:pt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: active === '01' ? 0 : 1, y: active === '01' ? -10 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className={`pointer-events-auto rounded-full px-3 py-2 transition-colors duration-700 ${light ? 'bg-ink/90' : 'bg-ink/40 backdrop-blur-xl'}`}>
          <Wordmark />
        </div>
        <span className={`hidden rounded-full px-3 py-2 text-[11px] tracking-wide backdrop-blur-xl transition-colors duration-700 md:block ${light ? 'bg-ink/90 text-white/60' : 'bg-ink/40 text-white/45'}`}>
          Propuesta comercial · {new Date().getFullYear()}
        </span>
      </motion.header>

      {/* Indicador lateral */}
      <nav aria-label="Escenas" className="fixed right-1.5 top-1/2 z-40 -translate-y-1/2 md:right-6">
        <ul className={`flex flex-col gap-0.5 rounded-full px-0.5 py-1.5 md:gap-1 md:px-1.5 md:py-2 backdrop-blur-xl transition-colors duration-700 ${light ? 'bg-ink/85' : 'bg-white/[0.03] ring-1 ring-white/[0.06]'}`}>
          {scenes.map((s) => {
            const on = s.id === active
            return (
              <li key={s.id}>
                <button
                  onClick={() => goToScene(s.id)}
                  className="group relative flex h-6 w-6 items-center justify-center rounded-full md:h-8 md:w-8"
                  aria-label={`${s.id} · ${s.label}`}
                  aria-current={on ? 'step' : undefined}
                >
                  {on && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/[0.1]" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                  <span className={`relative font-display text-[9px] font-semibold tabular-nums transition-colors md:text-[11px] ${on ? 'text-white' : 'text-white/30 group-hover:text-white/70 max-md:text-[0px]'}`}>
                    {s.id}
                  </span>
                  {!on && <span className="absolute h-1 w-1 rounded-full bg-white/30 md:hidden" />}
                  <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink-3/95 px-3 py-1.5 text-[11px] text-white/80 opacity-0 ring-1 ring-white/10 transition-all duration-300 group-hover:opacity-100 md:block md:translate-x-1 md:group-hover:translate-x-0">
                    {s.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Pista inicial */}
      <AnimatePresence>
        {hint && (
          <motion.div
            className="pointer-events-none fixed inset-x-0 bottom-7 z-40 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 3.4, duration: 1.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <div className="relative h-10 w-[1px] overflow-hidden bg-white/10">
              <motion.span
                className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-transparent to-white/80"
                animate={{ y: [-16, 40] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <span className="eyebrow text-white/40">
              Desliza <span className="hidden md:inline">· o usa ← →</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
