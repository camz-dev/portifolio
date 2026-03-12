import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client para uso no browser (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client para uso no servidor (service role key - mais permissões)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Tipos para as tabelas
export interface Projeto {
  id: string
  titulo: string
  descricao: string
  tecnologias: string[]
  link: string
  categoria: string
  imagem?: string
  ordem: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  nome: string
  nivel: number
  cor: string
  icone: string
  ordem: number
  created_at: string
  updated_at: string
}

export interface Perfil {
  id: string
  nome: string
  titulo: string
  descricao: string
  avatar_url?: string
  email: string
  github_url?: string
  linkedin_url?: string
  disponibilidade: string
  sobre: string
  objetivos: string[]
  interesses: string[]
  created_at: string
  updated_at: string
}

export interface Experiencia {
  id: string
  cargo: string
  empresa: string
  descricao: string
  data_inicio: string
  data_fim?: string
  atual: boolean
  tecnologias: string[]
  ordem: number
  created_at: string
  updated_at: string
}
