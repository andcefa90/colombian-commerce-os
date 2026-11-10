// Formato numérico en español (miles con punto, decimales con coma).
export function formatNumber(value, { decimals = 0, prefix = '', suffix = '' } = {}) {
  const fixed = Math.abs(value).toFixed(decimals)
  const [int, dec] = fixed.split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const sign = value < 0 ? '−' : ''
  return `${sign}${prefix}${grouped}${dec ? ',' + dec : ''}${suffix}`
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a, b, t) => a + (b - a) * t

// Generador pseudoaleatorio determinista (posiciones estables entre renders)
export function seeded(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
