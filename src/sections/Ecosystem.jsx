import { motion, useTransform } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { StickyScene } from '../components/StickyScene'
import { BrandMark } from '../components/Logo'
import { ToneIcon, toneOf } from '../components/ToneIcon'
import { useStage, useThreshold, useViewport } from '../animations/hooks'
import { useMouse } from '../animations/MouseProvider'
import { ecosystem, flowSteps } from '../data/content'

const T = {
  title: [0.0, 0.06, 0.08, 0.12],
  core: [0.06, 0.14],
  link: 0.14,
  linkStep: 0.035,
  orbit: [0.42, 0.5],
  ringOut: [0.52, 0.58],
  flow: [0.56, 0.86],
  flowOut: [0.88, 0.91],
  final: [0.9, 0.95],
}

function Link({ i, p, pos, color }) {
  const at = T.link + i * T.linkStep
  const len = useTransform(p, [at, at + 0.035], [0, 1])
  const live = useThreshold(p, at + 0.035)
  const d = `M0,0 L${pos.x},${pos.y}`
  return (
    <g>
      <line x1="0" y1="0" x2={pos.x} y2={pos.y} stroke="rgba(255,255,255,0.06)" />
      <motion.path d={d} stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" style={{ pathLength: len, filter: `drop-shadow(0 0 6px ${color})` }} />
      {live && (
        <circle r="2.8" fill="#fff">
          <animateMotion dur={`${2 + (i % 4) * 0.4}s`} repeatCount="indefinite" path={d} />
          <animate attributeName="opacity" values="0;1;1;0" dur={`${2 + (i % 4) * 0.4}s`} repeatCount="indefinite" />
        </circle>
      )}
    </g>
  )
}

function EcoNode({ node, i, p, pos, compact }) {
  const at = T.link + i * T.linkStep + 0.025
  const lit = useTransform(p, [at - 0.02, at + 0.01], [0.25, 1])
  const scale = useTransform(p, [at - 0.02, at + 0.02], [0.85, 1])
  const [c] = toneOf(node.tone)
  const shadow = useTransform(lit, (v) => `0 0 ${v * 46}px -8px ${c}, inset 0 1px 0 rgba(255,255,255,0.08)`)
  return (
    <motion.div className="absolute left-1/2 top-1/2" style={{ x: pos.x, y: pos.y }}>
      <motion.div style={{ opacity: lit, scale }} className="-translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ boxShadow: shadow }} className={`glass flex flex-col items-center rounded-2xl ${compact ? 'gap-1 px-2 py-2' : 'gap-2 px-4 py-3'}`}>
          <ToneIcon icon={node.icon} tone={node.tone} size={compact ? 26 : 34} radius={compact ? 8 : 10} />
          <span className={`eyebrow whitespace-nowrap text-white/85 ${compact ? 'text-[8px] tracking-[0.08em]' : 'text-[10px] tracking-[0.16em]'}`}>{node.label}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function FlowStep({ step, i, p, n }) {
  const span = (T.flow[1] - T.flow[0]) / n
  const at = T.flow[0] + i * span
  const opacity = useTransform(p, [at - span * 0.6, at, at + span, at + span * 1.6], [0.18, 1, 1, 0.5])
  const x = useTransform(p, [at - span * 0.6, at], [-14, 0])
  const glow = useTransform(p, [at - span * 0.3, at, at + span, at + span * 1.4], [0, 1, 1, 0])
  const bg = useTransform(glow, (g) => `rgba(255,255,255,${0.02 + g * 0.06})`)
  const ring = useTransform(glow, (g) => `inset 0 0 0 1px rgba(246,201,69,${g * 0.45}), 0 0 ${g * 40}px -10px rgba(246,201,69,0.7)`)
  const Icon = step.icon
  return (
    <motion.div style={{ opacity, x, backgroundColor: bg, boxShadow: ring }} className="relative z-10 flex items-center gap-3.5 rounded-2xl px-3.5 py-2.5 md:gap-4 md:px-4 md:py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white md:h-9 md:w-9">
        <Icon size={16} />
      </span>
      <span className="font-display text-[15px] font-semibold tracking-tight text-white md:text-xl">{step.label}</span>
      <span className="ml-auto font-display text-[11px] font-semibold text-white/25">0{i + 1}</span>
    </motion.div>
  )
}

function Stage({ p }) {
  const { w, h } = useViewport()
  const mobile = w < 768
  const mouse = useMouse()
  const rx = mobile ? w * 0.36 : Math.min(w * 0.33, 480)
  const ry = mobile ? h * 0.3 : Math.min(h * 0.33, 290)
  const positions = ecosystem.map((_, i) => {
    const a = -Math.PI / 2 + (i / ecosystem.length) * Math.PI * 2
    return { x: Math.cos(a) * rx, y: Math.sin(a) * ry }
  })

  const title = useStage(p, [-1, 0, T.title[2], T.title[3]], { y: 30, blur: 14 })
  const core = useStage(p, T.core, { y: 0, blur: 20, scaleFrom: 0.6 })
  const orbit = useTransform(p, T.orbit, [0, 1])
  const ringOpacity = useTransform(p, [T.ringOut[0], T.ringOut[1], T.flowOut[0], T.flowOut[1]], [1, 0.14, 0.14, 0.3])
  const ringScale = useTransform(p, [T.ringOut[0], T.ringOut[1], T.final[0], 1], [1, 0.82, 0.82, 1.1])
  const ringBlur = useTransform(p, T.ringOut, ['blur(0px)', 'blur(4px)'])
  const mx = useTransform(mouse.x, (v) => v * 16)
  const my = useTransform(mouse.y, (v) => v * 12)

  const flow = useStage(p, [T.flow[0] - 0.03, T.flow[0], T.flowOut[0], T.flowOut[1]], { y: 30, blur: 12 })
  const fill = useTransform(p, T.flow, ['0%', '100%'])
  const loop = useStage(p, [T.flow[1] - 0.02, T.flow[1] + 0.01], { y: 8, blur: 6 })
  const final = useStage(p, T.final, { y: 30, blur: 16, scaleFrom: 0.96 })

  return (
    <div className="relative h-full w-full bg-ink">
      <div className="hairline-grid pointer-events-none absolute inset-0 opacity-50" />

      {/* Título de entrada */}
      <motion.div style={title} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span className="eyebrow text-azure">07 — Todo conectado</span>
        <h2 className="display mt-5 text-[13vw] text-white md:text-[8vw]">
          Todo el negocio,
          <br />
          <span className="text-white/35">un solo sistema.</span>
        </h2>
      </motion.div>

      {/* Ecosistema */}
      <motion.div className="absolute inset-0" style={{ opacity: ringOpacity, scale: ringScale, filter: ringBlur }}>
        <motion.div className="absolute inset-0" style={{ x: mx, y: my }}>
          <svg className="absolute inset-0 h-full w-full" viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}>
            <motion.ellipse cx="0" cy="0" rx={rx} ry={ry} fill="none" stroke="rgba(246,201,69,0.35)" strokeWidth="1" strokeDasharray="2 7" style={{ pathLength: orbit }} />
            {positions.map((pos, i) => (
              <Link key={i} i={i} p={p} pos={pos} color={toneOf(ecosystem[i].tone)[0]} />
            ))}
          </svg>
          {ecosystem.map((node, i) => (
            <EcoNode key={node.label} node={node} i={i} p={p} pos={positions[i]} compact={mobile} />
          ))}
        </motion.div>

        {/* Núcleo */}
        <motion.div style={core} className="absolute left-1/2 top-1/2">
          <div className="-translate-x-1/2 -translate-y-1/2">
            <div className="relative flex h-36 w-36 flex-col items-center justify-center rounded-full md:h-48 md:w-48">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#f6c945,#5277ff,#f0524f,#f6c945)] opacity-80 blur-xl" style={{ animation: 'spin-slow 14s linear infinite' }} />
              <div className="absolute inset-[3px] rounded-full bg-ink-2 ring-1 ring-white/10" />
              <div className="absolute -inset-6 rounded-full border border-dashed border-white/10" style={{ animation: 'spin-slow 40s linear infinite' }} />
              <BrandMark size={mobile ? 28 : 34} className="relative" />
              <span className="relative mt-2 text-center font-display text-[13px] font-bold leading-tight tracking-tight text-white md:text-[16px]">
                Colombian
                <br />
                Commerce OS
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Secuencia */}
      <motion.div style={flow} className="absolute inset-0 flex items-center justify-center pl-4 pr-10 md:px-5">
        <div className="relative w-full max-w-[460px]">
          <div className="absolute bottom-6 left-[30px] top-6 w-px bg-white/[0.08] md:left-[34px]">
            <motion.div className="w-full bg-gradient-to-b from-gold via-azure to-ember" style={{ height: fill }} />
          </div>
          <div className="flex flex-col gap-1.5 md:gap-2">
            {flowSteps.map((s, i) => (
              <FlowStep key={s.label} step={s} i={i} p={p} n={flowSteps.length} />
            ))}
          </div>
          <motion.div style={loop} className="mt-4 flex items-center gap-2 pl-4 text-[12px] text-white/45">
            <RefreshCw size={13} className="text-gold" /> Y el ciclo vuelve a empezar.
          </motion.div>
        </div>
      </motion.div>

      {/* Frase final */}
      <motion.div style={final} className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
        <h2 className="display text-[11vw] text-white md:text-[6.6vw]">
          Un negocio conectado
          <br />
          <span className="text-tri">toma mejores decisiones.</span>
        </h2>
      </motion.div>
    </div>
  )
}

export default function Ecosystem() {
  return (
    <StickyScene id="07" height="560vh" label="Todo conectado">
      {(p) => <Stage p={p} />}
    </StickyScene>
  )
}
