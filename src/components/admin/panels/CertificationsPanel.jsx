/**
 * CertificationsPanel.jsx — CRUD untuk sertifikasi dengan upload gambar
 *
 * Fitur baru:
 * - Tombol "Preview" di setiap kartu → buka modal review sertifikat lengkap
 * - Modal preview menampilkan gambar full size + semua info + link verifikasi
 * - UI kartu diperbaiki: lebih informatif dan rapi
 */
import { useState, useEffect } from 'react';
import { certificationsService, storageService } from '@lib/supabase';
import {
  SectionHeader, AdminCard, Modal, FormGroup, Input, ImageUpload,
  BtnPrimary, BtnGhost, ConfirmDelete,
} from '../AdminUI';

const EMPTY_FORM = {
  name: '',
  issuer: '',
  year: String(new Date().getFullYear()),
  credential_id: '',
  verify_url: '',
  image_url: '',
};

/* ── Preview Modal ── */
function PreviewModal({ cert, onClose }) {
  if (!cert) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(8,7,6,0.9)', backdropFilter: 'blur(16px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: '#141311',
          border: '1px solid rgba(201,169,97,0.15)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[.2em] text-gold/70 mb-0.5">
              Preview Sertifikat
            </p>
            <h3 className="text-[15px] font-medium text-ink-50 truncate max-w-[400px]">
              {cert.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:text-ink-100 transition-colors flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {/* Image */}
          <div
            className="relative w-full flex items-center justify-center"
            style={{ background: '#0c0c0b', minHeight: '240px' }}
          >
            {cert.image_url ? (
              <img
                src={cert.image_url}
                alt={cert.name}
                className="w-full object-contain"
                style={{ maxHeight: '360px' }}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 py-16">
                <div className="text-5xl opacity-30">🏅</div>
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-ink-400">
                  Tidak ada gambar
                </p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6 space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.15em] text-ink-400 mb-1.5">
                  Nama Sertifikat
                </p>
                <p className="text-[14px] text-ink-100 font-medium">{cert.name}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.15em] text-ink-400 mb-1.5">
                  Penerbit
                </p>
                <p className="text-[14px] text-ink-100">{cert.issuer}</p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.15em] text-ink-400 mb-1.5">
                  Tahun
                </p>
                <p className="font-mono text-[13px] text-ink-200">{cert.year}</p>
              </div>
              {cert.credential_id && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.15em] text-ink-400 mb-1.5">
                    ID Kredensial
                  </p>
                  <p
                    className="font-mono text-[11px] text-ink-200 px-2.5 py-1.5 rounded-lg break-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    {cert.credential_id}
                  </p>
                </div>
              )}
            </div>

            {/* Verify URL */}
            {cert.verify_url ? (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.15em] text-ink-400 mb-1.5">
                  URL Verifikasi
                </p>
                <a
                  href={cert.verify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[12px] text-gold hover:underline break-all"
                >
                  {cert.verify_url}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
                    <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"/>
                  </svg>
                </a>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-400">
                  <circle cx="6" cy="6" r="5"/>
                  <path d="M6 4v2M6 8h.01"/>
                </svg>
                <p className="font-mono text-[11px] text-ink-400">Tidak ada URL verifikasi</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 flex items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="font-mono text-[10px] text-ink-400">
            {cert.verify_url ? '✓ Memiliki link verifikasi' : '— Tanpa link verifikasi'}
          </p>
          <div className="flex items-center gap-2">
            {cert.verify_url && (
              <a
                href={cert.verify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-[12px] font-medium rounded-lg transition-all hover:opacity-90"
                style={{ background: 'rgba(201,169,97,1)', color: '#0c0c0b' }}
              >
                Buka Verifikasi ↗
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-[12px] text-ink-300 border border-ink-400/20 rounded-lg hover:text-ink-50 hover:border-ink-400/40 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Panel ── */
export default function CertificationsPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewCert, setPreviewCert] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { const d = await certificationsService.getAll(); setItems(d); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setForm({
      name: item.name,
      issuer: item.issuer,
      year: item.year,
      credential_id: item.credential_id || '',
      verify_url: item.verify_url || '',
      image_url: item.image_url || '',
    });
    setImageFile(item.image_url ? { previewUrl: item.image_url } : null);
    setEditingId(item.id);
    setModalOpen(true);
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
    } catch (e) { alert('Gagal: ' + e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    try { await certificationsService.delete(id); setItems(prev => prev.filter(i => i.id !== id)); }
    catch (e) { console.error(e); }
  }

  return (
    <>
      <SectionHeader title="Sertifikasi" desc="Kelola sertifikat dan badge profesional. Klik Preview untuk melihat tampilan detail." />

      <AdminCard
        title="Daftar Sertifikasi"
        count={items.length}
        action={
          <button
            onClick={openAdd}
            className="text-[12px] text-gold border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold/10 transition-colors"
          >
            + Tambah Sertifikasi
          </button>
        }
      >
        {loading ? (
          <div className="py-8 text-center font-mono text-[12px] text-ink-400">Memuat...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((cert) => (
              <div
                key={cert.id}
                className="bg-[#0c0c0b] border border-ink-400/10 rounded-xl overflow-hidden hover:border-ink-400/20 transition-all group"
              >
                {/* Image area */}
                <div className="relative w-full overflow-hidden" style={{ paddingBottom: '52%' }}>
                  {cert.image_url ? (
                    <img
                      src={cert.image_url}
                      alt={cert.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink-400/5">
                      <div className="text-center">
                        <div className="text-3xl mb-1 opacity-40">🏅</div>
                        <span className="font-mono text-[10px] text-ink-400">No image</span>
                      </div>
                    </div>
                  )}

                  {/* Hover overlay — action buttons */}
                  <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    {/* Preview button */}
                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="flex items-center gap-1.5 text-[11px] text-white border border-white/30 px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="5" cy="5" r="3.5"/>
                        <path d="M8 8l2.5 2.5"/>
                      </svg>
                      Preview
                    </button>
                    <button
                      onClick={() => openEdit(cert)}
                      className="text-[11px] text-white border border-white/30 px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cert)}
                      className="text-[11px] text-red-300 border border-red-400/40 px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-red-400/10 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>

                  {/* Status badge — verify */}
                  <div className="absolute top-2.5 left-2.5">
                    {cert.verify_url ? (
                      <span
                        className="font-mono text-[9px] uppercase tracking-[.1em] px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(201,169,97,0.15)',
                          border: '1px solid rgba(201,169,97,0.3)',
                          color: 'rgba(201,169,97,0.9)',
                        }}
                      >
                        ✓ Terverifikasi
                      </span>
                    ) : (
                      <span
                        className="font-mono text-[9px] uppercase tracking-[.1em] px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.4)',
                        }}
                      >
                        Tanpa Verifikasi
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3.5">
                  <div className="text-[13px] font-medium text-ink-50 truncate">{cert.name}</div>
                  <div className="text-[11px] text-ink-400 mt-0.5">{cert.issuer}</div>

                  <div className="flex items-center justify-between mt-2.5 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="font-mono text-[10px] text-ink-400">{cert.year}</span>
                    <div className="flex items-center gap-1.5">
                      {cert.credential_id && (
                        <span className="font-mono text-[9px] text-ink-400 bg-ink-400/10 px-1.5 py-0.5 rounded">
                          ID
                        </span>
                      )}
                      <button
                        onClick={() => setPreviewCert(cert)}
                        className="font-mono text-[10px] text-gold/80 hover:text-gold transition-colors"
                      >
                        Preview →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="col-span-2 py-8 text-center font-mono text-[12px] text-ink-400">
                Belum ada sertifikasi.
              </div>
            )}
          </div>
        )}
      </AdminCard>

      {/* Form Modal (Add/Edit) */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Sertifikasi' : 'Tambah Sertifikasi'}
        footer={
          <>
            <BtnGhost onClick={() => setModalOpen(false)}>Batal</BtnGhost>
            <BtnPrimary onClick={handleSave} loading={saving}>Simpan</BtnPrimary>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Nama Sertifikat">
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="AWS Solutions Architect" />
          </FormGroup>
          <FormGroup label="Penerbit">
            <Input value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} placeholder="Amazon Web Services" />
          </FormGroup>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Tahun Terbit">
            <Input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} min="2010" max="2030" />
          </FormGroup>
          <FormGroup label="ID Kredensial" hint="Opsional">
            <Input value={form.credential_id} onChange={e => setForm({ ...form, credential_id: e.target.value })} placeholder="ABC-123-XYZ" />
          </FormGroup>
        </div>
        <FormGroup label="URL Verifikasi" hint="Opsional">
          <Input type="url" value={form.verify_url} onChange={e => setForm({ ...form, verify_url: e.target.value })} placeholder="https://verify.example.com/..." />
        </FormGroup>
        <FormGroup label="Gambar Sertifikat / Badge">
          <ImageUpload
            value={imageFile}
            onChange={setImageFile}
            label="Upload gambar sertifikat atau badge"
            hint="PNG, JPG, WebP · maks 5MB"
            folder="certifications"
          />
        </FormGroup>
      </Modal>

      {/* Preview Modal */}
      {previewCert && (
        <PreviewModal cert={previewCert} onClose={() => setPreviewCert(null)} />
      )}

      {/* Confirm Delete */}
      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        itemName={deleteTarget?.name}
      />
    </>
  );
}