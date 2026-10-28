import { useRef } from 'react'
import { gsap, useGSAP } from '../scroll'

export default function Cursor() {
  const dot = useRef(null), ring = useRef(null)
  useGSAP(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const dx = gsap.quickTo(dot.current, 'x', { duration: .12 }), dy = gsap.quickTo(dot.current, 'y', { duration: .12 })
    const rx = gsap.quickTo(ring.current, 'x', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(ring.current, 'y', { duration: .5, ease: 'power3' })
    let shown = false
    const move = (e) => {
      if (!shown) { shown = true; gsap.to([dot.current, ring.current], { opacity: 1, duration: .4 }) }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
    }
    const over = (e) => {
      const hit = e.target.closest('a, button, input, textarea, .book')
      gsap.to(ring.current, { scale: hit ? 1.8 : 1, backgroundColor: hit ? 'rgba(246,193,119,.12)' : 'rgba(0,0,0,0)', duration: .4 })
    }
    addEventListener('pointermove', move); addEventListener('pointerover', over)
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerover', over) }
  })
  return <><div className="cursor-dot" ref={dot} /><div className="cursor-ring" ref={ring} /></>
}
