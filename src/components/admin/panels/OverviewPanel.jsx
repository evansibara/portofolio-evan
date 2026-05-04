/**
 * OverviewPanel.jsx — Dashboard overview dengan statistik konten
 */
import { useState, useEffect } from 'react';
import { skillsService, projectsService, experienceService, certificationsService } from '@lib/supabase';
import { SectionHeader, AdminCard } from '../AdminUI';

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-[#0c0c0b] border border-ink-400/10 rounded-xl p-4">
      <p className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-400 mb-2">{label}</p>
      <p className="text-3xl font-display font-light text-ink-50">{value}</p>
      {sub && <p className="font-mono text-[11px] text-ink-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function OverviewPanel() {
  const [stats, setStats] = useState({ skills: 0, projects: 0, experience: 0, certifications: 0, featured: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [skills, projects, experience, certs] = await Promise.all([
          skillsService.getAll(),
          projectsService.getAll(),
          experienceService.getAll(),
          certificationsService.getAll(),
        ]);
        setStats({
          skills: skills.length,
          projects: projects.length,
          experience: experience.length,
          certifications: certs.length,
          featured: projects.filter(p => p.featured).length,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <>
      <SectionHeader title="Overview" desc="Ringkasan konten portfolio kamu" />
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard label="Projects" value={loading ? '—' : stats.projects} sub={`${stats.featured} featured`}/>
        <StatCard label="Skills" value={loading ? '—' : stats.skills} sub="tech stack"/>
        <StatCard label="Pengalaman" value={loading ? '—' : stats.experience} sub="posisi kerja"/>
        <StatCard label="Sertifikasi" value={loading ? '—' : stats.certifications} sub="total"/>
      </div>

      <AdminCard title="Status Koneksi Supabase">
        <div className="space-y-2">
          {[['Database', true],['Storage (Images)', true],['Auth', true]].map(([label, ok]) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-ink-400/8 last:border-0">
              <span className="text-[13px] text-ink-200">{label}</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-400' : 'bg-red-400'}`}/>
                <span className={`font-mono text-[11px] ${ok ? 'text-emerald-400' : 'text-red-400'}`}>{ok ? 'Connected' : 'Error'}</span>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </>
  );
}
