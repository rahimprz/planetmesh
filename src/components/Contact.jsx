import { useState } from 'react'
import { LINKS } from '../content'
import { Eyebrow, MaskTitle, Rise } from './Reveal'

export default function Contact() {
  const [note, setNote] = useState({ text: '', err: false })
  const submit = (e) => {
    e.preventDefault()
    const f = e.currentTarget, name = f.name.value.trim(), email = f.email.value.trim(), msg = f.message.value.trim()
    if (!name || !email || !msg) return setNote({ text: 'Please add your name, email and message.', err: true })
    setNote({ text: `Opening your email app… if nothing opens, write to ${LINKS.contactEmail}`, err: false })
    window.location.href = `mailto:${LINKS.contactEmail}?subject=${encodeURIComponent(`Message from ${name} — ifshewereawoman.com`)}&body=${encodeURIComponent(`${msg}\n\n— ${name} (${email})`)}`
  }
  return (
    <section className="contact" id="contact">
      <div className="wrap contact-grid">
        <div>
          <Eyebrow>Contact me</Eyebrow>
          <MaskTitle lines={['Questions or', <em key="c">comments?</em>]} />
          <Rise as="p" className="lead">Feel free to send me a message. I look forward to hearing from you.</Rise>
          <Rise className="mails">
            <div><small>Messages</small><a href={`mailto:${LINKS.contactEmail}`}>{LINKS.contactEmail}</a></div>
            <div><small>Feedback &amp; suggestions on the book</small><a href={`mailto:${LINKS.feedbackEmail}`}>{LINKS.feedbackEmail}</a></div>
          </Rise>
        </div>
        <Rise as="form" className="form" onSubmit={submit} noValidate>
          <div className="field"><input id="f-name" name="name" placeholder=" " autoComplete="name" /><label htmlFor="f-name">Your name</label></div>
          <div className="field"><input id="f-email" name="email" type="email" placeholder=" " autoComplete="email" /><label htmlFor="f-email">Email</label></div>
          <div className="field"><textarea id="f-msg" name="message" placeholder=" " /><label htmlFor="f-msg">Your message</label></div>
          <button className="btn btn--solid" type="submit">Send message <span className="arrow">→</span></button>
          <div className={`form-note${note.err ? ' err' : ''}`} role="status" aria-live="polite">{note.text}</div>
        </Rise>
      </div>
    </section>
  )
}
