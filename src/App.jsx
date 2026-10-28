import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, useGSAP, lenisRef, reduceMotion } from './scroll'
import Sky from './components/Sky'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Premise from './components/Premise'
import Pillars from './components/Pillars'
import Origin from './components/Origin'
import MetaMesh from './components/MetaMesh'
import Library from './components/Library'
import Verse from './components/Verse'
import GetBook from './components/GetBook'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [ready, setReady] = useState(reduceMotion)
  const dawn = useRef(0) // 0 → 1 as the page scrolls; read by the mesh canvas
  const root = useRef(null)

  // Smooth scrolling, synced with ScrollTrigger
  useEffect(() => {
    if (reduceMotion) return
    const lenis = new Lenis({ lerp: 0.09 })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null }
  }, [])

  // Lock scroll while the loader runs
  useEffect(() => {
    if (!ready) { lenisRef.current?.stop(); document.documentElement.style.overflow = 'hidden' }
    else { lenisRef.current?.start(); document.documentElement.style.overflow = ''; ScrollTrigger.refresh() }
  }, [ready])

  // Night → dawn: page progress drives the sunrise in the Sky shader
  useGSAP(() => {
    ScrollTrigger.create({ trigger: 'main', start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => { dawn.current = s.progress } })
  }, { scope: root })

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <div ref={root}>
      <div className="sky" aria-hidden="true" />
      <Sky dawn={dawn} />
      <div className="veil" aria-hidden="true" />
      {!reduceMotion && <Loader onDone={() => setReady(true)} />}
      <Nav ready={ready} />
      <main id="top">
        <Hero ready={ready} />
        <Marquee />
        <Premise />
        <Pillars />
        <Origin />
        <MetaMesh />
        <Library />
        <GetBook />
        <Verse />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
