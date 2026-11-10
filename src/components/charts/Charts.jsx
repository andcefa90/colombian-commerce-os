import { useId } from 'react'
import { motion } from 'framer-motion'
import { smoothPath, toPoints } from './paths'
import { toneOf } from '../ToneIcon'
import { ease } from '../../animations/variants'

/** Gráfico de área que se dibuja de izquierda a derecha. */
export function AreaChart({ data, labels = [], play, color = '#5fe0b3', height = 220, delay = 0 }) {
  const id = useId().replace(/:/g, '')
  const W = 640
  const H = height
  const pad = { t: 16, r: 18, b: 30, l: 8 }
  const pts = toPoints(data, W, H, pad, Math.min(...data) * 0.82, Math.max(...data) * 1.06)
  const line = smoothPath(pts)
  const area = `${line} L${pts.at(-1)[0]},${H - pad.b} L${pts[0][0]},${H - pad.b} Z`
  const last = pts.at(-1)
  const dur = 2.2
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <motion.rect
            x="0" y="0" height={H}
            initial={{ width: 0 }}
            animate={{ width: play ? W : 0 }}
            transition={{ duration: dur, ease, delay }}
          />
        </clipPath>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + g * (H - pad.t - pad.b)} y2={pad.t + g * (H - pad.t - pad.b)} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 6" />
      ))}
      <path d={area} fill={`url(#fill-${id})`} clipPath={`url(#clip-${id})`} />
      <motion.path
        d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: play ? 1 : 0 }}
        transition={{ duration: dur, ease, delay }}
      />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: play ? 1 : 0 }} transition={{ delay: delay + dur * 0.9, duration: 0.5 }}>
        <circle cx={last[0]} cy={last[1]} r="10" fill={color} opacity="0.18">
          <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={last[0]} cy={last[1]} r="4.5" fill={color} stroke="#0c0e12" strokeWidth="2" />
      </motion.g>
      {labels.map((l, i) => (
        <text key={i} x={pts[i][0]} y={H - 8} textAnchor="middle" fontSize="11" fill={i === labels.length - 1 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)'} fontFamily="Inter Variable">
          {l}
        </text>
      ))}
    </svg>
  )
}

/** Barras horizontales que crecen escalonadas. */
export function HBars({ items, play, max, light = false }) {
  const top = max ?? Math.max(...items.map((i) => i.v))
  return (
    <div className="flex flex-col gap-3">
      {items.map((it, i) => {
        const [a, b] = toneOf(it.tone)
        return (
          <div key={it.label} className="grid grid-cols-[72px_1fr_34px] items-center gap-3 text-[12px]">
            <span className={light ? 'text-black/55' : 'text-white/55'}>{it.label}</span>
            <div className={`h-2 overflow-hidden rounded-full ${light ? 'bg-black/[0.05]' : 'bg-white/[0.05]'}`}>
              <motion.div
                className="h-full origin-left rounded-full"
                style={{ background: `linear-gradient(90deg, ${b}, ${a})`, width: `${(it.v / top) * 100}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: play ? 1 : 0 }}
                transition={{ duration: 1.4, ease, delay: 0.25 + i * 0.1 }}
              />
            </div>
            <span className={`text-right tabular-nums ${light ? 'text-black/70' : 'text-white/70'}`}>{it.v}%</span>
          </div>
        )
      })}
    </div>
  )
}

/** Columnas verticales que suben. */
export function Columns({ items, play, height = 150 }) {
  const top = Math.max(...items.map((i) => i.v))
  return (
    <div className="flex items-end justify-between gap-2.5" style={{ height }}>
      {items.map((it, i) => {
        const [a, b] = toneOf(it.tone)
        return (
          <div key={it.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <motion.span
              className="text-[11px] tabular-nums text-white/60"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: play ? 1 : 0, y: play ? 0 : 6 }}
              transition={{ delay: 0.9 + i * 0.1, duration: 0.6 }}
            >
              {it.v}
            </motion.span>
            <motion.div
              className="w-full max-w-[38px] origin-bottom rounded-[7px]"
              style={{ height: `${(it.v / top) * 72}%`, background: `linear-gradient(180deg, ${a}, ${b}cc)`, boxShadow: `0 0 30px -8px ${a}` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: play ? 1 : 0 }}
              transition={{ duration: 1.3, ease, delay: 0.2 + i * 0.1 }}
            />
            <span className="text-[10.5px] text-white/40">{it.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/** Dona con porcentaje. */
export function Donut({ value, play, size = 120, color = '#7d97ff', track = 'rgba(255,255,255,0.06)', children }) {
  const r = 42
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke={track} strokeWidth="9" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: play ? value / 100 : 0 }}
          transition={{ duration: 1.8, ease, delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

/** Mini línea para KPIs. */
export function Sparkline({ data, play, color, width = 96, height = 32, delay = 0 }) {
  const pts = toPoints(data, width, height, { t: 3, r: 3, b: 3, l: 3 })
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="overflow-visible">
      <motion.path
        d={smoothPath(pts)} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: play ? 1 : 0, opacity: play ? 1 : 0 }}
        transition={{ duration: 1.6, ease, delay }}
      />
    </svg>
  )
}
