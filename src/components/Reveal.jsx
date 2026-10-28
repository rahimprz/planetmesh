import { useRef } from 'react'
import { gsap, useGSAP, reduceMotion } from '../scroll'

// Headline whose lines slide up from a mask when scrolled into view.
export function MaskTitle({ lines, className = 'h2', as: Tag = 'h2' }) {
  const ref = useRef(null)
  useGSAP(() => {
    if (reduceMotion) return
    gsap.from(ref.current.querySelectorAll('.mask > span'), {
      yPercent: 110, duration: 1.4, stagger: .12, ease: 'expo.out',
      scrollTrigger: { trigger: ref.current, start: 'top 86%' },
    })
  }, { scope: ref })
  return <Tag className={className} ref={ref}>{lines.map((l, i) => <span className="mask" key={i}><span>{l}</span></span>)}</Tag>
}

// Fade-up wrapper for any block.
export function Rise({ children, className, delay = 0, as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  useGSAP(() => {
    if (reduceMotion) return
    gsap.from(ref.current, { y: 50, opacity: 0, duration: 1.3, delay, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 90%' } })
  }, { scope: ref })
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>
}

// Text that lights up word by word as you scroll through it.
export function ScrubWords({ text, className, as: Tag = 'p' }) {
  const ref = useRef(null)
  useGSAP(() => {
    if (reduceMotion) return
    gsap.to(ref.current.querySelectorAll('.word'), {
      opacity: 1, stagger: .08, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top 82%', end: 'bottom 48%', scrub: true },
    })
  }, { scope: ref })
  return <Tag ref={ref} className={className}>{text.split(' ').map((w, i) => <span className="word" key={i}>{w}</span>)}</Tag>
}

export function Eyebrow({ children }) {
  const ref = useRef(null)
  useGSAP(() => {
    if (reduceMotion) return
    gsap.from(ref.current, { x: -24, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 92%' } })
  })
  return <div className="eyebrow" ref={ref}>{children}</div>
}
