import { useEffect, useRef } from 'react'
import { reduceMotion } from '../scroll'

// A living network: drifting nodes, links between neighbours, and "messages"
// that travel node to node. Colour warms from moss to dawn as you scroll.
export default function MeshCanvas({ dawn }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d')
    let W, H, DPR, nodes = [], pulses = [], raf
    const mouse = { x: -1e4, y: -1e4 }
    const size = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR
      const n = Math.round(Math.min(110, Math.max(36, (innerWidth * innerHeight) / 15000)))
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18 * DPR, vy: (Math.random() - 0.5) * 0.18 * DPR,
        r: (Math.random() * 1.6 + 0.6) * DPR, ph: Math.random() * 6.28,
      }))
      pulses = []
    }
    const move = (e) => { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR }
    size()
    addEventListener('resize', size); addEventListener('pointermove', move)
    const A = [156, 197, 161], B = [246, 193, 119]
    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      const t = now / 1000, p = dawn.current, L = 150 * DPR, L2 = L * L
      const c = A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(',')
      ctx.clearRect(0, 0, W, H)
      for (const n of nodes) {
        if (!reduceMotion) { n.x += n.vx; n.y += n.vy }
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
        const dx = mouse.x - n.x, dy = mouse.y - n.y
        if (dx * dx + dy * dy < (180 * DPR) ** 2) { n.x += dx * 0.004; n.y += dy * 0.004 }
      }
      ctx.lineWidth = DPR
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2
        if (d < L2) {
          ctx.strokeStyle = `rgba(${c},${(1 - d / L2) * 0.2})`
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          if (!reduceMotion && Math.random() < 0.0003) pulses.push({ a, b, k: 0 })
        }
      }
      for (const n of nodes) {
        const g = 0.55 + 0.45 * Math.sin(t * 1.4 + n.ph)
        ctx.fillStyle = `rgba(${c},${0.3 + 0.5 * g})`
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (0.8 + 0.4 * g), 0, 6.283); ctx.fill()
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const P = pulses[k]; P.k += 0.012
        if (P.k >= 1) { pulses.splice(k, 1); continue }
        const x = P.a.x + (P.b.x - P.a.x) * P.k, y = P.a.y + (P.b.y - P.a.y) * P.k
        const gr = ctx.createRadialGradient(x, y, 0, x, y, 9 * DPR)
        gr.addColorStop(0, 'rgba(246,193,119,.95)'); gr.addColorStop(1, 'rgba(246,193,119,0)')
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, 9 * DPR, 0, 6.283); ctx.fill()
      }
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('pointermove', move) }
  }, [dawn])
  return <canvas ref={ref} className="mesh-canvas" aria-hidden="true" />
}
