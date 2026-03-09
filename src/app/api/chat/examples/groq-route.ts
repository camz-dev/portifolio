/*
===========================================
📚 API DE CHAT COM GROQ (SUPER RÁPIDO!)
===========================================
Para usar, você precisa:
1. Criar conta em: https://console.groq.com
2. Gerar API Key em: https://console.groq.com/keys
3. Adicionar no .env: GROQ_API_KEY=gsk_...

CUSTO: GRATUITO (até 30 requisições/minuto)
VANTAGEM: Extremamente rápido (~100 tokens/segundo)
*/

import { NextRequest, NextResponse } from 'next/server'

const CONTEXTO = `Você é o assistente do portfólio de Camile Pereira. Responda em português, de forma breve.

Camile é desenvolvedora em evolução. GitHub: github.com/camz-dev
Skills: JavaScript, TypeScript, React, Node.js, Python, SQL.
Interesses: Frontend, Backend, IA.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mensagem } = body

    if (!mensagem) {
      return NextResponse.json({ resposta: 'Por favor, digite uma mensagem.' })
    }

    // ===========================================
    // 📚 CHAMADA PARA GROQ
    // ===========================================
    // Groq é compatível com a API da OpenAI (mesmo formato!)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        // Modelos disponíveis: llama-3.3-70b-versatile, llama-3.1-8b-instant
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: CONTEXTO },
          { role: 'user', content: mensagem }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    // Mesmo formato da OpenAI!
    const resposta = data.choices?.[0]?.message?.content

    if (resposta) {
      return NextResponse.json({ resposta })
    }

    return NextResponse.json({ 
      resposta: 'Olá! Sou o assistente da Camile. Como posso ajudar?' 
    })

  } catch (error) {
    console.error('Erro Groq:', error)
    return NextResponse.json({ 
      resposta: 'Olá! Sou o assistente da Camile. Ela é desenvolvedora em evolução!' 
    })
  }
}
