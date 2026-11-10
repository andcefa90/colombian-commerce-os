import { motion } from 'framer-motion'

/** Marca: tres franjas en proporción 2:1:1, una referencia sutil a la bandera. */
export function BrandMark({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#0d0f13" stroke="rgba(255,255,255,0.1)" />
      <rect x="8" y="8.5" width="16" height="6" rx="3" fill="#f6c945" />
      <rect x="8" y="15.75" width="16" height="3.75" rx="1.875" fill="#5277ff" />
      <rect x="8" y="20.75" width="16" height="3" rx="1.5" fill="#f0524f" />
    </svg>
  )
}

export function Wordmark({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BrandMark size={26} />
      <span className="font-display text-[13px] font-semibold tracking-tight text-white/90">
        Colombian Commerce <span className="text-white/45">OS</span>
      </span>
    </div>
  )
}

/** Lockup grande para las escenas de marca. */
export function LogoLockup({ size = 'lg', className = '' }) {
  const big = size === 'lg'
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <BrandMark size={big ? 64 : 44} className="mb-6 drop-shadow-[0_0_40px_rgba(246,201,69,0.25)]" />
      <h2 className={`display text-silver ${big ? 'text-[13vw] md:text-[8.2vw]' : 'text-5xl md:text-7xl'}`}>
        Colombian
        <br />
        Commerce OS
      </h2>
      <motion.div
        className="mt-6 h-[3px] w-28 overflow-hidden rounded-full md:w-40"
        initial={false}
      >
        <div className="flex h-full">
          <span className="h-full w-1/2 bg-gold" />
          <span className="h-full w-1/4 bg-azure" />
          <span className="h-full w-1/4 bg-ember" />
        </div>
      </motion.div>
    </div>
  )
}
