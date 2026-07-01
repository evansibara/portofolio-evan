import { useEffect, useRef, useState } from 'react';
import { navLinks, site } from '@data/site';

/**
 * Navbar — clean rewrite, no StaggeredMenu / GlassSurface / anime.
 * Desktop: floating pill, blur backdrop, CSS transitions.
 * Mobile: hamburger + slide-down drawer.
 * ponytail: zero external deps, ~100 lines, pure CSS
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);

  // Scroll tracker
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  // Close drawer on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      <style>{`
        .nb-root {
          position: fixed;
          top: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          width: calc(100% - 3rem);
          max-width: 900px;
          pointer-events: none;
        }
        .nb-pill {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          border: 1px solid rgba(201,169,97,0.18);
          background: rgba(20,18,16,0.72);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
          box-shadow: 0 4px 32px rgba(0,0,0,0.32);
        }
        .nb-pill[data-scrolled] {
          background: rgba(22,19,16,0.88);
          border-color: rgba(201,169,97,0.28);
          box-shadow: 0 8px 40px rgba(0,0,0,0.48);
        }
        .nb-logo {
          font-family: 'Fraunces', serif;
          font-size: 1.1rem;
          font-weight: 400;
          color: #f5f3ef;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: color 0.3s;
        }
        .nb-logo:hover { color: #c9a961; }
        .nb-logo-dash { color: #c9a961; }

        /* Desktop links */
        .nb-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nb-link {
          padding: 0.4rem 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.625rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a09880;
          text-decoration: none;
          border-radius: 9999px;
          transition: color 0.3s, background 0.3s;
        }
        .nb-link:hover { color: #c9a961; background: rgba(201,169,97,0.08); }

        /* CTA button */
        .nb-cta {
          padding: 0.4rem 1.1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.625rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #f5f3ef;
          text-decoration: none;
          border-radius: 9999px;
          border: 1px solid rgba(201,169,97,0.3);
          transition: color 0.3s, border-color 0.3s, background 0.3s;
        }
        .nb-cta:hover { color: #c9a961; border-color: #c9a961; background: rgba(201,169,97,0.08); }

        /* Hamburger — mobile only */
        .nb-burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 4px;
          background: none;
          border: none;
          pointer-events: auto;
        }
        .nb-burger span {
          display: block;
          width: 22px;
          height: 1.5px;
          background: #f5f3ef;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
          transform-origin: center;
        }
        .nb-burger[data-open] span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nb-burger[data-open] span:nth-child(2) { opacity: 0; }
        .nb-burger[data-open] span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* Mobile drawer */
        .nb-drawer {
          position: absolute;
          top: calc(100% + 0.75rem);
          left: 0; right: 0;
          background: rgba(20,18,16,0.96);
          border: 1px solid rgba(201,169,97,0.18);
          border-radius: 1.25rem;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s;
          pointer-events: none;
        }
        .nb-drawer[data-open] {
          max-height: 16rem;
          opacity: 1;
          pointer-events: auto;
        }
        .nb-drawer-link {
          display: block;
          padding: 0.75rem 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a09880;
          text-decoration: none;
          border-radius: 0.75rem;
          transition: color 0.2s, background 0.2s;
        }
        .nb-drawer-link:hover { color: #c9a961; background: rgba(201,169,97,0.08); }
        .nb-drawer-cta {
          display: block;
          padding: 0.75rem 1rem;
          margin-top: 0.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a961;
          text-decoration: none;
          border-radius: 0.75rem;
          border: 1px solid rgba(201,169,97,0.3);
          text-align: center;
          transition: background 0.2s, border-color 0.2s;
        }
        .nb-drawer-cta:hover { background: rgba(201,169,97,0.1); border-color: #c9a961; }

        @media (max-width: 767px) {
          .nb-links, .nb-cta { display: none; }
          .nb-burger { display: flex; }
          .nb-root { top: 1rem; width: calc(100% - 2rem); }
        }
      `}</style>

      <nav className="nb-root" aria-label="Main navigation">
        <div
          ref={drawerRef}
          className="nb-pill"
          data-scrolled={scrolled || undefined}
        >
          <a href="#top" className="nb-logo">
            {site.name}<span className="nb-logo-dash">—</span>
          </a>

          {/* Desktop nav */}
          <ul className="nb-links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="nb-link">{l.label}</a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${site.email}`} className="nb-cta">Let's talk</a>

          {/* Mobile hamburger */}
          <button
            className="nb-burger"
            data-open={open || undefined}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>

          {/* Mobile drawer */}
          <div className="nb-drawer" data-open={open || undefined} aria-hidden={!open}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="nb-drawer-link"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href={`mailto:${site.email}`}
              className="nb-drawer-cta"
              onClick={() => setOpen(false)}
            >
              Let's talk
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}