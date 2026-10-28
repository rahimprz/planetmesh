import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, useGSAP, lenisRef, reduceMotion } from './scroll'
import MeshCanvas from './components/MeshCanvas'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Premise from './components/Premise'
import Pillars from './components/Pillars'
import Origin from './components/Origin'
import MetaMesh from './components/MetaMesh'
import Library from './components/Library'
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

  // Night → dawn sky across the whole page
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1.2,
        onUpdate: (s) => { dawn.current = s.progress } },
    })
    tl.to('.sky-dusk', { opacity: 1, ease: 'none', duration: 1 })
      .to('.sky-dawn', { opacity: 0.95, ease: 'none', duration: 1.2 }, '-=.2')
      .to('.sky-sun', { opacity: 1, bottom: '-34vmax', ease: 'none', duration: 1 }, '-=.9')
  }, { scope: root })

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <div ref={root}>
      <div className="sky" aria-hidden="true">
        <div className="sky-dusk" /><div className="sky-dawn" /><div className="sky-sun" />
      </div>
      <MeshCanvas dawn={dawn} />
      <div className="grain" aria-hidden="true" />
      {!reduceMotion && <Loader onDone={() => setReady(true)} />}
      <Cursor />
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
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
