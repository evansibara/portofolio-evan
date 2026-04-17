import { useEffect, useRef } from 'react';
import anime from 'animejs';
import Reveal from '@components/animations/Reveal';
import Magnetic from '@components/ui/Magnetic';
import { useInView } from '@hooks/useInView';
import { site, socialLinks } from '@data/site';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

// ── Icon mapping: sama dengan StaggeredMenu ──
const ICON_MAP = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  gmail: SiGmail,
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [ref, inView] = useInView({ threshold: 0.25 });
  const emailRef = useRef(null);

  // Subtle pulse on the email arrow once it's in view
  useEffect(() => {
    if (!inView || !emailRef.current) return;
    const arrow = emailRef.current.querySelector('[data-email-arrow]');
    if (!arrow) return;
    anime({
      targets: arrow,
      translateX: [0, 6, 0],
      translateY: [0, -6, 0],
      duration: 2200,
      easing: 'easeInOutSine',
      loop: true,
      delay: 800,
    });
  }, [inView]);

  return (
    <footer
      id="contact"
      ref={ref}
      className="relative border-t border-ink-400/10 mt-24 sm:mt-32 md:mt-40"
    >
      <div className="container-custom py-16 sm:py-20 md:py-28 lg:py-32">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            {/* Large tagline */}
            <div className="md:col-span-7">
              <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-ink-400 mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                <span className="w-8 sm:w-10 h-px bg-gold/60" />
                Correspondence
              </p>
              <h2
                className="font-display font-light leading-[0.95] tracking-tightest text-ink-50
                           text-[clamp(2.5rem,9vw,5rem)] md:text-7xl"
              >
                Have a project
                <br />
                <span className="italic text-ink-200">in mind?</span>
              </h2>
              <Magnetic strength={0.15}>
                <a
                  ref={emailRef}
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-3 mt-8 sm:mt-10 md:mt-12
                             text-sm sm:text-base md:text-lg lg:text-xl
                             font-mono text-ink-100 border-b border-ink-400/30 pb-2
                             hover:border-gold hover:text-gold transition-colors duration-500 ease-refined
                             break-all sm:break-normal"
                >
                  {site.email}
                  <span data-email-arrow className="inline-flex flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 17L17 7M17 7H8M17 7V16"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                </a>
              </Magnetic>
            </div>

            {/* Social links — sekarang pakai icon dari react-icons */}
            <div className="md:col-span-4 md:col-start-9 md:pl-12 md:border-l border-ink-400/10">
              <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-ink-400 mb-6 sm:mb-8">
                Elsewhere
              </p>
              <ul className="space-y-1">
                {socialLinks.map((s, i) => {
                  const IconComponent = s.icon ? ICON_MAP[s.icon.toLowerCase()] : null;
                  const isMail = s.href?.startsWith('mailto:');
                  return (
                    <li key={s.handle}>
                      <Magnetic strength={0.1}>
                        <a
                          href={s.href}
                          target={isMail ? undefined : '_blank'}
                          rel={isMail ? undefined : 'noopener noreferrer'}
                          className="group flex items-center justify-between py-3 text-ink-100 hover:text-gold transition-colors duration-500 ease-refined border-b border-ink-400/10"
                        >
                          <span className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <span className="font-mono text-[9px] sm:text-[10px] text-ink-400 group-hover:text-gold transition-colors duration-500 flex-shrink-0">
                              / {String(i + 1).padStart(2, '0')}
                            </span>

                            {/* Icon — react-icons */}
                            {IconComponent && (
                              <span className="text-ink-300 group-hover:text-gold transition-colors duration-500 flex-shrink-0 inline-flex items-center">
                                <IconComponent size={18} />
                              </span>
                            )}

                            <span className="text-sm sm:text-base font-light truncate">
                              {s.label}
                            </span>
                          </span>
                          <span className="text-ink-400 group-hover:text-gold transition-colors duration-500 flex-shrink-0 ml-3">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M7 17L17 7M17 7H8M17 7V16"
                                stroke="currentColor"
                                strokeWidth="1.25"
                                strokeLinecap="square"
                              />
                            </svg>
                          </span>
                        </a>
                      </Magnetic>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="hairline my-10 sm:my-12 md:my-16" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-ink-400">
          <p>
            © {year} — {site.name}. All rights reserved.
          </p>
          <p>
            {site.location} · Available for select engagements
          </p>
        </div>
      </div>
    </footer>
  );
}