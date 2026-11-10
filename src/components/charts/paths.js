// Curva suave (Catmull-Rom → Bézier) a partir de puntos [x, y].
export function smoothPath(pts, tension = 0.5) {
  if (pts.length < 2) return ''
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`
  }
  return d
}

export function toPoints(values, w, h, pad = { t: 10, r: 10, b: 10, l: 10 }, min, max) {
  const lo = min ?? Math.min(...values)
  const hi = max ?? Math.max(...values)
  const span = hi - lo || 1
  return values.map((v, i) => [
    pad.l + (i / (values.length - 1)) * (w - pad.l - pad.r),
    pad.t + (1 - (v - lo) / span) * (h - pad.t - pad.b),
  ])
}
