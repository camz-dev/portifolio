/*
===========================================
📚 API DE CHAT COM IA (z-ai-web-dev-sdk)
===========================================
Esta é a IA que já funciona neste ambiente!
- ✅ Configurada automaticamente
- ✅ Funcionando localmente
- ✅ Sem necessidade de chave externa
*/

import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Contexto sobre Camile - Personalidade do assistente
const CONTEXTO = `Você é o assistente virtual do portfólio de Camile Pereira. 
Responda em português brasileiro, de forma amigável e breve (máximo 3 frases).

SOBRE CAMILE PEREIRA:
- Profissão: Desenvolvedora em evolução
- GitHub: https://github.com/camz-dev
- LinkedIn: https://www.linkedin.com/in/camile-pereira-52b210236
- Estuda 3 dias por semana

SKILLS:
- JavaScript (70%), TypeScript (60%)
- React (65%), Node.js (55%)
- Python (50%), SQL (60%)

PROJETOS NO PORTFÓLIO:
1. Portfolio Web - Next.js + TypeScript + Tailwind CSS
2. Sistema de Tarefas - React + Node.js
3. Chatbot com IA

INTERESSES: Frontend, Backend, IA, Banco de Dados, Mobile

INSTRUÇÕES:
- Responda em português do Brasil
- Seja amigável e profissional
- Se não souber algo, sugira entrar em contato pelo GitHub/LinkedIn
- Convide para conhecer os projetos`

// Instância global (reutilizada)
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mensagem } = body

    if (!mensagem) {
      return NextResponse.json({ 
        resposta: 'Olá! Sou o assistente do portfólio da Camile. Como posso ajudar?' 
      })
    }

    console.log('🚀 Mensagem:', mensagem.substring(0, 50))

    // Cria a instância se não existir
    if (!zaiInstance) {
      zaiInstance = await ZAI.create()
    }

    // Chama a IA
    const completion = await zaiInstance.chat.completions.create({
      messages: [
        { role: 'assistant', content: CONTEXTO },
        { role: 'user', content: mensagem }
      ],
      thinking: { type: 'disabled' }
    })

    const resposta = completion.choices?.[0]?.message?.content

    console.log('✅ Resposta:', resposta?.substring(0, 50))

    if (resposta) {
      return NextResponse.json({ resposta })
    }

    // Fallback
    return NextResponse.json({ 
      resposta: 'Olá! Camile é uma desenvolvedora em evolução estudando JavaScript, TypeScript e React. Como posso ajudar?' 
    })

  } catch (error) {
    console.error('❌ Erro:', error)
    return NextResponse.json({ 
      resposta: 'Olá! Sou o assistente da Camile. Ela é desenvolvedora em evolução com interesse em Frontend, Backend e IA. Como posso ajudar?' 
    })
  }
}
