import { PREMISE, RESILIENCE } from '../content'
import { Eyebrow, ScrubWords, Rise } from './Reveal'

export default function Premise() {
  return (
    <section id="story">
      <div className="wrap">
        <Eyebrow>The premise</Eyebrow>
        <ScrubWords className="premise-text" text={PREMISE} />
        <div className="premise-foot">
          <Rise className="stat"><b>01</b><span>Resilience</span></Rise>
          <Rise as="p" className="lead" delay={.1}>{RESILIENCE}</Rise>
        </div>
      </div>
    </section>
  )
}
