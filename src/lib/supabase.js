import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/* ══════ SKILLS ══════ */
export const skillsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async create(skill) {
    const { data, error } = await supabase
      .from('skills')
      .insert([{ ...skill, updated_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('skills')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  },

  async reorder(items) {
    const updates = items.map((item, idx) =>
      supabase.from('skills').update({ sort_order: idx }).eq('id', item.id)
    );
    await Promise.all(updates);
  },
};

/* ══════ PROJECTS ══════ */
export const projectsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async create(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...project, updated_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },
};

/* ══════ EXPERIENCE ══════ */
export const experienceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async create(exp) {
    const { data, error } = await supabase
      .from('experience')
      .insert([{ ...exp, updated_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('experience')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) throw error;
  },
};

/* ══════ CERTIFICATIONS ══════ */
export const certificationsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async create(cert) {
    const { data, error } = await supabase
      .from('certifications')
      .insert([{ ...cert, updated_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('certifications')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (error) throw error;
  },
};

/* ══════ SITE SETTINGS ══════ */
export const settingsService = {
  async get() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) throw error;
    return data;
  },

  async update(updates) {
    const { data, error } = await supabase
      .from('site_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', 1)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

/* ══════ IMAGE UPLOAD ══════ */
export const storageService = {
  /**
   * Upload image ke Supabase Storage
   * @param {File} file - File object dari input
   * @param {'projects'|'certifications'|'profile'} folder - Sub-folder tujuan
   * @returns {string} Public URL gambar
   */
  async uploadImage(file, folder = 'projects') {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(data.path);

    return publicUrl;
  },

  /**
   * Upload profile picture — otomatis replace file lama dengan upsert
   * @param {File} file - File gambar profile baru
   * @returns {string} Public URL gambar profile
   */
  async uploadProfilePicture(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    // Pakai nama file fixed agar URL tidak berubah-ubah (cache bust via query)
    const fileName = `profile/lanyard-profile.${ext}`;

    const { data, error } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, file, {
        cacheControl: '0',   // no cache agar foto baru langsung tampil
        upsert: true,        // replace file lama
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(data.path);

    // Tambah cache buster agar browser tidak pakai foto lama
    return `${publicUrl}?t=${Date.now()}`;
  },

  async deleteImage(url) {
    const path = url.split('/portfolio-assets/')[1]?.split('?')[0];
    if (!path) return;
    await supabase.storage.from('portfolio-assets').remove([path]);
  },
};