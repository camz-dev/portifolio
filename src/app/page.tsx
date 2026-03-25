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
  Building2, School, Clock, Home as HomeIcon, FolderKanban,
  Wrench, Phone, Menu, X, Sparkles, BookOpen, Image as ImageIcon,
  MessageSquare, ChevronUp, CheckCircle, ChevronDown, ChevronRight,
  Sun, Moon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import ParticleBackground from "@/components/particle-background"
import { 
  CursorGlow, 
  NoiseTexture, 
  GeometricShapes,
  ScrollReveal,
  Counter 
} from "@/components/dynamic-elements"
import { ThemeToggle } from "@/components/theme/theme-provider"
import { useColorMode, getActiveColors } from "@/hooks/use-color-mode"
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
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [hero, setHero] = useState<Hero | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [theme, setTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Hook para detectar modo do sistema (claro/escuro)
  // Passa o theme_mode do banco de dados para respeitar a configuração do admin
  const { colorMode, isDark, isLight } = useColorMode(theme?.theme_mode)
  
  const [formulario, setFormulario] = useState({ nome: "", email: "", mensagem: "" })
  const [chatAberto, setChatAberto] = useState(false)
  const [mensagens, setMensagens] = useState<Array<{ autor: 'bot' | 'usuario'; texto: string }>>([{ autor: "bot", texto: "Olá! Como posso ajudar?" }])
  const [inputChat, setInputChat] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [formEnviado, setFormEnviado] = useState(false)
  const [expandedExperiences, setExpandedExperiences] = useState<Set<string>>(new Set())
  
  const [textoDigitado, setTextoDigitado] = useState("")
  const nomeCompleto = profile?.name || "Camile Pereira"
  
  // Refs for sections
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

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
  
  // Aplicar tema responsivo baseado no modo do sistema
  useEffect(() => {
    if (theme) {
      // Obter cores ativas baseado no modo do sistema
      const activeColors = getActiveColors(theme, colorMode)
      
      document.documentElement.style.setProperty('--primary', activeColors.primary_color)
      document.documentElement.style.setProperty('--secondary', activeColors.secondary_color)
      document.documentElement.style.setProperty('--accent', activeColors.accent_color)
      document.documentElement.style.setProperty('--background', activeColors.background_color)
      document.documentElement.style.setProperty('--foreground', activeColors.text_color)
      
      if (activeColors.card_background) {
        document.documentElement.style.setProperty('--card', activeColors.card_background)
      }
      if (activeColors.muted_color) {
        document.documentElement.style.setProperty('--muted-foreground', activeColors.muted_color)
      }
      if (activeColors.border_color) {
        document.documentElement.style.setProperty('--border', activeColors.border_color)
      }
      
      // Adicionar classe ao body para estilos específicos do modo
      document.body.classList.remove('dark-mode', 'light-mode')
      document.body.classList.add(colorMode === 'dark' ? 'dark-mode' : 'light-mode')
    }
  }, [theme, colorMode])
  
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

  // Scroll spy - detect active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100
      
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 500)
      
      // Find active section
      for (const item of navItems) {
        const section = sectionRefs.current[item.id]
        if (section) {
          const { offsetTop, offsetHeight } = section
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId]
    if (section) {
      const headerOffset = 80
      const elementPosition = section.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setMobileMenuOpen(false)
  }

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    <div className="min-h-screen bg-background relative">
      {/* Dynamic Elements */}
      <CursorGlow 
        color={theme?.primary_color || '#10b981'} 
        enabled={theme?.cursor_effect && theme.cursor_effect !== 'none'} 
        style={theme?.cursor_effect || 'glow'}
      />
      <NoiseTexture 
        enabled={theme?.noise_texture} 
        opacity={0.03} 
      />
      <GeometricShapes 
        enabled={theme?.particle_style === 'geometric'} 
        color={theme?.primary_color || '#10b981'} 
      />
      
      <ParticleBackground 
        quantidade={theme?.particle_effect === false ? 0 : 30}
        style={theme?.particle_style || 'floating'}
        color={theme?.primary_color || '#10b981'}
        enabled={theme?.particle_effect !== false}
      />
      
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/95 to-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 backdrop-blur-sm bg-background/60 rounded-b-2xl px-4 mx-2 border border-border/50 border-t-0">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => scrollToSection('home')}
              whileHover={{ scale: 1.02 }}
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${theme?.primary_color || '#10b981'}, ${theme?.secondary_color || '#14b8a6'})`
                }}
              >
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:block">
                <span className="text-primary" style={{ color: theme?.primary_color }}>Dev</span>Portfolio
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      isActive 
                        ? 'text-primary-foreground shadow-lg' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    style={isActive ? { backgroundColor: theme?.primary_color || undefined } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl"
            >
              <nav className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                        isActive 
                          ? 'text-primary-foreground shadow-lg' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      style={isActive ? { backgroundColor: theme?.primary_color || undefined } : {}}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Home Section */}
        <section 
          ref={(el) => { sectionRefs.current['home'] = el }}
          id="home"
          className="min-h-screen flex items-center justify-center px-4 py-20"
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Avatar */}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="relative mb-8 inline-block">
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
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="max-w-2xl text-muted-foreground mt-6 text-lg mx-auto">
              {hero?.description || profile?.bio}
            </motion.p>

            {/* Availability */}
            {profile?.availability && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center justify-center gap-2 mt-6">
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex gap-4 mt-8 justify-center">
              <Button 
                size="lg" 
                onClick={() => scrollToSection(hero?.cta_url || 'projects')}
                style={{ backgroundColor: theme?.primary_color || undefined }}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {hero?.cta_text || 'Ver Projetos'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => scrollToSection(hero?.secondary_cta_url || 'contact')}
                style={{ borderColor: theme?.primary_color || undefined, color: theme?.primary_color || undefined }}
              >
                <Mail className="mr-2 h-5 w-5" />
                {hero?.secondary_cta_text || 'Contato'}
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary" style={{ color: theme?.primary_color || undefined }}>
                  <Counter 
                    value={profile?.years_experience || 2} 
                    suffix="+" 
                    enabled={theme?.counter_animation}
                  />
                </p>
                <p className="text-sm text-muted-foreground">Anos Estudando</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary" style={{ color: theme?.primary_color || undefined }}>
                  <Counter 
                    value={projects?.length || 10} 
                    suffix="+" 
                    enabled={theme?.counter_animation}
                  />
                </p>
                <p className="text-sm text-muted-foreground">Projetos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary" style={{ color: theme?.primary_color || undefined }}>
                  <Counter 
                    value={skills?.length || 6} 
                    suffix="+" 
                    enabled={theme?.counter_animation}
                  />
                </p>
                <p className="text-sm text-muted-foreground">Tecnologias</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section 
          ref={(el) => { sectionRefs.current['about'] = el }}
          id="about"
          className="py-20 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
        </section>

        {/* Experience Section */}
        <section 
          ref={(el) => { sectionRefs.current['experience'] = el }}
          id="experience"
          className="py-20 px-4 bg-muted/30"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Briefcase className="h-8 w-8" style={{ color: theme?.primary_color || undefined }} />
                Experiências
              </h2>
              
              {experiences.length > 0 ? (
                <div className="space-y-4">
                  {experiences.map((exp, index) => {
                    const isExpanded = expandedExperiences.has(exp.id)
                    return (
                      <motion.div 
                        key={exp.id} 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
                          onClick={() => {
                            const newExpanded = new Set(expandedExperiences)
                            if (isExpanded) {
                              newExpanded.delete(exp.id)
                            } else {
                              newExpanded.add(exp.id)
                            }
                            setExpandedExperiences(newExpanded)
                          }}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Building2 className="h-5 w-5 flex-shrink-0" style={{ color: theme?.primary_color || undefined }} />
                                  <CardTitle className="text-lg truncate">{exp.position}</CardTitle>
                                </div>
                                <CardDescription className="text-base font-medium text-foreground">
                                  {exp.company}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="text-right">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(exp.start_date)} - {exp.current ? 'Presente' : exp.end_date ? formatDate(exp.end_date) : ''}</span>
                                  </div>
                                  {exp.location && (
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                                      <MapPin className="w-3 h-3" />{exp.location}
                                    </p>
                                  )}
                                </div>
                                {exp.current && (
                                  <Badge style={{ backgroundColor: `${theme?.primary_color || '#10b981'}20`, color: theme?.primary_color || '#10b981' }}>
                                    Atual
                                  </Badge>
                                )}
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="p-1"
                                >
                                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                </motion.div>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                              >
                                <CardContent className="pt-0 border-t border-border/50">
                                  <div className="pt-4">
                                    <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                                    {exp.technologies && exp.technologies.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-4">
                                        {exp.technologies.map((tech) => (
                                          <Badge 
                                            key={tech} 
                                            variant="outline"
                                            style={{ borderColor: theme?.primary_color ? `${theme.primary_color}40` : undefined }}
                                          >
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      </motion.div>
                    )
                  })}
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
        </section>

        {/* Education Section */}
        <section 
          ref={(el) => { sectionRefs.current['education'] = el }}
          id="education"
          className="py-20 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <GraduationCap className="h-8 w-8" style={{ color: theme?.primary_color || undefined }} />
                Educação
              </h2>
              
              {education.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {education.map((edu, index) => (
                    <motion.div key={edu.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
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
        </section>

        {/* Projects Section */}
        <section 
          ref={(el) => { sectionRefs.current['projects'] = el }}
          id="projects"
          className="py-20 px-4 bg-muted/30"
        >
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <FolderKanban className="h-8 w-8" style={{ color: theme?.primary_color || undefined }} />
                Meus Projetos
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((projeto, index) => (
                  <motion.div key={projeto.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
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
        </section>

        {/* Skills Section */}
        <section 
          ref={(el) => { sectionRefs.current['skills'] = el }}
          id="skills"
          className="py-20 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Wrench className="h-8 w-8" style={{ color: theme?.primary_color || undefined }} />
                Minhas Skills
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill, index) => {
                  const IconComponent = getCategoryIcon(skill.category)
                  return (
                    <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
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
                              <span className="text-xs text-muted-foreground ml-2">{skill.level}%</span>
                            </div>
                          </div>
                          <Progress value={skill.level} className="h-2" style={{ 
                            // @ts-ignore
                            '--progress-background': theme?.primary_color || undefined 
                          }} />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          ref={(el) => { sectionRefs.current['contact'] = el }}
          id="contact"
          className="py-20 px-4 bg-muted/30"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Phone className="h-8 w-8" style={{ color: theme?.primary_color || undefined }} />
                Contato
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Redes Sociais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        {contacts.map((contact) => {
                          const IconComponent = getSocialIcon(contact.platform)
                          return (
                            <a
                              key={contact.id}
                              href={contact.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                              <IconComponent className="w-5 h-5" />
                            </a>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profile?.email && (
                        <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                          <Mail className="w-5 h-5" style={{ color: theme?.primary_color || undefined }} />
                          {profile.email}
                        </a>
                      )}
                      {profile?.whatsapp && (
                        <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                          <MessageSquare className="w-5 h-5" style={{ color: theme?.primary_color || undefined }} />
                          {profile.whatsapp}
                        </a>
                      )}
                      {profile?.phone && (
                        <a href={`tel:${profile.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                          <Phone className="w-5 h-5" style={{ color: theme?.primary_color || undefined }} />
                          {profile.phone}
                        </a>
                      )}
                      {profile?.location && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <MapPin className="w-5 h-5" style={{ color: theme?.primary_color || undefined }} />
                          {profile.location}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Envie uma mensagem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={enviarFormulario} className="space-y-4">
                      <div>
                        <Input 
                          placeholder="Seu nome" 
                          value={formulario.nome}
                          onChange={(e) => setFormulario({...formulario, nome: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Input 
                          type="email"
                          placeholder="Seu email" 
                          value={formulario.email}
                          onChange={(e) => setFormulario({...formulario, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Textarea 
                          placeholder="Sua mensagem" 
                          value={formulario.mensagem}
                          onChange={(e) => setFormulario({...formulario, mensagem: e.target.value})}
                          required
                          rows={4}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        style={{ backgroundColor: theme?.primary_color || undefined }}
                      >
                        {formEnviado ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Enviado!
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Mensagem
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} {profile?.name || 'DevPortfolio'}. Todos os direitos reservados.</p>
            <div className="flex justify-center gap-4 mt-4">
              {contacts.slice(0, 4).map((contact) => {
                const IconComponent = getSocialIcon(contact.platform)
                return (
                  <a
                    key={contact.id}
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </footer>
      </main>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 w-12 h-12 rounded-full shadow-lg z-40 flex items-center justify-center bg-background border border-border hover:bg-muted transition-colors"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

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
