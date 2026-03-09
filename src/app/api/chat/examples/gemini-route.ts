/*
===========================================
📚 API DE CHAT COM GOOGLE GEMINI
===========================================
Para usar, você precisa:
1. Criar conta em: https://aistudio.google.com
2. Gerar API Key em: https://aistudio.google.com/apikey
3. Adicionar no .env: GEMINI_API_KEY=...

CUSTO: GRATUITO (até 60 requisições/minuto)
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
    // 📚 CHAMADA PARA GOOGLE GEMINI
    // ===========================================
    // Gemini usa URL diferente - a chave vai na URL
    const apiKey = process.env.GEMINI_API_KEY
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: CONTEXTO },
              { text: mensagem }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
        },
      }),
    })

    const data = await response.json()
    
    // Gemini retorna: { candidates: [{ content: { parts: [{ text: "..." }] } }] }
    const resposta = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (resposta) {
      return NextResponse.json({ resposta })
    }

    return NextResponse.json({ 
      resposta: 'Olá! Sou o assistente da Camile. Como posso ajudar?' 
    })

  } catch (error) {
    console.error('Erro Gemini:', error)
    return NextResponse.json({ 
      resposta: 'Olá! Sou o assistente da Camile. Ela é desenvolvedora em evolução!' 
    })
  }
}
