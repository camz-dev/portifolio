import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/server-client'

export async function POST() {
  try {
    const supabase = getSupabaseClient()
    
    // Insert sample profile
    await supabase.from('profile').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Seu Nome',
      title: 'Desenvolvedor Full Stack',
      bio: 'Desenvolvedor apaixonado por criar soluções inovadoras e experiências digitais incríveis. Com experiência em diversas tecnologias modernas, busco sempre entregar código de qualidade.',
      location: 'São Paulo, Brasil',
      email: 'seu@email.com',
      availability: 'available',
      years_experience: 5
    }, { onConflict: 'id' })

    // Insert sample hero
    await supabase.from('hero').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Olá, eu sou Seu Nome',
      subtitle: 'Desenvolvedor Full Stack',
      description: 'Transformando ideias em código de qualidade. Especializado em React, Node.js e muito mais.',
      cta_text: 'Ver Projetos',
      cta_url: '#projects',
      secondary_cta_text: 'Contato',
      secondary_cta_url: '#contact',
      show_avatar: true,
      animation_type: 'fade'
    }, { onConflict: 'id' })

    // Insert sample theme
    await supabase.from('themes').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Emerald Dark',
      primary_color: '#10b981',
      secondary_color: '#14b8a6',
      accent_color: '#06b6d4',
      background_color: '#0f172a',
      text_color: '#f8fafc',
      font_primary: 'Inter',
      font_secondary: 'Fira Code',
      border_radius: 'md',
      active: true
    }, { onConflict: 'id' })

    // Insert sample settings
    await supabase.from('settings').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      site_name: 'Meu Portfólio',
      site_description: 'Portfólio profissional de desenvolvedor Full Stack',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo'
    }, { onConflict: 'id' })

    // Insert sample skills
    const skills = [
      { name: 'React', category: 'frontend', level: 90, order_index: 0 },
      { name: 'TypeScript', category: 'frontend', level: 85, order_index: 1 },
      { name: 'Next.js', category: 'frontend', level: 85, order_index: 2 },
      { name: 'Tailwind CSS', category: 'frontend', level: 90, order_index: 3 },
      { name: 'Node.js', category: 'backend', level: 80, order_index: 4 },
      { name: 'Python', category: 'backend', level: 75, order_index: 5 },
      { name: 'PostgreSQL', category: 'database', level: 80, order_index: 6 },
      { name: 'MongoDB', category: 'database', level: 75, order_index: 7 },
      { name: 'Docker', category: 'devops', level: 70, order_index: 8 },
      { name: 'Git', category: 'devops', level: 90, order_index: 9 },
      { name: 'Figma', category: 'design', level: 65, order_index: 10 },
    ]
    
    for (const skill of skills) {
      await supabase.from('skills').upsert(skill, { onConflict: 'name' })
    }

    // Insert sample contacts
    const contacts = [
      { platform: 'GitHub', url: 'https://github.com/seuusuario', username: '@seuusuario', visible: true, order_index: 0 },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/seuusuario', username: 'seuusuario', visible: true, order_index: 1 },
      { platform: 'Email', url: 'mailto:seu@email.com', username: 'seu@email.com', visible: true, order_index: 2 },
    ]
    
    for (const contact of contacts) {
      await supabase.from('contacts').upsert(contact, { onConflict: 'platform' })
    }

    // Insert sample projects
    const projects = [
      {
        title: 'E-commerce Platform',
        description: 'Plataforma completa de e-commerce com carrinho, pagamentos e painel admin.',
        long_description: 'Desenvolvi uma plataforma de e-commerce completa utilizando Next.js, Stripe para pagamentos e Supabase como banco de dados.',
        technologies: ['Next.js', 'React', 'TypeScript', 'Stripe', 'Supabase', 'Tailwind CSS'],
        category: 'Web App',
        featured: true,
        status: 'published',
        order_index: 0
      },
      {
        title: 'Task Manager',
        description: 'Aplicativo de gerenciamento de tarefas com drag-and-drop e colaboração em tempo real.',
        long_description: 'Um aplicativo de gerenciamento de tarefas inspirado no Trello, com funcionalidades de drag-and-drop e colaboração em tempo real.',
        technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Docker'],
        category: 'Web App',
        featured: true,
        status: 'published',
        order_index: 1
      },
      {
        title: 'API REST',
        description: 'API RESTful completa com autenticação JWT e documentação Swagger.',
        long_description: 'Desenvolvi uma API RESTful robusta com autenticação JWT, validação de dados e documentação automática.',
        technologies: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'Swagger'],
        category: 'Backend',
        featured: false,
        status: 'published',
        order_index: 2
      }
    ]
    
    for (const project of projects) {
      await supabase.from('projects').insert(project)
    }

    return NextResponse.json({
      status: 'success',
      message: '✅ Dados de exemplo inseridos com sucesso!'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Erro ao inserir dados',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
