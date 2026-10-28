import { useRef } from 'react'
import { gsap, useGSAP, reduceMotion } from '../scroll'
import { PILLARS } from '../content'

const Art = [
  <svg viewBox="0 0 100 100" fill="none" stroke="#f6c177" strokeWidth=".6" key="a"><circle cx="50" cy="50" r="5" fill="#f6c177"/>{[[15,20],[85,18],[82,82],[18,80],[50,8],[50,92]].map(([x,y],i)=>(<g key={i}><circle cx={x} cy={y} r="3"/><path d={`M${x} ${y} L50 50`}/></g>))}<path d="M15 20 L50 8 L85 18 L82 82 L50 92 L18 80Z"/></svg>,
  <svg viewBox="0 0 100 100" fill="none" stroke="#9cc5a1" strokeWidth=".6" key="b"><circle cx="38" cy="40" r="24"/><circle cx="62" cy="40" r="24"/><circle cx="50" cy="62" r="24"/></svg>,
  <svg viewBox="0 0 100 100" fill="none" stroke="#e8807a" strokeWidth=".6" key="c"><path d="M50 95 V10"/><path d="M50 65 C38 55 24 55 12 62 M50 65 C62 55 76 55 88 62 M50 42 C40 32 30 32 20 36 M50 42 C60 32 70 32 80 36"/><path d="M50 95 C44 98 34 99 24 99 M50 95 C56 98 66 99 76 99"/></svg>,
]

export default function Pillars() {
  const ref = useRef(null), track = useRef(null)

  useGSAP(() => {
    const path = ref.current.querySelector('#chainPath'), len = path.getTotalLength()
    const msg = ref.current.querySelector('.msg'), nodes = ref.current.querySelectorAll('.cnodes circle')
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: reduceMotion ? 0 : len })
    if (reduceMotion) return

    const mm = gsap.matchMedia()
    // Desktop: pin the section and scroll it sideways
    mm.add('(min-width: 961px)', () => {
      const dist = () => track.current.scrollWidth - innerWidth
      const hz = gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: ref.current, pin: true, scrub: 1, end: () => '+=' + dist(), invalidateOnRefresh: true },
      })
      gsap.utils.toArray('.pillar', ref.current).forEach((p) => {
        gsap.from(p.querySelector('h3'), { y: 80, opacity: 0, ease: 'power3.out',
          scrollTrigger: { trigger: p, containerAnimation: hz, start: 'left 85%', end: 'left 45%', scrub: true } })
        gsap.from(p.querySelector('.pillar-art'), { rotate: -60, scale: .6, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: p, containerAnimation: hz, start: 'left 100%', end: 'left 30%', scrub: true } })
      })
      const chain = gsap.timeline({ scrollTrigger: { trigger: '.chain-panel', containerAnimation: hz, start: 'left 75%', end: 'center 50%', scrub: true } })
      build(chain)
    })
    // Mobile: simple vertical reveals
    mm.add('(max-width: 960px)', () => {
      gsap.utils.toArray('.pillar', ref.current).forEach((p) =>
        gsap.from(p, { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 88%' } }))
      const chain = gsap.timeline({ scrollTrigger: { trigger: '.chain-svg', start: 'top 85%', end: 'bottom 45%', scrub: true } })
      build(chain)
    })

    function build(tl) {
      const k = { v: 0 }
      tl.to(path, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
        .to(k, { v: 1, ease: 'none', duration: 1, onUpdate: () => {
          const pt = path.getPointAtLength(k.v * len); msg.setAttribute('cx', pt.x); msg.setAttribute('cy', pt.y)
        } }, 0)
      nodes.forEach((c, i) => {
        const at = (i / (nodes.length - 1)) * .95
        tl.fromTo(c, { scale: 0 }, { scale: 1, transformOrigin: '50% 50%', ease: 'back.out(3)', duration: .1 }, Math.max(0, at - .05))
          .to(c, { fill: '#f6c177', duration: .05 }, at)
      })
    }
    return () => mm.revert()
  }, { scope: ref })

  return (
    <section className="hz" ref={ref} aria-label="A necessary return">
      <div className="hz-track" ref={track}>
        <div className="hz-panel">
          <div className="hz-intro">
            <div className="eyebrow">A necessary return</div>
            <h2 className="h2" style={{ marginTop: 26 }}>Step away from the cloud.<br /><em>Re-root.</em></h2>
            <p className="lead">The novelette, <em>Planet Mesh</em>, offers a necessary return: an invitation to step away from exploitative digital clouds and re-root ourselves in <strong>decentralized, communal networks of care, support, and integration</strong>.</p>
          </div>
        </div>
        <div className="hz-panel pillars">
          {PILLARS.map((p, i) => (
            <article className="pillar" key={p.n}>
              <div className="pillar-art">{Art[i]}</div>
              <div className="pillar-glow" style={{ background: `radial-gradient(circle at 50% 100%, ${p.color}, transparent 60%)` }} />
              <span className="pillar-n" style={{ color: p.color }}>{p.n}</span>
              <h3>{p.title}</h3>
            </article>
          ))}
        </div>
        <div className="hz-panel chain-wrap">
          <div className="chain-panel">
            <p><strong>Node to node.</strong>The narrative features node to node exchange; similar in many ways to the word of mouth information process of yesteryear.</p>
            <svg className="chain-svg" viewBox="0 0 600 200" aria-hidden="true">
              <defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stopColor="#9cc5a1" /><stop offset=".5" stopColor="#f6c177" /><stop offset="1" stopColor="#e8807a" /></linearGradient></defs>
              <path id="chainPath" d="M20 120 C 90 30, 150 30, 170 100 S 260 180, 300 100 S 380 20, 430 90 S 520 170, 580 80" fill="none" stroke="url(#cg)" strokeWidth="1.6" strokeLinecap="round" />
              <g className="cnodes" fill="#06071a" stroke="#f4ede1" strokeWidth="1.2">
                {[[20,120],[170,100],[300,100],[430,90],[580,80]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="10" />)}
              </g>
              <circle className="msg" r="5.5" cx="20" cy="120" fill="#f6c177" style={{ filter: 'drop-shadow(0 0 8px #f6c177)' }} />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
