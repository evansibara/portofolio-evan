import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import Reveal from '@components/animations/Reveal';
import Magnetic from '@components/ui/Magnetic';
import GlassSurface from '@components/GlassSurface';
import { useInView } from '@hooks/useInView';
import { projects, categories } from '@data/projects';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [hovered, setHovered] = useState(null);
  const listRef = useRef(null);
  const previewRef = useRef(null);
  const [sectionRef, inView] = useInView({ threshold: 0.1 });

  const filtered =
    filter === 'All'
      ? projects
      : projects.filter((p) => p.category === filter);

  // Stagger on filter change
  useEffect(() => {
    if (!listRef.current) return;
    anime({
      targets: listRef.current.querySelectorAll('[data-project-row]'),
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1000,
      delay: anime.stagger(70),
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  }, [filter]);

  // Section header enter
  const headerRef = useRef(null);
  useEffect(() => {
    if (!inView || !headerRef.current) return;
    anime({
      targets: headerRef.current.querySelectorAll('[data-section-el]'),
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 1200,
      delay: anime.stagger(110),
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  }, [inView]);

  // Cursor-following preview card (desktop with hover only)
  useEffect(() => {
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (!supportsHover) return;

    const onMove = (e) => {
      if (!previewRef.current) return;
      const offsetX = 24;
      const offsetY = 24;
      anime({
        targets: previewRef.current,
        translateX: e.clientX + offsetX,
        translateY: e.clientY + offsetY,
        duration: 600,
        easing: 'cubicBezier(0.22, 1, 0.36, 1)',
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const hoveredProject = filtered.find((p) => p.id === hovered);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative py-20 sm:py-28 md:py-36 lg:py-44"
    >
      {/* Floating preview follows cursor on hover (desktop only) */}
      <div
        ref={previewRef}
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-40 hidden md:block transition-opacity duration-500 ease-refined ${
          hoveredProject ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div
          className="w-[260px] h-[170px] lg:w-[280px] lg:h-[180px] rounded-xl overflow-hidden border border-ink-400/15"
          style={{
            background:
              'linear-gradient(135deg, rgba(201,169,97,0.12) 0%, rgba(20,19,17,0.85) 60%)',
            backdropFilter: 'blur(20px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(245,243,239,0.08)',
            transform: 'rotate(-3deg)',
          }}
        >
          <div className="h-full w-full flex flex-col justify-end p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-2">
              {hoveredProject?.category}
            </p>
            <h4 className="font-display text-xl text-ink-50 font-light tracking-tight leading-tight">
              {hoveredProject?.title}
            </h4>
            <p className="font-mono text-[10px] text-ink-300 mt-1">
              {hoveredProject?.year}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom">
        {/* Section header */}
        <div ref={headerRef} className="mb-12 sm:mb-16 md:mb-24 lg:mb-28">
          <p
            data-section-el
            className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-ink-400 mb-6 sm:mb-8 opacity-0 flex items-center gap-3 sm:gap-4"
          >
            <span className="w-8 sm:w-10 h-px bg-gold/60" />
            Selected Work — {String(projects.length).padStart(2, '0')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-10 items-end">
            <h2
              data-section-el
              className="md:col-span-8 font-display font-light
                         text-[clamp(2.25rem,7vw,4.5rem)] md:text-7xl
                         leading-[0.95] tracking-tightest opacity-0 text-ink-50"
            >
              A selection of
              <br />
              <span className="italic text-ink-200">recent engagements.</span>
            </h2>

            <div data-section-el className="md:col-span-4 opacity-0">
              <p className="text-ink-300 text-sm sm:text-base md:text-lg leading-[1.7] font-light">
                A considered list of projects where I led development end-to-end
                — from architecture to deployment.
              </p>
            </div>
          </div>
        </div>

        {/* Filter chip — horizontally scrollable on mobile */}
        <div data-section-el className="mb-10 sm:mb-14 md:mb-16 opacity-0 -mx-5 sm:mx-0 overflow-x-auto sm:overflow-visible">
          <div className="px-5 sm:px-0 inline-block sm:block">
            <GlassSurface
              radius="9999px"
              blur={10}
              saturation={1.3}
              brightness={1.05}
              displace={0.5}
              tint="rgba(20, 19, 17, 0.38)"
              borderOpacity={0.08}
              className="inline-block whitespace-nowrap"
            >
              <div className="flex items-center gap-x-4 sm:gap-x-5 gap-y-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3">
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-ink-400 mr-1">
                  Filter
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] transition-colors duration-500 ease-refined whitespace-nowrap ${
                      filter === cat
                        ? 'text-gold'
                        : 'text-ink-300 hover:text-ink-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </GlassSurface>
          </div>
        </div>

        {/* Project list */}
        <div
          ref={listRef}
          className="relative"
          onMouseLeave={() => setHovered(null)}
        >
          {filtered.map((project, idx) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={idx}
              onHover={() => setHovered(project.id)}
              isHovered={hovered === project.id}
              anyHovered={hovered !== null}
            />
          ))}

          {filtered.length === 0 && (
            <p className="py-20 text-center font-mono text-ink-400 text-sm">
              No projects in this category yet.
            </p>
          )}
        </div>

        {/* Bottom link */}
        <Reveal delay={200}>
          <div className="mt-16 sm:mt-20 md:mt-24 pt-8 sm:pt-10 border-t border-ink-400/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-6">
            <p className="text-ink-300 text-sm sm:text-base md:text-lg font-light">
              A complete archive lives on{' '}
              <span className="text-ink-50">GitHub.</span>
            </p>
            <Magnetic strength={0.15}>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                View all on GitHub
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17L17 7M17 7H8M17 7V16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * ProjectRow — editorial row. Subtle gold underline + arrow on hover.
 * REVISI RESPONSIF:
 * - Mobile pakai layout flex column agar tidak ada overlap/overflow.
 * - Desktop tetap grid 12 kolom seperti sebelumnya.
 * - Tech stack tampil sebagai baris bawah di mobile (bukan di-hide total).
 */
function ProjectRow({ project, index, onHover, isHovered, anyHovered }) {
  return (
    <a
      href={project.links.live || project.links.github}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onHover}
      data-project-row
      data-cursor="hover"
      className={`group relative block border-t border-ink-400/10 py-7 sm:py-9 md:py-12 transition-opacity duration-700 ease-refined ${
        anyHovered && !isHovered ? 'opacity-40' : 'opacity-100'
      } ${index === 0 ? 'border-t-0' : ''}`}
    >
      {/* Mobile layout (< md) — stacked */}
      <div className="md:hidden">
        <div className="flex items-start justify-between gap-4 mb-3">
          <span className="font-mono text-[9px] tracking-[0.2em] text-ink-400 pt-2">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="text-right">
            <div className="font-mono text-[9px] text-ink-400 uppercase tracking-[0.2em]">
              {project.category}
            </div>
            <div className="font-mono text-base text-ink-200 mt-0.5 font-light">
              {project.year}
            </div>
          </div>
        </div>

        <h3 className="font-display text-[clamp(1.75rem,7vw,2.5rem)] font-light tracking-tightest leading-[1.05] text-ink-50 transition-colors duration-500 group-hover:text-gold mb-3">
          {project.title}
        </h3>

        <p className="text-ink-300 text-sm leading-[1.6] font-light mb-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Desktop layout (>= md) — grid */}
      <div className="hidden md:grid grid-cols-12 items-center gap-4 md:gap-8">
        {/* Index */}
        <span className="md:col-span-1 font-mono text-[10px] tracking-[0.2em] text-ink-400">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Title */}
        <div className="md:col-span-5">
          <h3 className="font-display text-4xl lg:text-5xl font-light tracking-tightest leading-[1.05] text-ink-50 transition-colors duration-500 group-hover:text-gold">
            {project.title}
          </h3>
          <p className="mt-3 text-ink-300 text-sm max-w-xl leading-[1.7] font-light">
            {project.description}
          </p>
        </div>

        {/* Tech stack */}
        <div className="md:col-span-4 flex flex-wrap gap-x-3 gap-y-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Year + category + arrow */}
        <div className="md:col-span-2 text-right flex items-center justify-end gap-4">
          <div>
            <div className="font-mono text-[10px] text-ink-400 uppercase tracking-[0.2em]">
              {project.category}
            </div>
            <div className="font-mono text-xl lg:text-2xl text-ink-200 mt-1 font-light">
              {project.year}
            </div>
          </div>
          <span
            className={`inline-block text-gold transition-all duration-700 ease-refined ${
              isHovered
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-2'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 17L17 7M17 7H8M17 7V16"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="square"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Hover underline — gold hairline */}
      <span
        className={`absolute left-0 right-0 bottom-0 h-px bg-gold/70 origin-left transition-transform duration-700 ease-refined ${
          isHovered ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </a>
  );
}