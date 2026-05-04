/**
 * Experience.jsx — Section pengalaman kerja di halaman portfolio utama
 * Membaca data dari Supabase (tabel: experience)
 * 
 * Tambahkan ke App.jsx / PortfolioPage:
 * import Experience from './components/sections/Experience';
 * <Experience /> — letakkan setelah <Projects />
 */

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { useInView } from '@hooks/useInView';
import { supabase } from '@lib/supabase';

export default function Experience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionRef, inView] = useInView({ threshold: 0.1 });
  const headerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    supabase
      .from('experience')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  // Animate header on enter
  useEffect(() => {
    if (!inView || !headerRef.current) return;
    anime({
      targets: headerRef.current.querySelectorAll('[data-el]'),
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 1200,
      delay: anime.stagger(110),
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  }, [inView]);

  // Animate list items
  useEffect(() => {
    if (!inView || !listRef.current || loading) return;
    anime({
      targets: listRef.current.querySelectorAll('[data-item]'),
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1000,
      delay: anime.stagger(90, { start: 300 }),
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  }, [inView, loading]);

  if (!loading && items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-20 sm:py-28 md:py-36"
    >
      <div className="container-custom">
        {/* Header */}
        <div ref={headerRef} className="mb-12 sm:mb-16 md:mb-24">
          <p
            data-el
            className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-ink-400 mb-6 sm:mb-8 opacity-0 flex items-center gap-3 sm:gap-4"
          >
            <span className="w-8 sm:w-10 h-px bg-gold/60" />
            Pengalaman — {String(items.length).padStart(2, '0')}
          </p>

          <h2
            data-el
            className="font-display font-light text-[clamp(2.25rem,7vw,4.5rem)] leading-[0.95] tracking-tightest opacity-0 text-ink-50"
          >
            Perjalanan
            <br />
            <span className="italic text-ink-200">karir saya.</span>
          </h2>
        </div>

        {/* Experience list */}
        <div ref={listRef} className="relative">
          {/* Vertical timeline line */}
          <div
            aria-hidden
            className="absolute left-0 top-0 bottom-0 w-px bg-ink-400/10 hidden md:block"
            style={{ left: '11px' }}
          />

          <div className="space-y-0">
            {items.map((item, idx) => (
              <ExperienceItem
                key={item.id}
                item={item}
                idx={idx}
                isLast={idx === items.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({ item, idx, isLast }) {
  const [expanded, setExpanded] = useState(idx === 0);

  return (
    <div
      data-item
      className="opacity-0 relative md:pl-10"
    >
      {/* Timeline dot */}
      <div
        aria-hidden
        className={`absolute left-0 top-6 w-[23px] h-[23px] rounded-full border hidden md:flex items-center justify-center flex-shrink-0 transition-colors duration-500
          ${expanded ? 'border-gold/60 bg-gold/10' : 'border-ink-400/20 bg-[#141311]'}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${expanded ? 'bg-gold' : 'bg-ink-400/40'}`} />
      </div>

      {/* Card */}
      <div
        className={`border-t border-ink-400/10 py-8 md:py-10 cursor-pointer group transition-all duration-500
          ${isLast ? '' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            {/* Role + current badge */}
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`font-display text-xl sm:text-2xl md:text-3xl font-light tracking-tight transition-colors duration-500
                ${expanded ? 'text-ink-50' : 'text-ink-200 group-hover:text-ink-50'}`}>
                {item.role}
              </h3>
              {item.is_current && (
                <span className="flex-shrink-0 font-mono text-[9px] uppercase tracking-[.15em] px-2 py-0.5 rounded-full border border-emerald-400/30 text-emerald-400 bg-emerald-400/8">
                  Sekarang
                </span>
              )}
            </div>

            {/* Company + location */}
            <p className="font-mono text-[11px] sm:text-[12px] text-ink-400 tracking-[.05em]">
              {item.company}
              {item.location && (
                <span className="text-ink-400/60"> · {item.location}</span>
              )}
            </p>
          </div>

          {/* Period + chevron */}
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="font-mono text-[11px] text-ink-400 hidden sm:block">
              {item.start_date} – {item.is_current ? 'Sekarang' : item.end_date}
            </span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"
              className={`text-ink-400 transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>

        {/* Period on mobile */}
        <p className="font-mono text-[10px] text-ink-400 mt-1 sm:hidden">
          {item.start_date} – {item.is_current ? 'Sekarang' : item.end_date}
        </p>

        {/* Expandable content */}
        <div
          className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${expanded ? 'max-h-[400px] opacity-100 mt-5' : 'max-h-0 opacity-0'}`}
        >
          {item.description && (
            <p className="text-sm sm:text-base text-ink-300 leading-[1.75] font-light max-w-[680px] mb-4">
              {item.description}
            </p>
          )}

          {item.tech?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tech.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] uppercase tracking-[.15em] text-ink-400 border border-ink-400/15 px-2.5 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
