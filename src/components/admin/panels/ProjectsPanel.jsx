/**
 * ProjectsPanel.jsx — CRUD panel untuk portfolio projects
 * Features: list, add, edit, delete, image upload ke Supabase Storage
 */

import { useState, useEffect } from 'react';
import { projectsService, storageService } from '@lib/supabase';
import {
  SectionHeader, AdminCard, Modal, FormGroup, Input, Textarea, Select,
  TagInput, ImageUpload, BtnPrimary, BtnGhost, BtnDanger, ConfirmDelete,
} from '../AdminUI';

const CATEGORIES = ['Fullstack', 'Frontend', 'Backend', 'Mobile', 'Dashboard', 'Realtime', 'Tooling', 'API', 'Lainnya'];

const EMPTY_FORM = {
  title: '',
  category: 'Fullstack',
  year: String(new Date().getFullYear()),
  description: '',
  tech: [],
  link_live: '',
  link_github: '',
  image_url: '',
  featured: false,
};

export default function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await projectsService.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(project) {
    setForm({
      title: project.title,
      category: project.category,
      year: project.year,
      description: project.description || '',
      tech: project.tech || [],
      link_live: project.link_live || '',
      link_github: project.link_github || '',
      image_url: project.image_url || '',
      featured: project.featured || false,
    });
    setImageFile(project.image_url ? { previewUrl: project.image_url } : null);
    setEditingId(project.id);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      let image_url = form.image_url;

      // Upload gambar baru jika ada file baru
      if (imageFile?.file) {
        image_url = await storageService.uploadImage(imageFile.file, 'projects');
      } else if (!imageFile) {
        image_url = '';
      }

      const payload = { ...form, image_url };

      if (editingId) {
        const updated = await projectsService.update(editingId, payload);
        setProjects((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await projectsService.create(payload);
        setProjects((prev) => [...prev, created]);
      }

      setModalOpen(false);
    } catch (err) {
      console.error('Save error:', err);
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await projectsService.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  }

  const categories = ['All', ...new Set(projects.map((p) => p.category))];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <SectionHeader
        title="Projects"
        desc="Kelola portfolio project, gambar, dan link eksternal"
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.1em] rounded-full whitespace-nowrap transition-colors
              ${filter === cat
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'text-ink-400 border border-ink-400/15 hover:text-ink-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <AdminCard
        title="Daftar Project"
        count={filtered.length}
        action={
          <button
            onClick={openAdd}
            className="text-[12px] text-gold border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold/10 transition-colors"
          >
            + Tambah Project
          </button>
        }
      >
        {loading ? (
          <div className="py-8 text-center font-mono text-[12px] text-ink-400">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center font-mono text-[12px] text-ink-400">
            Belum ada project. Klik "+ Tambah Project" untuk mulai.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((project, idx) => (
              <div
                key={project.id}
                className="flex items-center gap-3 p-3 bg-[#0c0c0b] border border-ink-400/10 rounded-lg hover:border-ink-400/20 transition-colors group"
              >
                {/* Thumbnail */}
                <div className="w-14 h-10 rounded-md overflow-hidden flex-shrink-0 bg-ink-400/10">
                  {project.image_url ? (
                    <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-ink-100 truncate">{project.title}</span>
                    {project.featured && (
                      <span className="flex-shrink-0 font-mono text-[9px] uppercase tracking-[.1em] px-1.5 py-0.5 bg-gold/10 text-gold rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] text-ink-400">{project.category}</span>
                    <span className="text-ink-400/40">·</span>
                    <span className="font-mono text-[10px] text-ink-400">{project.year}</span>
                    <span className="text-ink-400/40">·</span>
                    <span className="font-mono text-[10px] text-ink-400">{(project.tech || []).slice(0, 3).join(', ')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(project)}
                    className="text-[12px] text-ink-300 border border-ink-400/20 px-2.5 py-1 rounded-md hover:text-ink-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(project)}
                    className="text-[12px] text-red-400/70 border border-red-400/15 px-2.5 py-1 rounded-md hover:text-red-400 hover:border-red-400/30 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Modal Tambah/Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Project' : 'Tambah Project Baru'}
        footer={
          <>
            <BtnGhost onClick={() => setModalOpen(false)}>Batal</BtnGhost>
            <BtnPrimary onClick={handleSave} loading={saving}>
              {editingId ? 'Simpan Perubahan' : 'Tambah Project'}
            </BtnPrimary>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Judul Project">
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Nebula Commerce"
            />
          </FormGroup>
          <FormGroup label="Kategori">
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </FormGroup>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Tahun">
            <Input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              min="2015" max="2030"
            />
          </FormGroup>
          <FormGroup label="Status">
            <Select
              value={form.featured ? '1' : '0'}
              onChange={(e) => setForm({ ...form, featured: e.target.value === '1' })}
            >
              <option value="1">Featured</option>
              <option value="0">Normal</option>
            </Select>
          </FormGroup>
        </div>

        <FormGroup label="Deskripsi">
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Jelaskan project ini secara singkat..."
          />
        </FormGroup>

        <FormGroup label="Tech Stack" hint="Tekan Enter atau koma untuk menambah">
          <TagInput
            tags={form.tech}
            onChange={(tech) => setForm({ ...form, tech })}
            placeholder="React, Node.js, dll..."
          />
        </FormGroup>

        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Link Live">
            <Input
              type="url"
              value={form.link_live}
              onChange={(e) => setForm({ ...form, link_live: e.target.value })}
              placeholder="https://example.com"
            />
          </FormGroup>
          <FormGroup label="Link GitHub">
            <Input
              type="url"
              value={form.link_github}
              onChange={(e) => setForm({ ...form, link_github: e.target.value })}
              placeholder="https://github.com/..."
            />
          </FormGroup>
        </div>

        <FormGroup label="Gambar Project">
          <ImageUpload
            value={imageFile}
            onChange={setImageFile}
            label="Upload thumbnail project"
            folder="projects"
          />
        </FormGroup>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget.id)}
        itemName={deleteTarget?.title}
      />
    </>
  );
}
