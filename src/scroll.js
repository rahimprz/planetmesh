import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Shared Lenis instance (set in App) so links can smooth-scroll.
export const lenisRef = { current: null }

export function scrollToId(id) {
  const el = id === 'top' ? 0 : document.getElementById(id)
  if (el === null) return
  if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.6, offset: id === 'top' ? 0 : -10 })
  else if (el === 0) window.scrollTo({ top: 0, behavior: 'smooth' })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export { gsap, ScrollTrigger, useGSAP }
