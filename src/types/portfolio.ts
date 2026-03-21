// =============================================================================
// PORTFOLIO ADMIN TYPES
// =============================================================================

// ===== PROJECT =====
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
  created_at: string
  updated_at: string
}

export interface ProjectInput {
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

// ===== SKILL =====
export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'design' | 'other'
  level: number // 1-100
  icon_url?: string
  description?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface SkillInput {
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'design' | 'other'
  level: number
  icon_url?: string
  description?: string
  order_index: number
}

// ===== PROFILE (Sobre Mim) =====
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
  whatsapp?: string
  availability: 'available' | 'busy' | 'unavailable'
  years_experience: number
  created_at: string
  updated_at: string
}

export interface ProfileInput {
  name: string
  title: string
  bio: string
  avatar_url?: string
  resume_url?: string
  location?: string
  email?: string
  phone?: string
  whatsapp?: string
  availability: 'available' | 'busy' | 'unavailable'
  years_experience: number
}

// ===== CONTACT =====
export interface Contact {
  id: string
  platform: string
  url: string
  icon?: string
  username?: string
  order_index: number
  visible: boolean
  created_at: string
  updated_at: string
}

export interface ContactInput {
  platform: string
  url: string
  icon?: string
  username?: string
  order_index: number
  visible: boolean
}

// ===== HERO (Página Principal) =====
export interface Hero {
  id: string
  title: string
  subtitle: string
  description: string
  background_image?: string
  background_color?: string
  cta_text?: string
  cta_url?: string
  secondary_cta_text?: string
  secondary_cta_url?: string
  show_avatar: boolean
  animation_type: 'none' | 'fade' | 'slide' | 'typewriter'
  created_at: string
  updated_at: string
}

export interface HeroInput {
  title: string
  subtitle: string
  description: string
  background_image?: string
  background_color?: string
  cta_text?: string
  cta_url?: string
  secondary_cta_text?: string
  secondary_cta_url?: string
  show_avatar: boolean
  animation_type: 'none' | 'fade' | 'slide' | 'typewriter'
}

// ===== EXPERIENCE =====
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
  created_at: string
  updated_at: string
}

export interface ExperienceInput {
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

// ===== EDUCATION =====
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
  created_at: string
  updated_at: string
}

export interface EducationInput {
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

// ===== THEME =====
export interface Theme {
  id: string
  name: string
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  card_background?: string
  text_color: string
  muted_color?: string
  border_color?: string
  font_primary: string
  font_secondary: string
  border_radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  // Theme mode
  theme_mode?: 'dark' | 'light'
  // Light mode colors
  light_primary_color?: string
  light_secondary_color?: string
  light_accent_color?: string
  light_background_color?: string
  light_card_background?: string
  light_text_color?: string
  light_muted_color?: string
  light_border_color?: string
  // Animation settings
  animation_type?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'flip'
  animation_duration?: number // in milliseconds
  animation_delay?: number // in milliseconds
  hover_effect?: 'none' | 'scale' | 'lift' | 'glow' | 'shine'
  // Particle effects
  particle_effect?: boolean
  particle_style?: 'floating' | 'stars' | 'bubbles' | 'glow' | 'sparkle' | 'fire' | 'snow' | 'hearts' | 'aurora' | 'matrix' | 'geometric'
  gradient_animation?: boolean
  cursor_effect?: 'none' | 'trail' | 'sparkle' | 'bubble' | 'glow'
  // Dynamic Elements
  scroll_reveal_animation?: boolean
  counter_animation?: boolean
  timeline_glow_points?: boolean
  noise_texture?: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export interface ThemeInput {
  name: string
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  card_background?: string
  text_color: string
  muted_color?: string
  border_color?: string
  font_primary: string
  font_secondary: string
  border_radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  // Theme mode
  theme_mode?: 'dark' | 'light'
  // Light mode colors
  light_primary_color?: string
  light_secondary_color?: string
  light_accent_color?: string
  light_background_color?: string
  light_card_background?: string
  light_text_color?: string
  light_muted_color?: string
  light_border_color?: string
  // Animation settings
  animation_type?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'flip'
  animation_duration?: number
  animation_delay?: number
  hover_effect?: 'none' | 'scale' | 'lift' | 'glow' | 'shine'
  // Particle effects
  particle_effect?: boolean
  particle_style?: 'floating' | 'stars' | 'bubbles' | 'glow' | 'sparkle' | 'fire' | 'snow' | 'hearts' | 'aurora' | 'matrix' | 'geometric'
  gradient_animation?: boolean
  cursor_effect?: 'none' | 'trail' | 'sparkle' | 'bubble' | 'glow'
  // Dynamic Elements
  scroll_reveal_animation?: boolean
  counter_animation?: boolean
  timeline_glow_points?: boolean
  noise_texture?: boolean
  active: boolean
}

// ===== MESSAGE (Contact Form Messages) =====
export interface Message {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  read: boolean
  replied: boolean
  created_at: string
}

// ===== SETTINGS =====
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
  created_at: string
  updated_at: string
}

export interface SettingsInput {
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

// ===== CATEGORY (for projects) =====
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface CategoryInput {
  name: string
  slug: string
  description?: string
  color: string
  order_index: number
}
