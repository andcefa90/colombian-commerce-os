import { AnimatePresence, motion, useTransform } from 'framer-motion'
import { Send, Check, TriangleExclamationPoint, Heart, Clock, Sparkles } from 'lucide-react'
import { StickyScene } from '../components/StickyScene'
import { Counter, MotionNumber } from '../components/Counter'
import { DemoBadge } from '../components/DemoBadge'
import { toneOf } from '../components/ToneIcon'
import { smoothPath, toPoints } from '../components/charts/paths'
import { useStage, useThreshold } from '../animations/hooks'
import { ease } from '../animations/variants'
import { customer, segments } from '../data/content'

const T = {
  card: [0.06, 0.18],
  stats: 0.12,
  days: [0.3, 0.56],
  risk: 0.56,
  action: [0.64, 0.72],
  sent: 0.78,
  message: 0.84,
}

const segTone = { VIP: 'gold', Fiel: 'jade', Potencial: 'azure', 'En riesgo': 'ember', Inactivo: 'cream' }

function HistoryChart({ p, risk }) {
  const W = 460
  const H = 110
  // La historia ocupa el 80% del ancho; el resto muestra la caída por inactividad
  const pts = toPoints(customer.history, W * 0.8, H, { t: 10, r: 0, b: 10, l: 8 }, 0, 80)
  const last = pts.at(-1)
  const end = [W - 8, H - 14]
  const drop = `M${last[0]},${last[1]} C${last[0] + 30},${last[1]} ${end[0] - 40},${end[1]} ${end[0]},${end[1]}`
  const draw = useTransform(p, T.card, [0, 1])
  const dropLen = useTransform(p, T.days, [0, 1])
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full overflow-visible" preserveAspectRatio="none">
      <motion.path d={smoothPath(pts)} fill="none" stroke="#5fe0b3" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinecap="round" style={{ pathLength: draw }} />
      <motion.path
        d={drop}
        fill="none"
        stroke={risk ? '#ff7a6e' : '#f6c945'}
        strokeWidth="2.2"
        strokeDasharray="4 5"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: dropLen }}
      />
    </svg>
  )
}

function SegmentRail({ risk }) {
  const current = risk ? 'En riesgo' : 'Fiel'
  return (
    <div className="grid grid-cols-5 gap-1 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/[0.06]">
      {segments.map((s) => {
        const on = s === current
        const [a] = toneOf(segTone[s])
        return (
          <div key={s} className="relative flex items-center justify-center rounded-full py-1.5">
            {on && (
              <motion.span
                layoutId="seg-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: `${a}26`, boxShadow: `inset 0 0 0 1px ${a}66, 0 0 24px -6px ${a}` }}
                transition={{ type: 'spring', stiffness: 160, damping: 22 }}
              />
            )}
            <span className={`relative whitespace-nowrap text-[9.5px] font-semibold uppercase tracking-[0.08em] md:text-[10.5px] ${on ? '' : 'text-white/30'}`} style={on ? { color: a } : undefined}>
              {s}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function ProfileCard({ p }) {
  const stats = useThreshold(p, T.stats)
  const risk = useThreshold(p, T.risk)
  const days = useTransform(p, T.days, [customer.daysStart, customer.daysEnd])
  const daysColor = useTransform(p, [T.days[0], T.days[0] + 0.12, T.days[1]], ['#ffffff', '#f6c945', '#ff7a6e'])
  const lastBar = useTransform(p, T.days, ['40%', '100%'])
  return (
    <div className="glass relative overflow-hidden rounded-[26px] p-5 md:p-7">
      <motion.div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        animate={{ background: risk ? 'rgba(240,82,79,0.22)' : 'rgba(63,211,160,0.16)' }}
        transition={{ duration: 1.2 }}
      />
      {/* Encabezado */}
      <div className="relative flex items-center gap-4">
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f6c945] via-[#e9a23b] to-[#c9562f] font-display text-lg font-bold text-ink md:h-16 md:w-16">
            {customer.initials}
          </div>
          <motion.span
            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-[3px] ring-ink-2"
            animate={{ backgroundColor: risk ? '#f0524f' : '#3fd3a0' }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">{customer.name}</div>
          <div className="text-[12px] text-white/40">{customer.since} · {customer.frequency}</div>
        </div>
        <div className="hidden md:block">
          <DemoBadge />
        </div>
      </div>

      {/* Métricas */}
      <div className="relative mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/[0.06] md:grid-cols-4">
        {[
          { label: 'Compras', node: <Counter value={customer.orders} start={stats} /> },
          { label: 'Valor acumulado', node: <Counter value={customer.lifetime} prefix="$" start={stats} delay={0.1} /> },
          { label: 'Ticket promedio', node: <Counter value={customer.ticket} prefix="$" start={stats} delay={0.2} /> },
          {
            label: 'Días sin comprar',
            node: (
              <motion.span style={{ color: daysColor }}>
                <MotionNumber value={days} />
              </motion.span>
            ),
          },
        ].map((s) => (
          <div key={s.label} className="bg-ink-2/90 px-4 py-3.5">
            <div className="text-[10.5px] text-white/40">{s.label}</div>
            <div className="mt-1 font-display text-2xl font-bold tracking-tight text-white md:text-[28px]">{s.node}</div>
          </div>
        ))}
      </div>

      {/* Segmento */}
      <div className="relative mt-5">
        <div className="mb-2 flex items-center justify-between text-[11px] text-white/40">
          <span>Segmento</span>
          <AnimatePresence mode="wait">
            {risk ? (
              <motion.span key="r" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-ember">
                <TriangleExclamationPoint size={12} /> Riesgo detectado · 45 días sin comprar
              </motion.span>
            ) : (
              <motion.span key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                <Clock size={12} /> Última compra
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <SegmentRail risk={risk} />
      </div>

      {/* Evolución + comportamiento */}
      <div className="relative mt-5 grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-2 text-[11px] text-white/40">Evolución de compras</div>
          <div className="h-[78px] md:h-[100px]">
            <HistoryChart p={p} risk={risk} />
          </div>
          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div className="h-full rounded-full" style={{ width: lastBar, background: risk ? '#f0524f' : 'linear-gradient(90deg,#3fd3a0,#f6c945)' }} />
          </div>
        </div>
        <div className="hidden flex-col gap-2 md:flex">
          <div className="text-[11px] text-white/40">Categorías</div>
          {customer.categories.map((c, i) => (
            <div key={c.label} className="flex items-center gap-2 text-[11px]">
              <span className="w-16 text-white/55">{c.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  className="h-full origin-left rounded-full"
                  style={{ width: `${c.v * 2.4}%`, background: toneOf(c.tone)[0] }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: stats ? 1 : 0 }}
                  transition={{ duration: 1.2, ease, delay: 0.3 + i * 0.08 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-[11px] text-white/40">
          <Heart size={12} /> Favoritos
        </span>
        {customer.favorites.map((f) => (
          <span key={f} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/70 ring-1 ring-white/[0.06]">
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

function ActionCard({ p }) {
  const s = useStage(p, T.action, { y: 60, blur: 16, scaleFrom: 0.94 })
  const sent = useThreshold(p, T.sent)
  return (
    <motion.div style={s} className="glass w-full rounded-[22px] p-4 md:ml-auto md:max-w-[380px] md:p-5 lg:w-[340px]">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold text-ink">
          <Sparkles size={14} />
        </span>
        <span className="eyebrow text-[10px] text-gold">Acción recomendada</span>
      </div>
      <div className="mt-3 font-display text-lg font-bold tracking-tight text-white">Campaña de recuperación</div>
      <div className="mt-3 rounded-2xl bg-white p-3.5 text-ink">
        <div className="text-[10px] font-medium uppercase tracking-wider text-black/40">Vista previa · WhatsApp + email</div>
        <div className="mt-1.5 font-display text-[17px] font-bold">Te extrañamos 🇨🇴</div>
        <p className="mt-1 text-[12.5px] leading-snug text-black/60">María, tu café de origen te espera. 15% de descuento en tu próxima compra.</p>
      </div>
      <motion.div
        animate={{ backgroundColor: sent ? '#3fd3a0' : '#ffffff' }}
        transition={{ duration: 0.5 }}
        className="mt-3 flex items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-semibold text-ink"
      >
        <AnimatePresence mode="wait">
          <motion.span key={String(sent)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
            {sent ? <Check size={15} /> : <Send size={14} />} {sent ? 'Campaña programada' : 'Enviar campaña'}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

function Stage({ p }) {
  const head = useStage(p, [-1, 0], { y: 30 })
  const card = useStage(p, T.card, { y: 80, blur: 14, scaleFrom: 0.94 })
  const cardRot = useTransform(p, T.card, [16, 0])
  const cardDim = useTransform(p, [T.action[0], T.action[1]], [1, 0.55])
  const msgA = useStage(p, [-1, 0, T.message - 0.04, T.message], { y: 14, blur: 8 })
  const msgB = useStage(p, [T.message, T.message + 0.05], { y: 14, blur: 8 })
  return (
    <div className="relative flex h-full w-full items-center bg-ink">
      <div className="pointer-events-none absolute left-[10%] top-1/3 h-[50vh] w-[50vh] rounded-full bg-azure/10 blur-[120px]" />
      <div className="mx-auto grid w-full max-w-[1300px] items-center gap-6 px-5 pt-16 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:pt-0">
        <motion.div style={head}>
          <span className="eyebrow text-ember/90">05 — Clientes</span>
          <h2 className="display mt-4 text-[10.5vw] text-white md:mt-6 md:text-[5.4vw]">
            Cada cliente
            <br />
            <span className="text-white/35">tiene una historia.</span>
          </h2>
          <div className="relative mt-6 hidden h-16 lg:block">
            <motion.p style={msgA} className="absolute max-w-sm text-lg leading-relaxed text-white/50">
              Compras, frecuencia y favoritos en un solo perfil.
            </motion.p>
            <motion.p style={msgB} className="absolute max-w-md text-lg leading-relaxed text-white/50">
              No solo registra clientes. <span className="text-white">Ayuda a recuperarlos.</span>
            </motion.p>
          </div>
        </motion.div>
        <div className="relative" style={{ perspective: 1400 }}>
          <motion.div style={{ ...card, rotateX: cardRot }}>
            <motion.div style={{ opacity: cardDim }}>
              <ProfileCard p={p} />
            </motion.div>
          </motion.div>
          <div className="absolute inset-x-0 bottom-3 px-3 md:inset-x-6 lg:inset-x-auto lg:-bottom-10 lg:-right-8 lg:px-0">
            <ActionCard p={p} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Customers() {
  return (
    <StickyScene id="05" height="460vh" label="Clientes">
      {(p) => <Stage p={p} />}
    </StickyScene>
  )
}
