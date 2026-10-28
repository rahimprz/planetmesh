import { useRef } from 'react'
import { gsap, useGSAP, reduceMotion } from '../scroll'

const rings = [['min(56vw,560px)', '#f6c177'], ['min(80vw,840px)', '#9cc5a1'], ['min(104vw,1120px)', '#e8807a']]

export default function MetaMesh() {
  const ref = useRef(null)
  useGSAP(() => {
    if (reduceMotion) return
    gsap.utils.toArray('.mm-ring').forEach((r, i) => gsap.to(r, { rotate: i % 2 ? -360 : 360, duration: 30 + i * 14, repeat: -1, ease: 'none' }))
    gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=130%', scrub: 1, pin: true } })
      .from('.mm-ring', { scale: .2, opacity: 0, stagger: .08, duration: .5 }, 0)
      .from('.mm-kicker', { y: 40, opacity: 0, duration: .3 }, .1)
      .from('.mm-word', { scale: .55, opacity: 0, letterSpacing: '0.25em', duration: .5 }, .2)
      .to('.mm-word', { backgroundPosition: '-160% 0', duration: .7, ease: 'none' }, .45)
      .from('.mm-desc', { y: 30, opacity: 0, duration: .3 }, .55)
      .to('.mm-orbits', { scale: 1.3, duration: 1, ease: 'none' }, 0)
  }, { scope: ref })
  return (
    <section className="mm" ref={ref}>
      <div className="mm-orbits" aria-hidden="true">
        {rings.map(([s, c]) => <div className="mm-ring" key={c} style={{ width: s, height: s }}><i style={{ background: c, boxShadow: `0 0 16px ${c}` }} /></div>)}
      </div>
      <div className="mm-inner">
        <p className="mm-kicker">The true protagonist is not a single human hero.</p>
        <div className="mm-word">MetaMesh</div>
        <p className="mm-desc">It is the network itself — an evolving, emergent composition.</p>
      </div>
    </section>
  )
}
