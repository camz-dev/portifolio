import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://halznzwbjlgxnewhjcnr.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbHpuendiamxneG5ld2hqY25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDIzNzcsImV4cCI6MjA4OTA3ODM3N30.xC0porPLt5_SOnrs1d-_QlWD1BYMD0Md3V91DwfsCXw'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos
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

export interface Message {
  name: string
  email: string
  subject?: string
  message: string
}

// Funções de busca
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('order_index')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar projetos:', error)
    return []
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar skills:', error)
    return []
  }
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }
}

export async function getHero(): Promise<Hero | null> {
  try {
    const { data, error } = await supabase
      .from('hero')
      .select('*')
      .limit(1)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar hero:', error)
    return null
  }
}

export async function getContacts(): Promise<Contact[]> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('visible', true)
      .order('order_index')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar contatos:', error)
    return []
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar experiências:', error)
    return []
  }
}

export async function getEducation(): Promise<Education[]> {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('order_index')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar educação:', error)
    return []
  }
}

export async function sendMessage(msg: Message): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('messages')
      .insert([msg])
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    return false
  }
}
