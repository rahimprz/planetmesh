import { useRef } from 'react'
import { gsap, useGSAP, reduceMotion } from '../scroll'
import { VERSE } from '../content'
import { Eyebrow, MaskTitle, Rise } from './Reveal'

// "Lyrical Verse" — the poems, grouped by year as an editorial index.
// Newest first (an object would sort numeric year keys ascending, so keep an array)
const byYear = VERSE.reduce((acc, v) => {
  const y = v.date.slice(-4), g = acc.find((x) => x[0] === y)
  g ? g[1].push(v) : acc.push([y, [v]]); return acc
}, [])

export default function Verse() {
  const ref = useRef(null)
  useGSAP(() => {
    if (reduceMotion) return
    gsap.utils.toArray('.verse-row').forEach((row) =>
      gsap.from(row, { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 92%' } }))
    gsap.utils.toArray('.verse-year b').forEach((y) =>
      gsap.from(y, { yPercent: 100, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: y, start: 'top 90%' } }))
  }, { scope: ref })

  return (
    <section id="verse" ref={ref}>
      <div className="wrap">
        <div className="lib-head">
          <div>
            <Eyebrow>Poems &amp; reflections</Eyebrow>
            <MaskTitle lines={['Lyrical', <em key="v">Verse.</em>]} />
          </div>
          <Rise as="p" className="lead">Odes, questions and meditations on goodness, grief, the matriarchs and Gaia.</Rise>
        </div>
        <div className="verse">
          {byYear.map(([year, items]) => (
            <div className="verse-group" key={year}>
              <div className="verse-year"><span className="mask"><b>{year}</b></span></div>
              <div className="verse-list">
                {items.map((v) => (
                  <a className="verse-row" href={v.href} target="_blank" rel="noopener" key={v.href}>
                    <span className="verse-date">{v.date.replace(/ \d{4}$/, '')}</span>
                    <span className="verse-main">
                      <span className="verse-title">{v.title}</span>
                      <span className="verse-line">{v.line}</span>
                    </span>
                    <span className="verse-go">Continue reading <i>→</i></span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
