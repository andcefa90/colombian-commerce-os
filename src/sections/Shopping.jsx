import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Search, Heart, ShoppingBag, Truck, Store, Sparkles, RefreshCw, Plus, Check, MousePointer2, ArrowRight } from 'lucide-react'
import { ToneIcon, toneOf } from '../components/ToneIcon'
import { BrandMark } from '../components/Logo'
import { useCountUp } from '../animations/hooks'
import { ease, fadeUp } from '../animations/variants'
import { bundles, categories, featuredProducts, brand } from '../data/content'
import { formatNumber } from '../lib/format'

const SEARCH_TEXT = 'arepas de maíz, pandebono, café…'

function TypingSearch({ play }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!play) return
    const id = setInterval(() => setN((v) => (v >= SEARCH_TEXT.length ? v : v + 1)), 55)
    return () => clearInterval(id)
  }, [play])
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full bg-black/[0.04] px-4 py-2.5 ring-1 ring-black/[0.04] transition hover:ring-black/10">
      <Search size={15} className="shrink-0 text-black/40" />
      <span className="truncate text-[13px] text-black/45">
        Buscar entre 1.500+ productos · <span className="text-black/75">{SEARCH_TEXT.slice(0, n)}</span>
        <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-black/60" />
      </span>
    </div>
  )
}

function FulfillmentToggle({ mode, setMode }) {
  return (
    <div className="relative flex shrink-0 rounded-full bg-black/[0.05] p-1 text-[12px] font-medium">
      {[
        ['delivery', 'Delivery', Truck],
        ['pickup', 'Pickup', Store],
      ].map(([key, label, Icon]) => (
        <button key={key} onClick={() => setMode(key)} className="relative flex items-center gap-1.5 rounded-full px-3 py-1.5">
          {mode === key && <motion.span layoutId="fulfil" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          <Icon size={13} className={`relative ${mode === key ? 'text-ink' : 'text-black/45'}`} />
          <span className={`relative ${mode === key ? 'text-ink' : 'text-black/45'}`}>{label}</span>
        </button>
      ))}
    </div>
  )
}

function BundleCard({ b, selected, onSelect, innerRef }) {
  const [a, d] = toneOf(b.tone)
  return (
    <motion.button
      ref={innerRef}
      onClick={() => onSelect(b)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      animate={{ scale: selected ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`group relative flex w-[150px] shrink-0 flex-col items-start overflow-hidden rounded-2xl p-3.5 text-left transition-shadow md:w-auto ${
        selected ? 'shadow-[0_20px_40px_-18px_rgba(0,0,0,0.45)] ring-2 ring-ink' : 'ring-1 ring-black/[0.06] hover:shadow-[0_16px_30px_-18px_rgba(0,0,0,0.3)]'
      }`}
      style={{ background: `linear-gradient(160deg, ${a}30, ${a}0d 60%, #fff)` }}
    >
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-40 blur-2xl" style={{ background: a }} />
      <ToneIcon icon={b.icon} tone={b.tone} size={38} radius={12} />
      <span className="mt-6 text-[13px] font-semibold leading-tight text-ink">{b.title}</span>
      <span className="mt-0.5 text-[11px] text-black/45">{b.caption}</span>
      <span className="mt-3 flex items-center gap-1 text-[11px] font-medium" style={{ color: d }}>
        {selected ? <Check size={12} /> : <Plus size={12} />} {selected ? 'En tu carrito' : 'Armar carrito'}
      </span>
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white"
          >
            <Check size={11} strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function ProductCard({ p }) {
  const [fav, setFav] = useState(p.name === 'Café de origen')
  const [a] = toneOf(p.tone)
  return (
    <motion.div whileHover={{ y: -4 }} className="group relative rounded-2xl bg-white p-3 ring-1 ring-black/[0.06] transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]">
      <div className="relative mb-3 flex h-24 items-center justify-center overflow-hidden rounded-xl md:h-28" style={{ background: `radial-gradient(90% 90% at 50% 40%, ${a}40, ${a}10)` }}>
        <motion.div whileHover={{ scale: 1.08, rotate: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
          <ToneIcon icon={p.icon} tone={p.tone} size={52} radius={16} />
        </motion.div>
        {p.tag && <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-white">{p.tag}</span>}
        <button onClick={() => setFav((f) => !f)} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur" aria-label="Favorito">
          <motion.span key={String(fav)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
            <Heart size={14} className={fav ? 'fill-ember text-ember' : 'text-black/40'} />
          </motion.span>
        </button>
      </div>
      <div className="text-[13px] font-semibold text-ink">{p.name}</div>
      <div className="text-[11px] text-black/45">{p.meta}</div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold tabular-nums text-ink">
          ${p.price.toFixed(2)} {p.was && <span className="ml-1 text-[11px] font-normal text-black/35 line-through">${p.was.toFixed(2)}</span>}
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white transition group-hover:scale-110">
          <Plus size={14} />
        </span>
      </div>
    </motion.div>
  )
}

function CartPanel({ items, bundle, mode, cartRef }) {
  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const animated = useCountUp(subtotal, { duration: 0.9 })
  return (
    <div className="flex flex-col bg-[#f7f6f2] p-5 md:p-6 lg:border-l lg:border-black/[0.06]">
      <div className="flex items-center justify-between">
        <div ref={cartRef} className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
            <ShoppingBag size={16} />
            <motion.span
              key={count}
              initial={{ scale: 1.6 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 14 }}
              className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink"
            >
              {count}
            </motion.span>
          </span>
          <span className="text-[15px] font-semibold text-ink">Tu carrito</span>
        </div>
        <span className="text-[11px] text-black/40">{count} artículos</span>
      </div>

      <AnimatePresence mode="wait">
        {bundle && (
          <motion.div
            key={bundle.id}
            initial={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: 0.25 + bundle.items.length * 0.26, duration: 0.6, ease } }}
            exit={{ opacity: 0 }}
            className="relative mt-4 overflow-hidden rounded-xl bg-ink px-3.5 py-3 text-white"
          >
            <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent" style={{ animation: 'shimmer 2.6s ease-in-out infinite' }} />
            <div className="relative flex items-center gap-2 text-[12px] font-semibold">
              <Sparkles size={14} className="text-gold" /> Carrito creado automáticamente
            </div>
            <div className="relative mt-0.5 text-[11px] text-white/55">{bundle.title} · {bundle.items.length} productos</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex min-h-[230px] flex-1 flex-col gap-2">
        <AnimatePresence initial={false}>
          {items.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-black/10 p-6 text-center">
              <ShoppingBag size={22} className="text-black/25" />
              <p className="mt-3 max-w-[200px] text-[12px] leading-relaxed text-black/45">Elige una experiencia y armamos el carrito por ti.</p>
            </motion.div>
          )}
          {items.map((it) => (
            <motion.div
              layout
              key={it.key}
              initial={{ opacity: 0, x: 40, scale: 0.92, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="flex items-center gap-3 rounded-xl bg-white p-2.5 ring-1 ring-black/[0.04]"
            >
              <ToneIcon icon={it.icon} tone={it.tone} size={34} radius={10} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-medium text-ink">{it.name}</div>
                <div className="text-[11px] text-black/40">Cant. {it.qty}</div>
              </div>
              <span className="text-[12.5px] font-semibold tabular-nums text-ink">${(it.price * it.qty).toFixed(2)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-5 rounded-xl bg-white p-3 text-[12px] ring-1 ring-black/[0.04]">
        <div className="flex items-center gap-2 text-black/60">
          {mode === 'delivery' ? <Truck size={14} /> : <Store size={14} />}
          <AnimatePresence mode="wait">
            <motion.span key={mode} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
              {mode === 'delivery' ? 'Entrega hoy · 4–6 p. m. · Los Ángeles' : 'Pickup en tienda · listo en 1 hora'}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <span className="text-[12px] text-black/45">Subtotal</span>
        <span className="font-display text-2xl font-bold tabular-nums tracking-tight text-ink">{formatNumber(animated, { decimals: 2, prefix: '$' })}</span>
      </div>
      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        className="group mt-4 flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[13px] font-semibold text-white disabled:opacity-40"
        disabled={!items.length}
      >
        Ir al checkout <ArrowRight size={15} className="transition group-hover:translate-x-1" />
      </motion.button>
    </div>
  )
}

function StoreMockup() {
  const frameRef = useRef(null)
  const cartRef = useRef(null)
  const bundleRefs = useRef({})
  const inView = useInView(frameRef, { once: true, amount: 0.35 })
  const [mode, setMode] = useState('delivery')
  const [bundle, setBundle] = useState(null)
  const [items, setItems] = useState([])
  const [flyers, setFlyers] = useState([])
  const [cursor, setCursor] = useState(null)
  const timers = useRef([])
  const userActed = useRef(false)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const rel = (el) => {
    const f = frameRef.current.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    return { x: r.left - f.left + r.width / 2, y: r.top - f.top + r.height / 2 }
  }

  const select = useCallback((b) => {
    clearTimers()
    setBundle(b)
    setItems([])
    const from = bundleRefs.current[b.id] ? rel(bundleRefs.current[b.id]) : null
    const to = cartRef.current ? rel(cartRef.current) : null
    b.items.forEach((it, i) => {
      timers.current.push(
        setTimeout(() => {
          if (from && to) {
            const id = `${b.id}-${i}-${Date.now()}`
            setFlyers((f) => [...f, { id, icon: it.icon, tone: it.tone, from, to }])
          }
          timers.current.push(setTimeout(() => setItems((cur) => [...cur, { ...it, key: `${b.id}-${i}` }]), 520))
        }, 250 + i * 260),
      )
    })
  }, [])

  const onUserSelect = (b) => {
    userActed.current = true
    setCursor(null)
    select(b)
  }

  // Demo automática: un cursor elige "Desayuno colombiano"
  useEffect(() => {
    if (!inView) return
    const target = bundleRefs.current.desayuno
    if (!target || !frameRef.current) return
    const f = frameRef.current.getBoundingClientRect()
    const t1 = setTimeout(() => {
      if (userActed.current) return
      setCursor({ x: f.width * 0.82, y: f.height * 0.95, click: false })
      setTimeout(() => {
        if (userActed.current) return
        const pos = rel(target)
        setCursor({ x: pos.x + 10, y: pos.y + 6, click: false })
      }, 120)
    }, 900)
    const t2 = setTimeout(() => {
      if (userActed.current) return
      setCursor((c) => c && { ...c, click: true })
      select(bundles[0])
    }, 2500)
    const t3 = setTimeout(() => !userActed.current && setCursor(null), 3600)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [inView, select])

  useEffect(() => clearTimers, [])

  return (
    <motion.div
      ref={frameRef}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="relative mx-auto max-w-[1220px] overflow-hidden rounded-[24px] bg-white text-ink shadow-[0_80px_160px_-60px_rgba(20,18,10,0.45)] ring-1 ring-black/[0.06] md:rounded-[30px]"
    >
      <div className="grid lg:grid-cols-[1fr_350px]">
        <div className="min-w-0 p-4 md:p-7">
          {/* Barra superior */}
          <div className="flex flex-wrap items-center gap-3 md:flex-nowrap md:gap-4">
            <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
              <BrandMark size={30} />
              <div className="leading-tight">
                <div className="text-[13px] font-bold tracking-tight">{brand.storeName}</div>
                <div className="text-[10px] text-black/40">Sabores de Colombia en LA</div>
              </div>
            </div>
            <div className="order-3 w-full md:order-none md:w-auto md:flex-1">
              <TypingSearch play={inView} />
            </div>
            <div className="ml-auto flex items-center gap-2 md:ml-0">
              <FulfillmentToggle mode={mode} setMode={setMode} />
              <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-black/[0.04] md:flex">
                <Heart size={15} className="text-black/55" />
              </span>
            </div>
          </div>

          {/* Categorías */}
          <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
            {categories.map((c, i) => (
              <button key={c} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${i === 0 ? 'bg-ink text-white' : 'bg-black/[0.04] text-black/60 hover:bg-black/[0.08]'}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Ofertas + recompra */}
          <div className="mt-5 grid gap-3 md:grid-cols-[1.6fr_1fr]">
            <div className="relative overflow-hidden rounded-2xl bg-ink p-5 text-white md:p-6">
              <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-gold/25 blur-3xl" />
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">Ofertas de la semana</span>
                  <div className="mt-3 font-display text-2xl font-bold leading-[1.05] tracking-tight md:text-[28px]">
                    −20% en café
                    <br />
                    <span className="text-white/50">de origen</span>
                  </div>
                </div>
                <ToneIcon icon={featuredProducts[0].icon} tone="cocoa" size={72} radius={22} />
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-[#f4f2ed] p-4 ring-1 ring-black/[0.04]">
              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <RefreshCw size={14} /> Volver a comprar
              </div>
              <p className="mt-1 text-[11.5px] text-black/45">Tu pedido de siempre · 6 productos</p>
              <button className="mt-3 self-start rounded-full bg-white px-3 py-1.5 text-[11.5px] font-semibold shadow-sm transition hover:shadow-md">Repetir pedido</button>
            </div>
          </div>

          {/* Compra como en Colombia */}
          <div className="mt-7">
            <div className="flex items-end justify-between">
              <h4 className="font-display text-[17px] font-bold tracking-tight md:text-xl">Compra como en Colombia 🇨🇴</h4>
              <span className="hidden text-[11px] text-black/40 md:block">Un toque y el carrito se arma solo</span>
            </div>
            <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2 pt-1 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
              {bundles.map((b) => (
                <BundleCard key={b.id} b={b} selected={bundle?.id === b.id} onSelect={onUserSelect} innerRef={(el) => (bundleRefs.current[b.id] = el)} />
              ))}
            </div>
          </div>

          {/* Recomendados */}
          <div className="mt-7 hidden md:block">
            <div className="flex items-end justify-between">
              <h4 className="font-display text-xl font-bold tracking-tight">Recomendado para ti</h4>
              <span className="text-[11px] text-black/40">Según tus compras anteriores</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {featuredProducts.map((p) => (
                <ProductCard key={p.name} p={p} />
              ))}
            </div>
          </div>
        </div>

        <CartPanel items={items} bundle={bundle} mode={mode} cartRef={cartRef} />
      </div>

      {/* Productos que vuelan al carrito */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {flyers.map((f) => (
          <motion.div
            key={f.id}
            className="absolute left-0 top-0"
            initial={{ x: f.from.x - 18, y: f.from.y - 18, scale: 0.6, opacity: 0 }}
            animate={{
              x: [f.from.x - 18, (f.from.x + f.to.x) / 2 - 18, f.to.x - 18],
              y: [f.from.y - 18, Math.min(f.from.y, f.to.y) - 90, f.to.y - 18],
              scale: [0.6, 1.15, 0.35],
              opacity: [0, 1, 0.2],
            }}
            transition={{ duration: 0.62, ease: [0.45, 0, 0.2, 1] }}
            onAnimationComplete={() => setFlyers((all) => all.filter((x) => x.id !== f.id))}
          >
            <ToneIcon icon={f.icon} tone={f.tone} size={36} radius={11} />
          </motion.div>
        ))}
      </div>

      {/* Cursor de demostración */}
      <AnimatePresence>
        {cursor && (
          <motion.div
            className="pointer-events-none absolute left-0 top-0 z-30"
            initial={{ opacity: 0, x: cursor.x, y: cursor.y }}
            animate={{ opacity: 1, x: cursor.x, y: cursor.y }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
          >
            <motion.div animate={{ scale: cursor.click ? [1, 0.82, 1] : 1 }} transition={{ duration: 0.3 }}>
              <MousePointer2 size={24} className="fill-ink text-white drop-shadow-lg" strokeWidth={1.4} />
            </motion.div>
            {cursor.click && (
              <motion.span
                className="absolute -left-4 -top-4 h-10 w-10 rounded-full border-2 border-ink/40"
                initial={{ scale: 0.3, opacity: 1 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.7 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Shopping() {
  return (
    <section data-scene="03" id="scene-03" aria-label="La experiencia de compra" className="relative z-10 -mt-[1px] rounded-t-[36px] bg-paper pb-24 pt-24 text-ink md:rounded-t-[64px] md:pb-36 md:pt-36">
      <div className="mx-auto max-w-[1300px] px-4 md:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }} className="mb-12 text-center md:mb-20">
          <span className="eyebrow text-black/40">03 — La experiencia de compra</span>
          <h2 className="display mt-5 text-[12vw] text-ink md:text-[6.8vw]">
            Comprar se siente
            <br />
            <span className="text-black/30">como en casa.</span>
          </h2>
        </motion.div>
        <StoreMockup />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.8 }}
          className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-black/45 md:mt-14"
        >
          {['Búsqueda inteligente', 'Favoritos', 'Recompra en un toque', 'Delivery y pickup', 'Recomendaciones'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <Check size={13} className="text-black/60" /> {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
