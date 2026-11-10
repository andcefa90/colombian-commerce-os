import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { StickyScene } from '../components/StickyScene'
import { LogoLockup } from '../components/Logo'
import { useStage } from '../animations/hooks'
import { brand } from '../data/content'

function MagneticButton({ href, children }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white py-4 pl-7 pr-5 text-[14px] font-semibold tracking-wide text-ink shadow-[0_20px_60px_-15px_rgba(246,201,69,0.5)]"
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">{children}</span>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:translate-x-1">
        <ArrowRight size={15} />
      </span>
    </motion.a>
  )
}

function Stage({ p }) {
  const a = useStage(p, [0.04, 0.14, 0.28, 0.36], { y: 30, blur: 18 })
  const b = useStage(p, [0.38, 0.48, 0.62, 0.7], { y: 30, blur: 18 })
  const c = useStage(p, [0.72, 0.84], { y: 30, blur: 22, scaleFrom: 0.95 })
  const cta = useStage(p, [0.84, 0.92], { y: 16, blur: 8 })
  return (
    <div className="relative h-full w-full bg-[#040405]">
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <motion.h2 style={a} className="display text-[14vw] text-white md:text-[8.5vw]">
          Más que una
          <br />
          <span className="text-white/35">tienda online.</span>
        </motion.h2>
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <motion.h2 style={b} className="display text-[11vw] text-white md:text-[6.4vw]">
          El ecosistema digital
          <br />
          para hacer crecer
          <br />
          <span className="text-tri">el negocio.</span>
        </motion.h2>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <motion.div style={c}>
          <LogoLockup size="md" />
        </motion.div>
        <motion.div style={cta} className="mt-12 flex flex-col items-center gap-6">
          <MagneticButton href={brand.ctaHref}>COMENZAR PROYECTO</MagneticButton>
          <span className="text-[11px] text-white/30">Cifras de ventas, clientes e inventario mostradas como demostración.</span>
        </motion.div>
      </div>
    </div>
  )
}

export default function Finale() {
  return (
    <StickyScene id="08" height="360vh" label="Cierre">
      {(p) => <Stage p={p} />}
    </StickyScene>
  )
}
