# Portfolio Admin Panel

Painel administrativo para gerenciar seu portfólio profissional.

## 🚀 Deploy no Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU_USUARIO/portfolio-admin)

## 📋 Variáveis de Ambiente

Configure no Vercel ou localmente:

```env
NEXT_PUBLIC_SUPABASE_URL=https://halznzwbjlgxnewhjcnr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbHpuendiamxneG5ld2hqY25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDIzNzcsImV4cCI6MjA4OTA3ODM3N30.xC0porPLt5_SOnrs1d-_QlWD1BYMD0Md3V91DwfsCXw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbHpuendiamxneG5ld2hqY25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUwMjM3NywiZXhwIjoyMDg5MDc4Mzc3fQ.PLTBKujcrxd6RqxKPwACHuwVE-nnr14-Y1TJciS76VA
ADMIN_PASSWORD=sua_senha_segura
```

## 🔗 Integração com o Portfólio

### Opção 1: Usando Supabase Client (Recomendado)

```bash
npm install @supabase/supabase-js
# ou
bun add @supabase/supabase-js
```

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

```typescript
// Buscar projetos publicados
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .eq('status', 'published')
  .order('order_index')

// Buscar skills
const { data: skills } = await supabase
  .from('skills')
  .select('*')
  .order('order_index')

// Buscar perfil
const { data: profile } = await supabase
  .from('profile')
  .select('*')
  .single()

// Buscar hero
const { data: hero } = await supabase
  .from('hero')
  .select('*')
  .single()

// Buscar contatos visíveis
const { data: contacts } = await supabase
  .from('contacts')
  .select('*')
  .eq('visible', true)
  .order('order_index')

// Buscar experiências
const { data: experiences } = await supabase
  .from('experiences')
  .select('*')
  .order('order_index')

// Buscar educação
const { data: education } = await supabase
  .from('education')
  .select('*')
  .order('order_index')

// Buscar tema ativo
const { data: theme } = await supabase
  .from('themes')
  .select('*')
  .eq('active', true)
  .single()

// Buscar configurações
const { data: settings } = await supabase
  .from('settings')
  .select('*')
  .single()
```

### Opção 2: API Routes no Portfólio

Crie API routes no seu portfólio para buscar os dados:

```typescript
// app/api/projects/route.ts
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('order_index')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
```

### Opção 3: Fetch Direto

```typescript
// Buscar dados diretamente do Supabase REST API
const response = await fetch(
  'https://halznzwbjlgxnewhjcnr.supabase.co/rest/v1/projects?select=*&status=eq.published&order=order_index',
  {
    headers: {
      'apikey': 'SUA_ANON_KEY',
      'Authorization': 'Bearer SUA_ANON_KEY'
    }
  }
)
const projects = await response.json()
```

## 📁 Estrutura de Dados

### Projetos
```typescript
interface Project {
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
```

### Skills
```typescript
interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'design' | 'other'
  level: number // 1-100
  icon_url?: string
  description?: string
  order_index: number
}
```

### Perfil
```typescript
interface Profile {
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
```

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
bun install

# Rodar em desenvolvimento
bun run dev

# Acessar
http://localhost:3000
```

## 📦 Tecnologias

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Supabase (PostgreSQL)
- Zustand (State Management)

## 🔐 Segurança

- Autenticação por senha
- Cookies HTTP-only
- Service Role Key apenas no servidor
- RLS desabilitado para admin (habilite se necessário)

---

Feito com 💚 para gerenciar portfólios
