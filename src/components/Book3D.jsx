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
            <g stroke="rgba(244,237,225,.35)" strokeWidth=".5" fill="none">
              <path d="M20 70 L70 40 L120 80 L170 50 M70 40 L90 120 L120 80 M20 70 L50 130 L90 120 L150 140 L170 50 M50 130 L40 190 L100 175 L150 140 L180 200 M100 175 L90 120 M40 190 L110 240 L180 200 L100 175" />
            </g>
            <g fill="#f6c177">
              {[[20,70],[70,40],[120,80],[170,50],[90,120],[50,130],[150,140],[40,190],[100,175],[180,200],[110,240]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={i % 3 ? 1.6 : 2.6} opacity={i % 2 ? .7 : 1} />
              ))}
            </g>
            <circle cx="100" cy="312" r="70" fill="rgba(246,193,119,.35)" />
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
