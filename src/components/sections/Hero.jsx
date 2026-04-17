import { useEffect, useRef } from 'react';
import anime from 'animejs';
import Magnetic from '@components/ui/Magnetic';
import Particles from '@components/Particles';
import { site } from '@data/site';
import Lanyard from '@components/Lanyard';

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
          targets: ctx.querySelectorAll('[data-hero-lanyard]'),
          opacity: [0, 1],
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

    // Subtle ambient parallax on the glow shape (desktop pointer only)
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
      {/* Particle field — React Bits OGL particles, sparse & calm */}
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

      {/* Ambient glow — smaller & repositioned on mobile */}
      <div
        data-hero-shape
        aria-hidden
        className="absolute top-1/2 right-[5%] -translate-y-1/2
                   w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px]
                   rounded-full bg-gold/[0.05] blur-[80px] sm:blur-[100px] md:blur-[120px]
                   pointer-events-none z-[2]"
      />

      {/* Lanyard (desktop only) — tinggi dikurangi agar tidak mendorong konten bawah */}
      <div
        data-hero-lanyard
        aria-hidden
        className="hidden md:block absolute top-[-40px] right-0 w-[900px] lg:w-[1080px] h-[72vh] opacity-0 pointer-events-auto z-20"
      >
        <Lanyard
          position={[0, 0, 13]}
          gravity={[0, -40, 0]}
          fov={18}
          cardScale={2.4}
          faceFocus={0.3}
          horizontalShift={0}
          textureFlipY={false}
          textureRotation={0}
          textureMirrorX={false}
        />
      </div>

      {/* Vertical rule */}
      <div
        aria-hidden
        className="absolute left-5 sm:left-6 md:left-12 lg:left-20 top-0 bottom-0 w-px bg-ink-400/10 pointer-events-none z-[3]"
      />

      {/* Content */}
      <div className="relative px-5 sm:px-6 md:px-12 lg:px-20 z-10">
        <div className="max-w-[720px]">
          <div className="mb-5 sm:mb-6 md:mb-8">
            <p
              data-hero-label
              className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-ink-400 opacity-0 flex items-center gap-3 sm:gap-4"
            >
              <span className="w-8 sm:w-10 h-px bg-gold/60" />
              Portfolio — MMXXVI
            </p>
          </div>

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
                style={{
                  paddingRight: '0.12em',
                  paddingLeft: '0.02em',
                  marginLeft: '-0.02em',
                }}
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

          <p
            data-hero-tagline
            className="text-sm sm:text-base md:text-lg text-ink-200 leading-[1.7] text-balance opacity-0 font-light max-w-[560px] mb-6 md:mb-8"
          >
            I'm <span className="text-ink-50">{site.name}</span>. {site.tagline}{' '}
            Shipping production applications with React, Node, and a considered
            approach to design and craft.
          </p>

          <div className="flex flex-col xs:flex-row sm:flex-row flex-wrap items-stretch xs:items-center sm:items-center gap-3 sm:gap-4">
            <Magnetic strength={0.15}>
              <a
                data-hero-cta
                href="#work"
                className="opacity-0 btn-primary w-full xs:w-auto sm:w-auto"
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
                className="opacity-0 btn-ghost w-full xs:w-auto sm:w-auto"
              >
                Get in touch
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}