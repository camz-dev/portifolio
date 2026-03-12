import { NextRequest, NextResponse } from 'next/server'
import { LLM } from 'z-ai-web-dev-sdk'

// Inicializar o cliente LLM
const llm = new LLM()

// Contexto do portfolio para o chatbot
const CONTEXTO_PORTFOLIO = `
Você é o assistente virtual do portfolio de Camile Pereira, uma desenvolvedora em evolução.

Informações sobre Camile:
- Desenvolvedora em evolução, estudando frontend, backend e IA
- Tecnologias: JavaScript, TypeScript, React, Node.js, Python, SQL
- Projetos: Cripto Analyzer (análise de criptomoedas), Portfolio Web, Sistema de Tarefas, Chatbot com IA
- Objetivos: Dominar tecnologias web modernas, criar projetos impactantes, contribuir com a comunidade
- Disponibilidade: 3 dias por semana para estudos e projetos
- Interesses: Frontend, Backend, Inteligência Artificial, Banco de Dados, Mobile

Seu papel é:
- Responder perguntas sobre Camile e seu trabalho
- Ajudar visitantes a navegar pelo portfolio
- Fornecer informações sobre os projetos e habilidades
- Ser amigável e prestativo

Responda de forma concisa e amigável em português brasileiro.
`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mensagem, historico = [] } = body

    if (!mensagem) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 })
    }

    // Construir histórico de conversa
    const mensagens = [
      { role: 'system', content: CONTEXTO_PORTFOLIO },
      ...historico.map((msg: { autor: string; texto: string }) => ({
        role: msg.autor === 'usuario' ? 'user' : 'assistant',
        content: msg.texto
      })),
      { role: 'user', content: mensagem }
    ]

    // Chamar a API de LLM
    const resposta = await llm.chat({
      messages: mensagens,
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 500
    })

    return NextResponse.json({ 
      resposta: resposta.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.' 
    })

  } catch (error) {
    console.error('Erro no chat:', error)
    return NextResponse.json({ 
      error: 'Erro ao processar mensagem',
      resposta: 'Desculpe, tive um problema técnico. Tente novamente em instantes.'
    }, { status: 500 })
  }
}
