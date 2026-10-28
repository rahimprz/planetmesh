import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, scrollToId } from '../scroll'
import { LINKS } from '../content'

const items = [['story', 'The Story', 'opt'], ['library', 'Reading', 'opt'], ['contact', 'Contact', '']]

export default function Nav({ ready }) {
  const ref = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  useGSAP(() => {
    gsap.to('.nav-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } })
  }, { scope: ref })
  useGSAP(() => {
    if (!ready) { gsap.set(ref.current, { yPercent: -120 }); return }
    gsap.to(ref.current, { yPercent: 0, duration: 1.2, ease: 'expo.out', delay: .9 })
  }, { dependencies: [ready], scope: ref })
  const go = (id) => (e) => { e.preventDefault(); scrollToId(id) }
  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`} ref={ref}>
      <a href="#top" className="brand" onClick={go('top')}><i />Womankin</a>
      <ul className="nav-links">
        {items.map(([id, label, cls]) => (
          <li key={id} className={cls}><a href={`#${id}`} onClick={go(id)}>{label}</a></li>
        ))}
        <li><a className="nav-cta" href={LINKS.read} target="_blank" rel="noopener">Read now</a></li>
      </ul>
      <div className="nav-progress" />
    </header>
  )
}
