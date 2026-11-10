import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { depthIn } from '../animations/variants'

/** Tarjeta de dashboard que entra con profundidad y avisa a sus hijos cuando está visible. */
export function Panel({ title, right, i = 0, className = '', bodyClassName = '', children }) {
  const ref = useRef(null)
  const play = useInView(ref, { once: true, amount: 0.4 })
  return (
    <motion.div
      ref={ref}
      custom={i}
      variants={depthIn}
      initial="hidden"
      animate={play ? 'show' : 'hidden'}
      whileHover={{ y: -3, transition: { duration: 0.3 } }}
      style={{ transformPerspective: 1200 }}
      className={`relative flex flex-col overflow-hidden rounded-[20px] bg-gradient-to-b from-white/[0.055] to-white/[0.02] p-5 ring-1 ring-white/[0.07] transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] hover:ring-white/[0.12] ${className}`}
    >
      {(title || right) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <span className="text-[12px] font-medium text-white/50">{title}</span>}
          {right}
        </div>
      )}
      <div className={`flex-1 ${bodyClassName}`}>{typeof children === 'function' ? children(play) : children}</div>
    </motion.div>
  )
}
