-- ===========================================
-- SQL PARA CRIAR AS TABELAS DO PORTFOLIO
-- Execute isso no SQL Editor do Supabase
-- ===========================================

-- Tabela de Perfil
CREATE TABLE IF NOT EXISTS perfil (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL DEFAULT 'Camile Pereira',
  titulo VARCHAR(255) NOT NULL DEFAULT 'Desenvolvedora Full Stack',
  descricao TEXT NOT NULL DEFAULT 'Apaixonada por tecnologia e aprendendo todos os dias',
  avatar_url TEXT,
  email VARCHAR(255) NOT NULL DEFAULT 'camile@email.com',
  github_url TEXT DEFAULT 'https://github.com/camz-dev',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/camile-pereira-52b210236',
  disponibilidade TEXT NOT NULL DEFAULT '3 dias por semana',
  sobre TEXT NOT NULL DEFAULT 'Entusiasta de tecnologia em jornada de aprendizado contínuo.',
  objetivos TEXT[] DEFAULT ARRAY['Dominar tecnologias web modernas', 'Criar projetos impactantes', 'Contribuir com a comunidade', 'Integrar IA em aplicações'],
  interesses TEXT[] DEFAULT ARRAY['Frontend', 'Backend', 'Inteligência Artificial', 'Banco de Dados', 'Mobile'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Projetos
CREATE TABLE IF NOT EXISTS projetos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  tecnologias TEXT[] NOT NULL DEFAULT '{}',
  link TEXT NOT NULL DEFAULT '#',
  categoria VARCHAR(50) NOT NULL DEFAULT 'frontend',
  imagem TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  nivel INTEGER NOT NULL DEFAULT 50 CHECK (nivel >= 0 AND nivel <= 100),
  cor VARCHAR(50) NOT NULL DEFAULT 'bg-emerald-500',
  icone VARCHAR(50) NOT NULL DEFAULT 'Code',
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Experiências
CREATE TABLE IF NOT EXISTS experiencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cargo VARCHAR(255) NOT NULL,
  empresa VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  atual BOOLEAN DEFAULT FALSE,
  tecnologias TEXT[] DEFAULT '{}',
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INSERIR DADOS INICIAIS
-- ===========================================

-- Inserir perfil inicial
INSERT INTO perfil (nome, titulo, descricao, email, sobre)
VALUES (
  'Camile Pereira',
  'Desenvolvedora Full Stack',
  'Apaixonada por tecnologia e aprendendo todos os dias',
  'camile@email.com',
  'Entusiasta de tecnologia em jornada de aprendizado contínuo. Com experiência prévia em programação, banco de dados e IA, estou expandindo meus conhecimentos para me tornar uma desenvolvedora full stack completa.'
) ON CONFLICT DO NOTHING;

-- Inserir projetos iniciais
INSERT INTO projetos (titulo, descricao, tecnologias, link, categoria, ordem) VALUES
('Cripto Analyzer', 'Análise de criptomoedas em tempo real com gráficos interativos e acompanhamento de preços.', ARRAY['React', 'API REST', 'Chart.js'], 'https://crypto-analyzer-one-xi.vercel.app/', 'frontend', 1),
('Portfolio Web', 'Meu primeiro portfolio profissional com Next.js, TypeScript e Tailwind CSS.', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS'], '#', 'frontend', 2),
('Sistema de Tarefas', 'Aplicativo para gerenciar tarefas diárias com CRUD completo.', ARRAY['React', 'Node.js', 'MongoDB'], '#', 'fullstack', 3),
('Chatbot com IA', 'Chatbot inteligente para atendimento automatizado.', ARRAY['Python', 'OpenAI', 'FastAPI'], '#', 'ia', 4)
ON CONFLICT DO NOTHING;

-- Inserir skills iniciais
INSERT INTO skills (nome, nivel, cor, icone, ordem) VALUES
('JavaScript', 70, 'bg-emerald-500', 'Code', 1),
('TypeScript', 60, 'bg-green-500', 'Code', 2),
('React', 65, 'bg-teal-500', 'Globe', 3),
('Node.js', 55, 'bg-emerald-600', 'Code', 4),
('Python', 50, 'bg-green-600', 'Brain', 5),
('SQL', 60, 'bg-teal-600', 'Database', 6)
ON CONFLICT (nome) DO NOTHING;

-- ===========================================
-- HABILITAR RLS (Row Level Security)
-- ===========================================

ALTER TABLE perfil ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiencias ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (todos podem ler)
CREATE POLICY "Permitir leitura pública de perfil" ON perfil FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de projetos" ON projetos FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de experiencias" ON experiencias FOR SELECT USING (true);

-- Políticas para escrita (usando service role - backend apenas)
CREATE POLICY "Permitir escrita de perfil" ON perfil FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escrita de projetos" ON projetos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escrita de skills" ON skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir escrita de experiencias" ON experiencias FOR ALL USING (true) WITH CHECK (true);

-- ===========================================
-- TRIGGER PARA UPDATED_AT
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_perfil_updated_at BEFORE UPDATE ON perfil FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projetos_updated_at BEFORE UPDATE ON projetos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiencias_updated_at BEFORE UPDATE ON experiencias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
