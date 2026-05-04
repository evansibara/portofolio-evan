/**
 * ExperiencePanel.jsx — CRUD untuk pengalaman kerja
 */
import { useState, useEffect } from 'react';
import { experienceService } from '@lib/supabase';
import {
  SectionHeader, AdminCard, Modal, FormGroup, Input, Textarea,
  TagInput, BtnPrimary, BtnGhost, Toggle, ConfirmDelete,
} from '../AdminUI';

const EMPTY_FORM = { role: '', company: '', location: '', start_date: '', end_date: '', is_current: false, description: '', tech: [] };

export function ExperiencePanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { const d = await experienceService.getAll(); setItems(d); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function openAdd() { setForm(EMPTY_FORM); setEditingId(null); setModalOpen(true); }
  function openEdit(item) {
    setForm({ role: item.role, company: item.company, location: item.location||'', start_date: item.start_date, end_date: item.end_date||'', is_current: item.is_current, description: item.description||'', tech: item.tech||[] });
    setEditingId(item.id); setModalOpen(true);
  }

  async function handleSave() {
    if (!form.role.trim() || !form.company.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        const u = await experienceService.update(editingId, form);
        setItems(prev => prev.map(i => i.id === editingId ? u : i));
      } else {
        const c = await experienceService.create(form);
        setItems(prev => [...prev, c]);
      }
      setModalOpen(false);
    } catch (e) { alert('Gagal: '+e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    try { await experienceService.delete(id); setItems(prev => prev.filter(i => i.id !== id)); }
    catch (e) { console.error(e); }
  }

  return (
    <>
      <SectionHeader title="Pengalaman Kerja" desc="Kelola riwayat pekerjaan dan posisi profesional" />
      <AdminCard title="Riwayat Pekerjaan" count={items.length}
        action={<button onClick={openAdd} className="text-[12px] text-gold border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold/10 transition-colors">+ Tambah Pengalaman</button>}
      >
        {loading ? <div className="py-8 text-center font-mono text-[12px] text-ink-400">Memuat...</div> : (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="p-4 bg-[#0c0c0b] border border-ink-400/10 rounded-lg hover:border-ink-400/20 transition-colors group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium text-ink-50">{item.role}</span>
                      {item.is_current && <span className="font-mono text-[9px] uppercase tracking-[.1em] px-1.5 py-0.5 bg-emerald-400/10 text-emerald-400 rounded">Sekarang</span>}
                    </div>
                    <p className="text-[12px] text-ink-400 mt-0.5">{item.company}{item.location && ` · ${item.location}`}</p>
                    <p className="font-mono text-[10px] text-ink-400 mt-1">{item.start_date} – {item.is_current ? 'Sekarang' : item.end_date}</p>
                    {item.description && <p className="text-[12px] text-ink-300 mt-2 leading-relaxed">{item.description}</p>}
                    {item.tech?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.tech.map(t => <span key={t} className="font-mono text-[10px] text-ink-400 bg-ink-400/8 border border-ink-400/12 px-1.5 py-0.5 rounded">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => openEdit(item)} className="text-[11px] text-ink-300 border border-ink-400/20 px-2 py-1 rounded hover:text-ink-50 transition-colors">Edit</button>
                    <button onClick={() => setDeleteTarget(item)} className="text-[11px] text-red-400/60 border border-red-400/15 px-2 py-1 rounded hover:text-red-400 transition-colors">Hapus</button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="py-8 text-center font-mono text-[12px] text-ink-400">Belum ada data pengalaman kerja.</p>}
          </div>
        )}
      </AdminCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
        footer={<><BtnGhost onClick={() => setModalOpen(false)}>Batal</BtnGhost><BtnPrimary onClick={handleSave} loading={saving}>Simpan</BtnPrimary></>}
      >
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Posisi / Role"><Input value={form.role} onChange={e => setForm({...form,role:e.target.value})} placeholder="Frontend Developer"/></FormGroup>
          <FormGroup label="Nama Perusahaan"><Input value={form.company} onChange={e => setForm({...form,company:e.target.value})} placeholder="PT. Contoh Indonesia"/></FormGroup>
        </div>
        <FormGroup label="Lokasi"><Input value={form.location} onChange={e => setForm({...form,location:e.target.value})} placeholder="Jakarta / Remote"/></FormGroup>
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Mulai"><Input value={form.start_date} onChange={e => setForm({...form,start_date:e.target.value})} placeholder="Jan 2023"/></FormGroup>
          <FormGroup label="Selesai">
            <Input value={form.end_date} onChange={e => setForm({...form,end_date:e.target.value})} placeholder="Des 2023" disabled={form.is_current}/>
          </FormGroup>
        </div>
        <Toggle checked={form.is_current} onChange={v => setForm({...form,is_current:v,end_date:v?'':form.end_date})} label="Masih bekerja di sini (Sekarang)"/>
        <FormGroup label="Deskripsi Pekerjaan">
          <Textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Jelaskan tanggung jawab dan pencapaian..." style={{minHeight:'100px'}}/>
        </FormGroup>
        <FormGroup label="Tech Stack" hint="Tekan Enter untuk menambah">
          <TagInput tags={form.tech} onChange={tech => setForm({...form,tech})} placeholder="React, Node.js..."/>
        </FormGroup>
      </Modal>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget.id)} itemName={deleteTarget?.role}/>
    </>
  );
}

export default ExperiencePanel;
