/**
 * AdminUI.jsx — Shared komponen UI untuk admin dashboard
 * Menggunakan design tokens yang sama dengan portfolio
 */

import { useState, useRef } from 'react';

/* ─── Form Field Components ─── */

export function FormGroup({ label, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-400">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-ink-400 mt-0.5">{hint}</p>}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`
        w-full px-3 py-2 text-[13px] text-ink-100 bg-[#0c0c0b] border border-ink-400/20
        rounded-lg outline-none transition-colors focus:border-gold/60 placeholder:text-ink-400
        ${className}
      `}
      {...props}
    />
  );
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`
        w-full px-3 py-2 text-[13px] text-ink-100 bg-[#0c0c0b] border border-ink-400/20
        rounded-lg outline-none transition-colors focus:border-gold/60 placeholder:text-ink-400
        resize-y min-h-[80px] leading-relaxed
        ${className}
      `}
      {...props}
    />
  );
}

export function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`
        w-full px-3 py-2 text-[13px] text-ink-100 bg-[#0c0c0b] border border-ink-400/20
        rounded-lg outline-none transition-colors focus:border-gold/60 cursor-pointer
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={`relative w-9 h-5 rounded-full transition-colors duration-300
          ${checked ? 'bg-gold' : 'bg-ink-400/30'}`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300
            ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </div>
      {label && (
        <span className="text-[13px] text-ink-200 group-hover:text-ink-50 transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}

/* ─── Tag Input ─── */
export function TagInput({ tags = [], onChange, placeholder = 'Tambah...' }) {
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef(null);

  const addTag = () => {
    const val = inputVal.trim();
    if (!val || tags.includes(val)) return;
    onChange([...tags, val]);
    setInputVal('');
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 p-2 bg-[#0c0c0b] border border-ink-400/20 rounded-lg cursor-text min-h-[40px] items-center"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-ink-400/10 border border-ink-400/15 rounded text-[11px] text-ink-300"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="text-ink-400 hover:text-red-400 transition-colors leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
          }
          if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
            onChange(tags.slice(0, -1));
          }
        }}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[80px] bg-transparent text-[12px] text-ink-100 outline-none placeholder:text-ink-400"
      />
    </div>
  );
}

/* ─── Image Upload ─── */
export function ImageUpload({ value, onChange, label = 'Upload Gambar', hint = 'PNG, JPG, WebP · maks 5MB', folder = 'projects' }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    // Preview langsung (URL.createObjectURL)
    const previewUrl = URL.createObjectURL(file);
    onChange({ file, previewUrl });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const currentSrc = value?.previewUrl || value;

  return (
    <div>
      <div
        className={`relative border rounded-lg overflow-hidden transition-all duration-200 cursor-pointer
          ${dragOver ? 'border-gold/60 bg-gold/5' : 'border-ink-400/20 hover:border-ink-400/40'}
          ${currentSrc ? 'border-solid' : 'border-dashed'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {currentSrc ? (
          <div className="relative group">
            <img
              src={currentSrc}
              alt="Preview"
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[12px] text-white">Ganti Gambar</span>
            </div>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center gap-2 text-ink-400">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <div className="text-center">
              <p className="text-[13px]">{label}</p>
              <p className="text-[11px] mt-0.5">{hint}</p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      {currentSrc && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(null); }}
          className="mt-1.5 text-[11px] text-ink-400 hover:text-red-400 transition-colors"
        >
          Hapus gambar
        </button>
      )}
    </div>
  );
}

/* ─── Modal ─── */
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#141311] border border-ink-400/15 rounded-xl w-full max-w-[560px] max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-400/10">
          <h2 className="text-[15px] font-medium text-ink-50">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-ink-100 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {children}
        </div>
        {footer && (
          <div className="px-5 py-4 border-t border-ink-400/10 flex justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Buttons ─── */
export function BtnPrimary({ children, onClick, disabled, loading, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2 text-[13px] font-medium bg-gold text-[#0c0c0b] rounded-lg
        hover:opacity-90 active:scale-[.98] transition-all disabled:opacity-50
        disabled:cursor-not-allowed ${className}`}
    >
      {loading ? 'Menyimpan...' : children}
    </button>
  );
}

export function BtnGhost({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[13px] text-ink-300 border border-ink-400/20 rounded-lg
        hover:text-ink-50 hover:border-ink-400/40 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function BtnDanger({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-[12px] text-red-400 border border-red-400/20 rounded-md
        hover:bg-red-400/10 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

/* ─── Card ─── */
export function AdminCard({ title, count, action, children }) {
  return (
    <div className="bg-[#141311] border border-ink-400/10 rounded-xl p-5 mb-4">
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink-400/10">
          <div className="flex items-center gap-2">
            {title && <h3 className="text-[13px] font-medium text-ink-100">{title}</h3>}
            {count !== undefined && (
              <span className="font-mono text-[10px] text-ink-400 bg-ink-400/10 px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/* ─── Section Header ─── */
export function SectionHeader({ title, desc }) {
  return (
    <div className="mb-5">
      <h2 className="text-[18px] font-medium text-ink-50">{title}</h2>
      {desc && <p className="text-[13px] text-ink-400 mt-1">{desc}</p>}
    </div>
  );
}

/* ─── Confirm Delete ─── */
export function ConfirmDelete({ open, onClose, onConfirm, itemName }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Hapus Item"
      footer={
        <>
          <BtnGhost onClick={onClose}>Batal</BtnGhost>
          <BtnDanger onClick={() => { onConfirm(); onClose(); }}>
            Hapus Sekarang
          </BtnDanger>
        </>
      }
    >
      <p className="text-[14px] text-ink-200">
        Yakin ingin menghapus <strong className="text-ink-50">{itemName}</strong>?
        Tindakan ini tidak bisa dibatalkan.
      </p>
    </Modal>
  );
}
