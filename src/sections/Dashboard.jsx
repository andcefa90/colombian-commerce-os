import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useTransform } from 'framer-motion'
import { Brain, ArrowUpRight, TrendingUp, Package, Hourglass, Sparkles, LayoutDashboard, Users, Boxes, Receipt, Settings, Check } from 'lucide-react'
import { StickyScene } from '../components/StickyScene'
import { Panel } from '../components/Panel'
import { Counter } from '../components/Counter'
import { DemoBadge } from '../components/DemoBadge'
import { BrandMark } from '../components/Logo'
import { toneOf } from '../components/ToneIcon'
import { AreaChart, Columns, Donut, Sparkline } from '../components/charts/Charts'
import { useStage, useViewport } from '../animations/hooks'
import { ease, fadeUp } from '../animations/variants'
import { kpis, salesByCategory, salesByDay, topProducts } from '../data/content'
import { seeded } from '../lib/format'

/* ---------------- Transición: la tienda se disuelve en datos ---------------- */

function DataField({ p }) {
  const { w, h } = useViewport()
  const dots = useMemo(() => {
    const r = seeded(42)
    const n = w < 768 ? 70 : 160
    return Array.from({ length: n }, (_, i) => ({
      i,
      x: r() * w,
      y: r() * h,
      s: 1 + r() * 2.5,
      c: ['#f6c945', '#7d97ff', '#ff7a6e', '#5fe0b3'][i % 4],
      at: 0.12 + r() * 0.3,
    }))
  }, [w, h])
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${w} ${h}`}>
      {dots.map((d) => (
        <Dot key={d.i} d={d} p={p} />
      ))}
    </svg>
  )
}

function Dot({ d, p }) {
  const opacity = useTransform(p, [d.at, d.at + 0.08, 0.7, 0.9], [0, 0.8, 0.5, 0.15])
  return <motion.circle cx={d.x} cy={d.y} r={d.s} fill={d.c} style={{ opacity }} />
}

function GhostStore() {
  return (
    <div className="w-[88vw] max-w-[1100px] rounded-[30px] bg-white p-6 shadow-[0_80px_160px_-60px_rgba(0,0,0,0.4)] ring-1 ring-black/5">
      <div className="flex gap-3">
        <div className="h-8 w-32 rounded-full bg-black/[0.06]" />
        <div className="h-8 flex-1 rounded-full bg-black/[0.04]" />
        <div className="h-8 w-28 rounded-full bg-black/[0.06]" />
      </div>
      <div className="mt-5 grid grid-cols-[1.6fr_1fr] gap-3">
        <div className="h-28 rounded-2xl bg-ink" />
        <div className="h-28 rounded-2xl bg-black/[0.04]" />
      </div>
      <div className="mt-5 grid grid-cols-5 gap-3">
        {['gold', 'ember', 'jade', 'azure', 'ember'].map((t, i) => (
          <div key={i} className="h-32 rounded-2xl" style={{ background: `linear-gradient(160deg, ${toneOf(t)[0]}40, #fff)` }} />
        ))}
      </div>
    </div>
  )
}

function DashboardIntroStage({ p }) {
  const bg = useTransform(p, [0.08, 0.42], ['#f4f2ed', '#07080a'])
  const store = useStage(p, [-1, 0, 0.08, 0.4], { y: 0, blur: 26, scaleTo: 1.12 })
  const title = useStage(p, [0.38, 0.5], { y: 40, blur: 18, scaleFrom: 0.96 })
  const sub = useStage(p, [0.56, 0.66], { y: 16, blur: 10 })
  return (
    <motion.div className="relative h-full w-full" style={{ backgroundColor: bg }}>
      <DataField p={p} />
      <motion.div style={store} className="absolute inset-0 flex items-center justify-center">
        <GhostStore />
      </motion.div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.span style={title} className="eyebrow mb-6 text-azure">
          04 — Cuando el negocio empieza a ver
        </motion.span>
        <motion.h2 style={title} className="display text-[13vw] text-white md:text-[8vw]">
          De los datos
          <br />
          <span className="text-tri">a las decisiones.</span>
        </motion.h2>
        <motion.p style={sub} className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/50 md:text-lg">
          Ya no solo vemos lo que pasó. <span className="text-white/85">Entendemos lo que está pasando.</span>
        </motion.p>
      </div>
    </motion.div>
  )
}

/* ---------------- Dashboard ---------------- */

const liveOrders = [
  ['#4821', 'Desayuno colombiano', '$38,40'],
  ['#4822', 'Café de origen x2', '$29,80'],
  ['#4823', 'Noche de fútbol', '$34,45'],
  ['#4824', 'Pan de bono x6', '$6,99'],
  ['#4825', 'Mercado familiar', '$47,60'],
]

function LiveTicker() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % liveOrders.length), 3200)
    return () => clearInterval(id)
  }, [])
  const [id, name, total] = liveOrders[i]
  return (
    <div className="flex items-center gap-2.5 overflow-hidden rounded-full bg-white/[0.04] py-1.5 pl-2.5 pr-3.5 ring-1 ring-white/[0.06]">
      <span className="relative flex h-2 w-2 text-jade">
        <span className="pulse-ring relative h-2 w-2 rounded-full bg-jade" />
      </span>
      <span className="text-[11px] text-white/45">En vivo</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={id}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className="whitespace-nowrap text-[11px] text-white/80"
        >
          Pedido {id} · {name} · <span className="tabular-nums text-jade">{total}</span>
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function KpiCard({ k, i }) {
  const [a] = toneOf(k.tone)
  return (
    <Panel i={i} className="min-h-[118px] max-md:!p-4 md:min-h-[148px]">
      {(play) => (
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="eyebrow text-[9px] text-white/45 md:text-[10px]">{k.label}</span>
            <span className="flex items-center gap-1 rounded-full bg-jade/10 px-2 py-0.5 text-[10.5px] font-medium text-jade">
              <TrendingUp size={11} /> {k.delta}
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <Counter value={k.value} prefix={k.prefix} decimals={k.decimals ?? 0} start={play} delay={0.2 + i * 0.1} duration={2} className="font-display text-[26px] font-bold leading-none tracking-tight text-white md:text-[38px]" />
            <span className="hidden sm:block"><Sparkline data={k.spark} play={play} color={a} delay={0.5 + i * 0.1} width={84} height={30} /></span>
          </div>
        </div>
      )}
    </Panel>
  )
}

function TypeText({ text, play, delay = 0, speed = 28, onDone }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!play) return
    let id
    const t = setTimeout(() => {
      id = setInterval(() => {
        setN((v) => Math.min(v + 1, text.length))
      }, speed)
    }, delay * 1000)
    return () => {
      clearTimeout(t)
      clearInterval(id)
    }
  }, [play]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (play && n >= text.length) onDone?.()
  }, [n]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span>
      {text.slice(0, n)}
      {n < text.length && play && <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] animate-pulse bg-gold" />}
    </span>
  )
}

function InsightCard() {
  const [typed, setTyped] = useState(false)
  const [applied, setApplied] = useState(false)
  return (
    <Panel i={1} className="!p-0 lg:col-span-12">
      {(play) => (
        <div className="relative grid gap-6 overflow-hidden p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <motion.div
            className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
            animate={{ opacity: play ? [0.4, 0.9, 0.4] : 0 }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-[#c99a1c] text-ink">
                <Brain size={16} />
              </span>
              <span className="eyebrow text-gold">Insight inteligente</span>
            </div>
            <p className="mt-5 max-w-3xl font-display text-[22px] font-semibold leading-snug tracking-tight text-white md:text-[30px]">
              “<TypeText text="Las ventas de café aumentaron 34% en los últimos 14 días." play={play} delay={0.9} onDone={() => setTyped(true)} />”
            </p>
            <AnimatePresence>
              {typed && (
                <motion.div
                  initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, ease, delay: 0.3 }}
                  className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] py-2 pl-2 pr-4 ring-1 ring-white/10"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-jade/15 text-jade">
                    <Sparkles size={13} />
                  </span>
                  <span className="text-[13.5px] text-white/85">
                    <span className="text-white/50">Recomendación:</span> aumentar inventario.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {typed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease, delay: 0.8 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setApplied(true)}
                className={`relative flex items-center gap-2 self-end justify-self-start rounded-full px-5 py-3 text-[13px] font-semibold transition-colors md:self-center ${
                  applied ? 'bg-jade text-ink' : 'bg-white text-ink'
                }`}
              >
                {applied ? <Check size={15} /> : <ArrowUpRight size={15} />}
                {applied ? 'Orden de compra creada' : 'Aplicar recomendación'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </Panel>
  )
}

function DashboardApp() {
  const nav = [LayoutDashboard, Receipt, Users, Boxes, Settings]
  return (
    <div className="relative mx-auto max-w-[1300px] overflow-hidden rounded-[24px] bg-ink-2 ring-1 ring-white/[0.08] shadow-[0_80px_160px_-60px_rgba(0,0,0,0.9)] md:rounded-[30px]">
      <div className="flex">
        {/* Barra lateral */}
        <aside className="hidden w-[68px] shrink-0 flex-col items-center gap-2 border-r border-white/[0.06] py-6 lg:flex">
          <BrandMark size={30} />
          <div className="mt-6 flex flex-col gap-2">
            {nav.map((Icon, i) => (
              <span key={i} className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${i === 0 ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:bg-white/[0.04] hover:text-white/70'}`}>
                <Icon size={18} />
              </span>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1 p-4 md:p-7">
          {/* Encabezado */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">Panel de ventas</h3>
                <DemoBadge />
              </div>
              <p className="mt-1 text-[12px] text-white/40">Hoy · Todas las tiendas</p>
            </div>
            <LiveTicker />
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-12">
            {kpis.map((k, i) => (
              <div key={k.label} className="col-span-1 lg:col-span-3">
                <KpiCard k={k} i={i} />
              </div>
            ))}

            <Panel title="Ventas por día · últimos 14 días" right={<span className="text-[11px] text-white/35">miles USD</span>} className="col-span-2 lg:col-span-8" i={0}>
              {(play) => (
                <div className="h-[200px] md:h-[240px]">
                  <AreaChart data={salesByDay.map((d) => d.v)} labels={salesByDay.map((d) => d.d)} play={play} color="#5fe0b3" height={240} delay={0.3} />
                </div>
              )}
            </Panel>

            <Panel title="Ventas por categoría" right={<span className="text-[11px] text-white/35">índice</span>} className="col-span-2 lg:col-span-4" i={1}>
              {(play) => <Columns items={salesByCategory} play={play} height={220} />}
            </Panel>

            <Panel title="Productos más vendidos" className="col-span-2 lg:col-span-4" i={0}>
              {(play) => (
                <ol className="flex flex-col gap-3">
                  {topProducts.map((tp, i) => (
                    <motion.li
                      key={tp.name}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: play ? 1 : 0, x: play ? 0 : -14 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease }}
                      className="grid grid-cols-[20px_1fr_auto] items-center gap-3"
                    >
                      <span className="font-display text-[13px] font-bold text-white/30">{i + 1}</span>
                      <div className="min-w-0">
                        <div className="text-[13px] text-white/85">{tp.name}</div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                          <motion.div
                            className="h-full origin-left rounded-full"
                            style={{ width: `${(tp.units / topProducts[0].units) * 100}%`, background: i === 0 ? 'linear-gradient(90deg,#b8860b,#f6c945)' : 'rgba(255,255,255,0.28)' }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: play ? 1 : 0 }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 1.2, ease }}
                          />
                        </div>
                      </div>
                      <span className="text-[12px] tabular-nums text-white/45">{tp.units} u.</span>
                    </motion.li>
                  ))}
                </ol>
              )}
            </Panel>

            <Panel title="Clientes recurrentes" className="col-span-2 sm:col-span-1 lg:col-span-4" i={1}>
              {(play) => (
                <div className="flex h-full items-center gap-5">
                  <Donut value={62} play={play} size={128}>
                    <Counter value={62} suffix="%" start={play} delay={0.3} className="font-display text-2xl font-bold text-white" />
                    <span className="text-[10px] text-white/40">recompra</span>
                  </Donut>
                  <div className="flex flex-col gap-3 text-[12px]">
                    <div>
                      <div className="text-white/40">Nuevos este mes</div>
                      <Counter value={148} start={play} delay={0.5} className="font-display text-lg font-semibold text-white" />
                    </div>
                    <div>
                      <div className="text-white/40">Frecuencia media</div>
                      <span className="font-display text-lg font-semibold text-white">12 días</span>
                    </div>
                  </div>
                </div>
              )}
            </Panel>

            <div className="col-span-2 grid gap-3 sm:col-span-1 md:gap-4 lg:col-span-4">
              <Panel i={2} className="!p-4">
                {(play) => (
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-azure/15 text-azure">
                      <Hourglass size={19} />
                    </span>
                    <div className="flex-1">
                      <div className="eyebrow text-[10px] text-white/45">Baja rotación</div>
                      <div className="text-[12px] text-white/40">Sin ventas en 30 días</div>
                    </div>
                    <span className="font-display text-3xl font-bold text-white">
                      <Counter value={8} start={play} delay={0.4} duration={1.2} />
                    </span>
                  </div>
                )}
              </Panel>
              <Panel i={3} className="!p-4">
                {(play) => (
                  <div className="flex items-center gap-4">
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-ember/15 text-ember">
                      <Package size={19} />
                      {play && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-ember ring-2 ring-ink-2" />}
                    </span>
                    <div className="flex-1">
                      <div className="eyebrow text-[10px] text-white/45">Alertas de inventario</div>
                      <div className="text-[12px] text-white/40">Bajo el punto de reorden</div>
                    </div>
                    <span className="font-display text-3xl font-bold text-white">
                      <Counter value={12} start={play} delay={0.5} duration={1.2} />
                    </span>
                  </div>
                )}
              </Panel>
            </div>

            <InsightCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <>
      <StickyScene id="04" height="260vh" label="Cuando el negocio empieza a ver">
        {(p) => <DashboardIntroStage p={p} />}
      </StickyScene>
      <section data-scene="04" aria-label="Dashboard" className="relative bg-ink px-3 pb-28 pt-4 md:px-8 md:pb-40">
        <DashboardApp />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 1 }}
          className="mx-auto mt-10 max-w-xl text-center text-[13px] text-white/35"
        >
          Cifras ilustrativas para demostrar la experiencia. No corresponden a datos reales del negocio.
        </motion.p>
      </section>
    </>
  )
}
