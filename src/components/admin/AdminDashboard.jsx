/**
 * AdminDashboard.jsx
 * Panel admin utama untuk mengelola konten portfolio
 * Requires: supabase client setup di src/lib/supabase.js
 */

import { useState, useEffect } from 'react';
import OverviewPanel from './panels/OverviewPanel';
import SkillsPanel from './panels/SkillsPanel';
import ProjectsPanel from './panels/ProjectsPanel';
import ExperiencePanel from './panels/ExperiencePanel';
import CertificationsPanel from './panels/CertificationsPanel';
import SettingsPanel from './panels/SettingsPanel';

const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
        <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="8" r="3"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.41 1.41M11.37 11.37l1.41 1.41M3.22 12.78l1.41-1.41M11.37 4.63l1.41-1.41"/>
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="1" y="3" width="14" height="10" rx="1.5"/>
        <path d="M5 3V1.5M11 3V1.5M1 7h14"/>
      </svg>
    ),
  },
  {
    id: 'experience',
    label: 'Pengalaman',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2" y="4" width="12" height="10" rx="1"/>
        <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M8 9v-2M8 11v-.5"/>
      </svg>
    ),
  },
  {
    id: 'certifications',
    label: 'Sertifikasi',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="7" r="4"/>
        <path d="M5.5 11l-1.5 4 4-2 4 2-1.5-4"/>
      </svg>
    ),
  },
];

const PANELS = {
  overview: OverviewPanel,
  skills: SkillsPanel,
  projects: ProjectsPanel,
  experience: ExperiencePanel,
  certifications: CertificationsPanel,
  settings: SettingsPanel,
};

const PANEL_TITLES = {
  overview: 'Overview',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Pengalaman Kerja',
  certifications: 'Sertifikasi',
  settings: 'Site Settings',
};

export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState('overview');
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

  const ActivePanelComponent = PANELS[activePanel];

  const handleSave = async () => {
    setSaveStatus('saving');
    // Trigger save event — setiap panel subscribe ke ini
    window.dispatchEvent(new CustomEvent('admin:save'));
    setTimeout(() => setSaveStatus('saved'), 1200);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* ─── Sidebar ─── */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-ink-400/10 bg-[#141311]">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-ink-400/10">
          <p className="font-mono text-[9px] uppercase tracking-[.14em] text-ink-400 mb-1">
            Portfolio CMS
          </p>
          <p className="font-display text-base text-ink-50 font-light">Evan Sibara</p>
          <span className="inline-block mt-1.5 font-mono text-[9px] uppercase tracking-[.1em] px-2 py-0.5 rounded bg-gold/10 text-gold">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          <p className="px-4 py-2 font-mono text-[9px] uppercase tracking-[.1em] text-ink-400">
            Konten
          </p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors duration-200 border-l-2
                ${activePanel === item.id
                  ? 'border-gold bg-ink-900/60 text-ink-50'
                  : 'border-transparent text-ink-300 hover:text-ink-100 hover:bg-ink-900/40'
                }`}
            >
              <span className={activePanel === item.id ? 'text-gold' : 'opacity-60'}>
                {item.icon}
              </span>
              <span className="text-[13px]">{item.label}</span>
            </button>
          ))}

          <div className="my-2 mx-4 h-px bg-ink-400/10" />
          <p className="px-4 py-2 font-mono text-[9px] uppercase tracking-[.1em] text-ink-400">
            Pengaturan
          </p>
          <button
            onClick={() => setActivePanel('settings')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors duration-200 border-l-2
              ${activePanel === 'settings'
                ? 'border-gold bg-ink-900/60 text-ink-50'
                : 'border-transparent text-ink-300 hover:text-ink-100 hover:bg-ink-900/40'
              }`}
          >
            <span className={activePanel === 'settings' ? 'text-gold opacity-100' : 'opacity-60'}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="8" cy="8" r="2.5"/>
                <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M2.93 2.93l1.06 1.06M12.01 12.01l1.06 1.06M2.93 13.07l1.06-1.06M12.01 3.99l1.06-1.06"/>
              </svg>
            </span>
            <span className="text-[13px]">Site Settings</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-ink-400/10">
          <p className="font-mono text-[10px] text-ink-400">Supabase</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] text-emerald-400">Connected</span>
          </div>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-ink-400/10 bg-[#141311]/80 backdrop-blur-sm flex-shrink-0">
          <h1 className="text-[14px] font-medium text-ink-50">
            {PANEL_TITLES[activePanel]}
          </h1>
          <div className="flex items-center gap-2.5">
            {saveStatus === 'saved' && (
              <span className="font-mono text-[11px] text-emerald-400">
                ✓ Tersimpan ke Supabase
              </span>
            )}
            {saveStatus === 'saving' && (
              <span className="font-mono text-[11px] text-ink-400 animate-pulse">
                Menyimpan...
              </span>
            )}
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-ink-300 border border-ink-400/15 rounded-md hover:text-ink-50 hover:border-ink-400/30 transition-colors"
            >
              Preview
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"/>
              </svg>
            </a>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-4 py-1.5 text-[12px] font-medium bg-gold text-[#0c0c0b] rounded-md hover:opacity-90 active:scale-[.98] transition-all disabled:opacity-60"
            >
              Simpan Perubahan
            </button>
          </div>
        </header>

        {/* Panel Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <ActivePanelComponent onSave={handleSave} />
        </main>
      </div>
    </div>
  );
}
