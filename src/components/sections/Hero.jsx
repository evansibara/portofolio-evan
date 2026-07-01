import { lazy, Suspense, useEffect, useRef } from 'react';
import anime from 'animejs';
import Magnetic from '@components/ui/Magnetic';
import { site } from '@data/site';

// ── Lazy load komponen berat ──
// Particles: OGL WebGL (~80KB), tidak blocking render teks Hero sama sekali.
//
// Catatan: komponen Lanyard (Three.js + R3F + Rapier, ~500KB gzipped) sudah
// dihapus dari Hero. Selain berat, canvas-nya memasang `touch-action: none`
// dan menjalankan simulasi fisika setiap frame tanpa henti — ini yang jadi
// penyebab utama halaman terasa "tidak bisa di-scroll" di banyak device.
// Diganti dengan HeroGraphic: SVG + CSS animation, zero 3D, zero scroll interference.
const Particles = lazy(() => import('@components/Particles'));

// ─────────────────────────────────────────────────────────────
// HeroGraphic — Ilustrasi abstrak pengganti Lanyard
// Pure SVG + CSS animation, zero JS 3D library, zero pointer-event lock
// ─────────────────────────────────────────────────────────────
function HeroGraphic() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto h-[520px] xl:h-[600px] select-none pointer-events-none">

      {/* ── Gold ambient halo ── */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2
                   w-72 h-72 rounded-full pointer-events-none
                   bg-[radial-gradient(circle,rgba(201,169,97,0.14)_0%,transparent_70%)]"
        style={{ filter: 'blur(2px)' }}
      />

      {/* ── Outer dashed orbit ring ── */}
      <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px]">
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full hero-graphic-orbit-ring"
          fill="none"
        >
          <circle
            cx="160" cy="160" r="156"
            stroke="rgba(201,169,97,0.12)"
            strokeWidth="1"
            strokeDasharray="6 16"
          />
          {/* Traveling dot along ring */}
          <circle cx="160" cy="4" r="3.5" fill="rgba(201,169,97,0.85)" />
          <circle cx="160" cy="4" r="6" fill="rgba(201,169,97,0.15)" />
        </svg>
      </div>

      {/* ── Inner decorative ring ── */}
      <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px]">
        <svg viewBox="0 0 220 220" className="w-full h-full opacity-40" fill="none">
          <circle
            cx="110" cy="110" r="106"
            stroke="rgba(140,133,120,0.2)"
            strokeWidth="0.75"
          />
        </svg>
      </div>

      {/* ── Main terminal card ── */}
      {/* Wrapper for centering (no transform conflict with float) */}
      <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[252px]">
        {/* Float wrapper — separate from centering transforms */}
        <div className="hero-graphic-float">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(12,12,11,0.97)',
              border: '1px solid rgba(201,169,97,0.18)',
              boxShadow: '0 0 0 1px rgba(201,169,97,0.06), 0 32px 64px rgba(0,0,0,0.6), 0 0 40px rgba(201,169,97,0.07), inset 0 1px 0 rgba(201,169,97,0.1)',
            }}
          >
            {/* Terminal header bar */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{
                borderBottom: '1px solid rgba(201,169,97,0.1)',
                background: 'rgba(201,169,97,0.025)',
              }}
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,95,87,0.65)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,188,0,0.65)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(40,202,66,0.65)' }} />
              </div>
              <span
                className="flex-1 text-center font-mono tracking-wider"
                style={{ fontSize: '8.5px', color: 'rgba(140,133,120,0.55)' }}
              >
                portfolio.js
              </span>
            </div>

            {/* Code body */}
            <div className="px-5 pt-4 pb-5 font-mono" style={{ fontSize: '10px', lineHeight: '1.9' }}>
              <div>
                <span style={{ color: 'rgba(201,169,97,0.75)' }}>const </span>
                <span style={{ color: 'rgba(245,243,239,0.9)' }}>developer</span>
                <span style={{ color: 'rgba(140,133,120,0.7)' }}> = {'{'}</span>
              </div>
              <div className="pl-4">
                <span style={{ color: 'rgba(175,168,156,0.65)' }}>name</span>
                <span style={{ color: 'rgba(140,133,120,0.6)' }}>: </span>
                <span style={{ color: 'rgba(201,169,97,0.7)' }}>'Evan Sibara'</span>
                <span style={{ color: 'rgba(140,133,120,0.6)' }}>,</span>
              </div>
              <div className="pl-4">
                <span style={{ color: 'rgba(175,168,156,0.65)' }}>role</span>
                <span style={{ color: 'rgba(140,133,120,0.6)' }}>: </span>
                <span style={{ color: 'rgba(201,169,97,0.7)' }}>'Fullstack Dev'</span>
                <span style={{ color: 'rgba(140,133,120,0.6)' }}>,</span>
              </div>
              <div className="pl-4">
                <span style={{ color: 'rgba(175,168,156,0.65)' }}>stack</span>
                <span style={{ color: 'rgba(140,133,120,0.6)' }}>: [</span>
                <span style={{ color: 'rgba(201,169,97,0.7)' }}>'React'</span>
                <span style={{ color: 'rgba(140,133,120,0.5)' }}>, </span>
                <span style={{ color: 'rgba(201,169,97,0.7)' }}>'Node'</span>
                <span style={{ color: 'rgba(140,133,120,0.6)' }}>],</span>
              </div>
              <div>
                <span style={{ color: 'rgba(140,133,120,0.7)' }}>{'}'}</span>
              </div>

              {/* Divider */}
              <div className="my-3" style={{ borderTop: '1px solid rgba(201,169,97,0.08)' }} />

              {/* Comment + await */}
              <div style={{ color: 'rgba(140,133,120,0.42)' }}>
                <span>// building for production</span>
              </div>
              <div>
                <span style={{ color: 'rgba(201,169,97,0.7)' }}>await </span>
                <span style={{ color: 'rgba(210,204,194,0.7)' }}>deploy</span>
                <span style={{ color: 'rgba(140,133,120,0.6)' }}>(developer)</span>
              </div>

              {/* Output line with blinking cursor */}
              <div className="flex items-center gap-1 mt-1">
                <span style={{ color: 'rgba(40,202,66,0.75)', fontSize: '9px' }}>▶ </span>
                <span style={{ color: 'rgba(140,133,120,0.55)', fontSize: '9px' }}>Ready in 1.2s</span>
                <span className="hero-graphic-cursor ml-1 inline-block w-px h-[10px]"
                      style={{ background: 'rgba(201,169,97,0.85)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating skill chips ── */}
      <div
        className="absolute hero-graphic-float"
        style={{ top: '14%', right: '6%', animationDelay: '0.4s', animationDuration: '5.5s' }}
      >
        <div
          className="px-3 py-1 rounded-full font-mono"
          style={{
            fontSize: '9px',
            color: 'rgba(201,169,97,0.8)',
            border: '1px solid rgba(201,169,97,0.22)',
            background: 'rgba(12,12,11,0.92)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            letterSpacing: '0.06em',
          }}
        >
          React
        </div>
      </div>

      <div
        className="absolute hero-graphic-float"
        style={{ bottom: '20%', left: '4%', animationDelay: '1.1s', animationDuration: '6.2s' }}
      >
        <div
          className="px-3 py-1 rounded-full font-mono"
          style={{
            fontSize: '9px',
            color: 'rgba(140,133,120,0.7)',
            border: '1px solid rgba(140,133,120,0.18)',
            background: 'rgba(12,12,11,0.92)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            letterSpacing: '0.06em',
          }}
        >
          Supabase
        </div>
      </div>

      <div
        className="absolute hero-graphic-float"
        style={{ bottom: '34%', right: '4%', animationDelay: '1.8s', animationDuration: '4.9s' }}
      >
        <div
          className="px-3 py-1 rounded-full font-mono"
          style={{
            fontSize: '9px',
            color: 'rgba(140,133,120,0.7)',
            border: '1px solid rgba(140,133,120,0.18)',
            background: 'rgba(12,12,11,0.92)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            letterSpacing: '0.06em',
          }}
        >
          TypeScript
        </div>
      </div>

      <div
        className="absolute hero-graphic-float"
        style={{ top: '30%', left: '2%', animationDelay: '2.5s', animationDuration: '5.8s' }}
      >
        <div
          className="px-3 py-1 rounded-full font-mono"
          style={{
            fontSize: '9px',
            color: 'rgba(140,133,120,0.65)',
            border: '1px solid rgba(140,133,120,0.15)',
            background: 'rgba(12,12,11,0.92)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            letterSpacing: '0.06em',
          }}
        >
          Node.js
        </div>
      </div>

      {/* ── Corner bracket decorations ── */}
      <svg
        className="absolute"
        style={{ top: '8%', left: '10%', opacity: 0.35 }}
        width="28" height="28" viewBox="0 0 28 28" fill="none"
      >
        <path d="M10 2H2v8" stroke="rgba(201,169,97,1)" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
      <svg
        className="absolute"
        style={{ bottom: '8%', right: '10%', opacity: 0.35 }}
        width="28" height="28" viewBox="0 0 28 28" fill="none"
      >
        <path d="M18 26h8v-8" stroke="rgba(201,169,97,1)" strokeWidth="1.5" strokeLinecap="square" />
      </svg>

      {/* ── Dot grid — top right ── */}
      <svg
        className="absolute"
        style={{ top: '6%', right: '11%', opacity: 0.18 }}
        width="56" height="56" viewBox="0 0 56 56" fill="none"
      >
        {[0, 1, 2, 3].map(row =>
          [0, 1, 2, 3].map(col => (
            <circle
              key={`${row}-${col}`}
              cx={col * 14 + 4} cy={row * 14 + 4}
              r="1.5"
              fill="rgba(201,169,97,1)"
            />
          ))
        )}
      </svg>

      {/* ── Dot grid — bottom left ── */}
      <svg
        className="absolute"
        style={{ bottom: '10%', left: '8%', opacity: 0.13 }}
        width="42" height="42" viewBox="0 0 42 42" fill="none"
      >
        {[0, 1, 2].map(row =>
          [0, 1, 2].map(col => (
            <circle
              key={`${row}-${col}`}
              cx={col * 14 + 4} cy={row * 14 + 4}
              r="1.5"
              fill="rgba(140,133,120,1)"
            />
          ))
        )}
      </svg>

      {/* ── Horizontal rule lines ── */}
      <svg
        className="absolute"
        style={{ top: '22%', right: '0%', opacity: 0.18 }}
        width="40" height="1" viewBox="0 0 40 1"
      >
        <line x1="0" y1="0.5" x2="40" y2="0.5" stroke="rgba(201,169,97,1)" strokeWidth="1" />
      </svg>
      <svg
        className="absolute"
        style={{ bottom: '26%', left: '0%', opacity: 0.14 }}
        width="30" height="1" viewBox="0 0 30 1"
      >
        <line x1="0" y1="0.5" x2="30" y2="0.5" stroke="rgba(140,133,120,1)" strokeWidth="1" />
      </svg>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────────────────────
export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = heroRef.current;
    if (!ctx) return;

    const tl = anime.timeline({
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });

    tl.add({
      targets: ctx.querySelectorAll('[data-hero-label]'),
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 1100,
      delay: 400,
    })
      .add(
        {
          targets: ctx.querySelectorAll('[data-hero-word]'),
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 1300,
          delay: anime.stagger(120),
        },
        '-=700'
      )
      .add(
        {
          targets: ctx.querySelectorAll('[data-hero-tagline]'),
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 1100,
        },
        '-=900'
      )
      .add(
        {
          targets: ctx.querySelectorAll('[data-hero-cta]'),
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 900,
          delay: anime.stagger(100),
        },
        '-=500'
      )
      .add(
        {
          targets: ctx.querySelectorAll('[data-hero-graphic]'),
          opacity: [0, 1],
          scale: [0.94, 1],
          duration: 1400,
        },
        '-=900'
      )
      .add(
        {
          targets: ctx.querySelectorAll('[data-hero-particles]'),
          opacity: [0, 1],
          duration: 1800,
        },
        '-=1400'
      );

    // Subtle parallax on glow — only on hover-capable devices
    const shape = ctx.querySelector('[data-hero-shape]');
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    const onMouse = (e) => {
      if (!shape) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      anime({
        targets: shape,
        translateX: x,
        translateY: y,
        duration: 2000,
        easing: 'cubicBezier(0.22, 1, 0.36, 1)',
      });
    };
    if (supportsHover) {
      window.addEventListener('mousemove', onMouse);
      return () => window.removeEventListener('mousemove', onMouse);
    }
  }, []);

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative flex flex-col justify-center pt-20 sm:pt-24 md:pt-28 pb-6 md:pb-8 overflow-hidden"
    >
      {/* ── Particle field ── */}
      <Suspense fallback={null}>
        <div
          data-hero-particles
          aria-hidden
          className="absolute inset-0 opacity-0 pointer-events-none z-[1]"
        >
          <Particles
            particleCount={120}
            particleColors={['#C9A961', '#F5F3EF', '#8C8578']}
            particleBaseSize={60}
            sizeRandomness={1.2}
            particleSpread={12}
            speed={0.08}
            alphaParticles
            cameraDistance={22}
            disableRotation={false}
          />
        </div>
      </Suspense>

      {/* ── Ambient glow — parallax on mousemove ── */}
      <div
        data-hero-shape
        aria-hidden
        className="absolute top-1/2 right-[5%] -translate-y-1/2
                   w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] md:w-[580px] md:h-[580px]
                   rounded-full bg-gold/[0.05] blur-[80px] sm:blur-[100px] md:blur-[120px]
                   pointer-events-none z-[2]"
      />

      {/* ── Vertical editorial rule ── */}
      <div
        aria-hidden
        className="absolute left-5 sm:left-6 md:left-12 lg:left-20 top-0 bottom-0 w-px bg-ink-400/10 pointer-events-none z-[3]"
      />

      <div className="relative px-5 sm:px-6 md:px-12 lg:px-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center min-h-[80vh] lg:min-h-0">

          {/* ── LEFT COLUMN — text content ── */}
          <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-6 max-w-[720px] py-8 lg:py-20">

            {/* Label */}
            <div className="mb-5 sm:mb-6 md:mb-8">
              <p
                data-hero-label
                className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-ink-400 opacity-0 flex items-center gap-3 sm:gap-4"
              >
                <span className="w-8 sm:w-10 h-px bg-gold/60" />
                Portfolio — MMXXVI
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-mega font-display font-light leading-[0.95] mb-5 sm:mb-6 md:mb-8 text-ink-50">
              <span className="block tracking-tightest">
                <span
                  data-hero-word
                  className="inline-block opacity-0 will-change-transform"
                >
                  Fullstack
                </span>
              </span>
              <span className="block pb-[0.08em]">
                <span
                  data-hero-word
                  className="inline-block opacity-0 font-display italic hero-gradient-word will-change-transform"
                  style={{ paddingRight: '0.12em', paddingLeft: '0.02em', marginLeft: '-0.02em' }}
                >
                  Developer
                </span>
                <span
                  data-hero-word
                  className="inline-block opacity-0 text-gold ml-2 sm:ml-4 align-middle will-change-transform"
                  style={{ fontSize: '0.4em' }}
                >
                  ⟶
                </span>
              </span>
            </h1>

            {/* Tagline */}
            <p
              data-hero-tagline
              className="text-sm sm:text-base md:text-lg text-ink-200 leading-[1.7] text-balance opacity-0 font-light max-w-[520px] mb-8 md:mb-10"
            >
              I'm <span className="text-ink-50 font-normal">{site.name}</span>.{' '}
              {site.tagline} Shipping production applications with React, Node,
              and a considered approach to design and craft.
            </p>

            {/* CTA row */}
            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 sm:gap-4">
              <Magnetic strength={0.15}>
                <a
                  data-hero-cta
                  href="#work"
                  className="opacity-0 btn-primary w-full xs:w-auto"
                >
                  View selected work
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14m0 0l-6-6m6 6l-6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                </a>
              </Magnetic>
              <Magnetic strength={0.15}>
                <a
                  data-hero-cta
                  href={`mailto:${site.email}`}
                  className="opacity-0 btn-ghost w-full xs:w-auto"
                >
                  Get in touch
                </a>
              </Magnetic>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Abstract graphic (hidden on mobile) ── */}
          <div
            data-hero-graphic
            aria-hidden
            className="hidden lg:flex lg:col-span-5 xl:col-span-5 2xl:col-span-6
                       opacity-0 items-center justify-center
                       py-10 xl:py-16"
          >
            <HeroGraphic />
          </div>

        </div>
      </div>
    </section>
  );
}