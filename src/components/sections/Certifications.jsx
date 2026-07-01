/**
 * Certifications.jsx — Section sertifikasi di halaman portfolio utama
 * Membaca data dari Supabase (tabel: certifications)
 *
 * Fitur baru:
 * - Klik kartu → buka modal lightbox untuk review sertifikat/lisensi
 * - Modal menampilkan gambar full size, info lengkap, ID kredensial, dan tombol verifikasi
 * - Keyboard support: Escape untuk tutup, arrow kiri/kanan untuk navigasi antar sertifikat
 * - Animasi smooth open/close
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import anime from 'animejs';
import { useInView } from '@hooks/useInView';
import { supabase } from '@lib/supabase';
import GlassSurface from '@components/GlassSurface';
import { lockScroll, unlockScroll } from '@lib/scrollLock';

/* ── Lightbox Modal ── */
function CertLightbox({ cert, allCerts, onClose, onNav }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const currentIdx = allCerts.findIndex((c) => c.id === cert.id);

  // Animasi masuk
  useEffect(() => {
    if (!overlayRef.current || !cardRef.current) return;
    anime({
      targets: overlayRef.current,
      opacity: [0, 1],
      duration: 280,
      easing: 'easeOutQuad',
    });
    anime({
      targets: cardRef.current,
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.96, 1],
      duration: 420,
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  }, [cert.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIdx > 0) onNav(allCerts[currentIdx - 1]);
      if (e.key === 'ArrowRight' && currentIdx < allCerts.length - 1) onNav(allCerts[currentIdx + 1]);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIdx, allCerts, onClose, onNav]);

  // Lock scroll — pakai shared ref-counted lock supaya aman
  // walau ada modal lain yang kebetulan aktif berdekatan waktu.
  useEffect(() => {
    lockScroll();
    return () => unlockScroll();
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: 'rgba(8, 7, 6, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        opacity: 0,
      }}
    >
      {/* Card Modal */}
      <div
        ref={cardRef}
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden rounded-2xl"
        style={{
          background: 'rgba(20,19,17,0.97)',
          border: '1px solid rgba(201,169,97,0.15)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,169,97,0.05)',
          opacity: 0,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-ink-400 hover:text-ink-50 transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          aria-label="Tutup"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M1 1l12 12M13 1L1 13"/>
          </svg>
        </button>

        {/* Left — Image */}
        <div className="w-full md:w-[52%] flex-shrink-0 relative bg-[#0c0c0b]" style={{ minHeight: '220px' }}>
          {cert.image_url ? (
            <>
              <img
                src={cert.image_url}
                alt={cert.name}
                className="w-full h-full object-contain"
                style={{ maxHeight: '480px' }}
              />
              {/* subtle vignette */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to right, transparent 60%, rgba(20,19,17,0.4) 100%)' }} />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-8"
              style={{ minHeight: '260px' }}>
              <div className="text-6xl opacity-40">🏅</div>
              <p className="font-mono text-[10px] uppercase tracking-[.25em] text-ink-400">No Preview</p>
            </div>
          )}

          {/* Navigation arrows */}
          {currentIdx > 0 && (
            <button
              onClick={() => onNav(allCerts[currentIdx - 1])}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full text-ink-300 hover:text-ink-50 transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
              aria-label="Sebelumnya"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 1L3 7l6 6"/>
              </svg>
            </button>
          )}
          {currentIdx < allCerts.length - 1 && (
            <button
              onClick={() => onNav(allCerts[currentIdx + 1])}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full text-ink-300 hover:text-ink-50 transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
              aria-label="Berikutnya"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 1l6 6-6 6"/>
              </svg>
            </button>
          )}
        </div>

        {/* Right — Detail */}
        <div className="flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto">
          {/* Issuer badge */}
          <div className="mb-5">
            <span
              className="inline-block font-mono text-[9px] uppercase tracking-[.2em] px-3 py-1 rounded-full"
              style={{
                background: 'rgba(201,169,97,0.08)',
                border: '1px solid rgba(201,169,97,0.2)',
                color: 'rgba(201,169,97,0.9)',
              }}
            >
              {cert.issuer}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-display text-2xl sm:text-3xl font-light leading-tight tracking-tight text-ink-50 mb-2">
            {cert.name}
          </h2>

          {/* Year */}
          <p className="font-mono text-[11px] text-ink-400 mb-6">{cert.year}</p>

          {/* Divider */}
          <div className="h-px mb-6" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Meta info */}
          <div className="space-y-4 flex-1">
            {cert.credential_id && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.15em] text-ink-400 mb-1.5">
                  ID Kredensial
                </p>
                <p
                  className="font-mono text-[12px] text-ink-200 px-3 py-2 rounded-lg break-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {cert.credential_id}
                </p>
              </div>
            )}

            {cert.issuer && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.15em] text-ink-400 mb-1.5">
                  Diterbitkan Oleh
                </p>
                <p className="text-[13px] text-ink-200">{cert.issuer}</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 space-y-2.5">
            {cert.verify_url ? (
              <a
                href={cert.verify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl font-mono text-[11px] uppercase tracking-[.15em] transition-all duration-300 hover:opacity-90 active:scale-[.98]"
                style={{
                  background: 'rgba(201,169,97,1)',
                  color: '#0c0c0b',
                }}
              >
                Verifikasi Sertifikat
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"/>
                </svg>
              </a>
            ) : (
              <div
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-[11px] uppercase tracking-[.15em] text-ink-400"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="6" cy="6" r="5"/>
                  <path d="M6 4v2M6 8h.01"/>
                </svg>
                Tidak ada link verifikasi
              </div>
            )}

            {/* Counter */}
            <p className="text-center font-mono text-[10px] text-ink-400 pt-1">
              {currentIdx + 1} / {allCerts.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CertCard ── */
function CertCard({ cert, idx, hovered, onHover, onClick }) {
  const isHovered = hovered === cert.id;
  const anyHovered = hovered !== null;

  return (
    <div
      data-cert
      onMouseEnter={onHover}
      onClick={onClick}
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

        {/* Hover overlay — "Lihat Detail" */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'rgba(8,7,6,0.55)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-[.15em] text-ink-50"
            style={{ background: 'rgba(201,169,97,0.15)', border: '1px solid rgba(201,169,97,0.3)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="5" cy="5" r="3.5"/>
              <path d="M8 8l2.5 2.5"/>
            </svg>
            Lihat Detail
          </div>
        </div>

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
        <h3
          className={`font-display text-lg sm:text-xl font-light tracking-tight leading-snug mb-1 transition-colors duration-500
            ${isHovered ? 'text-ink-50' : 'text-ink-100'}`}
        >
          {cert.name}
        </h3>

        <div className="flex items-center justify-between gap-3 mt-2">
          <span className="font-mono text-[11px] text-ink-400">{cert.year}</span>

          <span
            className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[.1em] transition-all duration-500
              ${isHovered ? 'text-gold' : 'text-ink-400'}`}
          >
            {cert.verify_url ? 'Terverifikasi' : cert.credential_id ? `ID: ${cert.credential_id.slice(0, 8)}…` : 'Review →'}
          </span>
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

/* ── Main Section ── */
export default function Certifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [activeCert, setActiveCert] = useState(null);
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

  const handleNav = useCallback((cert) => {
    setActiveCert(cert);
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <>
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
                Credential dan sertifikat yang telah saya raih dalam perjalanan belajar dan berkarir.{' '}
                <span className="text-ink-400 text-sm">Klik kartu untuk melihat detail.</span>
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
                onClick={() => setActiveCert(cert)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {activeCert && (
        <CertLightbox
          cert={activeCert}
          allCerts={items}
          onClose={() => setActiveCert(null)}
          onNav={handleNav}
        />
      )}
    </>
  );
}