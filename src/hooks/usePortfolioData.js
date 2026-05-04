/**
 * usePortfolioData.js — Custom hook untuk fetch semua data portfolio dari Supabase
 * 
 * Cara pakai:
 * const { projects, skills, experience, certifications, settings, loading } = usePortfolioData();
 */

import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabase';

export function usePortfolioData() {
  const [state, setState] = useState({
    projects: [],
    skills: [],
    experience: [],
    certifications: [],
    settings: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchAll() {
      try {
        const [
          { data: projects },
          { data: skills },
          { data: experience },
          { data: certifications },
          { data: settingsArr },
        ] = await Promise.all([
          supabase.from('projects').select('*').order('sort_order'),
          supabase.from('skills').select('*').order('sort_order'),
          supabase.from('experience').select('*').order('sort_order'),
          supabase.from('certifications').select('*').order('sort_order'),
          supabase.from('site_settings').select('*').eq('id', 1),
        ]);

        setState({
          projects: projects || [],
          skills: skills || [],
          experience: experience || [],
          certifications: certifications || [],
          settings: settingsArr?.[0] || null,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setState((prev) => ({ ...prev, loading: false, error }));
      }
    }

    fetchAll();
  }, []);

  return state;
}

/**
 * useProjects — Ambil hanya projects dari Supabase
 * Drop-in replacement untuk import dari @data/projects
 */
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setProjects(data || []);
        setLoading(false);
      });
  }, []);

  // Computed: unique categories
  const categories = ['All', ...new Set(projects.map((p) => p.category))];

  return { projects, categories, loading };
}

/**
 * useSkills — Ambil skills dari Supabase
 */
export function useSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setSkills(data || []);
        setLoading(false);
      });
  }, []);

  return { skills, loading };
}
