/**
 * SkillsPanel.jsx — CRUD untuk skills / tech stack
 */
import { useState, useEffect } from 'react';
import { skillsService } from '@lib/supabase';
import {
  SectionHeader, AdminCard, Modal, FormGroup, Input, Select,
  BtnPrimary, BtnGhost, ConfirmDelete,
} from '../AdminUI';

const CATEGORIES = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'Tools', 'Design', 'Lainnya'];

const EMPTY_FORM = { name: '', category: 'Frontend', level: 80, icon: '' };

export default function SkillsPanel() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [groupBy, setGroupBy] = useState('Semua');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await skillsService.getAll();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(skill) {
    setForm({ name: skill.name, category: skill.category, level: skill.level, icon: skill.icon || '' });
    setEditingId(skill.id);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await skillsService.update(editingId, form);
        setSkills((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
      } else {
        const created = await skillsService.create(form);
        setSkills((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      alert('Gagal: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await skillsService.delete(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  const categories = ['Semua', ...new Set(skills.map((s) => s.category))];
  const filtered = groupBy === 'Semua' ? skills : skills.filter((s) => s.category === groupBy);

  return (
    <>
      <SectionHeader title="Skills" desc="Kelola tech stack dan skill yang ditampilkan di portfolio" />

      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setGroupBy(cat)}
            className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.1em] rounded-full whitespace-nowrap transition-colors
              ${groupBy === cat ? 'bg-gold/15 text-gold border border-gold/30' : 'text-ink-400 border border-ink-400/15 hover:text-ink-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <AdminCard
        title="Daftar Skill"
        count={filtered.length}
        action={
          <button onClick={openAdd} className="text-[12px] text-gold border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold/10 transition-colors">
            + Tambah Skill
          </button>
        }
      >
        {loading ? (
          <div className="py-8 text-center font-mono text-[12px] text-ink-400">Memuat...</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-3 p-3 bg-[#0c0c0b] border border-ink-400/10 rounded-lg hover:border-ink-400/20 transition-colors group"
              >
                {skill.icon && (
                  <div className="w-8 h-8 rounded-md bg-ink-400/10 flex items-center justify-center text-lg flex-shrink-0">
                    {skill.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-ink-100 truncate">{skill.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-ink-400/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold/70 rounded-full transition-all"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-ink-400 flex-shrink-0">{skill.level}%</span>
                  </div>
                  <div className="font-mono text-[10px] text-ink-400 mt-0.5">{skill.category}</div>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(skill)} className="text-[11px] text-ink-300 border border-ink-400/20 px-2 py-0.5 rounded hover:text-ink-50 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => setDeleteTarget(skill)} className="text-[11px] text-red-400/60 border border-red-400/15 px-2 py-0.5 rounded hover:text-red-400 transition-colors">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Skill' : 'Tambah Skill'}
        footer={
          <>
            <BtnGhost onClick={() => setModalOpen(false)}>Batal</BtnGhost>
            <BtnPrimary onClick={handleSave} loading={saving}>Simpan</BtnPrimary>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Nama Skill">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="React" />
          </FormGroup>
          <FormGroup label="Kategori">
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </FormGroup>
        </div>
        <FormGroup label={`Level Kemampuan — ${form.level}%`}>
          <input
            type="range" min="1" max="100" value={form.level}
            onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
            className="w-full accent-[#c9a961]"
          />
        </FormGroup>
        <FormGroup label="Icon / Emoji" hint="Emoji atau nama icon react-icons (opsional)">
          <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="⚛️" />
        </FormGroup>
      </Modal>

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget.id)}
        itemName={deleteTarget?.name}
      />
    </>
  );
}
