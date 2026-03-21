/**
 * EXEMPLO DE USO NO SEU PORTFÓLIO
 * =================================
 * 
 * Este é um exemplo de como você usaria os dados do painel admin
 * no seu projeto de portfólio.
 */

// ============================================================================
// EXEMPLO 1: Página Principal (Server Component - Next.js 14/15)
// ============================================================================

// app/page.tsx
import { getHero, getProfile, getProjects, getSkills, getContacts } from '@/lib/portfolio-data'

export default async function HomePage() {
  // Buscar todos os dados em paralelo
  const [hero, profile, projects, skills, contacts] = await Promise.all([
    getHero(),
    getProfile(),
    getProjects(),
    getSkills(),
    getContacts(),
  ])

  return (
    <main>
      {/* ========== HERO SECTION ========== */}
      <section className="hero" style={{ backgroundColor: hero?.background_color }}>
        <div className="container">
          <h1>{hero?.title || 'Olá, eu sou Desenvolvedor'}</h1>
          <h2>{hero?.subtitle}</h2>
          <p>{hero?.description}</p>
          
          {hero?.cta_text && (
            <a href={hero.cta_url} className="btn-primary">
              {hero.cta_text}
            </a>
          )}
        </div>
      </section>

      {/* ========== SOBRE MIM ========== */}
      <section id="about" className="about">
        <div className="container">
          <h2>Sobre Mim</h2>
          {profile?.avatar_url && (
            <img src={profile.avatar_url} alt={profile.name} />
          )}
          <h3>{profile?.name}</h3>
          <p className="title">{profile?.title}</p>
          <p>{profile?.bio}</p>
          <p>📍 {profile?.location}</p>
          <p>💼 {profile?.years_experience} anos de experiência</p>
        </div>
      </section>

      {/* ========== SKILLS ========== */}
      <section id="skills" className="skills">
        <div className="container">
          <h2>Habilidades</h2>
          <div className="skills-grid">
            {skills.map((skill) => (
              <div key={skill.id} className="skill-card">
                <h4>{skill.name}</h4>
                <div className="progress-bar">
                  <div style={{ width: `${skill.level}%` }} />
                </div>
                <span>{skill.level}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROJETOS ========== */}
      <section id="projects" className="projects">
        <div className="container">
          <h2>Projetos</h2>
          <div className="projects-grid">
            {projects.map((project) => (
              <article key={project.id} className="project-card">
                {project.image_url && (
                  <img src={project.image_url} alt={project.title} />
                )}
                <div className="content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="techs">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                  <div className="links">
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noreferrer">
                        Ver Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CONTATO ========== */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>Contato</h2>
          <div className="social-links">
            {contacts.map((contact) => (
              <a
                key={contact.id}
                href={contact.url}
                target="_blank"
                rel="noreferrer"
                className="social-link"
              >
                {contact.platform}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}


// ============================================================================
// EXEMPLO 2: Página de Projetos Individual (Dynamic Route)
// ============================================================================

// app/projects/[id]/page.tsx
import { getProjects, getProjectById } from '@/lib/portfolio-data'
import { notFound } from 'next/navigation'

// Gerar páginas estáticas para todos os projetos
export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({
    id: project.id,
  }))
}

export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  return (
    <main>
      <article>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        
        {project.long_description && (
          <div className="prose">
            {project.long_description}
          </div>
        )}

        <div className="technologies">
          {project.technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>

        <div className="links">
          {project.demo_url && <a href={project.demo_url}>Ver Demo</a>}
          {project.github_url && <a href={project.github_url}>Código Fonte</a>}
        </div>
      </article>
    </main>
  )
}


// ============================================================================
// EXEMPLO 3: Client Component com use hook (React 19)
// ============================================================================

// components/ProjectsList.tsx
'use client'

import { use, Suspense } from 'react'
import { getProjects } from '@/lib/portfolio-data'

function ProjectsList() {
  const projects = use(getProjects())

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="border rounded-lg p-4">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  )
}

export default function ProjectsSection() {
  return (
    <section>
      <h2>Meus Projetos</h2>
      <Suspense fallback={<p>Carregando projetos...</p>}>
        <ProjectsList />
      </Suspense>
    </section>
  )
}


// ============================================================================
// EXEMPLO 4: Formulário de Contato
// ============================================================================

// app/api/contact/route.ts
import { sendMessage } from '@/lib/portfolio-data'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  
  const success = await sendMessage({
    name: body.name,
    email: body.email,
    subject: body.subject,
    message: body.message,
  })

  if (success) {
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json(
    { error: 'Erro ao enviar mensagem' },
    { status: 500 }
  )
}

// components/ContactForm.tsx
'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = new FormData(form)

    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: data.get('name'),
        email: data.get('email'),
        subject: data.get('subject'),
        message: data.get('message'),
      }),
    })

    if (response.ok) {
      setSuccess(true)
      form.reset()
    }
    
    setLoading(false)
  }

  if (success) {
    return <p>Mensagem enviada com sucesso!</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Seu nome" required />
      <input name="email" type="email" placeholder="Seu email" required />
      <input name="subject" placeholder="Assunto" />
      <textarea name="message" placeholder="Sua mensagem" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}
