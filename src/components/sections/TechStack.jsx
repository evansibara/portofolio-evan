import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import LogoLoop from '@components/LogoLoop';
import { useInView } from '@hooks/useInView';
import {
  SiReact,
  SiSupabase,
  SiPostman,
  SiFlutter,
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
} from 'react-icons/si';

const techLogos = [
  { node: <SiReact color="#61DAFB" />, title: 'React', href: 'https://react.dev' },
  { node: <SiSupabase color="#3ECF8E" />, title: 'Supabase', href: 'https://supabase.com' },
  { node: <SiPostman color="#FF6C37" />, title: 'Postman', href: 'https://www.postman.com' },
  { node: <SiFlutter color="#02569B" />, title: 'Flutter', href: 'https://flutter.dev' },
  { node: <SiTypescript color="#3178C6" />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss color="#06B6D4" />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { node: <SiNextdotjs color="#ffffff" />, title: 'Next.js', href: 'https://nextjs.org' },
];

export default function TechStack() {
  const [sectionRef, inView] = useInView({ threshold: 0.2 });
  const contentRef = useRef(null);

  // Responsive logo config — adapts to viewport width
  const [logoConfig, setLogoConfig] = useState({
    logoHeight: 42,
    gap: 72,
    height: 88,
  });

  useEffect(() => {
    const computeConfig = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setLogoConfig({ logoHeight: 28, gap: 40, height: 64 });
      } else if (w < 768) {
        setLogoConfig({ logoHeight: 32, gap: 48, height: 72 });
      } else if (w < 1024) {
        setLogoConfig({ logoHeight: 38, gap: 60, height: 80 });
      } else {
        setLogoConfig({ logoHeight: 42, gap: 72, height: 88 });
      }
    };
    computeConfig();
    window.addEventListener('resize', computeConfig);
    return () => window.removeEventListener('resize', computeConfig);
  }, []);

  useEffect(() => {
    if (!inView || !contentRef.current) return;
    anime({
      targets: contentRef.current.querySelectorAll('[data-tech-el]'),
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1100,
      delay: anime.stagger(120),
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="relative py-8 sm:py-10 md:py-12 overflow-hidden"
    >
      <div ref={contentRef}>
        {/* Header — tetap di dalam container agar align dengan konten lain */}
        <div className="container-custom mb-5 sm:mb-6 md:mb-8">
          <p
            data-tech-el
            className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-ink-400 flex items-center gap-3 sm:gap-4 opacity-0"
          >
            <span className="w-8 sm:w-10 h-px bg-gold/60" />
            Tech Stack
          </p>
          <h2
            data-tech-el
            className="mt-2 text-lg sm:text-xl md:text-2xl font-display font-light text-ink-50 tracking-tight opacity-0"
          >
            Tools I work <span className="italic text-ink-100">with</span>
          </h2>
        </div>

        {/* LogoLoop — full-bleed, membentang dari ujung kiri ke ujung kanan viewport */}
        <div data-tech-el className="opacity-0 w-full">
          <div
            className="relative w-full"
            style={{ height: `${logoConfig.height}px`, overflow: 'hidden' }}
          >
            <LogoLoop
              logos={techLogos}
              speed={80}
              direction="left"
              logoHeight={logoConfig.logoHeight}
              gap={logoConfig.gap}
              scaleOnHover
              fadeOut
              fadeOutColor="transparent"
              pauseOnHover
              ariaLabel="My technology stack"
              style={{ color: '#e5e5e5', width: '100%' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}