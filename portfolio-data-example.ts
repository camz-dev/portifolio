/**
 * INTEGRAÇÃO DO PORTFÓLIO COM O PAINEL ADMIN
 * ============================================
 * 
 * Copie este arquivo para o seu projeto de portfólio em:
 * src/lib/portfolio-data.ts
 */

import { createClient } from '@supabase/supabase-js'

// ============================================================================
// PASSO 1: Configurar o cliente Supabase
// ============================================================================

const supabaseUrl = 'https://halznzwbjlgxnewhjcnr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbHpuendiamxneG5ld2hqY25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDIzNzcsImV4cCI6MjA4OTA3ODM3N30.xC0porPLt5_SOnrs1d-_QlWD1BYMD0Md3V91DwfsCXw'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================================================
// PASSO 2: Funções para buscar os dados
// ============================================================================

/** Buscar projetos publicados */
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('order_index')
  
  if (error) {
    console.error('Erro ao buscar projetos:', error)
    return []
  }
  return data
}

/** Buscar skills */
export async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('order_index')
  
  if (error) {
    console.error('Erro ao buscar skills:', error)
    return []
  }
  return data
}

/** Buscar perfil */
export async function getProfile() {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .single()
  
  if (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }
  return data
}

/** Buscar hero (página inicial) */
export async function getHero() {
  const { data, error } = await supabase
    .from('hero')
    .select('*')
    .single()
  
  if (error) {
    console.error('Erro ao buscar hero:', error)
    return null
  }
  return data
}

/** Buscar contatos visíveis */
export async function getContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('visible', true)
    .order('order_index')
  
  if (error) {
    console.error('Erro ao buscar contatos:', error)
    return []
  }
  return data
}

/** Buscar experiências */
export async function getExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('order_index')
  
  if (error) {
    console.error('Erro ao buscar experiências:', error)
    return []
  }
  return data
}

/** Buscar educação */
export async function getEducation() {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('order_index')
  
  if (error) {
    console.error('Erro ao buscar educação:', error)
    return []
  }
  return data
}

/** Buscar tema ativo */
export async function getTheme() {
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('active', true)
    .single()
  
  if (error) {
    console.error('Erro ao buscar tema:', error)
    return null
  }
  return data
}

/** Enviar mensagem de contato */
export async function sendMessage(message: { name: string; email: string; subject?: string; message: string }) {
  const { error } = await supabase
    .from('messages')
    .insert([message])
  
  return !error
}
