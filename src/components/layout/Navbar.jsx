import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import Magnetic from '@components/ui/Magnetic';
import GlassSurface from '@components/GlassSurface';
import StaggeredMenu from '@components/StaggeredMenu';
import { navLinks, socialLinks, site } from '@data/site';

/**
 * Navbar — HYBRID responsive:
 *
 * - Desktop (≥ 768px / md): classic floating pill navbar.
 *   Logo kiri, nav links (Work, About, Contact) di tengah, tombol "Let's talk"
 *   di kanan. TIDAK pakai tombol Menu/Close — semua langsung terlihat.
 *
 * - Mobile & Tablet kecil (< 768px): pakai StaggeredMenu (React Bits)
 *   dengan hamburger toggle, panel slide-in, dan animasi stagger.
 *
 * Detection pakai window.matchMedia agar rendering adaptif sejak mount
 * (tidak flicker). Listener resize untuk handle orientation change /
 * resize window di dev tools.
 */
export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 768px)').matches;
  });

  // Listen for viewport width changes
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => setIsDesktop(e.matches);
    // addEventListener is the modern method; fallback for older Safari
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
    } else {
      mql.addListener(onChange);
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', onChange);
      } else {
        mql.removeListener(onChange);
      }
    };
  }, []);

  // Scroll tracker — shared by both variants
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mount fade-in animation — hanya untuk desktop variant
  useEffect(() => {
    if (!isDesktop || !navRef.current) return;

    anime({
      targets: navRef.current.querySelectorAll('[data-nav-item]'),
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 1100,
      delay: anime.stagger(70, { start: 300 }),
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });

    anime({
      targets: navRef.current.querySelector('[data-nav-shell]'),
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 1200,
      delay: 200,
      easing: 'cubicBezier(0.22, 1, 0.36, 1)',
    });
  }, [isDesktop]);

  // ───────────────────────────────────────────────────────────
  //  MOBILE / TABLET — StaggeredMenu
  // ───────────────────────────────────────────────────────────
  if (!isDesktop) {
    const menuItems = navLinks.map((link) => ({
      label: link.label,
      link: link.href,
      ariaLabel: `Go to ${link.label}`,
    }));

    const menuSocials = socialLinks.map((s) => ({
      label: s.label,
      link: s.href,
      icon: s.icon,
    }));

    const logoNode = (
      <a href="#top" className="sm-logo">
        {site.name}
        <span className="sm-logo-gold">—</span>
      </a>
    );

    return (
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-50">
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={menuSocials}
          displaySocials={true}
          displayItemNumbering={true}
          logoNode={logoNode}
          menuButtonColor={scrolled ? '#c9a961' : '#f5f3ef'}
          openMenuButtonColor="#f5f3ef"
          changeMenuColorOnOpen={true}
          accentColor="#c9a961"
          colors={['#1a1714', '#2a231c']}
          closeOnClickAway={true}
          scrolled={scrolled}
        />
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────
  //  DESKTOP — classic floating pill navbar
  // ───────────────────────────────────────────────────────────
  return (
    <div
      ref={navRef}
      className="fixed top-6 inset-x-12 lg:inset-x-20 z-50 pointer-events-none"
    >
      <div
        data-nav-shell
        className="opacity-0 pointer-events-auto mx-auto max-w-[1400px] transition-all duration-700 ease-refined"
      >
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={9999}
          brightness={scrolled ? 58 : 50}
          opacity={0.92}
          blur={scrolled ? 14 : 11}
          backgroundOpacity={scrolled ? 0.22 : 0.14}
          saturation={scrolled ? 1.4 : 1.2}
          displace={scrolled ? 1.5 : 1}
          distortionScale={-160}
          redOffset={0}
          greenOffset={8}
          blueOffset={18}
          mixBlendMode="difference"
          className="transition-all duration-700 ease-refined"
          style={{ width: '100%', height: 'auto' }}
        >
          <div className="flex items-center justify-between w-full px-8 py-3.5">
            {/* Logo / name */}
            <a
              href="#top"
              data-nav-item
              className="font-display text-lg font-normal tracking-tight opacity-0 transition-colors duration-500 hover:text-gold text-ink-50"
            >
              {site.name}
              <span className="text-gold ml-0.5">—</span>
            </a>

            {/* Nav links — center */}
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href} data-nav-item className="opacity-0">
                  <Magnetic strength={0.12}>
                    <a
                      href={link.href}
                      className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-200 hover:text-gold transition-colors duration-500"
                    >
                      {link.label}
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>

            {/* CTA — right */}
            <div data-nav-item className="opacity-0">
              <Magnetic strength={0.2}>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-ink-400/25 text-ink-100 font-mono text-[10px] uppercase tracking-[0.25em] hover:border-gold hover:text-gold transition-colors duration-500"
                >
                  Let's talk
                </a>
              </Magnetic>
            </div>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}