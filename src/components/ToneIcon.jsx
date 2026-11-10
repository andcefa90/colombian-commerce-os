import { tones } from '../data/content'

export const toneOf = (t) => tones[t] ?? tones.gold

/** Ícono sobre un fondo de color con gradiente y brillo interno. */
export function ToneIcon({ icon: Icon, tone = 'gold', size = 40, radius = 12, iconScale = 0.46, light = false, className = '' }) {
  const [a, b] = toneOf(tone)
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: light
          ? `linear-gradient(145deg, ${a}33, ${a}14)`
          : `radial-gradient(120% 120% at 25% 15%, ${a}, ${b})`,
        boxShadow: light
          ? `inset 0 0 0 1px ${a}40`
          : `inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px -8px ${b}`,
      }}
    >
      <Icon size={size * iconScale} strokeWidth={1.8} color={light ? b : 'rgba(10,10,12,0.82)'} />
    </span>
  )
}
