# Portfolio - Integrado com Painel Admin

Este portfólio está integrado com o [Portfolio Admin Panel](https://github.com/camz-dev/portfolio-admin).

## 🚀 Funcionalidades

- **Dados Dinâmicos**: Projetos, skills, perfil e contatos são carregados do Supabase
- **Fallback Inteligente**: Se o Supabase não responder, usa dados estáticos
- **Formulário de Contato**: Mensagens são salvas no banco de dados
- **Chatbot IA**: Assistente virtual para visitantes

## 📋 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://halznzwbjlgxnewhjcnr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbHpuendiamxneG5ld2hqY25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDIzNzcsImV4cCI6MjA4OTA3ODM3N30.xC0porPLt5_SOnrs1d-_QlWD1BYMD0Md3V91DwfsCXw
```

### Deploy no Vercel

1. Conecte este repositório ao Vercel
2. Adicione as variáveis de ambiente
3. Deploy!

## 🔄 Fluxo de Dados

```
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│  Admin Panel    │  ───>  │    Supabase     │  <───  │   Este Portfolio│
│  (editar dados) │        │   (banco dados) │        │  (exibir dados) │
└─────────────────┘        └─────────────────┘        └─────────────────┘
```

1. **Edite** os dados no [Admin Panel](https://github.com/camz-dev/portfolio-admin)
2. **Salva** automaticamente no Supabase
3. **Portfolio** carrega os dados em tempo real

## 📁 Estrutura

```
src/
├── lib/
│   └── supabase.ts      # Cliente Supabase e funções de busca
├── app/
│   ├── api/chat/        # API do chatbot IA
│   └── page.tsx         # Página principal (carrega dados do Supabase)
└── components/          # Componentes UI
```

## 🛠 Desenvolvimento

```bash
# Instalar dependências
bun install

# Rodar localmente
bun run dev
```

## 📦 Tecnologias

- Next.js 16
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Framer Motion

---

Feito com 💚
