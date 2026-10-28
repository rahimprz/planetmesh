import { useEffect, useRef } from 'react'
import { reduceMotion } from '../scroll'

/*
  Full-screen WebGL backdrop: a planet's horizon seen from orbit.
  As the page scrolls (dawn.current 0 → 1) the sun climbs over the limb,
  the atmosphere warms from violet to amber and the stars wash out.
  Falls back to the CSS gradient on .sky when WebGL is unavailable.
*/

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x), u.y);
}
float fbm(vec2 p){
  float v=0., a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){ v+=a*noise(p); p=m*p; a*=.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - .5) * asp, uv.y);
  float s = smoothstep(0., 1., uScroll);
  float t = uTime;
  vec2 m = (uMouse - .5) * vec2(.05, .025);

  // ---- planet geometry ----
  float R = 2.6;
  float horizon = mix(.13, .24, s);
  vec2 c = vec2(-m.x * .6, horizon - R - m.y);
  float d = length(p - c) - R;                 // > 0 sky, < 0 planet

  vec2 sun = vec2(asp * .16 - m.x, horizon + mix(-.045, .06, s));
  float dx = abs(p.x - sun.x);
  float toward = exp(-dx * 1.15);              // 1 near the sun along the limb

  // ---- sky ----
  float h = max(d, 0.);
  vec3 col = mix(vec3(.012,.014,.045), vec3(.035,.035,.10), exp(-h * 1.6));
  vec3 warm = mix(vec3(.10,.07,.24), vec3(.62,.27,.21), s);
  col += warm * exp(-h * mix(5.5, 2.4, s)) * (.45 + .55 * s) * (.55 + .45 * toward);
  col += vec3(.20,.12,.30) * exp(-h * 1.1) * .25 * s;

  // drifting nebula — domain-warped fbm, very low key
  vec2 q = p * 1.25 + vec2(t * .006, 0.);
  vec2 w = vec2(fbm(q + vec2(0., t * .012)), fbm(q + vec2(5.2, 1.3) - t * .01));
  float n = fbm(q + 2.2 * w);
  vec3 neb = mix(vec3(.10,.09,.28), mix(vec3(.38,.16,.30), vec3(.15,.30,.30), w.x), n);
  col += neb * smoothstep(.42, .9, n) * .24 * smoothstep(.02, .5, h) * (1. - .45 * s);

  // stars — sparse, twinkling, washed out by dawn and near the horizon
  vec2 cell = floor(gl_FragCoord.xy / 2.);
  float r = hash(cell);
  float tw = .55 + .45 * sin(t * (1. + r * 3.) + r * 40.);
  float star = step(.9982, r) * tw * smoothstep(.06, .5, h) * (1. - .85 * s);
  col += vec3(.85,.88,1.) * star * .9;

  // ---- atmosphere rim ----
  vec3 cool = vec3(.30,.32,.92);
  vec3 hot = mix(vec3(.98,.48,.34), vec3(1.,.80,.52), toward);
  vec3 rimCol = mix(cool, hot, clamp(toward * (.35 + .9 * s), 0., 1.));
  float rim = exp(-h * mix(30., 13., s)) * step(0., d);
  col += rimCol * rim * (.30 + .95 * s) * (.35 + .65 * toward);

  // ---- planet surface ----
  if (d < 0.) {
    vec2 sp = (p - c) / R;
    float band = fbm(vec2(sp.x * 7. + t * .004, sp.y * 26.));
    float storm = fbm(sp * 22. + band * 2.);
    vec3 surf = vec3(.006,.008,.018) + vec3(.012,.012,.03) * band + vec3(.01,.006,.012) * storm;
    float edge = exp(d * 26.);
    surf += hot * edge * toward * (.10 + .32 * s);
    surf += rimCol * exp(d * 110.) * (.25 + .6 * s);
    col = surf;
  }

  // ---- sun + horizontal flare ----
  float sd = length((p - sun) * vec2(1., 1.15));
  col += vec3(1.,.82,.58) * exp(-sd * mix(46., 15., s)) * mix(.25, 1.5, s);
  col += vec3(1.,.62,.40) * exp(-sd * 3.5) * .14 * s;
  float flare = exp(-abs(d) * 70.) * exp(-dx * mix(3.2, 1.1, s));
  col += vec3(1.,.66,.44) * flare * (.15 + .9 * s);

  // grain + gentle tone map
  col += (hash(gl_FragCoord.xy + fract(t * 7.) * 91.) - .5) * .035;
  col = 1. - exp(-col * 1.3);
  gl_FragColor = vec4(pow(max(col, 0.), vec3(.96)), 1.);
}`

export default function Sky({ dawn }) {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
    if (!gl) { cv.style.display = 'none'; return }

    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { cv.style.display = 'none'; return }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const U = (n) => gl.getUniformLocation(prog, n)
    const uRes = U('uRes'), uTime = U('uTime'), uScroll = U('uScroll'), uMouse = U('uMouse')

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr)
      gl.viewport(0, 0, cv.width, cv.height)
    }
    size(); addEventListener('resize', size)

    const mouse = { x: .5, y: .5, tx: .5, ty: .5 }
    const move = (e) => { mouse.tx = e.clientX / innerWidth; mouse.ty = 1 - e.clientY / innerHeight }
    addEventListener('pointermove', move)

    let raf, scroll = dawn.current, start = performance.now()
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      scroll += (dawn.current - scroll) * .06
      mouse.x += (mouse.tx - mouse.x) * .04; mouse.y += (mouse.ty - mouse.y) * .04
      gl.uniform2f(uRes, cv.width, cv.height)
      gl.uniform1f(uTime, reduceMotion ? 12 : (now - start) / 1000)
      gl.uniform1f(uScroll, scroll)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('pointermove', move) }
  }, [dawn])

  return <canvas ref={ref} className="sky-canvas" aria-hidden="true" />
}
