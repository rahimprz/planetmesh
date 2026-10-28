import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../scroll'

// A single horizon line draws across, the title breathes in, then the curtain lifts.
export default function Loader({ onDone }) {
  const ref = useRef(null)
  const [gone, setGone] = useState(false)
  useGSAP(() => {
    gsap.timeline({ onComplete: () => setGone(true) })
      .from('.loader-line', { scaleX: 0, duration: 1.3, ease: 'expo.inOut' })
      .from('.loader-word span', { yPercent: 110, duration: 1, stagger: .06, ease: 'expo.out' }, '-=.5')
      .to('.loader-word span', { yPercent: -110, duration: .6, stagger: .03, ease: 'power3.in' }, '+=.35')
      .to('.loader-line', { scaleX: 0, transformOrigin: 'right', duration: .7, ease: 'expo.in' }, '<')
      .add(() => onDone(), '-=.05')
      .to(ref.current, { opacity: 0, duration: 1, ease: 'power2.out' })
  }, { scope: ref })
  if (gone) return null
  return (
    <div className="loader" ref={ref} aria-hidden="true">
      <div className="loader-word">{['Dawn’s', 'Early', 'Message'].map((w) => <span className="mask" key={w}><span>{w}</span></span>)}</div>
      <div className="loader-line" />
    </div>
  )
}
