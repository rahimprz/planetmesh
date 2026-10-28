import { useRef } from 'react'
import { gsap, useGSAP, reduceMotion } from '../scroll'
import { LINKS } from '../content'
import { Eyebrow, MaskTitle, Rise } from './Reveal'

export default function GetBook() {
  const ref = useRef(null)
  useGSAP(() => {
    if (reduceMotion || !matchMedia('(hover: hover)').matches) return
    ref.current.querySelectorAll('.btn').forEach((b) => {
      const x = gsap.quickTo(b, 'x', { duration: .6, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .6, ease: 'power3' })
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .3); y((e.clientY - r.top - r.height / 2) * .4) })
      b.addEventListener('pointerleave', () => { x(0); y(0) })
    })
  }, { scope: ref })
  return (
    <section className="get" id="book" ref={ref}>
      <div className="wrap">
        <Eyebrow>The novelette</Eyebrow>
        <MaskTitle lines={['Enter the', <em key="m">Mesh.</em>]} />
        <Rise as="p" className="lead">Read <em>Planet Mesh</em> online, or purchase a copy from your favorite store.</Rise>
        <Rise className="get-cta">
          <a className="btn btn--solid" href={LINKS.read} target="_blank" rel="noopener">Read online <span className="arrow">→</span></a>
          <a className="btn" href={LINKS.purchase} target="_blank" rel="noopener">Purchase <span className="arrow">→</span></a>
        </Rise>
        <Rise><span className="soon"><i />Files coming soon</span></Rise>
      </div>
    </section>
  )
}
