import { useMemo } from 'react'
import { motion, useTransform } from 'framer-motion'
import { StickyScene } from '../components/StickyScene'
import { ToneIcon } from '../components/ToneIcon'
import { MotionNumber } from '../components/Counter'
import { LogoLockup } from '../components/Logo'
import { useStage, useThreshold, useViewport } from '../animations/hooks'
import { useMouse } from '../animations/MouseProvider'
import { ease } from '../animations/variants'
import { growthWords, products } from '../data/content'
import { lerp, seeded } from '../lib/format'

// Línea de tiempo de la escena (progreso 0 → 1)
const T = {
  openOut: [0.03, 0.09],
  counterIn: [0.08, 0.11],
  grow: [0.1, 0.44],
  freeze: [0.46, 0.52],
  question: [0.52, 0.56, 0.62, 0.65],
  words: 0.66,
  wordsOut: [0.79, 0.82],
  organize: [0.8, 0.9],
  logo: [0.9, 0.95],
}

function buildTiles(n, w, h, mobile) {
  const rand = seeded(1500)
  const cols = Math.ceil(Math.sqrt((n * w) / h) * 1.15)
  const rows = Math.ceil((n * 1.6) / cols)
  const cw = w / cols
  const ch = h / rows
  const cells = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) * cw - w / 2 + (rand() - 0.5) * cw * 0.8
      const y = (r + 0.5) * ch - h / 2 + (rand() - 0.5) * ch * 0.8
      // Zona central libre para el contador
      const inCenter = (x / (w * 0.2)) ** 2 + (y / (h * 0.17)) ** 2 < 1
      if (!inCenter) cells.push({ x, y, d: Math.hypot(x / w, y / h) + rand() * 0.12 })
    }
  }
  cells.sort((a, b) => a.d - b.d)
  const picked = cells.slice(0, n)

  // Cuadrícula final organizada (catálogo)
  const gCols = mobile ? 8 : 12
  const size = mobile ? 30 : 38
  const gap = mobile ? 8 : 12
  const gRows = Math.ceil(n / gCols)
  const gw = gCols * size + (gCols - 1) * gap
  const gh = gRows * size + (gRows - 1) * gap

  return picked.map((cell, i) => {
    const product = products[i % products.length]
    const depth = 0.7 + rand() * 0.6
    const gc = i % gCols
    const gr = Math.floor(i / gCols)
    const orgStart = T.organize[0] + rand() * 0.035
    return {
      key: i,
      product,
      depth,
      sx: cell.x,
      sy: cell.y,
      gx: -gw / 2 + gc * (size + gap) + size / 2,
      gy: -gh / 2 + gr * (size + gap) + size / 2,
      appear: T.grow[0] + (T.grow[1] - T.grow[0]) * Math.pow(i / n, 0.85),
      org: [orgStart, orgStart + 0.055],
      showLabel: !mobile && i % 7 === 3,
      floatDur: 5 + rand() * 4,
      floatDelay: -rand() * 6,
      size,
    }
  })
}

function Tile({ t, p }) {
  const opacity = useTransform(p, [t.appear, t.appear + 0.025], [0, 1])
  const appearScale = useTransform(p, [t.appear, t.appear + 0.03], [0.3, 1])
  const org = useTransform(p, t.org, [0, 1])
  const x = useTransform(org, (v) => lerp(t.sx, t.gx, v))
  const y = useTransform(org, (v) => lerp(t.sy, t.gy, v))
  const scale = useTransform([appearScale, org], ([a, o]) => a * lerp(t.depth, 1, o))
  const labelOpacity = useTransform(p, [t.appear + 0.02, t.appear + 0.04, T.organize[0], T.organize[0] + 0.02], [0, 1, 1, 0])
  return (
    <motion.div className="absolute left-1/2 top-1/2" style={{ x, y, opacity, scale }}>
      <div
        className="tile-float -translate-x-1/2 -translate-y-1/2"
        style={{ animationDuration: `${t.floatDur}s`, animationDelay: `${t.floatDelay}s` }}
      >
        <ToneIcon icon={t.product.icon} tone={t.product.tone} size={t.size} radius={t.size * 0.3} />
        {t.showLabel && (
          <motion.span
            style={{ opacity: labelOpacity }}
            className="absolute left-full top-1/2 ml-2.5 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/70 ring-1 ring-white/10 backdrop-blur-md"
          >
            {t.product.name}
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}

function IntroStage({ p }) {
  const { w, h } = useViewport()
  const mobile = w < 768
  const n = mobile ? 56 : 120
  const tiles = useMemo(() => buildTiles(n, w, h, mobile), [n, w, h, mobile])
  const mouse = useMouse()

  // Apertura
  const open = useStage(p, [-1, 0, T.openOut[0], T.openOut[1]], { y: 40, blur: 16, scaleTo: 0.92 })

  // Contador 1 → 1.500
  const counterStage = useStage(p, [T.counterIn[0], T.counterIn[1], T.freeze[0], T.freeze[1]], { y: 20, blur: 10 })
  const growQ = useTransform(p, T.grow, [0, 1])
  const count = useTransform(growQ, (q) => Math.round(Math.pow(1500, q)))
  const done = useThreshold(p, T.grow[1])

  // Capa de productos
  const layerOpacity = useTransform(p, [T.freeze[0], T.freeze[1], T.organize[0], T.organize[0] + 0.04, T.logo[0], T.logo[1]], [1, 0.18, 0.18, 1, 1, 0.22])
  const layerBlur = useTransform(p, [T.freeze[0], T.freeze[1], T.organize[0], T.organize[0] + 0.05], [0, 7, 7, 0])
  const layerFilter = useTransform(layerBlur, (v) => (v < 0.05 ? 'none' : `blur(${v}px)`))
  const layerScale = useTransform(p, [T.organize[1], 1], [1, 1.08])
  const mx = useTransform(mouse.x, (v) => v * -14)
  const my = useTransform(mouse.y, (v) => v * -10)
  const organized = useThreshold(p, T.organize[0])

  // Pregunta
  const q1 = useStage(p, [T.question[0], T.question[1] - 0.01, T.question[2], T.question[3]], { y: 36, blur: 14 })
  const q2 = useStage(p, [T.question[0] + 0.015, T.question[1], T.question[2], T.question[3]], { y: 36, blur: 14 })

  // Logo
  const logo = useStage(p, T.logo, { y: 20, blur: 20, scaleFrom: 0.94 })
  const glow = useTransform(p, [T.grow[0], T.grow[1], T.freeze[1], T.logo[0], T.logo[1]], [0, 0.9, 0.35, 0.4, 1])

  return (
    <div className="relative h-full w-full bg-ink">
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: glow, background: 'radial-gradient(60% 50% at 50% 55%, rgba(246,201,69,0.10), rgba(82,119,255,0.05) 45%, transparent 75%)' }}
      />
      <div className="hairline-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Productos */}
      <motion.div className={`absolute inset-0 ${organized ? 'is-organized' : ''}`} style={{ opacity: layerOpacity, filter: layerFilter, scale: layerScale, x: mx, y: my }}>
        {tiles.map((t) => (
          <Tile key={t.key} t={t} p={p} />
        ))}
      </motion.div>

      {/* Apertura: 1.500+ productos */}
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={open}>
        <motion.h1
          className="display text-silver text-[30vw] md:text-[19vw]"
          initial={{ opacity: 0, filter: 'blur(24px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 2.4, ease, delay: 0.5 }}
        >
          1.500<span className="text-gold">+</span>
        </motion.h1>
        <motion.p
          className="font-display text-2xl font-medium tracking-tight text-white/55 md:text-4xl"
          initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.6, ease, delay: 2.1 }}
        >
          productos.
        </motion.p>
      </motion.div>

      {/* Contador */}
      <motion.div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={counterStage}>
        <div className="absolute h-[40vh] w-[70vw] max-w-[640px] rounded-full bg-ink/80 blur-3xl" />
        <div className="relative flex flex-col items-center">
          <div className="display text-[22vw] text-white md:text-[12vw]">
            <MotionNumber value={count} />
            <motion.span className="text-gold" animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 0.5 }}>
              +
            </motion.span>
          </div>
          <span className="eyebrow mt-3 text-white/40">productos en catálogo</span>
        </div>
      </motion.div>

      {/* ¿Qué pasa cuando un negocio crece? */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.h2 style={q1} className="display text-[11vw] text-white md:text-[6.6vw]">
          ¿Qué pasa cuando
        </motion.h2>
        <motion.h2 style={q2} className="display text-[11vw] md:text-[6.6vw]">
          <span className="text-tri">un negocio crece?</span>
        </motion.h2>
      </div>

      {/* Más productos. Más clientes... */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <div className="flex flex-col items-start gap-1 md:gap-2">
          {growthWords.map((word, i) => (
            <GrowthWord key={word} word={word} i={i} p={p} last={i === growthWords.length - 1} />
          ))}
        </div>
      </div>

      {/* Marca */}
      <motion.div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6" style={logo}>
        <div className="absolute h-[60vh] w-[90vw] max-w-[1000px] rounded-full bg-ink/85 blur-3xl" />
        <LogoLockup className="relative" />
        <p className="relative mt-8 max-w-md text-center text-[15px] leading-relaxed text-white/50 md:text-base">
          El ecosistema digital para convertir un negocio colombiano en una operación inteligente.
        </p>
      </motion.div>
    </div>
  )
}

function GrowthWord({ word, i, p, last }) {
  const step = 0.032
  const s = T.words + i * step
  const opacity = useTransform(
    p,
    last ? [s, s + 0.02, T.wordsOut[0], T.wordsOut[1]] : [s, s + 0.02, s + step, s + step + 0.02, T.wordsOut[0], T.wordsOut[1]],
    last ? [0, 1, 1, 0] : [0, 1, 1, 0.28, 0.28, 0],
  )
  const x = useTransform(p, [s, s + 0.025], [-30, 0])
  const blur = useTransform(p, [s, s + 0.025], [12, 0])
  const filter = useTransform(blur, (v) => (v < 0.05 ? 'none' : `blur(${v}px)`))
  const [head, ...rest] = word.split(' ')
  return (
    <motion.p style={{ opacity, x, filter }} className="display text-[12vw] md:text-[6.4vw]">
      <span className="text-white/45">{head} </span>
      <span className="text-white">{rest.join(' ')}</span>
    </motion.p>
  )
}

export default function Intro() {
  return (
    <StickyScene id="01" height="680vh" label="El comienzo">
      {(p) => <IntroStage p={p} />}
    </StickyScene>
  )
}
