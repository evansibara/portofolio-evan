/**
 * SettingsPanel.jsx — Revisi dengan Interactive Image Cropper
 * Fitur crop: drag untuk geser posisi foto, slider untuk zoom
 * Hasil crop langsung di-upload ke Supabase Storage
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { settingsService, storageService } from '@lib/supabase';
import { SectionHeader, AdminCard, FormGroup, Input, Toggle, BtnPrimary, BtnGhost } from '../AdminUI';

const DEFAULTS = {
  name: 'Evan Sibara', role: 'Fullstack Developer',
  tagline: 'Building fast, thoughtful software for the web.',
  email: '', location: 'Indonesia',
  github_url: '', linkedin_url: '', instagram_url: '',
  profile_picture_url: '',
  show_skills: true, show_projects: true, show_experience: true,
  show_certifications: true, maintenance_mode: false,
};

const CANVAS_SIZE = 320;

function ImageCropper({ imageSrc, onCropDone, onCancel }) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const imgRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const scaleX = CANVAS_SIZE / img.width;
      const scaleY = CANVAS_SIZE / img.height;
      setZoom(Math.max(scaleX, scaleY));
      setOffset({ x: 0, y: 0 });
      setImgLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (!imgLoaded || !canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.clip();
    const scaledW = img.width * zoom;
    const scaledH = img.height * zoom;
    const x = (CANVAS_SIZE - scaledW) / 2 + offset.x;
    const y = (CANVAS_SIZE - scaledH) / 2 + offset.y;
    ctx.drawImage(img, x, y, scaledW, scaledH);
    ctx.restore();
    ctx.strokeStyle = 'rgba(201,169,97,0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CANVAS_SIZE - 2, CANVAS_SIZE - 2);
  }, [zoom, offset, imgLoaded]);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  }, [offset]);

  const onMouseMove = useCallback((e) => {
    if (!dragging || !dragStart.current || !imgRef.current) return;
    const img = imgRef.current;
    const scaledW = img.width * zoom;
    const scaledH = img.height * zoom;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    const maxX = Math.abs((scaledW - CANVAS_SIZE) / 2) + 40;
    const maxY = Math.abs((scaledH - CANVAS_SIZE) / 2) + 40;
    setOffset({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  }, [dragging, zoom]);

  const onMouseUp = useCallback(() => {
    setDragging(false);
    dragStart.current = null;
  }, []);

  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    setDragging(true);
    dragStart.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
  }, [offset]);

  const onTouchMove = useCallback((e) => {
    if (!dragging || !dragStart.current || !imgRef.current) return;
    const touch = e.touches[0];
    const img = imgRef.current;
    const scaledW = img.width * zoom;
    const scaledH = img.height * zoom;
    const newX = touch.clientX - dragStart.current.x;
    const newY = touch.clientY - dragStart.current.y;
    const maxX = Math.abs((scaledW - CANVAS_SIZE) / 2) + 40;
    const maxY = Math.abs((scaledH - CANVAS_SIZE) / 2) + 40;
    setOffset({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  }, [dragging, zoom]);

  const handleDone = useCallback(() => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 800;
    exportCanvas.height = 800;
    const ctx = exportCanvas.getContext('2d');
    const scale = 800 / CANVAS_SIZE;
    const scaledW = img.width * zoom * scale;
    const scaledH = img.height * zoom * scale;
    const x = (800 - scaledW) / 2 + offset.x * scale;
    const y = (800 - scaledH) / 2 + offset.y * scale;
    ctx.drawImage(img, x, y, scaledW, scaledH);
    exportCanvas.toBlob((blob) => {
      if (blob) onCropDone(blob);
    }, 'image/jpeg', 0.88);
  }, [zoom, offset, onCropDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#141311] border border-ink-400/15 rounded-2xl w-full max-w-[420px] overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-ink-400/10">
          <h3 className="text-[15px] font-medium text-ink-50">Atur Posisi Foto</h3>
          <p className="text-[12px] text-ink-400 mt-0.5">Drag untuk geser · Slider untuk zoom</p>
        </div>

        <div className="flex justify-center py-5 px-5">
          <div
            className="relative rounded-xl overflow-hidden"
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, cursor: dragging ? 'grabbing' : 'grab' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onMouseUp}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="block select-none"
              style={{ touchAction: 'none' }}
            />
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink-400/10">
                <div className="w-6 h-6 border-2 border-ink-400/30 border-t-gold rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-ink-400 w-8">Zoom</span>
            <input
              type="range"
              min="0.3"
              max="4"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 h-1.5 rounded-full cursor-pointer accent-gold"
            />
            <span className="text-[11px] font-mono text-ink-400 w-8 text-right">{zoom.toFixed(1)}x</span>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-ink-400/10 flex justify-end gap-2.5">
          <BtnGhost onClick={onCancel}>Batal</BtnGhost>
          <BtnPrimary onClick={handleDone}>Simpan & Upload</BtnPrimary>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPanel() {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    settingsService.get()
      .then(data => {
        const merged = { ...DEFAULTS, ...data };
        setForm(merged);
        if (merged.profile_picture_url) setPhotoPreview(merged.profile_picture_url);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { alert('Format file harus JPG, PNG, atau WebP'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('Ukuran file maksimal 10MB'); return; }
    const localUrl = URL.createObjectURL(file);
    setCropSrc(localUrl);
    setShowCropper(true);
    e.target.value = '';
  }

  async function handleCropDone(blob) {
    setShowCropper(false);
    setCropSrc(null);
    setUploadingPhoto(true);
    const previewUrl = URL.createObjectURL(blob);
    setPhotoPreview(previewUrl);
    try {
      const file = new File([blob], `profile-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const publicUrl = await storageService.uploadProfilePicture(file);
      await settingsService.update({ profile_picture_url: publicUrl });
      setForm(f => ({ ...f, profile_picture_url: publicUrl }));
      setPhotoPreview(publicUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Gagal upload foto: ' + err.message);
      setPhotoPreview(form.profile_picture_url || null);
    } finally {
      setUploadingPhoto(false);
    }
  }

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
      {showCropper && cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          onCropDone={handleCropDone}
          onCancel={() => { setShowCropper(false); setCropSrc(null); }}
        />
      )}

      <SectionHeader title="Site Settings" desc="Atur informasi profil, social links, dan visibilitas section" />

      <AdminCard title="Foto Profile">
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-ink-400/10 border border-ink-400/20 flex items-center justify-center">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 text-ink-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            {uploadingPhoto && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <p className="text-[12px] text-ink-300 leading-relaxed">
              Foto profil kamu. Setelah pilih foto, kamu bisa <strong className="text-ink-100">drag</strong> untuk geser
              dan <strong className="text-ink-100">zoom</strong> untuk mengatur posisi yang pas.
            </p>
            <p className="font-mono text-[11px] text-ink-400">Format: JPG, PNG, WebP · Maks: 10MB</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-400/10 hover:bg-ink-400/20 border border-ink-400/20 text-[12px] font-mono text-ink-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingPhoto ? (
                <><div className="w-3.5 h-3.5 border border-ink-400/30 border-t-ink-200 rounded-full animate-spin" />Mengupload...</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>{photoPreview ? 'Ganti Foto' : 'Upload Foto'}</>
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} className="hidden" />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Profil">
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Nama"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama Kamu"/></FormGroup>
          <FormGroup label="Role / Jabatan"><Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="Fullstack Developer"/></FormGroup>
        </div>
        <FormGroup label="Tagline"><Input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Building fast, thoughtful software..."/></FormGroup>
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