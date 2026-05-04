/**
 * Certifications.jsx — Section sertifikasi di halaman portfolio utama
 * Membaca data dari Supabase (tabel: certifications)
 * 
 * Tambahkan ke App.jsx / PortfolioPage:
 * import Certifications from './components/sections/Certifications';
 * <Certifications /> — letakkan setelah <Experience />
 */

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { useInView } from '@hooks/useInView';
import { supabase } from '@lib/supabase';
import GlassSurface from '@components/GlassSurface';

export default function Certifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [sectionRef, inView] = useInView({ threshold: 0.1 });
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    supabase
      .from('certifications')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

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

  useEffect(() => {
    if (!inView || !gridRef.current || loading) return;
    anime({
      targets: gridRef.current.querySelectorAll('[data-cert]'),
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.97, 1],
      duration: 1100,
      delay: anime.stagger(80, { start: 200 }),
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  }, [inView, loading]);

  if (!loading && items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="certifications"
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
            Sertifikasi — {String(items.length).padStart(2, '0')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <h2
              data-el
              className="md:col-span-8 font-display font-light text-[clamp(2.25rem,7vw,4.5rem)] leading-[0.95] tracking-tightest opacity-0 text-ink-50"
            >
              Lisensi &
              <br />
              <span className="italic text-ink-200">sertifikasi.</span>
            </h2>
            <p
              data-el
              className="md:col-span-4 text-ink-300 text-sm sm:text-base leading-[1.7] font-light opacity-0"
            >
              Credential dan sertifikat yang telah saya raih dalam perjalanan belajar dan berkarir.
            </p>
          </div>
        </div>

        {/* Grid sertifikasi */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          onMouseLeave={() => setHovered(null)}
        >
          {items.map((cert, idx) => (
            <CertCard
              key={cert.id}
              cert={cert}
              idx={idx}
              hovered={hovered}
              onHover={() => setHovered(cert.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CertCard({ cert, idx, hovered, onHover }) {
  const isHovered = hovered === cert.id;
  const anyHovered = hovered !== null;

  return (
    <div
      data-cert
      onMouseEnter={onHover}
      className={`opacity-0 group relative rounded-xl overflow-hidden border transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer
        ${isHovered
          ? 'border-gold/30 shadow-[0_0_40px_rgba(201,169,97,0.08)]'
          : anyHovered
            ? 'border-ink-400/8 opacity-50'
            : 'border-ink-400/12 hover:border-ink-400/25'}`}
      style={{ background: 'rgba(20,19,17,0.6)', backdropFilter: 'blur(12px)' }}
    >
      {/* Image area */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '60%' }}>
        {cert.image_url ? (
          <>
            <img
              src={cert.image_url}
              alt={cert.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141311] via-[#141311]/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 50% 60%, rgba(201,169,97,0.06) 0%, transparent 70%)',
              }}
            />
            <div className="relative text-center">
              <div className="text-5xl mb-2 opacity-60">🏅</div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-ink-400">No Image</p>
            </div>
          </div>
        )}

        {/* Issuer badge — top right */}
        <div className="absolute top-3 right-3">
          <GlassSurface
            radius="999px"
            blur={8}
            saturation={1.2}
            brightness={1}
            displace={0.3}
            tint="rgba(12, 12, 11, 0.5)"
            borderOpacity={0.1}
            className="inline-block"
          >
            <span className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.15em] text-ink-300">
              {cert.issuer}
            </span>
          </GlassSurface>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className={`font-display text-lg sm:text-xl font-light tracking-tight leading-snug mb-1 transition-colors duration-500
          ${isHovered ? 'text-ink-50' : 'text-ink-100'}`}>
          {cert.name}
        </h3>

        <div className="flex items-center justify-between gap-3 mt-2">
          <span className="font-mono text-[11px] text-ink-400">{cert.year}</span>

          {cert.verify_url ? (
            <a
              href={cert.verify_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[.1em] transition-all duration-500
                ${isHovered ? 'text-gold' : 'text-ink-400 hover:text-ink-100'}`}
            >
              Verifikasi
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"/>
              </svg>
            </a>
          ) : cert.credential_id ? (
            <span className="font-mono text-[10px] text-ink-400/60 truncate max-w-[120px]">
              ID: {cert.credential_id}
            </span>
          ) : null}
        </div>
      </div>

      {/* Gold hairline bottom on hover */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gold/60 origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}
      />
    </div>
  );
}
