-- ===========================================
-- SQL PARA ATUALIZAR A TABELA DE PERFIL
-- Execute isso no SQL Editor do Supabase
-- ===========================================

-- Adicionar campos de contato na tabela perfil
ALTER TABLE perfil 
ADD COLUMN IF NOT EXISTS telefone VARCHAR(20),
ADD COLUMN IF NOT EXISTS contato_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS contato_telefone VARCHAR(20),
ADD COLUMN IF NOT EXISTS contato_whatsapp VARCHAR(20),
ADD COLUMN IF NOT EXISTS contato_endereco TEXT;

-- Adicionar campo de imagem na tabela projetos
ALTER TABLE projetos 
ADD COLUMN IF NOT EXISTS imagem TEXT;

-- Atualizar projetos existentes com imagens
UPDATE projetos SET imagem = '/projetos/cripto-analyzer.png' WHERE titulo = 'Cripto Analyzer';
UPDATE projetos SET imagem = '/projetos/portfolio-web.png' WHERE titulo = 'Portfolio Web';
UPDATE projetos SET imagem = '/projetos/sistema-tarefas.png' WHERE titulo = 'Sistema de Tarefas';
UPDATE projetos SET imagem = '/projetos/chatbot-ia.png' WHERE titulo = 'Chatbot com IA';

-- Atualizar perfil com informações de contato
UPDATE perfil SET 
  contato_email = email,
  contato_whatsapp = '5511999999999',
  contato_endereco = 'São Paulo, SP - Brasil'
WHERE id IS NOT NULL;
