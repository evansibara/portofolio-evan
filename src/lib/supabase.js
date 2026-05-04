/**
 * supabase.js — Supabase client + data service untuk admin dashboard
 * 
 * SETUP:
 * 1. npm install @supabase/supabase-js
 * 2. Buat file .env di root project:
 *    VITE_SUPABASE_URL=https://xxxx.supabase.co
 *    VITE_SUPABASE_ANON_KEY=your-anon-key
 * 
 * 3. Jalankan SQL di Supabase SQL Editor (lihat schema di bawah)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/* ══════════════════════════════════════════════════════
   DATABASE SCHEMA — Jalankan di Supabase SQL Editor
══════════════════════════════════════════════════════

-- Skills table
create table skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null default 'Frontend',
  level integer not null default 80 check (level between 1 and 100),
  icon text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  year text not null,
  description text,
  tech text[] default '{}',
  link_live text,
  link_github text,
  image_url text,
  featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Experience table
create table experience (
  id uuid default gen_random_uuid() primary key,
  role text not null,
  company text not null,
  location text,
  start_date text not null,
  end_date text,
  is_current boolean default false,
  description text,
  tech text[] default '{}',
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Certifications table
create table certifications (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  issuer text not null,
  year text not null,
  credential_id text,
  verify_url text,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Site settings table (single row)
create table site_settings (
  id integer primary key default 1,
  name text default 'Your Name',
  role text default 'Fullstack Developer',
  tagline text default 'Building fast, thoughtful software for the web.',
  email text,
  location text default 'Indonesia',
  github_url text,
  linkedin_url text,
  instagram_url text,
  show_skills boolean default true,
  show_projects boolean default true,
  show_experience boolean default true,
  show_certifications boolean default true,
  maintenance_mode boolean default false,
  updated_at timestamptz default now()
);

-- Insert default settings row
insert into site_settings (id) values (1) on conflict do nothing;

-- Storage bucket for images
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict do nothing;

-- RLS Policies (atur sesuai kebutuhan auth)
alter table skills enable row level security;
alter table projects enable row level security;
alter table experience enable row level security;
alter table certifications enable row level security;
alter table site_settings enable row level security;

-- Allow public read
create policy "Public read skills" on skills for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read experience" on experience for select using (true);
create policy "Public read certifications" on certifications for select using (true);
create policy "Public read settings" on site_settings for select using (true);

-- Allow authenticated write (admin only)
create policy "Auth write skills" on skills for all using (auth.role() = 'authenticated');
create policy "Auth write projects" on projects for all using (auth.role() = 'authenticated');
create policy "Auth write experience" on experience for all using (auth.role() = 'authenticated');
create policy "Auth write certifications" on certifications for all using (auth.role() = 'authenticated');
create policy "Auth write settings" on site_settings for all using (auth.role() = 'authenticated');

══════════════════════════════════════════════════════ */

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
   * @param {'projects'|'certifications'} bucket - Sub-folder tujuan
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

  async deleteImage(url) {
    const path = url.split('/portfolio-assets/')[1];
    if (!path) return;
    await supabase.storage.from('portfolio-assets').remove([path]);
  },
};
