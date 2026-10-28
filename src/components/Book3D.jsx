import { forwardRef } from 'react'

// Original cover design for Planet Mesh, rendered in CSS 3D.
const Book3D = forwardRef(function Book3D(_, ref) {
  return (
    <div className="book-stage">
      <div className="book" ref={ref} aria-label="Planet Mesh book cover">
        <div className="book-glow" />
        <div className="book-face book-back" />
        <div className="book-face book-spine" />
        <div className="book-pages" />
        <div className="book-face book-front">
          <svg viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <radialGradient id="bk-sun" cx="0.62" cy="0.775" r="0.5">
                <stop offset="0" stopColor="#ffe2b0" stopOpacity="1" />
                <stop offset=".08" stopColor="#f6b97a" stopOpacity=".9" />
                <stop offset=".35" stopColor="#d9705a" stopOpacity=".35" />
                <stop offset="1" stopColor="#d9705a" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="bk-limb" x1="0" x2="1"><stop offset="0" stopColor="#6f74ff" stopOpacity=".5" /><stop offset=".6" stopColor="#ffc98a" /><stop offset="1" stopColor="#ff9f7a" stopOpacity=".6" /></linearGradient>
            </defs>
            <rect width="200" height="300" fill="url(#bk-sun)" />
            <path d="M-40 300 Q100 196 240 300 Z" fill="#05061a" />
            <path d="M-40 300 Q100 196 240 300" fill="none" stroke="url(#bk-limb)" strokeWidth="1.2" />
            <g fill="#f4ede1">{[[30,40,.5],[160,30,.7],[120,70,.4],[60,110,.6],[178,120,.4],[20,160,.5],[96,22,.5]].map(([x,y,o],i)=><circle key={i} cx={x} cy={y} r=".7" opacity={o} />)}</g>
            <ellipse cx="100" cy="150" rx="78" ry="78" fill="none" stroke="rgba(244,237,225,.14)" strokeWidth=".4" />
          </svg>
          <div className="cover-text">
            <div className="cover-kicker">A novelette</div>
            <div className="cover-title">Planet<em>Mesh</em></div>
            <div className="cover-author">Dawn's Early Message</div>
          </div>
        </div>
        <div className="book-shadow" />
      </div>
    </div>
  )
})
export default Book3D
