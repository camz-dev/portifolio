/*
===========================================
📚 API DE CHAT COM OPENAI (GPT-4)
===========================================
Para usar, você precisa:
1. Criar conta em: https://platform.openai.com
2. Gerar API Key em: https://platform.openai.com/api-keys
3. Adicionar no .env: OPENAI_API_KEY=sk-...

CUSTO: ~$0.01 por 1000 mensagens (gpt-4o-mini)
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
    // 📚 CHAMADA PARA OPENAI
    // ===========================================
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // A chave vem do arquivo .env (não expor no código!)
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // Modelo barato e rápido
        messages: [
          { role: 'system', content: CONTEXTO },
          { role: 'user', content: mensagem }
        ],
        max_tokens: 200,   // Limita tamanho da resposta
        temperature: 0.7,  // Criatividade (0=preciso, 1=criativo)
      }),
    })

    const data = await response.json()
    
    // OpenAI retorna: { choices: [{ message: { content: "..." } }] }
    const resposta = data.choices?.[0]?.message?.content

    if (resposta) {
      return NextResponse.json({ resposta })
    }

    return NextResponse.json({ 
      resposta: 'Olá! Sou o assistente da Camile. Como posso ajudar?' 
    })

  } catch (error) {
    console.error('Erro OpenAI:', error)
    return NextResponse.json({ 
      resposta: 'Olá! Sou o assistente da Camile. Ela é desenvolvedora em evolução!' 
    })
  }
}
