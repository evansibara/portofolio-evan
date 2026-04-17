import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import TechStack from './components/sections/TechStack';
import Projects from './components/sections/Projects';
import ColorBends from './components/ColorBends';
import GradualBlur from './components/GradualBlur';

export default function App() {
  // Detect mobile to conditionally render expensive WebGL effects.
  // Rationale: ColorBends (Three.js shader) dan GradualBlur (multi-layer backdrop-filter)
  // berat untuk GPU mobile low-end dan bikin lag scroll di HP.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="relative">
      {/* ── ColorBends Background — hanya render di tablet+.
            Di HP, pakai static gradient fallback yang ringan. ── */}
      {!isMobile ? (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 0.85,
          }}
        >
          <ColorBends
            colors={['#1a1714', '#2a231c', '#C9A961']}
            rotation={110}
            speed={0.14}
            scale={1.2}
            frequency={0.9}
            warpStrength={0.8}
            mouseInfluence={0.6}
            noise={0.12}
            parallax={0.4}
            iterations={1}
            intensity={1.1}
            bandWidth={8}
            transparent
          />
        </div>
      ) : (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(201,169,97,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(42,35,28,0.5) 0%, transparent 55%)',
          }}
        />
      )}

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <TechStack />
        <Projects />
      </main>

      <Footer />

      {/* ── GradualBlur BOTTOM — hanya di desktop/tablet.
            Di HP, multi-layer backdrop-filter bikin scroll lag. ── */}
      {!isMobile && (
        <GradualBlur
          target="page"
          position="bottom"
          height="6rem"
          strength={2.5}
          divCount={6}
          curve="bezier"
          exponential={true}
          opacity={1}
          zIndex={40}
        />
      )}
    </div>
  );
}