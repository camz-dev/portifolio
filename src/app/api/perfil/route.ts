import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar perfil
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('perfil')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      // Se não encontrar, criar um perfil padrão
      if (error.code === 'PGRST116') {
        const { data: newPerfil, error: insertError } = await supabaseAdmin
          .from('perfil')
          .insert([{
            nome: 'Camile Pereira',
            titulo: 'Desenvolvedora Full Stack',
            descricao: 'Apaixonada por tecnologia e aprendendo todos os dias',
            email: 'camile@email.com',
            sobre: 'Entusiasta de tecnologia em jornada de aprendizado contínuo.',
            disponibilidade: '3 dias por semana',
            objetivos: ['Dominar tecnologias web modernas', 'Criar projetos impactantes'],
            interesses: ['Frontend', 'Backend', 'IA', 'Banco de Dados'],
            contato_email: 'camile@email.com',
          }])
          .select()
          .single()

        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 })
        }

        return NextResponse.json(newPerfil)
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar perfil' }, { status: 500 })
  }
}

// PUT - Atualizar perfil
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const { data, error } = await supabaseAdmin
      .from('perfil')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 })
  }
}
