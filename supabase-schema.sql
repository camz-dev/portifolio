-- =============================================================================
-- PORTFOLIO ADMIN - SUPABASE DATABASE SCHEMA
-- =============================================================================
-- Execute este SQL no Supabase SQL Editor para criar todas as tabelas
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- PROJECTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  category TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SKILLS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'devops', 'design', 'other')),
  level INTEGER DEFAULT 50 CHECK (level >= 1 AND level <= 100),
  icon_url TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- PROFILE TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  resume_url TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'unavailable')),
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- CONTACTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  username TEXT,
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- HERO TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS hero (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  background_image TEXT,
  background_color TEXT DEFAULT '#0f172a',
  cta_text TEXT,
  cta_url TEXT,
  secondary_cta_text TEXT,
  secondary_cta_url TEXT,
  show_avatar BOOLEAN DEFAULT true,
  animation_type TEXT DEFAULT 'fade' CHECK (animation_type IN ('none', 'fade', 'slide', 'typewriter')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- EXPERIENCES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  location TEXT,
  technologies TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- EDUCATION TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- THEMES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  background_color TEXT NOT NULL,
  card_background TEXT,
  text_color TEXT NOT NULL,
  muted_color TEXT,
  border_color TEXT,
  font_primary TEXT,
  font_secondary TEXT,
  border_radius TEXT DEFAULT 'md' CHECK (border_radius IN ('none', 'sm', 'md', 'lg', 'xl', 'full')),
  -- Animation fields
  animation_type TEXT DEFAULT 'fade' CHECK (animation_type IN ('none', 'fade', 'slide', 'scale', 'bounce', 'flip')),
  animation_duration INTEGER DEFAULT 300,
  animation_delay INTEGER DEFAULT 0,
  hover_effect TEXT DEFAULT 'scale' CHECK (hover_effect IN ('none', 'scale', 'lift', 'glow', 'shine')),
  particle_effect BOOLEAN DEFAULT true,
  gradient_animation BOOLEAN DEFAULT false,
  cursor_effect TEXT DEFAULT 'none' CHECK (cursor_effect IN ('none', 'trail', 'sparkle', 'bubble')),
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SETTINGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL,
  site_description TEXT NOT NULL,
  favicon_url TEXT,
  logo_url TEXT,
  google_analytics_id TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  social_image_url TEXT,
  language TEXT DEFAULT 'pt-BR',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- CATEGORIES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#10b981',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- MESSAGES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(order_index);
CREATE INDEX IF NOT EXISTS idx_contacts_visible ON contacts(visible);
CREATE INDEX IF NOT EXISTS idx_contacts_order ON contacts(order_index);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON experiences(order_index);
CREATE INDEX IF NOT EXISTS idx_education_order ON education(order_index);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (for portfolio frontend)
CREATE POLICY "Allow anonymous read access on projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access on skills" ON skills
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access on profile" ON profile
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access on contacts" ON contacts
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access on hero" ON hero
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access on experiences" ON experiences
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access on education" ON education
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access on themes" ON themes
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access on settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access on categories" ON categories
  FOR SELECT USING (true);

-- Allow anonymous insert on messages (for contact form)
CREATE POLICY "Allow anonymous insert on messages" ON messages
  FOR INSERT WITH CHECK (true);

-- =============================================================================
-- SERVICE ROLE POLICIES (for admin operations)
-- =============================================================================
-- The service role key bypasses RLS, so no additional policies needed
-- Just make sure to use the service role key in your admin API routes

-- =============================================================================
-- SAMPLE DATA (Optional - uncomment to insert)
-- =============================================================================
/*
-- Sample Profile
INSERT INTO profile (name, title, bio, location, email, availability, years_experience)
VALUES ('Seu Nome', 'Desenvolvedor Full Stack', 'Desenvolvedor apaixonado por criar soluções inovadoras.', 'São Paulo, Brasil', 'seu@email.com', 'available', 5);

-- Sample Hero
INSERT INTO hero (title, subtitle, description, cta_text, cta_url, secondary_cta_text, secondary_cta_url)
VALUES ('Olá, eu sou Seu Nome', 'Desenvolvedor Full Stack', 'Transformando ideias em código de qualidade.', 'Ver Projetos', '#projects', 'Contato', '#contact');

-- Sample Theme
INSERT INTO themes (name, primary_color, secondary_color, accent_color, background_color, text_color, font_primary, font_secondary, active)
VALUES ('Default', '#10b981', '#14b8a6', '#06b6d4', '#0f172a', '#f8fafc', 'Inter', 'Fira Code', true);

-- Sample Settings
INSERT INTO settings (site_name, site_description)
VALUES ('Meu Portfólio', 'Portfólio profissional de desenvolvedor');
*/

-- =============================================================================
-- MIGRATION - Add new columns to existing themes table
-- Execute these commands if you already have the themes table created
-- =============================================================================
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS card_background TEXT;
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS muted_color TEXT;
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS border_color TEXT;
-- ALTER TABLE themes DROP CONSTRAINT IF EXISTS themes_border_radius_check;
-- ALTER TABLE themes ADD CONSTRAINT themes_border_radius_check CHECK (border_radius IN ('none', 'sm', 'md', 'lg', 'xl', 'full'));
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS animation_type TEXT DEFAULT 'fade';
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS animation_duration INTEGER DEFAULT 300;
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS animation_delay INTEGER DEFAULT 0;
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS hover_effect TEXT DEFAULT 'scale';
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS particle_effect BOOLEAN DEFAULT true;
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS gradient_animation BOOLEAN DEFAULT false;
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS cursor_effect TEXT DEFAULT 'none';

-- =============================================================================
-- MIGRATION - Add theme_mode and particle_style columns to themes table
-- =============================================================================
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS theme_mode TEXT DEFAULT 'dark' CHECK (theme_mode IN ('dark', 'light'));
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS particle_style TEXT DEFAULT 'floating' CHECK (particle_style IN ('floating', 'stars', 'bubbles', 'glow', 'sparkle', 'fire', 'snow', 'hearts', 'aurora', 'matrix'));

-- =============================================================================
-- MIGRATION - Add light mode color columns to themes table
-- =============================================================================
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS light_primary_color TEXT;
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS light_secondary_color TEXT;
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS light_accent_color TEXT;
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS light_background_color TEXT DEFAULT '#ffffff';
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS light_card_background TEXT DEFAULT '#f8fafc';
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS light_text_color TEXT DEFAULT '#0f172a';
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS light_muted_color TEXT DEFAULT '#64748b';
-- ALTER TABLE themes ADD COLUMN IF NOT EXISTS light_border_color TEXT DEFAULT '#e2e8f0';

-- =============================================================================
-- MIGRATION - Add whatsapp column to profile table
-- =============================================================================
-- ALTER TABLE profile ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- =============================================================================
-- VIEWS FOR EASY ACCESS
-- =============================================================================
-- Active theme view
CREATE OR REPLACE VIEW active_theme AS
SELECT * FROM themes WHERE active = true LIMIT 1;

-- Published projects view
CREATE OR REPLACE VIEW published_projects AS
SELECT * FROM projects WHERE status = 'published' ORDER BY order_index;

-- Visible contacts view
CREATE OR REPLACE VIEW visible_contacts AS
SELECT * FROM contacts WHERE visible = true ORDER BY order_index;

-- Unread messages count view
CREATE OR REPLACE VIEW unread_messages_count AS
SELECT COUNT(*) as count FROM messages WHERE read = false;
