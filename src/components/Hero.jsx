import { useRef } from 'react'
import { gsap, useGSAP, reduceMotion } from '../scroll'
import { LINKS } from '../content'
import Book3D from './Book3D'

const chars = (w) => [...w].map((c, i) => <span className="char" key={i}>{c}</span>)

export default function Hero({ ready }) {
  const ref = useRef(null), book = useRef(null)

  useGSAP(() => {
    if (reduceMotion) return
    if (!ready) {
      gsap.set('.hero-title .char', { yPercent: 115 })
      gsap.set(['.hero .eyebrow', '.hero-sub', '.hero-cta > *', '.hero-foot'], { opacity: 0, y: 24 })
      gsap.set(book.current, { opacity: 0, y: 120, rotateY: -70, rotateX: 20 })
      return
    }
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to('.hero-title .row:first-child .char', { yPercent: 0, duration: 1.6, stagger: .05 })
      .to('.hero-title .row:last-child .char', { yPercent: 0, duration: 1.6, stagger: .05 }, '-=1.35')
      .to(book.current, { opacity: 1, y: 0, rotateY: -24, rotateX: 6, duration: 2, ease: 'expo.out' }, '-=1.5')
      .to('.hero .eyebrow', { opacity: 1, y: 0, duration: 1 }, '-=1.7')
      .to('.hero-sub', { opacity: 1, y: 0, duration: 1.2 }, '-=1.4')
      .to('.hero-cta > *', { opacity: 1, y: 0, duration: 1.1, stagger: .1 }, '-=1.1')
      .to('.hero-foot', { opacity: 1, y: 0, duration: 1 }, '-=.9')
      .add(() => {
        // gentle float + mouse tilt once the intro lands
        gsap.to(book.current, { y: -14, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        if (!matchMedia('(hover: hover)').matches) return
        const ry = gsap.quickTo(book.current, 'rotateY', { duration: 1.2, ease: 'power3' })
        const rx = gsap.quickTo(book.current, 'rotateX', { duration: 1.2, ease: 'power3' })
        const move = (e) => { ry(-24 + (e.clientX / innerWidth - .5) * 30); rx(6 - (e.clientY / innerHeight - .5) * 16) }
        addEventListener('pointermove', move)
      })

    gsap.to('.hero-title', { yPercent: -16, opacity: .2, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
    gsap.to('.book-stage', { yPercent: 22, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
  }, { dependencies: [ready], scope: ref })

  return (
    <section className="hero" ref={ref}>
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">Speculative fiction · A novelette</div>
          <h1 className="hero-title" aria-label="Planet Mesh">
            <span className="row" aria-hidden="true">{chars('Planet')}</span>
            <span className="row" aria-hidden="true">{chars('Mesh.')}</span>
          </h1>
          <p className="hero-sub">Dawn's Early Message — a lyrical exploration of humanity.</p>
          <div className="hero-cta">
            <a className="btn btn--solid" href={LINKS.read} target="_blank" rel="noopener">Read the novelette <span className="arrow">→</span></a>
            <a className="btn" href={LINKS.purchase} target="_blank" rel="noopener">Purchase <span className="arrow">→</span></a>
          </div>
        </div>
        <Book3D ref={book} />
      </div>
      <div className="hero-foot">
        <div className="scroll-cue"><i />Scroll to dawn</div>
        <div className="meta">Node to node</div>
      </div>
    </section>
  )
}
