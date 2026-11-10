import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValueEvent } from 'framer-motion'
import { useCountUp } from '../animations/hooks'
import { formatNumber } from '../lib/format'

/** Número que cuenta desde 0 cuando entra en pantalla (o cuando `start` pasa a true). */
export function Counter({ value, prefix = '', suffix = '', decimals = 0, duration = 1.8, delay = 0, start, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const go = start ?? inView
  const v = useCountUp(value, { start: go, duration, delay })
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {formatNumber(v, { decimals, prefix, suffix })}
    </span>
  )
}

/** Renderiza un MotionValue con formato, sin re-render por frame del padre. */
export function MotionNumber({ value, decimals = 0, prefix = '', suffix = '', round = true, className = '' }) {
  const fmt = (v) => formatNumber(round && decimals === 0 ? Math.round(v) : v, { decimals, prefix, suffix })
  const [text, setText] = useState(() => fmt(value.get()))
  useMotionValueEvent(value, 'change', (v) => setText(fmt(v)))
  useEffect(() => setText(fmt(value.get())), [value]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span className={`tabular-nums ${className}`}>{text}</span>
}
