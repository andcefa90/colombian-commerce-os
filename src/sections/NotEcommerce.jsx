import { motion, useTransform } from 'framer-motion'
import { ShoppingCart, CreditCard, LayoutGrid, Lock } from 'lucide-react'
import { StickyScene } from '../components/StickyScene'
import { ToneIcon, toneOf } from '../components/ToneIcon'
import { useStage, useThreshold, useViewport } from '../animations/hooks'
import { useMouse } from '../animations/MouseProvider'
import { brand, ecommerceNodes, featuredProducts, products } from '../data/content'

const T = {
  titleOut: [0.14, 0.22],
  windowIn: [0.16, 0.28],
  parts: [0.27, 0.31, 0.35],
  partsOut: [0.4, 0.44],
  shrink: [0.4, 0.54],
  nodes: 0.5,
  nodeStep: 0.035,
  text: [0.8, 0.86],
}

function StoreWindow() {
  const items = products.slice(0, 6)
  return (
    <div className="glass overflow-hidden rounded-[22px] text-left">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <div className="mx-auto flex items-center gap-1.5 rounded-full bg-white/[0.05] px-4 py-1 text-[11px] text-white/45">
          <Lock size={10} /> mercadocolombia.la
        </div>
      </div>
      <div className="grid grid-cols-[1fr_200px] gap-4 p-4 max-md:grid-cols-1">
        <div className="grid grid-cols-3 gap-3">
          {items.map((it) => (
            <div key={it.name} className="rounded-xl bg-white/[0.035] p-3 ring-1 ring-white/[0.05]">
              <div className="mb-3 flex h-14 items-center justify-center rounded-lg" style={{ background: `${toneOf(it.tone)[0]}14` }}>
                <ToneIcon icon={it.icon} tone={it.tone} size={30} radius={9} />
              </div>
              <div className="truncate text-[11px] text-white/75">{it.name}</div>
              <div className="text-[11px] tabular-nums text-white/40">${it.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.05] max-md:hidden">
          <div className="flex items-center gap-2 text-[12px] text-white/70">
            <ShoppingCart size={14} /> Carrito · 3
          </div>
          {featuredProducts.slice(0, 3).map((f) => (
            <div key={f.name} className="flex items-center gap-2">
              <ToneIcon icon={f.icon} tone={f.tone} size={22} radius={7} />
              <span className="flex-1 truncate text-[11px] text-white/55">{f.name}</span>
              <span className="text-[11px] tabular-nums text-white/45">${f.price}</span>
            </div>
          ))}
          <div className="mt-auto border-t border-white/[0.06] pt-3 text-[11px] text-white/45">
            Total <span className="float-right tabular-nums text-white/80">$29,14</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-white py-2 text-[11px] font-semibold text-ink">
            <CreditCard size={12} /> Checkout
          </div>
        </div>
      </div>
    </div>
  )
}

function PartChip({ p, at, label, icon: Icon, className }) {
  const s = useStage(p, [at, at + 0.03, T.partsOut[0], T.partsOut[1]], { y: 10, blur: 6 })
  return (
    <motion.div style={s} className={`absolute flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold text-ink shadow-2xl ${className}`}>
      <Icon size={14} /> {label}
    </motion.div>
  )
}

function Node({ node, i, p, pos }) {
  const at = T.nodes + i * T.nodeStep
  const opacity = useTransform(p, [at, at + 0.03], [0, 1])
  const scale = useTransform(p, [at, at + 0.04], [0.6, 1])
  const glow = useTransform(p, [at + 0.02, at + 0.05], [0, 1])
  const [a] = toneOf(node.tone)
  const boxShadow = useTransform(glow, (g) => `0 0 ${40 * g}px -6px ${a}88, inset 0 1px 0 rgba(255,255,255,0.06)`)
  return (
    <motion.div className="absolute left-1/2 top-1/2" style={{ x: pos.x, y: pos.y, opacity, scale }}>
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="glass flex items-center gap-2.5 whitespace-nowrap rounded-2xl py-2 pl-2 pr-4 max-md:flex-col max-md:gap-1.5 max-md:rounded-xl max-md:px-2 max-md:py-2"
          style={{ boxShadow }}
        >
          <ToneIcon icon={node.icon} tone={node.tone} size={30} radius={9} className="max-md:!h-6 max-md:!w-6" />
          <span className="eyebrow text-[10.5px] tracking-[0.16em] text-white/85 max-md:text-[8.5px] max-md:tracking-[0.1em]">{node.label}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function Connection({ i, p, pos, color }) {
  const at = T.nodes - 0.02 + i * T.nodeStep
  const pathLength = useTransform(p, [at, at + 0.04], [0, 1])
  const live = useThreshold(p, T.nodes + 7 * T.nodeStep)
  const d = `M0,0 L${pos.x},${pos.y}`
  return (
    <g>
      <motion.path d={d} stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="none" style={{ pathLength }} />
      <motion.path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" style={{ pathLength, opacity: 0.5 }} />
      {live && (
        <circle r="2.6" fill={color}>
          <animateMotion dur={`${2.4 + (i % 3) * 0.5}s`} repeatCount="indefinite" path={d} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
        </circle>
      )}
    </g>
  )
}

function Stage({ p }) {
  const { w, h } = useViewport()
  const mobile = w < 768
  const mouse = useMouse()
  const rx = mobile ? w * 0.36 : Math.min(w * 0.36, 560)
  const ry = mobile ? h * 0.3 : Math.min(h * 0.33, 300)
  const positions = ecommerceNodes.map((_, i) => {
    const a = -Math.PI / 2 + (i / ecommerceNodes.length) * Math.PI * 2
    return { x: Math.cos(a) * rx, y: Math.sin(a) * ry }
  })
  const winW = mobile ? w * 0.86 : Math.min(880, w * 0.62)
  const finalScale = Math.min(0.48, (rx * 0.95) / winW)

  const title = useStage(p, [-1, 0, T.titleOut[0], T.titleOut[1]], { y: 60, blur: 18, scaleTo: 0.9 })
  const winOpacity = useTransform(p, [T.windowIn[0], T.windowIn[0] + 0.06], [0, 1])
  const winY = useTransform(p, T.windowIn, [120, 0])
  const winRotate = useTransform(p, T.windowIn, [22, 0])
  const winScale = useTransform(p, [T.windowIn[0], T.windowIn[1], T.shrink[0], T.shrink[1]], [0.88, 1, 1, finalScale])
  const coreGlow = useTransform(p, [T.shrink[1] - 0.04, T.shrink[1] + 0.04], [0, 1])
  const text = useStage(p, T.text, { y: 30, blur: 14 })
  const groupScale = useTransform(p, T.text, [1, mobile ? 0.9 : 0.86])
  const groupY = useTransform(p, T.text, [0, -h * 0.06])
  const tiltX = useTransform(mouse.y, (v) => v * -3)
  const tiltY = useTransform(mouse.x, (v) => v * 4)

  return (
    <div className="relative h-full w-full bg-ink">
      <div className="hairline-grid pointer-events-none absolute inset-0 opacity-60" />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ opacity: coreGlow, background: 'radial-gradient(circle, rgba(246,201,69,0.16), rgba(82,119,255,0.08) 40%, transparent 70%)' }}
      />

      {/* Título */}
      <motion.div style={title} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span className="eyebrow mb-6 text-gold/80">02 — Más que una tienda</span>
        <h2 className="display text-[14vw] text-white md:text-[9vw]">
          No es solo
          <br />
          <span className="text-white/35">un e-commerce.</span>
        </h2>
      </motion.div>

      <motion.div className="absolute inset-0" style={{ scale: groupScale, y: groupY }}>
      {/* Conexiones */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}>
        {positions.map((pos, i) => (
          <Connection key={i} i={i} p={p} pos={pos} color={toneOf(ecommerceNodes[i].tone)[0]} />
        ))}
      </svg>

      {/* Ventana de la tienda */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: winW, perspective: 1400 }}>
        <motion.div style={{ opacity: winOpacity, y: winY, rotateX: winRotate, scale: winScale }}>
          <motion.div style={{ rotateX: tiltX, rotateY: tiltY }} className="relative">
            <StoreWindow />
            <PartChip p={p} at={T.parts[0]} label="Productos" icon={LayoutGrid} className="-left-4 top-1/3 md:-left-10" />
            <PartChip p={p} at={T.parts[1]} label="Carrito" icon={ShoppingCart} className="-right-3 top-10 md:-right-10" />
            <PartChip p={p} at={T.parts[2]} label="Checkout" icon={CreditCard} className="-bottom-4 right-10 md:right-24" />
          </motion.div>
        </motion.div>
      </div>

      {/* Nodos */}
      {ecommerceNodes.map((node, i) => (
        <Node key={node.label} node={node} i={i} p={p} pos={positions[i]} />
      ))}
      </motion.div>

      {/* Frase */}
      <motion.div style={text} className="pointer-events-none absolute inset-x-0 bottom-[7vh] flex flex-col items-center px-6 text-center md:bottom-[6vh]">
        <p className="display text-[8vw] text-white md:text-[3.4vw]">
          Una plataforma. <span className="text-white/40">Todo el negocio conectado.</span>
        </p>
      </motion.div>
      <span className="sr-only">{brand.name}</span>
    </div>
  )
}

export default function NotEcommerce() {
  return (
    <StickyScene id="02" height="480vh" label="No es una tienda online">
      {(p) => <Stage p={p} />}
    </StickyScene>
  )
}

