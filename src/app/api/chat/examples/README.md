# 🤖 Como Integrar Outras APIs de Chat

Este guia explica como trocar a API de IA do seu chatbot.

---

## 📊 Comparação de APIs

| API | Custo | Velocidade | Qualidade | Configuração |
|-----|-------|------------|-----------|--------------|
| **Groq** | ✅ Grátis | ⚡ Muito rápida | ⭐⭐⭐⭐ | Fácil |
| **Google Gemini** | ✅ Grátis | 🚀 Rápida | ⭐⭐⭐⭐ | Fácil |
| **OpenAI** | 💰 Pago | 🚀 Rápida | ⭐⭐⭐⭐⭐ | Fácil |
| **Zhipu AI** | ✅ Grátis | 🚗 Média | ⭐⭐▤ | Média |
| **Ollama** | ✅ Grátis | 🐢 Lenta | ⭐⭐⭐ | Difícil |

---

## 🔧 Como Trocar de API

### Passo 1: Escolha a API
Veja os exemplos nesta pasta:
- `openai-route.ts` - OpenAI GPT-4
- `gemini-route.ts` - Google Gemini
- `groq-route.ts` - Groq (RECOMENDADO - grátis e rápido!)

### Passo 2: Crie sua conta e pegue a API Key

| API | Link para cadastro |
|-----|-------------------|
| Groq | https://console.groq.com |
| Gemini | https://aistudio.google.com |
| OpenAI | https://platform.openai.com |

### Passo 3: Adicione a chave no .env
Crie/edite o arquivo `.env` na raiz do projeto:

```env
# Escolha UMA das opções:

# Groq (GRÁTIS - Recomendado)
GROQ_API_KEY=gsk_xxx...

# Google Gemini (GRÁTIS)
GEMINI_API_KEY=xxx...

# OpenAI (Pago)
OPENAI_API_KEY=sk-xxx...
```

### Passo 4: Copie o código
Substitua o conteúdo de `src/app/api/chat/route.ts` pelo código do exemplo escolhido.

---

## 🚀 Recomendação: Use o Groq!

**Por quê?**
- ✅ 100% Gratuito
- ✅ Muito rápido (Llama 3.3 70B)
- ✅ Compatível com OpenAI (fácil migrar)
- ✅ 30 requisições/minuto grátis

**Como usar:**
1. Crie conta: https://console.groq.com
2. Gere a chave: https://console.groq.com/keys
3. Adicione no `.env`: `GROQ_API_KEY=gsk_xxx`
4. Copie o código de `groq-route.ts` para `route.ts`

---

## 📁 Estrutura dos Arquivos

```
src/app/api/chat/
├── route.ts              # API ativa atualmente
└── examples/
    ├── openai-route.ts   # Exemplo OpenAI
    ├── gemini-route.ts   # Exemplo Gemini
    └── groq-route.ts     # Exemplo Groq ⭐ Recomendado
```

---

## 💡 Dicas

1. **Nunca exponha a API Key no frontend!** Sempre use variáveis de ambiente.
2. **Use `.env.local`** para desenvolvimento local (não vai para o Git).
3. **No Vercel**, adicione a chave em Settings > Environment Variables.
4. **Monitore o uso** no dashboard da API escolhida.
