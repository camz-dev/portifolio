/*
===========================================
📚 EXPLICAÇÃO: API DE CHAT COM IA
===========================================
Esta API recebe mensagens do usuário e retorna respostas
geradas por IA sobre Camile Pereira.

O que é uma API Route?
- É um "backend" dentro do Next.js
- Recebe requisições HTTP (GET, POST, etc.)
- Retorna respostas em JSON

Como funciona:
1. Frontend envia POST com a mensagem
2. API chama a IA com contexto sobre Camile
3. IA gera resposta personalizada
4. API retorna a resposta para o frontend
*/

import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

/*
===========================================
📚 EXPLICAÇÃO: CONTEXTO DA IA
===========================================
O contexto é a informação que a IA usa para responder.
É como se fosse a "memória" ou "personalidade" do assistente.
*/
const CONTEXTO = `
Você é o assistente virtual do portfólio de Camile Pereira.

INFORMAÇÕES SOBRE CAMILE PEREIRA:
- Nome: Camile Pereira
- Profissão: Desenvolvedora em evolução
- GitHub: https://github.com/camz-dev
- LinkedIn: https://www.linkedin.com/in/camile-pereira-52b210236
- Estuda 3 dias por semana

SKILLS:
- JavaScript (70%)
- TypeScript (60%)
- React (65%)
- Node.js (55%)
- Python (50%)
- SQL (60%)

PROJETOS:
1. Portfolio Web - Meu primeiro portfolio profissional com Next.js, TypeScript e Tailwind CSS
2. Sistema de Tarefas - Aplicativo para gerenciar tarefas diárias com CRUD completo
3. Chatbot com IA - Chatbot inteligente para atendimento automatizado

INTERESSES:
- Frontend
- Backend
- Intelência Artificial
- Banco de Dados
- Mobile

OBJETIVOS:
- Dominar tecnologias web modernas
- Criar projetos impactantes
- Contribuir com a comunidade
- Integrar IA em aplicações

INSTRUÇÕES:
- Responda de forma amigável e profissional
- Seja conciso (máximo 3 frases)
- Se perguntarem sobre oportunidades, incentive a entrar em contato
- Se não souber algo, sugira entrar em contato diretamente
- Sempre responda em português brasileiro
`

// Instância do ZAI (criada uma vez e reutilizada)
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

/*
===========================================
📚 EXPLICAÇÃO: FUNÇÃO POST
===========================================
Esta função é chamada quando o frontend faz uma requisição POST.
*/
export async function POST(request: NextRequest) {
  try {
    // 1. Cria a instância do ZAI se ainda não existir
    if (!zaiInstance) {
      zaiInstance = await ZAI.create()
    }

    // 2. Pega a mensagem do corpo da requisição
    const body = await request.json()
    const { mensagem, historico } = body

    // 3. Valida se tem mensagem
    if (!mensagem) {
      return NextResponse.json(
        { erro: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // 4. Prepara as mensagens para a IA
    // O histórico mantém o contexto da conversa
    const mensagens = [
      { role: 'assistant' as const, content: CONTEXTO },
      ...(historico || []).map((msg: { autor: string; texto: string }) => ({
        role: (msg.autor === 'usuario' ? 'user' : 'assistant') as const,
        content: msg.texto
      })),
      { role: 'user' as const, content: mensagem }
    ]

    // 5. Chama a IA
    const completion = await zaiInstance.chat.completions.create({
      messages: mensagens,
      thinking: { type: 'disabled' }
    })

    // 6. Pega a resposta
    const resposta = completion.choices[0]?.message?.content

    // 7. Retorna a resposta
    return NextResponse.json({
      resposta: resposta || 'Desculpe, não consegui processar sua mensagem.'
    })

  } catch (error) {
    // Tratamento de erro
    console.error('Erro na API de chat:', error)
    return NextResponse.json(
      { erro: 'Erro ao processar mensagem. Tente novamente.' },
      { status: 500 }
    )
  }
}

/*
===========================================
📚 RESUMO DO QUE APRENDEMOS:
===========================================
1. API Routes - Endpoints backend no Next.js
2. NextRequest/NextResponse - Tipos para requisições/respostas
3. ZAI.chat.completions.create - Método para gerar texto com IA
4. System prompt (role: 'assistant') - Instruções para personalizar a IA
5. Tratamento de erros com try/catch
6. Validação de entrada
7. Reutilização de instância para performance
*/
