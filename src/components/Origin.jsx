import { Eyebrow, MaskTitle, Rise, ScrubWords } from './Reveal'

export default function Origin() {
  return (
    <section>
      <div className="wrap origin-grid">
        <div className="origin-sticky">
          <Eyebrow>About the author</Eyebrow>
          <MaskTitle lines={['Tuning to', <em key="c">the Network.</em>]} />
        </div>
        <div className="origin-copy">
          <Rise as="p">The creation of <em>Planet Mesh</em> stems from a deep, emergent cry to dismantle our modern, disembodied isolation. For too long, humanity has surrendered its attention to centralized corporate platforms and rigid binary screens.</Rise>
          <ScrubWords as="blockquote" className="quote" text="We have forgotten how to listen to our bodies and to one another." />
          <Rise as="p">In <em>Planet Mesh</em>, the true protagonist is not a single human hero. It is the network itself — an evolving, emergent composition called the <strong>MetaMesh</strong>.</Rise>
        </div>
      </div>
    </section>
  )
}
