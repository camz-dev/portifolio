'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  Github, Linkedin, Mail, ExternalLink, Code, Database, 
  Brain, Globe, Rocket, MessageCircle, Send, User, 
  Briefcase, GraduationCap, Heart, MapPin, Calendar,
  Building2, School, Clock, CheckCircle, Home as HomeIcon, FolderKanban,
  Wrench, Phone, Menu, X, Sparkles, BookOpen, Image as ImageIcon,
  MessageSquare
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import ParticleBackground from "@/components/particle-background"
import { ThemeToggle } from "@/components/theme/theme-provider"
import { 
  getProjects, getSkills, getProfile, getHero, 
  getContacts, getExperiences, getEducation, sendMessage, getActiveTheme,
  type Project, type Skill, type Profile, type Hero, 
  type Contact, type Experience, type Education, type Theme
} from "@/lib/supabase"

// Fallbacks
const defaultProfile: Profile = {
  id: '1', name: 'Camile Pereira', title: 'Desenvolvedora',
  bio: 'Entusiasta de tecnologia em jornada de aprendizado contínuo.',
  location: 'Brasil', email: 'camile@email.com',
  availability: 'available', years_experience: 2
}

const defaultHero: Hero = {
  id: '1', title: 'Olá, eu sou Camile Pereira', subtitle: 'Desenvolvedora em Evolução',
  description: 'Desenvolvedora em evolução, explorando o mundo da programação.',
  background_color: '#0f172a', cta_text: 'Ver Projetos', cta_url: 'projects',
  secondary_cta_text: 'Contato', secondary_cta_url: 'contact',
  show_avatar: true, animation_type: 'typewriter'
}

const defaultProjects: Project[] = [
  { id: '1', title: 'Cripto Analyzer', description: 'Análise de criptomoedas em tempo real.',
    technologies: ['React', 'API REST', 'Chart.js'], category: 'frontend',
    featured: true, order_index: 0, status: 'published',
    demo_url: 'https://crypto-analyzer-one-xi.vercel.app/' },
  { id: '2', title: 'Portfolio Web', description: 'Meu portfolio profissional.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'], category: 'frontend',
    featured: true, order_index: 1, status: 'published' },
]

const defaultSkills: Skill[] = [
  { id: '1', name: 'JavaScript', category: 'frontend', level: 70, order_index: 0 },
  { id: '2', name: 'TypeScript', category: 'frontend', level: 60, order_index: 1 },
  { id: '3', name: 'React', category: 'frontend', level: 65, order_index: 2 },
  { id: '4', name: 'Node.js', category: 'backend', level: 55, order_index: 3 },
  { id: '5', name: 'Python', category: 'backend', level: 50, order_index: 4 },
  { id: '6', name: 'SQL', category: 'database', level: 60, order_index: 5 },
]

const defaultContacts: Contact[] = [
  { id: '1', platform: 'GitHub', url: 'https://github.com/camz-dev', username: 'camz-dev', visible: true, order_index: 0 },
  { id: '2', platform: 'LinkedIn', url: 'https://www.linkedin.com/in/camile-pereira-52b210236', username: 'Camile Pereira', visible: true, order_index: 1 },
  { id: '3', platform: 'Email', url: 'mailto:camile@email.com', username: 'camile@email.com', visible: true, order_index: 2 },
]

// Navigation items
const navItems = [
  { id: 'home', label: 'Início', icon: HomeIcon },
  { id: 'about', label: 'Sobre', icon: User },
  { id: 'experience', label: 'Experiência', icon: Briefcase },
  { id: 'education', label: 'Educação', icon: GraduationCap },
  { id: 'projects', label: 'Projetos', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'contact', label: 'Contato', icon: Phone },
]

export default function PortfolioPage() {
  // Estados
  const [currentSection, setCurrentSection] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [hero, setHero] = useState<Hero | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [theme, setTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [formulario, setFormulario] = useState({ nome: "", email: "", mensagem: "" })
  const [chatAberto, setChatAberto] = useState(false)
  const [mensagens, setMensagens] = useState([{ autor: "bot" as const, texto: "Olá! Como posso ajudar?" }])
  const [inputChat, setInputChat] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [formEnviado, setFormEnviado] = useState(false)
  
  const [textoDigitado, setTextoDigitado] = useState("")
  const nomeCompleto = profile?.name || "Camile Pereira"

  // Buscar dados
  useEffect(() => {
    async function fetchData() {
      try {
        const [profileData, heroData, projectsData, skillsData, contactsData, experiencesData, educationData, themeData] = await Promise.all([
          getProfile(), getHero(), getProjects(), getSkills(), getContacts(), getExperiences(), getEducation(), getActiveTheme()
        ])
        
        setProfile(profileData || defaultProfile)
        setHero(heroData || defaultHero)
        setProjects(projectsData.length > 0 ? projectsData : defaultProjects)
        setSkills(skillsData.length > 0 ? skillsData : defaultSkills)
        setContacts(contactsData.length > 0 ? contactsData : defaultContacts)
        setExperiences(experiencesData)
        setEducation(educationData)
        setTheme(themeData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setProfile(defaultProfile)
        setHero(defaultHero)
        setProjects(defaultProjects)
        setSkills(defaultSkills)
        setContacts(defaultContacts)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  
  // Aplicar tema
  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty('--primary', theme.primary_color)
      document.documentElement.style.setProperty('--secondary', theme.secondary_color)
      document.documentElement.style.setProperty('--accent', theme.accent_color)
      document.documentElement.style.setProperty('--background', theme.background_color)
      document.documentElement.style.setProperty('--foreground', theme.text_color)
      if (theme.card_background) {
        document.documentElement.style.setProperty('--card', theme.card_background)
      }
      if (theme.muted_color) {
        document.documentElement.style.setProperty('--muted-foreground', theme.muted_color)
      }
    }
  }, [theme])
  
  // Efeito de digitação
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < nomeCompleto.length) {
        setTextoDigitado(nomeCompleto.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [nomeCompleto])

  // Chat
  const enviarMensagem = async () => {
    if (!inputChat.trim() || carregando) return
    const mensagemUsuario = inputChat
    setMensagens(prev => [...prev, { autor: "usuario", texto: mensagemUsuario }])
    setInputChat("")
    setCarregando(true)
    
    try {
      const resposta = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: mensagemUsuario, historico: mensagens.slice(-4) }),
      })
      const dados = await resposta.json()
      setMensagens(prev => [...prev, { autor: "bot", texto: dados.resposta || "Desculpe, não entendi." }])
    } catch {
      setMensagens(prev => [...prev, { autor: "bot", texto: "Erro ao processar. Tente novamente." }])
    } finally {
      setCarregando(false)
    }
  }

  // Formulário
  const enviarFormulario = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await sendMessage({ name: formulario.nome, email: formulario.email, message: formulario.mensagem })
    if (success) {
      setFormEnviado(true)
      setFormulario({ nome: "", email: "", mensagem: "" })
      setTimeout(() => setFormEnviado(false), 3000)
    }
  }

  // Helpers
  const getCategoryIcon = (cat: string) => ({ frontend: Globe, backend: Code, database: Database, devops: Rocket, design: Brain }[cat] || Code)
  const getCategoryColor = (cat: string) => ({ frontend: 'bg-emerald-500', backend: 'bg-green-500', database: 'bg-teal-500', devops: 'bg-emerald-600', design: 'bg-green-600' }[cat] || 'bg-emerald-500')
  const getSocialIcon = (platform: string) => ({ GitHub: Github, Linkedin, LinkedIn: Linkedin, Email: Mail, WhatsApp: MessageSquare }[platform] || Mail)
  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  
  // Theme helpers
  const getThemeBorderRadius = () => {
    if (!theme?.border_radius) return '0.5rem'
    const radiusMap: Record<string, string> = {
      'none': '0',
      'sm': '0.25rem',
      'md': '0.5rem',
      'lg': '0.75rem',
      'xl': '1rem',
      'full': '9999px'
    }
    return radiusMap[theme.border_radius] || '0.5rem'
  }

  // Navegação
  const navigateTo = (section: string) => {
    setCurrentSection(section)
    setSidebarOpen(false)
  }

  // Renderizar seção atual
  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <HomeSection hero={hero} profile={profile} textoDigitado={textoDigitado} navigateTo={navigateTo} theme={theme} projects={projects} skills={skills} />
      case 'about':
        return <AboutSection profile={profile} theme={theme} />
      case 'experience':
        return <ExperienceSection experiences={experiences} formatDate={formatDate} theme={theme} />
      case 'education':
        return <EducationSection education={education} formatDate={formatDate} theme={theme} />
      case 'projects':
        return <ProjectsSection projects={projects} theme={theme} getThemeBorderRadius={getThemeBorderRadius} />
      case 'skills':
        return <SkillsSection skills={skills} getCategoryIcon={getCategoryIcon} getCategoryColor={getCategoryColor} theme={theme} />
      case 'contact':
        return <ContactSection contacts={contacts} profile={profile} formulario={formulario} setFormulario={setFormulario} enviarFormulario={enviarFormulario} formEnviado={formEnviado} getSocialIcon={getSocialIcon} theme={theme} />
      default:
        return <HomeSection hero={hero} profile={profile} textoDigitado={textoDigitado} navigateTo={navigateTo} theme={theme} projects={projects} skills={skills} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-background relative">
      <ParticleBackground quantidade={theme?.particle_effect === false ? 0 : 30} />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <motion.h1 className="text-lg font-bold">
            <span className="text-primary">Dev</span>Portfolio
          </motion.h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card/80 backdrop-blur-xl border-r border-border flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme?.primary_color || '#10b981'}, ${theme?.secondary_color || '#14b8a6'})`
                  }}
                >
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg"><span className="text-primary">Dev</span>Portfolio</h1>
                  <p className="text-xs text-muted-foreground">{profile?.name || 'Desenvolvedor'}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                    style={isActive ? { backgroundColor: theme?.primary_color || undefined } : {}}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tema</span>
                <ThemeToggle />
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                {contacts.slice(0, 4).map((contact) => {
                  const IconComponent = getSocialIcon(contact.platform)
                  return (
                    <a
                      key={contact.id}
                      href={contact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 overflow-y-auto">
        <div className="min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 lg:p-8"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Chat Button */}
      <Button
        onClick={() => setChatAberto(!chatAberto)}
        size="icon"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50"
        style={{ backgroundColor: theme?.primary_color || undefined }}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chatbot */}
      <AnimatePresence>
        {chatAberto && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 z-50"
          >
            <Card className="shadow-xl">
              <CardHeader 
                className="text-primary-foreground rounded-t-lg"
                style={{ backgroundColor: theme?.primary_color || undefined }}
              >
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="h-5 w-5" />Assistente IA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {mensagens.map((msg, index) => (
                    <div key={index} className={`flex ${msg.autor === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${msg.autor === 'usuario' ? 'text-primary-foreground' : 'bg-muted'}`}
                        style={msg.autor === 'usuario' ? { backgroundColor: theme?.primary_color || undefined } : {}}
                      >{msg.texto}</div>
                    </div>
                  ))}
                  {carregando && (
                    <div className="flex justify-start">
                      <div className="bg-muted px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-muted-foreground">pensando...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t flex gap-2">
                  <Input placeholder="Mensagem..." value={inputChat} onChange={(e) => setInputChat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !carregando && enviarMensagem()} className="flex-1" disabled={carregando} />
                  <Button size="icon" onClick={enviarMensagem} disabled={carregando} style={{ backgroundColor: theme?.primary_color || undefined }}><Send className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// SECTIONS
// ============================================

function HomeSection({ hero, profile, textoDigitado, navigateTo, theme, projects, skills }: { hero: Hero | null; profile: Profile | null; textoDigitado: string; navigateTo: (section: string) => void; theme: Theme | null; projects: Project[]; skills: Skill[] }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center py-12 lg:py-20">
        {/* Avatar */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="relative mb-8">
          <div 
            className="absolute inset-0 rounded-full blur-md opacity-60 animate-pulse"
            style={{ background: `linear-gradient(90deg, ${theme?.primary_color || '#10b981'}, ${theme?.secondary_color || '#14b8a6'}, ${theme?.accent_color || '#06b6d4'})` }}
          />
          <div 
            className="relative w-32 h-32 rounded-full flex items-center justify-center border-glow overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${theme?.primary_color || '#10b981'}, ${theme?.secondary_color || '#14b8a6'})` }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-white">{profile?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'CP'}</span>
            )}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {hero?.title?.split(profile?.name || 'Camile Pereira')[0] || 'Olá, eu sou '}
            <span style={{ color: theme?.primary_color || '#10b981' }}>{textoDigitado}<span className="animate-pulse">|</span></span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground">{hero?.subtitle || profile?.title}</p>
        </motion.div>

        {/* Description */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="max-w-2xl text-muted-foreground mt-6 text-lg">
          {hero?.description || profile?.bio}
        </motion.p>

        {/* Availability */}
        {profile?.availability && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-2 mt-6">
            <span 
              className={`w-3 h-3 rounded-full animate-pulse`}
              style={{ backgroundColor: profile.availability === 'available' ? (theme?.primary_color || '#10b981') : profile.availability === 'busy' ? '#eab308' : '#ef4444' }}
            />
            <span className="text-muted-foreground">
              {profile.availability === 'available' ? 'Disponível para projetos' : profile.availability === 'busy' ? 'Ocupado no momento' : 'Indisponível'}
            </span>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex gap-4 mt-8">
          <Button 
            size="lg" 
            onClick={() => navigateTo(hero?.cta_url || 'projects')}
            style={{ backgroundColor: theme?.primary_color || undefined }}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {hero?.cta_text || 'Ver Projetos'}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigateTo(hero?.secondary_cta_url || 'contact')}
            style={{ borderColor: theme?.primary_color || undefined, color: theme?.primary_color || undefined }}
          >
            <Mail className="mr-2 h-5 w-5" />
            {hero?.secondary_cta_text || 'Contato'}
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="grid grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary" style={{ color: theme?.primary_color || undefined }}>{profile?.years_experience || '2'}+</p>
            <p className="text-sm text-muted-foreground">Anos Estudando</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary" style={{ color: theme?.primary_color || undefined }}>{projects?.length || 10}+</p>
            <p className="text-sm text-muted-foreground">Projetos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary" style={{ color: theme?.primary_color || undefined }}>{skills?.length || 6}+</p>
            <p className="text-sm text-muted-foreground">Tecnologias</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function AboutSection({ profile, theme }: { profile: Profile | null; theme: Theme | null }) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <User className="h-8 w-8" style={{ color: theme?.primary_color || undefined }} />
          Sobre Mim
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" style={{ color: theme?.primary_color || undefined }} />
                Quem sou
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>{profile?.bio}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" style={{ color: theme?.primary_color || undefined }} />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="flex items-center gap-2">📍 {profile?.location || 'Brasil'}</p>
              <p className="flex items-center gap-2 mt-2">💼 {profile?.years_experience || 2} anos de experiência</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" style={{ color: theme?.primary_color || undefined }} />
                Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2">
              {profile?.email && <p className="flex items-center gap-2">📧 {profile.email}</p>}
              {profile?.whatsapp && <p className="flex items-center gap-2">📱 WhatsApp: {profile.whatsapp}</p>}
              {profile?.phone && <p className="flex items-center gap-2">📞 {profile.phone}</p>}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" style={{ color: theme?.primary_color || undefined }} />
                Interesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Frontend</Badge>
                <Badge variant="secondary">Backend</Badge>
                <Badge variant="secondary">IA</Badge>
                <Badge variant="secondary">Banco de Dados</Badge>
                <Badge variant="secondary">Mobile</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

function ExperienceSection({ experiences, formatDate, theme }: { experiences: Experience[]; formatDate: (date: string) => string; theme: Theme | null }) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Briefcase className="h-8 w-8" style={{ color: theme?.primary_color || undefined }} />
          Experiências
        </h2>
        
        {experiences.length > 0 ? (
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="relative pl-8 ml-4" style={{ borderLeftColor: theme?.primary_color || undefined, borderLeftWidth: 2 }}>
                  <div className="absolute left-0 top-6 w-3 h-3 rounded-full -translate-x-[7px]" style={{ backgroundColor: theme?.primary_color || '#10b981' }} />
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" style={{ color: theme?.primary_color || undefined }} />
                          {exp.position}
                        </CardTitle>
                        <CardDescription className="text-lg font-medium text-foreground mt-1">{exp.company}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(exp.start_date)} - {exp.current ? 'Presente' : exp.end_date ? formatDate(exp.end_date) : ''}
                        {exp.current && <Badge style={{ backgroundColor: `${theme?.primary_color || '#10b981'}20`, color: theme?.primary_color || '#10b981' }}>Atual</Badge>}
                      </div>
                    </div>
                    {exp.location && <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" />{exp.location}</p>}
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{exp.description}</p>
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => <Badge key={tech} variant="outline">{tech}</Badge>)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="py-16 text-center">
              <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Nenhuma experiência cadastrada</p>
              <p className="text-sm text-muted-foreground mt-2">Adicione experiências pelo painel administrativo</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

function EducationSection({ education, formatDate, theme }: { education: Education[]; formatDate: (date: string) => string; theme: Theme | null }) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <GraduationCap className="h-8 w-8" style={{ color: theme?.primary_color || undefined }} />
          Educação
        </h2>
        
        {education.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <motion.div key={edu.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {edu.logo_url ? (
                        <img src={edu.logo_url} alt={edu.institution} className="w-12 h-12 rounded-lg object-contain bg-muted p-2" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${theme?.primary_color || '#10b981'}20` }}>
                          <School className="w-6 h-6" style={{ color: theme?.primary_color || undefined }} />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{edu.degree}</CardTitle>
                        <CardDescription>{edu.field}</CardDescription>
                        <p className="text-sm font-medium mt-1">{edu.institution}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="w-4 h-4" />
                      {formatDate(edu.start_date)} - {edu.current ? 'Presente' : edu.end_date ? formatDate(edu.end_date) : ''}
                      {edu.current && <Badge style={{ backgroundColor: `${theme?.primary_color || '#10b981'}20`, color: theme?.primary_color || '#10b981' }}>Cursando</Badge>}
                    </div>
                    {edu.description && <p className="text-sm text-muted-foreground">{edu.description}</p>}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="py-16 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Nenhuma formação cadastrada</p>
              <p className="text-sm text-muted-foreground mt-2">Adicione formações pelo painel administrativo</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

function ProjectsSection({ projects, theme, getThemeBorderRadius }: { projects: Project[]; theme: Theme | null; getThemeBorderRadius: () => string }) {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FolderKanban className="h-8 w-8" style={{ color: theme?.primary_color || undefined }} />
          Meus Projetos
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((projeto, index) => (
            <motion.div key={projeto.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="h-full hover:shadow-lg transition-all group overflow-hidden" style={{ borderRadius: getThemeBorderRadius() }}>
                {projeto.image_url ? (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img src={projeto.image_url} alt={projeto.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {projeto.title}
                    <div className="flex gap-2">
                      {projeto.demo_url && (
                        <a 
                          href={projeto.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:opacity-80 transition-opacity"
                          style={{ color: theme?.primary_color || undefined }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {projeto.github_url && (
                        <a 
                          href={projeto.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:opacity-80 transition-opacity"
                          style={{ color: theme?.primary_color || undefined }}
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>{projeto.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {projeto.technologies && projeto.technologies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {projeto.technologies.map((tech) => (
                        <Badge 
                          key={tech} 
                          variant="outline"
                          style={{ borderColor: theme?.primary_color ? `${theme.primary_color}40` : undefined }}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Tecnologias não informadas</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {projects.length === 0 && (
          <Card className="bg-muted/50">
            <CardContent className="py-16 text-center">
              <FolderKanban className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Nenhum projeto cadastrado</p>
              <p className="text-sm text-muted-foreground mt-2">Adicione projetos pelo painel administrativo</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

function SkillsSection({ skills, getCategoryIcon, getCategoryColor, theme }: { skills: Skill[]; getCategoryIcon: (cat: string) => typeof Code; getCategoryColor: (cat: string) => string; theme: Theme | null }) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Wrench className="h-8 w-8" style={{ color: theme?.primary_color || undefined }} />
          Minhas Skills
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, index) => {
            const IconComponent = getCategoryIcon(skill.category)
            return (
              <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="p-2.5 rounded-xl text-white shadow-lg"
                        style={{ backgroundColor: theme?.primary_color || getCategoryColor(skill.category) }}
                      >
                        {skill.icon_url ? <img src={skill.icon_url} alt={skill.name} className="w-5 h-5" /> : <IconComponent className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground text-sm ml-2">{skill.level}%</span>
                      </div>
                    </div>
                    <Progress value={skill.level} className="h-2" style={{ backgroundColor: theme?.primary_color ? `${theme.primary_color}30` : undefined }} />
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

function ContactSection({ contacts, profile, formulario, setFormulario, enviarFormulario, formEnviado, getSocialIcon, theme }: { 
  contacts: Contact[];
  profile: Profile | null;
  formulario: { nome: string; email: string; mensagem: string };
  setFormulario: React.Dispatch<React.SetStateAction<{ nome: string; email: string; mensagem: string }>>;
  enviarFormulario: (e: React.FormEvent) => void;
  formEnviado: boolean;
  getSocialIcon: (platform: string) => typeof Github;
  theme: Theme | null;
}) {
  // Adicionar WhatsApp como contato se existir no profile
  const allContacts = [
    ...contacts,
    ...(profile?.whatsapp ? [{
      id: 'whatsapp',
      platform: 'WhatsApp',
      url: `https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`,
      username: profile.whatsapp,
      visible: true,
      order_index: 99
    }] : [])
  ]
  
  return (
    <div className="max-w-xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Phone className="h-8 w-8" style={{ color: theme?.primary_color || undefined }} />
          Contato
        </h2>
        
        <Card>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {formEnviado ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${theme?.primary_color || '#10b981'}20` }}>
                    <CheckCircle className="h-8 w-8" style={{ color: theme?.primary_color || '#10b981' }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Mensagem Enviada!</h3>
                  <p className="text-muted-foreground">Responderei em breve!</p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={enviarFormulario} className="space-y-4">
                  <div className="space-y-2"><label className="text-sm font-medium">Nome</label><Input placeholder="Seu nome" value={formulario.nome} onChange={(e) => setFormulario({...formulario, nome: e.target.value})} required /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input type="email" placeholder="seu@email.com" value={formulario.email} onChange={(e) => setFormulario({...formulario, email: e.target.value})} required /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Mensagem</label><Textarea placeholder="Sua mensagem..." value={formulario.mensagem} onChange={(e) => setFormulario({...formulario, mensagem: e.target.value})} rows={4} required /></div>
                  <Button type="submit" className="w-full" style={{ backgroundColor: theme?.primary_color || undefined }}><Send className="mr-2 h-4 w-4" />Enviar</Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <p className="text-center text-muted-foreground mb-4">Ou me encontre nas redes</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {allContacts.map((contact) => {
              const IconComponent = getSocialIcon(contact.platform)
              return (
                <Button key={contact.id} variant="outline" size="lg" asChild style={{ borderColor: theme?.primary_color ? `${theme.primary_color}50` : undefined }}>
                  <a href={contact.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <IconComponent className="h-5 w-5" />
                    {contact.platform}
                  </a>
                </Button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
