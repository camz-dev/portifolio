/**
 * EXEMPLO DE INTEGRAÇÃO COM O PORTFÓLIO
 * 
 * Copie este arquivo para o seu projeto de portfólio
 * e adapte conforme necessário.
 */

import { createClient } from '@supabase/supabase-js'

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://halznzwbjlgxnewhjcnr.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbHpuendiamxneG5ld2hqY25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDIzNzcsImV4cCI6MjA4OTA3ODM3N30.xC0porPLt5_SOnrs1d-_QlWD1BYMD0Md3V91DwfsCXw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// TIPOS
// ============================================================================

export interface Project {
  id: string
  title: string
  description: string
  long_description?: string
  image_url?: string
  demo_url?: string
  github_url?: string
  technologies: string[]
  category: string
  featured: boolean
  order_index: number
  status: 'draft' | 'published' | 'archived'
}

export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'design' | 'other'
  level: number
  icon_url?: string
  description?: string
  order_index: number
}

export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar_url?: string
  resume_url?: string
  location?: string
  email?: string
  phone?: string
  availability: 'available' | 'busy' | 'unavailable'
  years_experience: number
}

export interface Contact {
  id: string
  platform: string
  url: string
  icon?: string
  username?: string
  order_index: number
  visible: boolean
}

export interface Hero {
  id: string
  title: string
  subtitle: string
  description: string
  background_image?: string
  background_color: string
  cta_text?: string
  cta_url?: string
  secondary_cta_text?: string
  secondary_cta_url?: string
  show_avatar: boolean
  animation_type: 'none' | 'fade' | 'slide' | 'typewriter'
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string
  start_date: string
  end_date?: string
  current: boolean
  location?: string
  technologies: string[]
  order_index: number
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  description?: string
  start_date: string
  end_date?: string
  current: boolean
  logo_url?: string
  order_index: number
}

export interface Theme {
  id: string
  name: string
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  text_color: string
  font_primary: string
  font_secondary: string
  border_radius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  active: boolean
}

export interface Settings {
  id: string
  site_name: string
  site_description: string
  favicon_url?: string
  logo_url?: string
  google_analytics_id?: string
  meta_keywords: string[]
  social_image_url?: string
  language: string
  timezone: string
}

// ============================================================================
// FUNÇÕES DE BUSCA
// ============================================================================

/** Buscar todos os projetos publicados */
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('order_index')
  
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data || []
}

/** Buscar projetos em destaque */
export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('order_index')
  
  if (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
  return data || []
}

/** Buscar projeto por ID */
export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching project:', error)
    return null
  }
  return data
}

/** Buscar todas as skills */
export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('order_index')
  
  if (error) {
    console.error('Error fetching skills:', error)
    return []
  }
  return data || []
}

/** Buscar skills por categoria */
export async function getSkillsByCategory(category: Skill['category']): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('category', category)
    .order('order_index')
  
  if (error) {
    console.error('Error fetching skills:', error)
    return []
  }
  return data || []
}

/** Buscar perfil */
export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  return data
}

/** Buscar hero */
export async function getHero(): Promise<Hero | null> {
  const { data, error } = await supabase
    .from('hero')
    .select('*')
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error fetching hero:', error)
    return null
  }
  return data
}

/** Buscar contatos visíveis */
export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('visible', true)
    .order('order_index')
  
  if (error) {
    console.error('Error fetching contacts:', error)
    return []
  }
  return data || []
}

/** Buscar experiências */
export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('order_index')
  
  if (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
  return data || []
}

/** Buscar educação */
export async function getEducation(): Promise<Education[]> {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('order_index')
  
  if (error) {
    console.error('Error fetching education:', error)
    return []
  }
  return data || []
}

/** Buscar tema ativo */
export async function getActiveTheme(): Promise<Theme | null> {
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('active', true)
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error fetching theme:', error)
    return null
  }
  return data
}

/** Buscar configurações */
export async function getSettings(): Promise<Settings | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error fetching settings:', error)
    return null
  }
  return data
}

/** Enviar mensagem de contato */
export async function sendMessage(message: { name: string; email: string; subject?: string; message: string }): Promise<boolean> {
  const { error } = await supabase
    .from('messages')
    .insert([message])
  
  if (error) {
    console.error('Error sending message:', error)
    return false
  }
  return true
}

// ============================================================================
// HOOKS PARA REACT (se usar React)
// ============================================================================

import { useState, useEffect } from 'react'

/** Hook para buscar dados */
export function useData<T>(fetcher: () => Promise<T>, defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetcher()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

// ============================================================================
// EXEMPLO DE USO EM COMPONENTE
// ============================================================================

/*
// No seu componente React:

import { getProjects, getSkills, getProfile, getHero } from '@/lib/portfolio-data'

export default async function HomePage() {
  const [projects, profile, hero, skills] = await Promise.all([
    getProjects(),
    getProfile(),
    getHero(),
    getSkills()
  ])

  return (
    <main>
      <section className="hero">
        <h1>{hero?.title}</h1>
        <h2>{hero?.subtitle}</h2>
        <p>{hero?.description}</p>
      </section>
      
      <section className="about">
        <img src={profile?.avatar_url} alt={profile?.name} />
        <h2>{profile?.name}</h2>
        <p>{profile?.title}</p>
        <p>{profile?.bio}</p>
      </section>
      
      <section className="skills">
        {skills.map(skill => (
          <div key={skill.id}>
            <span>{skill.name}</span>
            <progress value={skill.level} max="100" />
          </div>
        ))}
      </section>
      
      <section className="projects">
        {projects.map(project => (
          <article key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div>
              {project.technologies.map(tech => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
*/
