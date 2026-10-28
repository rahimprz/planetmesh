import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../scroll'

export default function Loader({ onDone }) {
  const ref = useRef(null)
  const [gone, setGone] = useState(false)
  useGSAP(() => {
    const n = { v: 0 }, out = ref.current.querySelector('.loader-count')
    gsap.timeline({ onComplete: () => { setGone(true) } })
      .from('.loader-inner', { yPercent: 40, opacity: 0, duration: .8, ease: 'expo.out' })
      .to(n, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => { out.textContent = String(Math.round(n.v)).padStart(3, '0') } }, '<')
      .to('.loader-line', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, '<')
      .to('.loader-inner', { yPercent: -60, opacity: 0, duration: .6, ease: 'power3.in' })
      .add(() => onDone(), '-=.1')
      .to(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=.15')
  }, { scope: ref })
  if (gone) return null
  return (
    <div className="loader" ref={ref} style={{ clipPath: 'inset(0 0 0% 0)' }} aria-hidden="true">
      <div className="loader-inner">
        <div className="loader-count">000</div>
        <div className="loader-label">Connecting nodes</div>
      </div>
      <div className="loader-line" />
    </div>
  )
}
