import { useRef } from 'react'
import { gsap, useGSAP, reduceMotion, scrollToId } from '../scroll'
import { LINKS } from '../content'

export default function Footer() {
  const ref = useRef(null)
  useGSAP(() => {
    if (reduceMotion) return
    gsap.from('.footer-word span', { yPercent: 100, opacity: 0, stagger: .05, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 95%' } })
  }, { scope: ref })
  const go = (id) => (e) => { e.preventDefault(); scrollToId(id) }
  return (
    <footer className="footer" ref={ref}>
      <div className="footer-top">
        <span>Planet Mesh · Lyrical Verse</span>
        <nav>
          <a href={LINKS.read} target="_blank" rel="noopener">Read</a>
          <a href={LINKS.purchase} target="_blank" rel="noopener">Purchase</a>
          <a href="#verse" onClick={go('verse')}>Verse</a>
          <a href="#contact" onClick={go('contact')}>Contact</a>
          <a href="#top" onClick={go('top')}>Back to top ↑</a>
        </nav>
        <span>Copyright © {new Date().getFullYear()} Womankin — All Rights Reserved.</span>
      </div>
      <div className="footer-word" aria-label="Womankin">{[...'Womankin'].map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}</div>
    </footer>
  )
}
