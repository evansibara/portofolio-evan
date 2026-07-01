import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import TechStack from './components/sections/TechStack';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Certifications from './components/sections/Certifications';
import GradualBlur from './components/GradualBlur';

// ── Lazy load komponen berat (Three.js / OGL) ──
// Ini mencegah library 3D di-bundle ke chunk utama
// sehingga First Contentful Paint jauh lebih cepat.
// Catatan: Lanyard (Rapier physics) sudah dihapus — scroll bug resolved.
const ColorBends = lazy(() => import('./components/ColorBends'));

// Admin components (lazy — hanya di-load saat buka /admin)
const AdminRoute = lazy(() => import('./components/admin/AdminRoute'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

/* ── Portfolio Page ── */
function PortfolioPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="relative">
      {!isMobile ? (
        // Lazy load ColorBends — Three.js shader, tidak perlu blocking render awal
        <Suspense fallback={null}>
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
        </Suspense>
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
        <Experience />
        <Certifications />
      </main>

      <Footer />

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

/* ── Root App dengan Router ── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Portfolio utama */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Admin dashboard — lazy load + dilindungi Supabase Auth */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-ink-400/20 border-t-ink-200 rounded-full animate-spin" />
              </div>
            }>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}