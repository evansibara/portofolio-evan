/**
 * CertificationsPanel.jsx — CRUD untuk sertifikasi dengan upload gambar
 */
import { useState, useEffect } from 'react';
import { certificationsService, storageService } from '@lib/supabase';
import {
  SectionHeader, AdminCard, Modal, FormGroup, Input, ImageUpload,
  BtnPrimary, BtnGhost, ConfirmDelete,
} from '../AdminUI';

const EMPTY_FORM = { name: '', issuer: '', year: String(new Date().getFullYear()), credential_id: '', verify_url: '', image_url: '' };

export default function CertificationsPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { const d = await certificationsService.getAll(); setItems(d); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function openAdd() { setForm(EMPTY_FORM); setImageFile(null); setEditingId(null); setModalOpen(true); }
  function openEdit(item) {
    setForm({ name: item.name, issuer: item.issuer, year: item.year, credential_id: item.credential_id||'', verify_url: item.verify_url||'', image_url: item.image_url||'' });
    setImageFile(item.image_url ? { previewUrl: item.image_url } : null);
    setEditingId(item.id); setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.issuer.trim()) return;
    setSaving(true);
    try {
      let image_url = form.image_url;
      if (imageFile?.file) image_url = await storageService.uploadImage(imageFile.file, 'certifications');
      else if (!imageFile) image_url = '';

      const payload = { ...form, image_url };
      if (editingId) {
        const u = await certificationsService.update(editingId, payload);
        setItems(prev => prev.map(i => i.id === editingId ? u : i));
      } else {
        const c = await certificationsService.create(payload);
        setItems(prev => [...prev, c]);
      }
      setModalOpen(false);
    } catch (e) { alert('Gagal: '+e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    try { await certificationsService.delete(id); setItems(prev => prev.filter(i => i.id !== id)); }
    catch (e) { console.error(e); }
  }

  return (
    <>
      <SectionHeader title="Sertifikasi" desc="Kelola sertifikat dan badge profesional dengan gambar" />
      <AdminCard title="Daftar Sertifikasi" count={items.length}
        action={<button onClick={openAdd} className="text-[12px] text-gold border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold/10 transition-colors">+ Tambah Sertifikasi</button>}
      >
        {loading ? <div className="py-8 text-center font-mono text-[12px] text-ink-400">Memuat...</div> : (
          <div className="grid grid-cols-2 gap-3">
            {items.map(cert => (
              <div key={cert.id} className="bg-[#0c0c0b] border border-ink-400/10 rounded-xl overflow-hidden hover:border-ink-400/20 transition-colors group">
                {/* Image area */}
                <div className="relative w-full h-28 overflow-hidden bg-ink-400/5">
                  {cert.image_url ? (
                    <img src={cert.image_url} alt={cert.name} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl mb-1">🏅</div>
                        <span className="font-mono text-[10px] text-ink-400">No image</span>
                      </div>
                    </div>
                  )}
                  {/* Hover overlay actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => openEdit(cert)} className="text-[12px] text-white border border-white/30 px-3 py-1.5 rounded-md backdrop-blur-sm hover:bg-white/10 transition-colors">Edit</button>
                    <button onClick={() => setDeleteTarget(cert)} className="text-[12px] text-red-300 border border-red-400/40 px-3 py-1.5 rounded-md backdrop-blur-sm hover:bg-red-400/10 transition-colors">Hapus</button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <div className="text-[13px] font-medium text-ink-50 truncate">{cert.name}</div>
                  <div className="text-[11px] text-ink-400 mt-0.5">{cert.issuer}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-[10px] text-ink-400">{cert.year}</span>
                    {cert.verify_url && (
                      <a href={cert.verify_url} target="_blank" rel="noopener noreferrer"
                        className="font-mono text-[10px] text-gold hover:underline">Verifikasi →</a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="col-span-2 py-8 text-center font-mono text-[12px] text-ink-400">Belum ada sertifikasi.</div>}
          </div>
        )}
      </AdminCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Sertifikasi' : 'Tambah Sertifikasi'}
        footer={<><BtnGhost onClick={() => setModalOpen(false)}>Batal</BtnGhost><BtnPrimary onClick={handleSave} loading={saving}>Simpan</BtnPrimary></>}
      >
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Nama Sertifikat"><Input value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="AWS Solutions Architect"/></FormGroup>
          <FormGroup label="Penerbit"><Input value={form.issuer} onChange={e => setForm({...form,issuer:e.target.value})} placeholder="Amazon Web Services"/></FormGroup>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Tahun Terbit"><Input type="number" value={form.year} onChange={e => setForm({...form,year:e.target.value})} min="2010" max="2030"/></FormGroup>
          <FormGroup label="ID Kredensial" hint="Opsional"><Input value={form.credential_id} onChange={e => setForm({...form,credential_id:e.target.value})} placeholder="ABC-123-XYZ"/></FormGroup>
        </div>
        <FormGroup label="URL Verifikasi" hint="Opsional">
          <Input type="url" value={form.verify_url} onChange={e => setForm({...form,verify_url:e.target.value})} placeholder="https://verify.example.com/..."/>
        </FormGroup>
        <FormGroup label="Gambar Sertifikat / Badge">
          <ImageUpload value={imageFile} onChange={setImageFile} label="Upload gambar sertifikat atau badge" hint="PNG, JPG, WebP · maks 5MB" folder="certifications"/>
        </FormGroup>
      </Modal>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget?.id)} itemName={deleteTarget?.name}/>
    </>
  );
}
