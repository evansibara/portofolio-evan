/**
 * AdminRoute.jsx — Protected route wrapper dengan Supabase Auth
 * 
 * Cara pakai di App.jsx:
 * 
 * import AdminRoute from './components/admin/AdminRoute';
 * import AdminDashboard from './components/admin/AdminDashboard';
 * 
 * // Tambah ke router / App.jsx:
 * // Route /admin akan redirect ke /admin/login jika belum login
 * 
 * <AdminRoute>
 *   <AdminDashboard />
 * </AdminRoute>
 */

import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabase';

export default function AdminRoute({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cek session aktif
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Subscribe ke perubahan auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, sess) => {
      setSession(sess);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } catch (err) {
      setError('Login gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // Loading state
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="font-mono text-[12px] text-ink-400 animate-pulse">Memeriksa sesi...</div>
      </div>
    );
  }

  // Not logged in — show login form
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="w-full max-w-[360px]">
          {/* Logo area */}
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-ink-400 mb-2">Portfolio CMS</p>
            <h1 className="font-display text-2xl font-light text-ink-50">Admin Login</h1>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-[#141311] border border-ink-400/10 rounded-xl p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full px-3 py-2.5 text-[13px] text-ink-100 bg-[#0c0c0b] border border-ink-400/20 rounded-lg outline-none focus:border-gold/60 transition-colors placeholder:text-ink-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-[13px] text-ink-100 bg-[#0c0c0b] border border-ink-400/20 rounded-lg outline-none focus:border-gold/60 transition-colors placeholder:text-ink-400"
              />
            </div>

            {error && (
              <p className="text-[12px] text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-[13px] font-medium bg-gold text-[#0c0c0b] rounded-lg hover:opacity-90 active:scale-[.98] transition-all disabled:opacity-60 mt-2"
            >
              {loading ? 'Masuk...' : 'Masuk ke Admin'}
            </button>
          </form>

          <p className="text-center text-[11px] text-ink-400 mt-4">
            Buat akun di Supabase Authentication →{' '}
            <a
              href="https://app.supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              Dashboard
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Logged in — render admin panel dengan logout button
  return (
    <div className="relative">
      {children}
      {/* Logout — kecil, di pojok kanan atas */}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 z-50 font-mono text-[10px] uppercase tracking-[.1em] text-ink-400 border border-ink-400/15 px-3 py-1.5 rounded-full hover:text-ink-100 hover:border-ink-400/30 transition-colors bg-[#0c0c0b]"
      >
        Logout
      </button>
    </div>
  );
}
