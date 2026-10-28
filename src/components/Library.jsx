import { useRef } from 'react'
import { gsap, useGSAP, reduceMotion } from '../scroll'
import { BOOKS } from '../content'
import { Eyebrow, MaskTitle, Rise } from './Reveal'

export default function Library() {
  const ref = useRef(null)
  useGSAP(() => {
    if (reduceMotion) return
    gsap.utils.toArray('.lib-row').forEach((row) => {
      gsap.from(row, { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 90%' } })
    })
  }, { scope: ref })
  return (
    <section id="library" ref={ref}>
      <div className="wrap">
        <div className="lib-head">
          <div>
            <Eyebrow>Foundational texts</Eyebrow>
            <MaskTitle lines={[<span key="r">Read <em>deeper.</em></span>]} />
          </div>
          <Rise as="p" className="lead">To understand how decentralized, vibratory infrastructures can reshape human society, explore these foundational texts.</Rise>
        </div>
        <div className="lib-list">
          {BOOKS.map((b, i) => {
            const Tag = b.href ? 'a' : 'div'
            const props = b.href ? { href: b.href, target: '_blank', rel: 'noopener' } : {}
            return (
              <Tag className={`lib-row${b.href ? '' : ' no-link'}`} key={b.title} {...props}>
                <span className="lib-n">{String(i + 1).padStart(2, '0')}</span>
                <div><div className="lib-title">{b.title}</div><div className="lib-author">{b.author}</div></div>
                <p className="lib-why"><b>Why read it:</b> {b.why}</p>
                <span className="lib-go" aria-hidden="true">{b.href ? '↗' : '✦'}</span>
              </Tag>
            )
          })}
        </div>
      </div>
    </section>
  )
}
