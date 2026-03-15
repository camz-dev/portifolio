'use client'

// ===========================================
// IMPORTAÇÕES
// ===========================================
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Github, Linkedin, Mail, ExternalLink, Code, Database, 
  Brain, Globe, Rocket, MessageCircle, Send, User, 
  Briefcase, GraduationCap, Heart, MapPin, Calendar
} from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import ParticleBackground from "@/components/particle-background"
import { 
  supabase, getProjects, getSkills, getProfile, getHero, 
  getContacts, sendMessage, type Project, type Skill, 
  type Profile, type Hero, type Contact 
} from "@/lib/supabase"

// ===========================================
// DADOS DE FALLBACK (caso Supabase não responda)
// ===========================================
const defaultProfile: Profile = {
  id: '1',
  name: 'Camile Pereira',
  title: 'Desenvolvedora',
  bio: 'Entusiasta de tecnologia em jornada de aprendizado contínuo. Com experiência prévia em programação, banco de dados e IA, estou expandindo meus conhecimentos para me tornar uma desenvolvedora full stack completa.',
  location: 'Brasil',
  email: 'camile@email.com',
  availability: 'available',
  years_experience: 2
}

const defaultHero: Hero = {
  id: '1',
  title: 'Olá, eu sou Camile Pereira',
  subtitle: 'Desenvolvedora em Evolução',
  description: 'Desenvolvedora em evolução, explorando o mundo da programação através de projetos práticos. Atualmente estudando frontend, backend e IA para me tornar uma profissional completa.',
  background_color: '#0f172a',
  cta_text: 'Ver Projetos',
  cta_url: '#projetos',
  secondary_cta_text: 'Contato',
  secondary_cta_url: '#contato',
  show_avatar: true,
  animation_type: 'typewriter'
}

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Cripto Analyzer',
    description: 'Análise de criptomoedas em tempo real com gráficos interativos e acompanhamento de preços.',
    technologies: ['React', 'API REST', 'Chart.js'],
    category: 'frontend',
    featured: true,
    order_index: 0,
    status: 'published',
    demo_url: 'https://crypto-analyzer-one-xi.vercel.app/'
  },
  {
    id: '2',
    title: 'Portfolio Web',
    description: 'Meu portfolio profissional com Next.js, TypeScript e Tailwind CSS.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    category: 'frontend',
    featured: true,
    order_index: 1,
    status: 'published'
  },
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

// ===========================================
// COMPONENTE PRINCIPAL
// ===========================================
export default function Home() {
  // Estados para dados do Supabase
  const [profile, setProfile] = useState<Profile | null>(null)
  const [hero, setHero] = useState<Hero | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados do formulário e chat
  const [formulario, setFormulario] = useState({ nome: "", email: "", mensagem: "" })
  const [chatAberto, setChatAberto] = useState(false)
  const [mensagens, setMensagens] = useState([{ autor: "bot" as const, texto: "Olá! Como posso ajudar?" }])
  const [inputChat, setInputChat] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [formEnviado, setFormEnviado] = useState(false)
  
  // Efeito de digitação
  const [textoDigitado, setTextoDigitado] = useState("")
  const nomeCompleto = profile?.name || "Camile Pereira"
  
  // ===========================================
  // BUSCAR DADOS DO SUPABASE
  // ===========================================
  useEffect(() => {
    async function fetchData() {
      try {
        const [profileData, heroData, projectsData, skillsData, contactsData] = await Promise.all([
          getProfile(),
          getHero(),
          getProjects(),
          getSkills(),
          getContacts()
        ])
        
        setProfile(profileData || defaultProfile)
        setHero(heroData || defaultHero)
        setProjects(projectsData.length > 0 ? projectsData : defaultProjects)
        setSkills(skillsData.length > 0 ? skillsData : defaultSkills)
        setContacts(contactsData.length > 0 ? contactsData : defaultContacts)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        // Usa dados de fallback
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

  // ===========================================
  // FUNÇÕES
  // ===========================================
  const enviarMensagem = async () => {
    if (!inputChat.trim() || carregando) return
    
    const mensagemUsuario = inputChat
    const novasMensagens = [...mensagens, { autor: "usuario" as const, texto: mensagemUsuario }]
    
    setMensagens(novasMensagens)
    setInputChat("")
    setCarregando(true)
    
    try {
      const resposta = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensagem: mensagemUsuario,
          historico: mensagens.slice(-4),
        }),
      })
      
      const dados = await resposta.json()
      
      setMensagens(prev => [...prev, { 
        autor: "bot", 
        texto: dados.resposta || "Desculpe, não consegui processar sua mensagem." 
      }])
    } catch (error) {
      setMensagens(prev => [...prev, { 
        autor: "bot", 
        texto: "Ops! Tive um problema técnico. Tente novamente." 
      }])
    } finally {
      setCarregando(false)
    }
  }

  const enviarFormulario = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await sendMessage({
      name: formulario.nome,
      email: formulario.email,
      message: formulario.mensagem
    })
    
    if (success) {
      setFormEnviado(true)
      setFormulario({ nome: "", email: "", mensagem: "" })
      setTimeout(() => setFormEnviado(false), 3000)
    } else {
      alert('Erro ao enviar mensagem. Tente novamente.')
    }
  }

  // Mapear categoria para ícone
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, typeof Code> = {
      frontend: Globe,
      backend: Code,
      database: Database,
      devops: Rocket,
      design: Brain,
      other: Code
    }
    return icons[category] || Code
  }

  // Mapear categoria para cor
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      frontend: 'bg-emerald-500',
      backend: 'bg-green-500',
      database: 'bg-teal-500',
      devops: 'bg-emerald-600',
      design: 'bg-green-600',
      other: 'bg-teal-600'
    }
    return colors[category] || 'bg-emerald-500'
  }

  // Ícone da rede social
  const getSocialIcon = (platform: string) => {
    const icons: Record<string, typeof Github> = {
      GitHub: Github,
      Linkedin: Linkedin,
      LinkedIn: Linkedin,
      Email: Mail
    }
    return icons[platform] || Mail
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
    <div className="min-h-screen flex flex-col relative">
      <ParticleBackground quantidade={40} />
      
      {/* =========================================== */}
      {/* HEADER */}
      {/* =========================================== */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1 
            className="text-xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary">Dev</span>Portfolio
          </motion.h1>
          
          <div className="hidden md:flex gap-6">
            <a href="#sobre" className="hover:text-primary transition-colors">Sobre</a>
            <a href="#projetos" className="hover:text-primary transition-colors">Projetos</a>
            <a href="#skills" className="hover:text-primary transition-colors">Skills</a>
            <a href="#contato" className="hover:text-primary transition-colors">Contato</a>
          </div>
          
          <Button onClick={() => setChatAberto(!chatAberto)} size="icon" className="rounded-full">
            <MessageCircle className="h-5 w-5" />
          </Button>
        </nav>
      </header>

      {/* =========================================== */}
      {/* HERO */}
      {/* =========================================== */}
      <section className="flex-1 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 blur-md opacity-60 animate-pulse" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center border-glow overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {profile?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'CP'}
                </span>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              {hero?.title?.split(profile?.name || 'Camile Pereira')[0] || 'Olá, eu sou '}
              <span className="text-gradient-green">
                {textoDigitado}
                <span className="animate-pulse">|</span>
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mt-4">
              {hero?.subtitle || profile?.title}
            </p>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl text-muted-foreground"
          >
            {hero?.description || profile?.bio}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-4 mt-4"
          >
            {hero?.cta_text && (
              <Button size="lg" asChild>
                <a href={hero.cta_url || '#projetos'}>
                  <Rocket className="mr-2 h-5 w-5" />
                  {hero.cta_text}
                </a>
              </Button>
            )}
            {hero?.secondary_cta_text && (
              <Button size="lg" variant="outline" asChild>
                <a href={hero.secondary_cta_url || '#contato'}>
                  <Mail className="mr-2 h-5 w-5" />
                  {hero.secondary_cta_text}
                </a>
              </Button>
            )}
          </motion.div>
          
          {/* Status de disponibilidade */}
          {profile?.availability && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-2 mt-4"
            >
              <span className={`w-3 h-3 rounded-full ${
                profile.availability === 'available' ? 'bg-emerald-500' :
                profile.availability === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
              } animate-pulse`} />
              <span className="text-sm text-muted-foreground">
                {profile.availability === 'available' ? 'Disponível para projetos' :
                 profile.availability === 'busy' ? 'Ocupado no momento' : 'Indisponível'}
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* =========================================== */}
      {/* SOBRE MIM */}
      {/* =========================================== */}
      <section id="sobre" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Sobre Mim</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Quem sou
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>{profile?.bio || defaultProfile.bio}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="flex items-center gap-2">
                    📍 {profile?.location || 'Brasil'}
                  </p>
                  <p className="flex items-center gap-2 mt-2">
                    💼 {profile?.years_experience || 2} anos de experiência
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Objetivos
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><span className="text-primary">•</span> Dominar tecnologias web modernas</li>
                    <li className="flex items-center gap-2"><span className="text-primary">•</span> Criar projetos impactantes</li>
                    <li className="flex items-center gap-2"><span className="text-primary">•</span> Contribuir com a comunidade</li>
                    <li className="flex items-center gap-2"><span className="text-primary">•</span> Integrar IA em aplicações</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Interesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Frontend</Badge>
                    <Badge variant="secondary">Backend</Badge>
                    <Badge variant="secondary">Inteligência Artificial</Badge>
                    <Badge variant="secondary">Banco de Dados</Badge>
                    <Badge variant="secondary">Mobile</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================== */}
      {/* PROJETOS */}
      {/* =========================================== */}
      <section id="projetos" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">Meus Projetos</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Cada projeto é uma oportunidade de aprender algo novo.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((projeto, index) => (
                <motion.div
                  key={projeto.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow hover:border-primary/50 group">
                    {projeto.image_url && (
                      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                        <img src={projeto.image_url} alt={projeto.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {projeto.title}
                        <div className="flex gap-2">
                          {projeto.demo_url && (
                            <a href={projeto.demo_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {projeto.github_url && (
                            <a href={projeto.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </CardTitle>
                      <CardDescription>{projeto.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {projeto.technologies?.map((tech) => (
                          <Badge key={tech} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================== */}
      {/* SKILLS */}
      {/* =========================================== */}
      <section id="skills" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">Minhas Skills</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Tecnologias que estou estudando e aprimorando.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {skills.map((skill, index) => {
                const IconComponent = getCategoryIcon(skill.category)
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 rounded-lg ${getCategoryColor(skill.category)} text-white`}>
                            {skill.icon_url ? (
                              <img src={skill.icon_url} alt={skill.name} className="w-5 h-5" />
                            ) : (
                              <IconComponent className="h-5 w-5" />
                            )}
                          </div>
                          <span className="font-medium">{skill.name}</span>
                          <span className="ml-auto text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================== */}
      {/* CONTATO */}
      {/* =========================================== */}
      <section id="contato" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-4">Entre em Contato</h2>
            <p className="text-center text-muted-foreground mb-8">
              Tem uma oportunidade ou projeto? Vamos conversar!
            </p>
            
            <Card>
              <CardContent className="pt-6">
                {formEnviado ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Mensagem Enviada!</h3>
                    <p className="text-muted-foreground">Obrigado pelo contato. Responderei em breve!</p>
                  </div>
                ) : (
                  <form onSubmit={enviarFormulario} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome</label>
                      <Input
                        placeholder="Seu nome"
                        value={formulario.nome}
                        onChange={(e) => setFormulario({...formulario, nome: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={formulario.email}
                        onChange={(e) => setFormulario({...formulario, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mensagem</label>
                      <Textarea
                        placeholder="Sua mensagem..."
                        value={formulario.mensagem}
                        onChange={(e) => setFormulario({...formulario, mensagem: e.target.value})}
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Mensagem
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
            
            {/* Links de redes sociais */}
            <div className="flex justify-center gap-4 mt-8">
              {contacts.map((contact) => {
                const IconComponent = getSocialIcon(contact.platform)
                return (
                  <Button key={contact.id} variant="outline" size="icon" asChild>
                    <a href={contact.url} target="_blank" rel="noopener noreferrer" title={contact.platform}>
                      <IconComponent className="h-5 w-5" />
                    </a>
                  </Button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================== */}
      {/* CHATBOT MODAL */}
      {/* =========================================== */}
      {chatAberto && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-20 right-4 w-80 z-50"
        >
          <Card className="shadow-xl">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-5 w-5" />
                Assistente IA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {mensagens.map((msg, index) => (
                  <div key={index} className={`flex ${msg.autor === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      msg.autor === 'usuario' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {msg.texto}
                    </div>
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
                <Input
                  placeholder="Digite sua mensagem..."
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !carregando && enviarMensagem()}
                  className="flex-1"
                  disabled={carregando}
                />
                <Button size="icon" onClick={enviarMensagem} disabled={carregando}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* =========================================== */}
      {/* FOOTER */}
      {/* =========================================== */}
      <footer className="bg-primary text-primary-foreground py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-bold">DevPortfolio</p>
              <p className="text-sm opacity-80">Feito com Next.js, TypeScript e ❤️</p>
            </div>
            
            <Separator orientation="vertical" className="hidden md:block h-8" />
            
            <div className="flex gap-4">
              {contacts.slice(0, 2).map((contact) => {
                const IconComponent = getSocialIcon(contact.platform)
                return (
                  <a key={contact.id} href={contact.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <IconComponent className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
          
          <Separator className="my-4 opacity-20" />
          
          <p className="text-center text-sm opacity-60">
            © {new Date().getFullYear()} {profile?.name || 'Camile Pereira'}. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
