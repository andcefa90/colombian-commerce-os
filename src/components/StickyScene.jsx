import { useRef } from 'react'
import { useSceneProgress } from '../animations/hooks'

/**
 * Escena con scroll storytelling: una sección alta con un escenario sticky.
 * `children` recibe el progreso 0→1 de la escena.
 */
export function StickyScene({ id, height = '400vh', className = '', stageClassName = '', children, label }) {
  const ref = useRef(null)
  const progress = useSceneProgress(ref)
  return (
    <section ref={ref} id={id ? `scene-${id}` : undefined} data-scene={id} aria-label={label} className={`relative ${className}`} style={{ height }}>
      <div className={`sticky top-0 h-svh w-full overflow-hidden ${stageClassName}`}>{children(progress)}</div>
    </section>
  )
}
