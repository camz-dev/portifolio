'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  Github, Linkedin, Mail, ExternalLink, Code, Database, Brain, Globe, 
  Rocket, MessageCircle, Send, User, Briefcase, GraduationCap, Heart,
  Phone
} from "lucide-react"
import { motion } from "framer-motion"
import ParticleBackground from "@/components/particle-background"
import AdminPanel from "@/components/admin/AdminPanel"
import { ThemeToggle } from "@/components/theme-toggle"

// URL secreta para acessar o admin (mude para algo único)
const ADMIN_SECRET_KEY = "camz-admin-x9k2m7p4q"
const ADMIN_SECRET_PARAM = "admin_access"

// Interfaces
interface Projeto {
  id: string
  titulo: string
  descricao: string
  tecnologias: string[]
  link: string
  categoria: string
  imagem?: string
  ordem: number
}

interface Skill {
  id: string
  nome: string
  nivel: number
  cor: string
  icone: string
  ordem: number
}

interface Perfil {
  id: string
  nome: string
  titulo: string
  descricao: string
  email: string
  telefone?: string
  github_url: string
  linkedin_url: string
  disponibilidade: string
  sobre: string
  objetivos: string[]
  interesses: string[]
  contato_whatsapp?: string
  contato_endereco?: string
}

export default function Home() {
  const [modoAdmin, setModoAdmin] = useState(false)
  const [acessoAutorizado, setAcessoAutorizado] = useState(false)
  const [senha, setSenha] = useState('')
  const [erroSenha, setErroSenha] = useState('')
  const [urlDetectada, setUrlDetectada] = useState(false)
  
  const [formulario, setFormulario] = useState({ nome: "", email: "", mensagem: "" })
  const [chatAberto, setChatAberto] = useState(false)
  const [mensagens, setMensagens] = useState([{ autor: "bot" as const, texto: "Olá! Como posso ajudar?" }])
  const [inputChat, setInputChat] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [textoDigitado, setTextoDigitado] = useState("")
  
  // Estados dos dados do Supabase
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [perfil, setPerfil] = useState<Perfil | null>(null)

  // Carregar dados do Supabase
  const carregarDados = useCallback(async () => {
    try {
      const [projetosRes, skillsRes, perfilRes] = await Promise.all([
        fetch('/api/projetos'),
        fetch('/api/skills'),
        fetch('/api/perfil')
      ])
      
      const projetosData = await projetosRes.json()
      const skillsData = await skillsRes.json()
      const perfilData = await perfilRes.json()
      
      setProjetos(projetosData)
      setSkills(skillsData)
      setPerfil(perfilData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }, [])

  // Verificar URL secreta e token salvo
  useEffect(() => {
    // Verificar se a URL contém o parâmetro secreto
    const params = new URLSearchParams(window.location.search)
    const adminAccess = params.get(ADMIN_SECRET_PARAM)
    
    if (adminAccess === ADMIN_SECRET_KEY) {
      setUrlDetectada(true)
      setAcessoAutorizado(true)
      
      // Verificar se já tem token salvo
      const token = localStorage.getItem('admin_token')
      if (token) {
        setModoAdmin(true)
      }
      
      // Limpar a URL (remover o parâmetro secreto) por segurança
      setTimeout(() => {
        window.history.replaceState({}, '', window.location.pathname)
      }, 100)
    }
  }, [])

  // Carregar dados ao montar
  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  // Atualização automática a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!modoAdmin) {
        carregarDados()
      }
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [modoAdmin, carregarDados])

  // Recarregar dados quando sair do modo admin
  useEffect(() => {
    if (!modoAdmin) {
      carregarDados()
    }
  }, [modoAdmin, carregarDados])

  // Efeito de digitação
  useEffect(() => {
    const nome = perfil?.nome || "Camile Pereira"
    let i = 0
    const interval = setInterval(() => {
      if (i < nome.length) {
        setTextoDigitado(nome.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [perfil?.nome])

  // Verificar senha do admin
  const verificarSenha = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: senha })
      })
      const data = await res.json()
      
      if (data.success) {
        localStorage.setItem('admin_token', data.token)
        setModoAdmin(true)
        setSenha('')
        setErroSenha('')
      } else {
        setErroSenha('Senha incorreta!')
      }
    } catch {
      setErroSenha('Erro ao autenticar')
    }
  }

  // Tela de login do admin (só aparece se tiver acesso autorizado via URL)
  if (acessoAutorizado && !modoAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🔐 Acesso Administrativo</CardTitle>
            <CardDescription>
              {urlDetectada 
                ? '✅ URL secreta detectada! Digite sua senha para continuar.'
                : 'Digite sua senha para acessar o painel'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha de administrador"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && verificarSenha()}
              />
              {erroSenha && <p className="text-sm text-destructive">{erroSenha}</p>}
            </div>
            <div className="flex gap-2">
              <Button onClick={verificarSenha} className="flex-1">
                Entrar
              </Button>
              <Button variant="outline" onClick={() => {
                setAcessoAutorizado(false)
                setUrlDetectada(false)
              }}>
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Se estiver no modo admin, mostrar o painel
  if (modoAdmin) {
    return <AdminPanel onLogout={() => {
      setModoAdmin(false)
      setAcessoAutorizado(false)
      localStorage.removeItem('admin_token')
      carregarDados()
    }} />
  }

  const enviarMensagem = async () => {
    if (!inputChat.trim() || carregando) return
    
    const mensagemUsuario = inputChat
    setMensagens([...mensagens, { autor: "usuario" as const, texto: mensagemUsuario }])
    setInputChat("")
    setCarregando(true)
    
    try {
      const resposta = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: mensagemUsuario, historico: mensagens.slice(-4) }),
      })
      const dados = await resposta.json()
      setMensagens(prev => [...prev, { autor: "bot", texto: dados.resposta || "Desculpe, não consegui processar sua mensagem." }])
    } catch {
      setMensagens(prev => [...prev, { autor: "bot", texto: "Ops! Tive um problema técnico. Tente novamente." }])
    } finally {
      setCarregando(false)
    }
  }

  const enviarFormulario = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Mensagem enviada! Obrigado ${formulario.nome}! Entrarei em contato em breve.`)
    setFormulario({ nome: "", email: "", mensagem: "" })
  }

  const getIconeSkill = (icone: string) => {
    switch (icone) {
      case 'Database': return Database
      case 'Brain': return Brain
      case 'Globe': return Globe
      default: return Code
    }
  }

  const getImagemProjeto = (projeto: Projeto) => {
    if (projeto.imagem) return projeto.imagem
    
    const imagensPadrao: Record<string, string> = {
      'Cripto Analyzer': '/projetos/cripto-analyzer.png',
      'Portfolio Web': '/projetos/portfolio-web.png',
      'Sistema de Tarefas': '/projetos/sistema-tarefas.png',
      'Chatbot com IA': '/projetos/chatbot-ia.png',
    }
    
    return imagensPadrao[projeto.titulo] || '/projetos/default.png'
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticleBackground quantidade={40} />

      {/* Header */}
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
          
          <div className="flex gap-2">
            <ThemeToggle />
            <Button onClick={() => setChatAberto(!chatAberto)} size="icon" className="rounded-full">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 blur-md opacity-60 animate-pulse" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center border-glow">
              <span className="text-4xl font-bold text-white">
                {perfil?.nome?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'CP'}
              </span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Olá, eu sou{" "}
              <span className="text-gradient-green">
                {textoDigitado}
                <span className="animate-pulse">|</span>
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mt-4">
              {perfil?.titulo || "Apaixonada por tecnologia e aprendendo todos os dias"}
            </p>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl text-muted-foreground"
          >
            {perfil?.descricao || "Desenvolvedora em evolução, explorando o mundo da programação através de projetos práticos."}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-4 mt-4"
          >
            <Button size="lg" asChild>
              <a href="#projetos">
                <Rocket className="mr-2 h-5 w-5" />
                Ver Projetos
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#contato">
                <Mail className="mr-2 h-5 w-5" />
                Entre em Contato
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Sobre Mim */}
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
                  <p>{perfil?.sobre || "Entusiasta de tecnologia em jornada de aprendizado contínuo."}</p>
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
                    {(perfil?.objetivos || ["Dominar tecnologias web modernas", "Criar projetos impactantes"]).map((obj, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        {obj}
                      </li>
                    ))}
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
                    {(perfil?.interesses || ["Frontend", "Backend", "IA", "Banco de Dados"]).map((interesse) => (
                      <Badge key={interesse} variant="secondary">{interesse}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Disponibilidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    Atualmente dedicando <strong>{perfil?.disponibilidade || "tempo integral"}</strong> para
                    estudos e projetos. Aberto a oportunidades de estágio,
                    projetos freelance e colaborações open source.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projetos */}
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
              Aqui estão alguns que desenvolvi durante minha jornada.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {projetos.map((projeto, index) => (
                <motion.div
                  key={projeto.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a href={projeto.link} target="_blank" rel="noopener noreferrer" className="block group">
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img
                          src={getImagemProjeto(projeto)}
                          alt={projeto.titulo}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Badge variant="secondary" className="text-xs">
                            {projeto.categoria}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{projeto.titulo}</span>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardTitle>
                        <CardDescription>{projeto.descricao}</CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {projeto.tecnologias?.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
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
                const IconeComponente = getIconeSkill(skill.icone)
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
                          <div className={`p-2 rounded-lg ${skill.cor} text-white`}>
                            <IconeComponente className="h-5 w-5" />
                          </div>
                          <span className="font-medium">{skill.nome}</span>
                          <span className="ml-auto text-muted-foreground">{skill.nivel}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${skill.cor}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.nivel}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contato */}
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
              </CardContent>
            </Card>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{perfil?.email || 'camile@email.com'}</span>
              </div>
              {perfil?.contato_whatsapp && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a 
                    href={`https://wa.me/${perfil.contato_whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              )}
              {perfil?.contato_endereco && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <span>{perfil.contato_endereco}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-center gap-4 mt-6">
              <Button variant="outline" size="icon" asChild>
                <a href={perfil?.github_url || "https://github.com/camz-dev"} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={perfil?.linkedin_url || "https://www.linkedin.com/in/camile-pereira-52b210236"} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={`mailto:${perfil?.email || 'camile@email.com'}`}>
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chatbot Modal */}
      {chatAberto && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
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
                    <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${msg.autor === 'usuario' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
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

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-bold">DevPortfolio</p>
              <p className="text-sm opacity-80">Feito com Next.js, TypeScript e ❤️</p>
            </div>
            <Separator orientation="vertical" className="hidden md:block h-8" />
            <div className="flex gap-4">
              <a href={perfil?.github_url || "https://github.com/camz-dev"} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Github className="h-5 w-5" />
              </a>
              <a href={perfil?.linkedin_url || "https://www.linkedin.com/in/camile-pereira-52b210236"} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <Separator className="my-4 opacity-20" />
          <p className="text-center text-sm opacity-60">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
