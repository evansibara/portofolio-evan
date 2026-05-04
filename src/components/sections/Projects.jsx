import { useEffect, useRef, useState, useCallback } from 'react';
import anime from 'animejs';
import Reveal from '@components/animations/Reveal';
import Magnetic from '@components/ui/Magnetic';
import GlassSurface from '@components/GlassSurface';
import { useInView } from '@hooks/useInView';
import { useProjects } from '@hooks/usePortfolioData';

/* ─────────────────────────────────────────────
   PROJECT DETAIL MODAL
───────────────────────────────────────────── */
function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const tech = project?.tech || [];

  // Animate in
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';

    anime({
      targets: overlayRef.current,
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutQuad',
    });
    anime({
      targets: cardRef.current,
      opacity: [0, 1],
      translateY: [32, 0],
      scale: [0.97, 1],
      duration: 500,
      delay: 60,
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });

    return () => { document.body.style.overflow = ''; };
  }, [project]);

  const handleClose = useCallback(() => {
    anime({
      targets: cardRef.current,
      opacity: [1, 0],
      translateY: [0, 20],
      scale: [1, 0.97],
      duration: 280,
      easing: 'easeInQuad',
    });
    anime({
      targets: overlayRef.current,
      opacity: [1, 0],
      duration: 300,
      easing: 'easeInQuad',
      complete: onClose,
    });
  }, [onClose]);

  // Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  if (!project) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
      style={{
        background: 'rgba(12,12,11,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        opacity: 0,
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'rgba(20,19,17,0.96)',
          border: '1px solid rgba(245,243,239,0.08)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(245,243,239,0.06)',
          opacity: 0,
        }}
      >
        {/* ── Close button ── */}
        <button
          onClick={handleClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/8"
          style={{ border: '1px solid rgba(245,243,239,0.1)', color: 'rgb(140 133 120)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1L13 13M13 1L1 13"/>
          </svg>
        </button>

        {/* ── Hero image ── */}
        <div className="relative w-full overflow-hidden rounded-t-2xl" style={{ paddingBottom: '52%' }}>
          {project.image_url ? (
            <>
              <img
                src={project.image_url}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, transparent 40%, rgba(20,19,17,0.95) 100%)',
                }}
              />
            </>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(201,169,97,0.07) 0%, rgba(20,19,17,0.9) 70%)',
              }}
            >
              <span
                className="font-display font-light tracking-tightest"
                style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: 'rgba(201,169,97,0.15)' }}
              >
                {project.title?.[0]}
              </span>
            </div>
          )}

          {/* Category + year badge over image */}
          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            {project.category && (
              <span
                className="font-mono text-[9px] uppercase tracking-[0.25em] px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(201,169,97,0.12)',
                  border: '1px solid rgba(201,169,97,0.25)',
                  color: 'rgb(201 169 97)',
                }}
              >
                {project.category}
              </span>
            )}
            {project.year && (
              <span
                className="font-mono text-[9px] text-ink-400 px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(245,243,239,0.05)',
                  border: '1px solid rgba(245,243,239,0.08)',
                }}
              >
                {project.year}
              </span>
            )}
            {project.featured && (
              <span
                className="font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(62,207,142,0.1)',
                  border: '1px solid rgba(62,207,142,0.2)',
                  color: 'rgb(62 207 142)',
                }}
              >
                Featured
              </span>
            )}
          </div>
        </div>

        {/* ── Content body ── */}
        <div className="px-6 sm:px-8 pt-6 pb-8">
          {/* Title */}
          <h2
            className="font-display font-light tracking-tightest leading-[1.05] text-ink-50 mb-3"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}
          >
            {project.title}
          </h2>

          {/* Description */}
          {project.description && (
            <p className="text-ink-300 text-sm sm:text-base leading-[1.8] font-light mb-6">
              {project.description}
            </p>
          )}

          {/* Tech stack */}
          {tech.length > 0 && (
            <div className="mb-7">
              <p
                className="font-mono text-[9px] uppercase tracking-[0.3em] mb-3"
                style={{ color: 'rgb(140 133 120)' }}
              >
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {tech.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(245,243,239,0.04)',
                      border: '1px solid rgba(245,243,239,0.1)',
                      color: 'rgb(175 168 156)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(245,243,239,0.06)', marginBottom: '1.5rem' }} />

          {/* CTA Links */}
          <div className="flex flex-wrap gap-3">
            {project.link_live && (
              <a
                href={project.link_live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] px-5 py-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(201,169,97,0.12)',
                  border: '1px solid rgba(201,169,97,0.3)',
                  color: 'rgb(201 169 97)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201,169,97,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(201,169,97,0.12)';
                }}
              >
                Lihat Live
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"/>
                </svg>
              </a>
            )}
            {project.link_github && (
              <a
                href={project.link_github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] px-5 py-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(245,243,239,0.04)',
                  border: '1px solid rgba(245,243,239,0.1)',
                  color: 'rgb(175 168 156)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245,243,239,0.08)';
                  e.currentTarget.style.color = 'rgb(245 243 239)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(245,243,239,0.04)';
                  e.currentTarget.style.color = 'rgb(175 168 156)';
                }}
              >
                GitHub
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROJECTS SECTION
───────────────────────────────────────────── */
export default function Projects() {
  const { projects, categories, loading } = useProjects();
  const [filter, setFilter] = useState('All');
  const [hovered, setHovered] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
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
  }, [filter, projects]);

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

  // Cursor-following preview card (desktop only)
  useEffect(() => {
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (!supportsHover) return;
    const onMove = (e) => {
      if (!previewRef.current) return;
      anime({
        targets: previewRef.current,
        translateX: e.clientX + 24,
        translateY: e.clientY + 24,
        duration: 600,
        easing: 'cubicBezier(0.22, 1, 0.36, 1)',
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const hoveredProject = filtered.find((p) => p.id === hovered);

  return (
    <>
      <section ref={sectionRef} id="work" className="relative py-20 sm:py-28 md:py-36 lg:py-44">
        {/* Floating preview */}
        <div
          ref={previewRef}
          aria-hidden
          className={`pointer-events-none fixed top-0 left-0 z-40 hidden md:block transition-opacity duration-500 ease-refined
            ${hoveredProject ? 'opacity-100' : 'opacity-0'}`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div
            className="w-[260px] h-[170px] lg:w-[280px] lg:h-[180px] rounded-xl overflow-hidden border border-ink-400/15"
            style={{
              background: 'linear-gradient(135deg, rgba(201,169,97,0.12) 0%, rgba(20,19,17,0.85) 60%)',
              backdropFilter: 'blur(20px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(245,243,239,0.08)',
              transform: 'rotate(-3deg)',
            }}
          >
            {hoveredProject?.image_url ? (
              <div className="relative h-full">
                <img
                  src={hoveredProject.image_url}
                  alt=""
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-1">
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
            ) : (
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
            )}
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
                className="md:col-span-8 font-display font-light text-[clamp(2.25rem,7vw,4.5rem)] md:text-7xl leading-[0.95] tracking-tightest opacity-0 text-ink-50"
              >
                A selection of
                <br />
                <span className="italic text-ink-200">recent engagements.</span>
              </h2>
              <div data-section-el className="md:col-span-4 opacity-0">
                <p className="text-ink-300 text-sm sm:text-base md:text-lg leading-[1.7] font-light">
                  A considered list of projects where I led development end-to-end — from architecture to deployment.
                </p>
              </div>
            </div>
          </div>

          {/* Filter chips */}
          {!loading && (
            <div data-section-el className="mb-10 sm:mb-14 md:mb-16 opacity-0 -mx-5 sm:mx-0 overflow-x-auto sm:overflow-visible">
              <div className="px-5 sm:px-0 inline-block sm:block">
                <GlassSurface
                  radius="9999px" blur={10} saturation={1.3} brightness={1.05}
                  displace={0.5} tint="rgba(20, 19, 17, 0.38)" borderOpacity={0.08}
                  className="inline-block whitespace-nowrap"
                >
                  <div className="flex items-center gap-x-4 sm:gap-x-5 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3">
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-ink-400 mr-1">
                      Filter
                    </span>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] transition-colors duration-500 whitespace-nowrap
                          ${filter === cat ? 'text-gold' : 'text-ink-300 hover:text-ink-50'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </GlassSurface>
              </div>
            </div>
          )}

          {/* Project list */}
          {loading ? (
            <div className="py-24 text-center font-mono text-[12px] text-ink-400 animate-pulse">
              Memuat projects...
            </div>
          ) : (
            <div ref={listRef} className="relative" onMouseLeave={() => setHovered(null)}>
              {filtered.map((project, idx) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={idx}
                  onHover={() => setHovered(project.id)}
                  onOpen={() => setSelectedProject(project)}
                  isHovered={hovered === project.id}
                  anyHovered={hovered !== null}
                />
              ))}
              {filtered.length === 0 && (
                <p className="py-20 text-center font-mono text-ink-400 text-sm">
                  Belum ada project di kategori ini.
                </p>
              )}
            </div>
          )}

          {/* Bottom link */}
          <Reveal delay={200}>
            <div className="mt-16 sm:mt-20 md:mt-24 pt-8 sm:pt-10 border-t border-ink-400/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-6">
              <p className="text-ink-300 text-sm sm:text-base md:text-lg font-light">
                A complete archive lives on <span className="text-ink-50">GitHub.</span>
              </p>
              <Magnetic strength={0.15}>
                <a
                  href="https://github.com/evansibara"
                  target="_blank" rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  View all on GitHub
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                  </svg>
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   PROJECT ROW
   — Diubah dari <a href> menjadi <button/div>
   — onClick membuka modal, bukan link langsung
───────────────────────────────────────────── */
function ProjectRow({ project, index, onHover, onOpen, isHovered, anyHovered }) {
  const tech = project.tech || [];
  const hasLink = project.link_live || project.link_github;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(); }}
      onMouseEnter={onHover}
      data-project-row
      className={`group relative block border-t border-ink-400/10 py-7 sm:py-9 md:py-12 cursor-pointer select-none transition-opacity duration-700 ease-refined
        ${anyHovered && !isHovered ? 'opacity-40' : 'opacity-100'}
        ${index === 0 ? 'border-t-0' : ''}`}
    >
      {/* Mobile layout */}
      <div className="md:hidden">
        <div className="flex items-start justify-between gap-4 mb-3">
          <span className="font-mono text-[9px] tracking-[0.2em] text-ink-400 pt-2">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="text-right">
            <div className="font-mono text-[9px] text-ink-400 uppercase tracking-[0.2em]">{project.category}</div>
            <div className="font-mono text-base text-ink-200 mt-0.5 font-light">{project.year}</div>
          </div>
        </div>
        <h3 className="font-display text-[clamp(1.75rem,7vw,2.5rem)] font-light tracking-tightest leading-[1.05] text-ink-50 transition-colors duration-500 group-hover:text-gold mb-3">
          {project.title}
        </h3>
        <p className="text-ink-300 text-sm leading-[1.6] font-light mb-3">{project.description}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {tech.slice(0, 4).map((t) => (
            <span key={t} className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-400">{t}</span>
          ))}
        </div>
        {/* Mobile: tap hint */}
        <div className="flex items-center gap-1.5 mt-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold/60">Tap untuk detail</span>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-12 items-center gap-4 md:gap-8">
        <span className="md:col-span-1 font-mono text-[10px] tracking-[0.2em] text-ink-400">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="md:col-span-5">
          <h3 className="font-display text-4xl lg:text-5xl font-light tracking-tightest leading-[1.05] text-ink-50 transition-colors duration-500 group-hover:text-gold">
            {project.title}
          </h3>
          <p className="mt-3 text-ink-300 text-sm max-w-xl leading-[1.7] font-light line-clamp-2">{project.description}</p>
        </div>
        <div className="md:col-span-4 flex flex-wrap gap-x-3 gap-y-1.5">
          {tech.slice(0, 4).map((t) => (
            <span key={t} className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">{t}</span>
          ))}
        </div>
        <div className="md:col-span-2 text-right flex items-center justify-end gap-4">
          <div>
            <div className="font-mono text-[10px] text-ink-400 uppercase tracking-[0.2em]">{project.category}</div>
            <div className="font-mono text-xl lg:text-2xl text-ink-200 mt-1 font-light">{project.year}</div>
          </div>
          {/* Arrow icon — shows on hover */}
          <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-500 ease-refined text-gold flex-shrink-0
            ${isHovered ? 'opacity-100 translate-x-0 border-gold/30 bg-gold/8' : 'opacity-0 -translate-x-2 border-transparent'}`}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </span>
        </div>
      </div>

      {/* Hover underline */}
      <span className={`absolute left-0 right-0 bottom-0 h-px bg-gold/70 origin-left transition-transform duration-700 ease-refined ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}/>
    </div>
  );
}