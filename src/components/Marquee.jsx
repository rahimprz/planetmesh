import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, reduceMotion } from '../scroll'

const Star = ({ c }) => <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill={c} /></svg>
const Item = ({ c }) => <span className="marquee-item">It lives in the organic, <em>felt rhythms</em> of our home <Star c={c} /></span>

export default function Marquee() {
  const ref = useRef(null)
  useGSAP(() => {
    if (reduceMotion) return
    const loop = gsap.to('.marquee-track', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
    let dir = 1
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (s) => {
        dir = s.direction
        const boost = 1 + Math.min(Math.abs(s.getVelocity()) / 300, 6)
        gsap.to(loop, { timeScale: dir * boost, duration: .25, overwrite: true,
          onComplete: () => gsap.to(loop, { timeScale: dir, duration: 1.2 }) })
      },
    })
  }, { scope: ref })
  return (
    <div className="marquee" ref={ref} role="img" aria-label="It lives in the organic, felt rhythms of our home.">
      <div className="marquee-track" aria-hidden="true">
        <Item c="#f6c177" /><Item c="#9cc5a1" /><Item c="#f6c177" /><Item c="#9cc5a1" />
      </div>
    </div>
  )
}
