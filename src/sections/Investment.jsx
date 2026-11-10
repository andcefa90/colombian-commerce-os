import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import { ease } from '../animations/variants'
import { brand, included } from '../data/content'
import { formatNumber } from '../lib/format'

export default function Investment() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <section data-scene="08" id="scene-08" aria-label="La inversión" className="relative flex min-h-[140vh] items-center justify-center overflow-hidden bg-ink px-6 py-40">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[38%] h-[70vh] w-[90vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(246,201,69,0.13), rgba(82,119,255,0.05) 60%, transparent)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.8 }}
        transition={{ duration: 3, ease, delay: 1 }}
      />
      <div ref={ref} className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.span
          className="eyebrow text-white/45"
          initial={{ opacity: 0, letterSpacing: '0.4em' }}
          animate={{ opacity: inView ? 1 : 0, letterSpacing: inView ? '0.22em' : '0.4em' }}
          transition={{ duration: 1.8, ease }}
        >
          Una nueva infraestructura digital para el negocio
        </motion.span>

        <motion.div
          className="relative mt-12 md:mt-16"
          initial={{ opacity: 0, filter: 'blur(30px)', scale: 0.92 }}
          animate={inView ? { opacity: 1, filter: 'blur(0px)', scale: 1 } : {}}
          transition={{ duration: 2.4, ease, delay: 0.9 }}
        >
          <div className="display flex items-start justify-center text-silver text-[24vw] md:text-[13.5vw]">
            <span className="mr-1 mt-[0.12em] text-[0.38em] text-white/50">$</span>
            {formatNumber(brand.price)}
          </div>
          <div className="mt-2 font-display text-lg font-semibold tracking-[0.3em] text-gold md:text-2xl">{brand.currency}</div>
          {/* Destello */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-overlay"
              initial={{ x: '-120%' }}
              animate={inView ? { x: '320%' } : {}}
              transition={{ duration: 1.8, ease, delay: 2.6 }}
            />
          </div>
        </motion.div>

        <motion.p
          className="mt-8 text-[15px] text-white/60 md:text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease, delay: 2.2 }}
        >
          Plataforma E-commerce + Gestión + Analítica
        </motion.p>

        <motion.div
          className="mt-14 h-px w-full max-w-xl bg-gradient-to-r from-transparent via-white/15 to-transparent"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.6, ease, delay: 2.6 }}
        />

        <ul className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-x-12 gap-y-3.5 text-left sm:grid-cols-2">
          {included.map((item, i) => (
            <motion.li
              key={item}
              className="flex items-center gap-3 text-[15px] text-white/80"
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.9, ease, delay: 2.9 + i * 0.08 }}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Check size={12} strokeWidth={3} />
              </span>
              {item}
            </motion.li>
          ))}
        </ul>

        <motion.p
          className="display mt-20 text-[8vw] text-white md:text-[3.2vw]"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.4, ease, delay: 3.9 }}
        >
          Construido para crecer <span className="text-white/40">con el negocio.</span>
        </motion.p>
      </div>
    </section>
  )
}
