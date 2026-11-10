export function DemoBadge({ light = false, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide ${
        light ? 'bg-black/[0.05] text-black/50' : 'bg-white/[0.06] text-white/45 ring-1 ring-white/[0.06]'
      } ${className}`}
    >
      <span className={`h-1 w-1 rounded-full ${light ? 'bg-black/30' : 'bg-white/40'}`} />
      Datos ficticios · demo
    </span>
  )
}
