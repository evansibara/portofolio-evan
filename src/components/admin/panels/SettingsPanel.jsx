/**
 * SettingsPanel.jsx — Site settings, profil, dan toggle section
 */
import { useState, useEffect } from 'react';
import { settingsService } from '@lib/supabase';
import { SectionHeader, AdminCard, FormGroup, Input, Toggle, BtnPrimary } from '../AdminUI';

const DEFAULTS = {
  name: 'Evan Sibara', role: 'Fullstack Developer',
  tagline: 'Building fast, thoughtful software for the web.',
  email: '', location: 'Indonesia',
  github_url: '', linkedin_url: '', instagram_url: '',
  show_skills: true, show_projects: true, show_experience: true,
  show_certifications: true, maintenance_mode: false,
};

export default function SettingsPanel() {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.get()
      .then(data => setForm({ ...DEFAULTS, ...data }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await settingsService.update(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { alert('Gagal: ' + e.message); }
    finally { setSaving(false); }
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (loading) return <div className="py-16 text-center font-mono text-[12px] text-ink-400">Memuat pengaturan...</div>;

  return (
    <>
      <SectionHeader title="Site Settings" desc="Atur informasi profil, social links, dan visibilitas section" />

      <AdminCard title="Profil">
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Nama"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama Kamu"/></FormGroup>
          <FormGroup label="Role / Jabatan"><Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="Fullstack Developer"/></FormGroup>
        </div>
        <FormGroup label="Tagline">
          <Input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Building fast, thoughtful software..."/>
        </FormGroup>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <FormGroup label="Email"><Input type="email" value={form.email} onChange={e => set('email', e.target.value)}/></FormGroup>
          <FormGroup label="Lokasi"><Input value={form.location} onChange={e => set('location', e.target.value)}/></FormGroup>
        </div>
      </AdminCard>

      <AdminCard title="Social Links">
        <div className="space-y-3">
          <FormGroup label="GitHub URL"><Input type="url" value={form.github_url} onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/..."/></FormGroup>
          <FormGroup label="LinkedIn URL"><Input type="url" value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..."/></FormGroup>
          <FormGroup label="Instagram URL"><Input type="url" value={form.instagram_url} onChange={e => set('instagram_url', e.target.value)} placeholder="https://instagram.com/..."/></FormGroup>
        </div>
      </AdminCard>

      <AdminCard title="Tampilan Section">
        <div className="space-y-4">
          <Toggle checked={form.show_skills} onChange={v => set('show_skills', v)} label="Tampilkan section Skills"/>
          <Toggle checked={form.show_projects} onChange={v => set('show_projects', v)} label="Tampilkan section Projects"/>
          <Toggle checked={form.show_experience} onChange={v => set('show_experience', v)} label="Tampilkan section Pengalaman"/>
          <Toggle checked={form.show_certifications} onChange={v => set('show_certifications', v)} label="Tampilkan section Sertifikasi"/>
          <div className="pt-3 border-t border-ink-400/10">
            <Toggle checked={form.maintenance_mode} onChange={v => set('maintenance_mode', v)} label="Mode Maintenance (sembunyikan semua konten)"/>
          </div>
        </div>
      </AdminCard>

      <div className="flex items-center justify-between pt-2">
        {saved && <span className="font-mono text-[12px] text-emerald-400">✓ Pengaturan tersimpan</span>}
        <div className="ml-auto">
          <BtnPrimary onClick={handleSave} loading={saving}>Simpan Pengaturan</BtnPrimary>
        </div>
      </div>
    </>
  );
}
