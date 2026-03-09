/*
===========================================
📚 API DE CHAT COM IA - Versão Simplificada
===========================================
*/

import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Contexto curto para evitar timeout
const CONTEXTO = `Você é o assistente do portfólio de Camile Pereira. Responda em português, de forma breve.

Camile é desenvolvedora em evolução. GitHub: github.com/camz-dev
Skills: JavaScript, TypeScript, React, Node.js, Python, SQL.
Interesses: Frontend, Backend, IA.`

export async function POST(request: NextRequest) {
  try {
    // 1. Pega a mensagem
    const body = await request.json()
    const { mensagem } = body

    if (!mensagem) {
      return NextResponse.json({ resposta: 'Por favor, digite uma mensagem.' })
    }

    console.log('🔄 Iniciando requisição para IA...')

    // 2. Cria instância NOVA a cada requisição (evita problemas de cache)
    const zai = await ZAI.create()

    // 3. Prepara mensagens
    const mensagens = [
      { role: 'assistant' as const, content: CONTEXTO },
      { role: 'user' as const, content: mensagem }
    ]

    // 4. Chama a IA
    const completion = await zai.chat.completions.create({
      messages: mensagens
    })

    // 5. Pega resposta
    const resposta = completion.choices[0]?.message?.content
    
    console.log('✅ Resposta:', resposta?.substring(0, 50))

    if (resposta) {
      return NextResponse.json({ resposta })
    }

    // Fallback se resposta vazia
    return NextResponse.json({ 
      resposta: 'Camile é uma desenvolvedora em evolução estudando JavaScript, TypeScript e React. Posso ajudar com mais informações!' 
    })

  } catch (error: unknown) {
    console.error('❌ Erro:', error)
    
    // Resposta de fallback quando a IA falha
    return NextResponse.json({ 
      resposta: 'Olá! Sou o assistente do portfólio da Camile. Ela é uma desenvolvedora em evolução, estudando tecnologias web modernas. Como posso ajudar?' 
    })
  }
}
