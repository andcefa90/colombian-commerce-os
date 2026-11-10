import { motion, useTransform } from 'framer-motion'
import { Coffee, TriangleExclamationPoint, Sparkles, PackagePlus, Hourglass, CalendarClock, Archive, ShoppingCart } from 'lucide-react'
import { StickyScene } from '../components/StickyScene'
import { Counter, MotionNumber } from '../components/Counter'
import { ToneIcon, toneOf } from '../components/ToneIcon'
import { DemoBadge } from '../components/DemoBadge'
import { useIsMobile, useStage, useThreshold } from '../animations/hooks'
import { inventoryAlerts } from '../data/content'

const T = {
  card: [0.04, 0.14],
  chart: [0.08, 0.18],
  burn: [0.2, 0.46],
  reco: [0.46, 0.52],
  restock: [0.52, 0.62],
  stageOut: [0.64, 0.7],
  alerts: 0.7,
  final: [0.86, 0.92],
}

const alertIcons = { restock: ShoppingCart, slow: Hourglass, expiry: CalendarClock, over: Archive }

// Proyección: días 0..5, stock 0..40
const W = 560
const H = 280
const pad = { l: 36, r: 16, t: 20, b: 36 }
const X = (d) => pad.l + (d / 5) * (W - pad.l - pad.r)
const Y = (v) => pad.t + (1 - v / 40) * (H - pad.t - pad.b)

function ProjectionChart({ p }) {
  const burn = useTransform(p, T.burn, [0, 0.86])
  const ghost = useTransform(p, [T.reco[0] - 0.02, T.reco[0] + 0.02], [0, 1])
  const restock = useTransform(p, T.restock, [0, 1])
  const restockOn = useTransform(p, [T.restock[0], T.restock[0] + 0.01], [0, 1])
  const projected = useTransform(p, T.burn, [18, 2.5])
  const marker = useTransform(p, T.burn, [0, 2.58])
  const mx = useTransform(marker, (d) => X(d))
  const my = useTransform(marker, (d) => Y(Math.max(0, 18 - 6 * d)))
  const markerOpacity = useTransform(p, [T.burn[0], T.burn[0] + 0.02, T.restock[0], T.restock[0] + 0.03], [0, 1, 1, 0])

  const burnPath = `M${X(0)},${Y(18)} L${X(1)},${Y(12)} L${X(2)},${Y(6)} L${X(3)},${Y(0)}`
  const restockPath = `M${X(2)},${Y(6)} C${X(2.1)},${Y(6)} ${X(2.1)},${Y(36)} ${X(2.25)},${Y(36)} L${X(5)},${Y(19)}`

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="zero" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f0524f" stopOpacity="0" />
            <stop offset="1" stopColor="#f0524f" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        {[0, 10, 20, 30, 40].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={Y(v)} y2={Y(v)} stroke="rgba(255,255,255,0.05)" strokeDasharray={v === 0 ? '0' : '2 6'} />
            <text x={pad.l - 10} y={Y(v) + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.3)">{v}</text>
          </g>
        ))}
        <rect x={pad.l} y={Y(6)} width={W - pad.l - pad.r} height={Y(0) - Y(6)} fill="url(#zero)" />
        <text x={W - pad.r} y={Y(0) - 8} textAnchor="end" fontSize="10" fill="#ff7a6e" opacity="0.8">Zona sin stock</text>
        {['Hoy', 'Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5'].map((l, i) => (
          <text key={l} x={X(i)} y={H - 12} textAnchor="middle" fontSize="10.5" fill={i === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.32)'}>{l}</text>
        ))}

        {/* Venta proyectada */}
        <motion.path d={burnPath} fill="none" stroke="#f6c945" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: burn }} />
        <motion.path d={`M${X(2.58)},${Y(2.5)} L${X(3)},${Y(0)}`} fill="none" stroke="#ff7a6e" strokeWidth="2" strokeDasharray="3 5" style={{ opacity: ghost }} />
        <motion.circle cx={X(3)} cy={Y(0)} r="5" fill="none" stroke="#ff7a6e" strokeWidth="2" style={{ opacity: ghost }} />

        {[[0, 18], [1, 12], [2, 6]].map(([d, v], i) => (
          <StockPoint key={d} p={p} at={T.burn[0] + (T.burn[1] - T.burn[0]) * (i / 2.58)} x={X(d)} y={Y(v)} v={v} />
        ))}

        {/* Reposición recomendada */}
        <motion.path d={restockPath} fill="none" stroke="#5fe0b3" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: restock, opacity: restockOn }} />
        <motion.text x={X(2.25) - 8} y={Y(36) - 10} textAnchor="end" fontSize="12" fontWeight="700" fill="#5fe0b3" style={{ opacity: restock }}>Reposición +30</motion.text>

        <motion.g style={{ opacity: markerOpacity }}>
          <motion.circle cx={mx} cy={my} r="11" fill="#f6c945" opacity="0.2" />
          <motion.circle cx={mx} cy={my} r="5" fill="#f6c945" stroke="#0c0e12" strokeWidth="2" />
        </motion.g>
      </svg>
      <motion.div style={{ opacity: markerOpacity }} className="absolute right-0 top-0 rounded-full bg-white/[0.05] px-3 py-1 text-[11px] text-white/60 ring-1 ring-white/10">
        Proyección: <MotionNumber value={projected} className="font-semibold text-gold" /> u.
      </motion.div>
    </div>
  )
}

function StockPoint({ p, at, x, y, v }) {
  const o = useTransform(p, [at, at + 0.015], [0, 1])
  return (
    <motion.g style={{ opacity: o }}>
      <circle cx={x} cy={y} r="3.5" fill="#f6c945" />
      <text x={x + 8} y={y - 10} fontSize="13" fontWeight="700" fill="#fff" fontFamily="Manrope Variable">{v}</text>
    </motion.g>
  )
}

function ProductCard({ p }) {
  const low = useThreshold(p, T.card[1])
  const cover = useTransform(p, T.burn, ['30%', '6%'])
  return (
    <div className="glass rounded-[24px] p-5 md:p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: `radial-gradient(circle at 30% 20%, ${toneOf('cocoa')[0]}55, ${toneOf('cocoa')[1]}33)` }}>
          <ToneIcon icon={Coffee} tone="cocoa" size={40} radius={12} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg font-bold tracking-tight text-white md:text-xl">Café colombiano</div>
          <div className="text-[11.5px] text-white/40">SKU CAF-0500 · Huila 500 g</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/[0.06]">
        {[
          ['Stock', <><Counter value={18} start={low} /> <span className="text-sm font-medium text-white/40">u.</span></>],
          ['Velocidad', <><Counter value={6} start={low} delay={0.15} /> <span className="text-sm font-medium text-white/40">/día</span></>],
          ['Cobertura', <><Counter value={3} start={low} delay={0.3} /> <span className="text-sm font-medium text-white/40">días</span></>],
        ].map(([label, node]) => (
          <div key={label} className="bg-ink-2/90 px-3.5 py-3">
            <div className="text-[10.5px] text-white/40">{label}</div>
            <div className="mt-1 font-display text-2xl font-bold tracking-tight text-white">{node}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-ember to-gold" style={{ width: cover }} />
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: low ? 1 : 0, y: low ? 0 : 6 }}
        transition={{ duration: 0.6 }}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold/12 px-3 py-1.5 text-[11.5px] font-semibold text-gold ring-1 ring-gold/30"
      >
        <span className="relative flex h-2 w-2 text-gold">
          <span className="pulse-ring relative h-2 w-2 rounded-full bg-gold" />
        </span>
        <TriangleExclamationPoint size={13} /> STOCK BAJO
      </motion.div>
    </div>
  )
}

function Recommendation({ p }) {
  const s = useStage(p, T.reco, { y: 30, blur: 14, scaleFrom: 0.92 })
  const ordered = useThreshold(p, T.restock[1])
  return (
    <motion.div style={s} className="rounded-[20px] bg-white p-4 text-ink shadow-[0_30px_80px_-20px_rgba(95,224,179,0.45)] md:p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-gold">
          <Sparkles size={14} />
        </span>
        <span className="eyebrow text-[10px] text-black/50">Recomendación</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <div className="text-[12px] text-black/50">Comprar</div>
          <div className="whitespace-nowrap font-display text-4xl font-bold tracking-tight">+30 <span className="text-lg text-black/40">unidades</span></div>
        </div>
        <motion.span
          animate={{ backgroundColor: ordered ? '#3fd3a0' : '#07080a', color: ordered ? '#07080a' : '#ffffff' }}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] font-semibold"
        >
          <PackagePlus size={14} /> {ordered ? 'Orden lista' : 'Crear orden'}
        </motion.span>
      </div>
      <div className="mt-2 text-[11.5px] text-black/45">Cobertura después de reponer: 8 días</div>
    </motion.div>
  )
}

function AlertCard({ a, i, p }) {
  const at = T.alerts + i * 0.025
  const s = useStage(p, [at, at + 0.05], { y: 50, blur: 12, scaleFrom: 0.9 })
  const on = useThreshold(p, at + 0.02)
  const Icon = alertIcons[a.icon]
  const [c] = toneOf(a.tone)
  return (
    <motion.div style={s} whileHover={{ y: -4 }} className="glass relative overflow-hidden rounded-[22px] p-5 md:p-6">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl" style={{ background: `${c}30` }} />
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${c}1f`, color: c }}>
        <Icon size={18} />
      </span>
      <div className="relative mt-6 font-display text-5xl font-bold tracking-tight text-white md:text-6xl">
        <Counter value={a.value} start={on} duration={1.4} />
      </div>
      <div className="relative mt-2 text-[13px] leading-snug text-white/55">{a.label}</div>
    </motion.div>
  )
}

function Stage({ p }) {
  const title = useStage(p, [-1, 0, T.stageOut[0], T.stageOut[1]], { y: 30, blur: 12 })
  const card = useStage(p, [T.card[0], T.card[1], T.stageOut[0], T.stageOut[1]], { y: 60, blur: 12, scaleTo: 0.94 })
  const chart = useStage(p, [T.chart[0], T.chart[1], T.stageOut[0], T.stageOut[1]], { y: 60, blur: 12, scaleTo: 0.94 })
  const alertsWrap = useTransform(p, T.final, [1, 0.25])
  const alertsBlur = useTransform(p, T.final, ['blur(0px)', 'blur(8px)'])
  const alertsHead = useStage(p, [T.alerts - 0.02, T.alerts + 0.03], { y: 12, blur: 8 })
  const final = useStage(p, T.final, { y: 40, blur: 18, scaleFrom: 0.96 })
  const mobile = useIsMobile()
  const cardFade = useTransform(p, T.reco, [1, 0])
  return (
    <div className="relative h-full w-full bg-ink">
      <div className="pointer-events-none absolute right-[5%] top-[20%] h-[50vh] w-[50vh] rounded-full bg-gold/[0.07] blur-[120px]" />

      {/* Etapa A: producto + proyección */}
      <div className="absolute inset-0 flex flex-col justify-center px-5 pt-14 md:px-10 md:pt-10">
        <div className="mx-auto w-full max-w-[1240px]">
          <motion.div style={title} className="mb-6 md:mb-10">
            <span className="eyebrow text-gold/90">06 — Inventario inteligente</span>
            <h2 className="display mt-3 text-[9vw] text-white md:mt-4 md:text-[4.4vw]">
              Saber qué comprar
              <br />
              <span className="text-white/35">antes de quedarnos sin stock.</span>
            </h2>
          </motion.div>
          <div className="grid items-start gap-4 lg:grid-cols-[380px_1fr] md:gap-8">
            <motion.div style={card} className="relative">
              <motion.div style={{ opacity: mobile ? cardFade : 1 }}>
                <ProductCard p={p} />
              </motion.div>
              {mobile && (
                <div className="absolute inset-x-0 top-0">
                  <Recommendation p={p} />
                </div>
              )}
            </motion.div>
            <motion.div style={chart} className="glass relative rounded-[24px] p-4 md:p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12px] font-medium text-white/50">Venta proyectada</span>
                <DemoBadge />
              </div>
              <ProjectionChart p={p} />
              {!mobile && (
                <div className="absolute right-6 top-14 w-[330px]">
                  <Recommendation p={p} />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Etapa B: alertas */}
      <motion.div style={{ opacity: alertsWrap, filter: alertsBlur }} className="pointer-events-none absolute inset-0 flex items-center px-5 md:px-10">
        <div className="pointer-events-auto mx-auto w-full max-w-[1240px]">
          <motion.p style={alertsHead} className="eyebrow mb-6 text-white/45 md:mb-8">Todo el catálogo, vigilado en tiempo real</motion.p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {inventoryAlerts.map((a, i) => (
              <AlertCard key={a.label} a={a} i={i} p={p} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Etapa C */}
      <motion.div style={final} className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
        <h2 className="display text-[14vw] text-white md:text-[8.5vw]">
          Del inventario
          <br />
          <span className="text-tri">a la acción.</span>
        </h2>
      </motion.div>
    </div>
  )
}

export default function Inventory() {
  return (
    <StickyScene id="06" height="480vh" label="Inventario inteligente">
      {(p) => <Stage p={p} />}
    </StickyScene>
  )
}
