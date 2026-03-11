'use client'

/*
===========================================
📚 EXPLICAÇÃO: 'USE CLIENT'
===========================================
'use client' = Esta diretiva diz ao Next.js que este componente
roda no lado do CLIENTE (navegador), não no servidor.

Componentes com 'use client' podem:
- Usar hooks (useState, useEffect, etc.)
- Ter interatividade (cliques, formulários)
- Acessar APIs do navegador (localStorage, etc.)
*/

// ===========================================
// 📚 EXPLICAÇÃO: IMPORTAÇÕES DE COMPONENTES
// ===========================================
import { Button } from "@/components/ui/button"        // Botão estilizado
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"  // Card (cartão)
import { Badge } from "@/components/ui/badge"         // Badge (etiqueta)
import { Input } from "@/components/ui/input"         // Campo de texto
import { Textarea } from "@/components/ui/textarea"   // Área de texto
import { Separator } from "@/components/ui/separator" // Linha separadora
import { 
  Github,           // Ícone do GitHub
  Linkedin,         // Ícone do LinkedIn
  Mail,             // Ícone de email
  ExternalLink,     // Ícone de link externo
  Code,             // Ícone de código
  Database,         // Ícone de banco de dados
  Brain,            // Ícone de IA/cérebro
  Globe,            // Ícone de web/globo
  Rocket,           // Ícone de foguete
  MessageCircle,    // Ícone de chat
  Send,             // Ícone de enviar
  User,             // Ícone de usuário
  Briefcase,        // Ícone de trabalho
  GraduationCap,    // Ícone de educação
  Heart,            // Ícone de coração
} from "lucide-react"  // Lucide = biblioteca de ícones

// ===========================================
// 📚 EXPLICAÇÃO: FRAMER MOTION
// ===========================================
import { motion } from "framer-motion"  // Biblioteca para animações

/*
Framer Motion permite criar animações suaves e bonitas.
- motion.div = uma <div> que pode ser animada
- initial = estado inicial da animação
- animate = estado final da animação
- transition = como a animação acontece (duração, tipo)
*/

import { useState, useEffect } from "react"  // Hooks do React

// ===========================================
// 📚 EXPLICAÇÃO: COMPONENTE DE PARTÍCULAS
// ===========================================
import ParticleBackground from "@/components/particle-background"  // Partículas flutuantes

// ===========================================
// 📚 EXPLICAÇÃO: DADOS DOS PROJETOS
// ===========================================
const projetos = [
  {
    id: 1,
    titulo: "Cripto Analyzer",
    descricao: "Análise de criptomoedas em tempo real com gráficos interativos e acompanhamento de preços.",
    tecnologias: ["React", "API REST", "Chart.js"],
    link: "#",
    categoria: "frontend",
  },
  {
    id: 2,
    titulo: "Portfolio Web",
    descricao: "Meu primeiro portfolio profissional com Next.js, TypeScript e Tailwind CSS.",
    tecnologias: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "#",
    categoria: "frontend",
  },
  {
    id: 3,
    titulo: "Sistema de Tarefas",
    descricao: "Aplicativo para gerenciar tarefas diárias com CRUD completo.",
    tecnologias: ["React", "Node.js", "MongoDB"],
    link: "#",
    categoria: "fullstack",
  },
  {
    id: 4,
    titulo: "Chatbot com IA",
    descricao: "Chatbot inteligente para atendimento automatizado.",
    tecnologias: ["Python", "OpenAI", "FastAPI"],
    link: "#",
    categoria: "ia",
  },
]

/*
===========================================
📚 EXPLICAÇÃO: ARRAY DE OBJETOS
===========================================
`projetos` é um ARRAY (lista) de OBJETOS.
Cada objeto tem:
- id: identificador único
- titulo: nome do projeto
- descricao: texto explicativo
- tecnologias: lista de tecnologias usadas
- link: link para o projeto
- categoria: tipo do projeto
*/

// ===========================================
// 📚 EXPLICAÇÃO: DADOS DAS SKILLS
// ===========================================
const skills = [
  { nome: "JavaScript", nivel: 70, icone: Code, cor: "bg-emerald-500" },
  { nome: "TypeScript", nivel: 60, icone: Code, cor: "bg-green-500" },
  { nome: "React", nivel: 65, icone: Globe, cor: "bg-teal-500" },
  { nome: "Node.js", nivel: 55, icone: Code, cor: "bg-emerald-600" },
  { nome: "Python", nivel: 50, icone: Brain, cor: "bg-green-600" },
  { nome: "SQL", nivel: 60, icone: Database, cor: "bg-teal-600" },
]

/*
===========================================
📚 EXPLICAÇÃO: BARRA DE PROGRESSO
===========================================
Cada skill tem:
- nome: nome da tecnologia
- nivel: porcentagem de conhecimento (0-100)
- icone: componente de ícone
- cor: cor da barra de progresso
*/

// ===========================================
// 📚 EXPLICAÇÃO: COMPONENTE PRINCIPAL
// ===========================================
export default function Home() {
  /*
  ===========================================
  📚 EXPLICAÇÃO: USESTATE
  ===========================================
  useState é um HOOK que permite guardar dados que mudam.
  
  Sintaxe: const [valor, setValor] = useState(valorInicial)
  
  - valor: o dado atual
  - setValor: função para ATUALIZAR o dado
  - valorInicial: valor que começa
  
  Quando você chama setValor, o React RE-RENDERIZA o componente
  (atualiza a tela com o novo valor).
  */
  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    mensagem: "",
  })
  
  // Estado para controlar se o chat está aberto ou fechado
  const [chatAberto, setChatAberto] = useState(false)
  
  // Estado para guardar as mensagens do chat
  const [mensagens, setMensagens] = useState([
    { autor: "bot", texto: "Olá! Como posso ajudar?" }
  ])
  
  // Estado para o input do chat
  const [inputChat, setInputChat] = useState("")
  
  // ===========================================
  // 📚 EXPLICAÇÃO: EFEITO DE DIGITAÇÃO
  // ===========================================
  const [textoDigitado, setTextoDigitado] = useState("")
  const nomeCompleto = "Camile Pereira"
  
  useEffect(() => {
    /*
    Este efeito simula uma digitação letra por letra.
    - i controla qual letra estamos adicionando
    - A cada 100ms, adiciona uma nova letra
    - Quando termina, para o intervalo
    */
    let i = 0
    const interval = setInterval(() => {
      if (i < nomeCompleto.length) {
        setTextoDigitado(nomeCompleto.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 100)
    
    return () => clearInterval(interval)  // Limpa ao desmontar
  }, [])

  // Estado para controlar se a IA está processando
  const [carregando, setCarregando] = useState(false)

  /*
  ===========================================
  📚 EXPLICAÇÃO: FUNÇÃO PARA ENVIAR MENSAGEM
  ===========================================
  Esta função é chamada quando o usuário clica em "Enviar"
  ou pressiona Enter no chat.
  
  Agora ela chama a API de IA para obter respostas inteligentes!
  */
  const enviarMensagem = async () => {
    if (!inputChat.trim() || carregando) return  // Se vazio ou carregando, não faz nada
    
    const mensagemUsuario = inputChat
    const novasMensagens = [...mensagens, { autor: "usuario" as const, texto: mensagemUsuario }]
    
    // Adiciona mensagem do usuário
    setMensagens(novasMensagens)
    setInputChat("")  // Limpa o input
    setCarregando(true)  // Mostra que está processando
    
    try {
      /*
      ==========================================
      📚 EXPLICAÇÃO: FETCH API
      ==========================================
      fetch() faz uma requisição HTTP para um servidor.
      
      - method: 'POST' = enviando dados
      - headers: { 'Content-Type': 'application/json' } = diz que o corpo é JSON
      - body: JSON.stringify(...) = converte objeto para string JSON
      
      A API está em /api/chat, que é o arquivo route.ts que criamos.
      */
      const resposta = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mensagem: mensagemUsuario,
          historico: mensagens.slice(-4),  // Últimas 4 mensagens para contexto
        }),
      })
      
      const dados = await resposta.json()
      
      // Adiciona resposta da IA
      setMensagens(prev => [...prev, { 
        autor: "bot", 
        texto: dados.resposta || "Desculpe, não consegui processar sua mensagem." 
      }])
      
    } catch (error) {
      // Se der erro, mostra mensagem amigável
      console.error('Erro ao enviar mensagem:', error)
      setMensagens(prev => [...prev, { 
        autor: "bot", 
        texto: "Ops! Tive um problema técnico. Tente novamente em instantes. 🙁" 
      }])
    } finally {
      setCarregando(false)  // Termina o carregamento
    }
  }

  /*
  ===========================================
  📚 EXPLICAÇÃO: FUNÇÃO PARA ENVIAR FORMULÁRIO
  ===========================================
  Esta função simula o envio do formulário de contato.
  */
  const enviarFormulario = (e: React.FormEvent) => {
    e.preventDefault()  // Previne o recarregamento da página
    alert(`Mensagem enviada! Obrigado ${formulario.nome}!`)
    setFormulario({ nome: "", email: "", mensagem: "" })  // Limpa o formulário
  }

  // ===========================================
  // 📚 EXPLICAÇÃO: RETURN DO COMPONENTE
  // ===========================================
  // Tudo que está dentro do return é o que aparece na tela (JSX)
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 
        min-h-screen = altura mínima de uma tela (100vh)
        flex flex-col = display flex com direção coluna (itens embaixo um do outro)
        relative = posicionamento relativo para as partículas
      */}
      
      {/* =========================================== */}
      {/* PARTÍCULAS FLUTUANTES (APENAS NO HERO) */}
      {/* =========================================== */}
      <ParticleBackground quantidade={40} />
      
      {/* =========================================== */}
      {/* SEÇÃO: HEADER / NAVEGAÇÃO */}
      {/* =========================================== */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        {/*
          sticky top-0 = fixa no topo quando rola a página
          z-50 = z-index alto (fica por cima de outros elementos)
          bg-background/95 = fundo com 95% de opacidade
          backdrop-blur = efeito de desfoque no fundo
          border-b = borda na parte de baixo
        */}
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/*
            container = largura máxima centralizada
            mx-auto = margin horizontal automática (centraliza)
            px-4 = padding horizontal de 1rem
            py-4 = padding vertical de 1rem
            flex justify-between = flex com espaço entre os itens
            items-center = alinha verticalmente ao centro
          */}
          
          {/* Logo / Nome */}
          <motion.h1 
            className="text-xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/*
              motion.h1 = h1 animado
              initial = começa invisível (opacity: 0) e deslocado à esquerda (x: -20)
              animate = termina visível (opacity: 1) e na posição normal (x: 0)
              transition = animação dura 0.5 segundos
            */}
            <span className="text-primary">Dev</span>Portfolio
          </motion.h1>
          
          {/* Links de navegação */}
          <div className="hidden md:flex gap-6">
            {/*
              hidden = escondido por padrão
              md:flex = aparece como flex em telas médias e grandes
              gap-6 = espaçamento de 1.5rem entre itens
            */}
            <a href="#sobre" className="hover:text-primary transition-colors">Sobre</a>
            <a href="#projetos" className="hover:text-primary transition-colors">Projetos</a>
            <a href="#skills" className="hover:text-primary transition-colors">Skills</a>
            <a href="#contato" className="hover:text-primary transition-colors">Contato</a>
          </div>
          
          {/* Botão do Chatbot */}
          <Button 
            onClick={() => setChatAberto(!chatAberto)}
            size="icon"
            className="rounded-full"
          >
            {/*
              onClick = função chamada ao clicar
              size="icon" = tamanho pequeno, quadrado
              className="rounded-full" = totalmente arredondado
            */}
            <MessageCircle className="h-5 w-5" />
          </Button>
        </nav>
      </header>

      {/* =========================================== */}
      {/* SEÇÃO: HERO (APRESENTAÇÃO) */}
      {/* =========================================== */}
      <section className="flex-1 container mx-auto px-4 py-20">
        {/*
          section = tag semântica para seção da página
          flex-1 = ocupa todo espaço disponível
          py-20 = padding vertical de 5rem
        */}
        
        <div className="flex flex-col items-center text-center gap-6">
          {/* Avatar com borda brilhante */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative"
          >
            {/* Anel externo brilhante */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 blur-md opacity-60 animate-pulse" />
            
            {/* Avatar principal */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center border-glow">
              {/*
                w-32 h-32 = largura e altura de 8rem
                rounded-full = totalmente arredondado (círculo)
                bg-gradient-to-br = gradiente do topo-esquerda para baixo-direita
                from-emerald-500 to-green-600 = gradiente verde
                border-glow = borda brilhante (definido no CSS)
              */}
              <span className="text-4xl font-bold text-white">CP</span>
            </div>
          </motion.div>
          
          {/* Título animado com efeito de digitação */}
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
              {/*
                text-4xl = texto grande (2.25rem)
                md:text-5xl = ainda maior em telas médias
                font-bold = negrito
                text-gradient-green = gradiente verde (definido no CSS)
                animate-pulse = barra pulsando (efeito de cursor)
              */}
            </h2>
            <p className="text-xl text-muted-foreground mt-4">
              Apaixonada por tecnologia e aprendendo todos os dias
            </p>
          </motion.div>
          
          {/* Descrição */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl text-muted-foreground"
          >
            {/*
              max-w-2xl = largura máxima de 42rem
              text-muted-foreground = cor mais suave para texto secundário
            */}
            Desenvolvedora em evolução, explorando o mundo da programação
            através de projetos práticos. Atualmente estudando frontend,
            backend e IA para me tornar uma profissional completa.
          </motion.p>
          
          {/* Botões de ação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-4 mt-4"
          >
            <Button size="lg" asChild>
              {/*
                size="lg" = tamanho grande
                asChild = passa as props para o filho (link)
              */}
              <a href="#projetos">
                <Rocket className="mr-2 h-5 w-5" />
                Ver Projetos
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              {/*
                variant="outline" = estilo de borda (não preenchido)
              */}
              <a href="#contato">
                <Mail className="mr-2 h-5 w-5" />
                Entre em Contato
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* =========================================== */}
      {/* SEÇÃO: SOBRE MIM */}
      {/* =========================================== */}
      <section id="sobre" className="bg-muted/50 py-20">
        {/*
          bg-muted/50 = cor de fundo suave com 50% opacidade
        */}
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            {/*
              whileInView = anima quando entra na tela
              viewport={{ once: true }} = anima apenas uma vez
            */}
            
            <h2 className="text-3xl font-bold text-center mb-8">
              Sobre Mim
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Card: Quem sou */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Quem sou
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    Entusiasta de tecnologia em jornada de aprendizado contínuo.
                    Com experiência prévia em programação, banco de dados e IA,
                    estou expandindo meus conhecimentos para me tornar uma
                    desenvolvedora full stack completa.
                  </p>
                </CardContent>
              </Card>
              
              {/* Card: Objetivos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Objetivos
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      Dominar tecnologias web modernas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      Criar projetos impactantes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      Contribuir com a comunidade
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      Integrar IA em aplicações
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Card: Interesses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Interesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {/*
                      flex-wrap = permite quebrar linha quando não cabe
                    */}
                    <Badge variant="secondary">Frontend</Badge>
                    <Badge variant="secondary">Backend</Badge>
                    <Badge variant="secondary">Inteligência Artificial</Badge>
                    <Badge variant="secondary">Banco de Dados</Badge>
                    <Badge variant="secondary">Mobile</Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Card: Disponibilidade */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Disponibilidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    Atualmente dedicando <strong>3 dias por semana</strong> para
                    estudos e projetos. Aberto a oportunidades de estágio,
                    projetos freelance e colaborações open source.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================== */}
      {/* SEÇÃO: PROJETOS */}
      {/* =========================================== */}
      <section id="projetos" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">
              Meus Projetos
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Cada projeto é uma oportunidade de aprender algo novo.
              Aqui estão alguns que desenvolvi durante minha jornada.
            </p>
            
            {/* Grid de projetos */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/*
                grid md:grid-cols-2 = grid com 2 colunas em tela média
                lg:grid-cols-3 = 3 colunas em tela grande
              */}
              {projetos.map((projeto, index) => (
                <motion.div
                  key={projeto.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/*
                    .map() = percorre cada item do array
                    key = identificador único para o React (ajuda na performance)
                    delay: index * 0.1 = cada card anima com delay progressivo
                  */}
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {/*
                      h-full = altura total disponível
                      hover:shadow-lg = sombra maior ao passar o mouse
                    */}
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {projeto.titulo}
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </CardTitle>
                      <CardDescription>
                        {projeto.descricao}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Badges das tecnologias */}
                      <div className="flex flex-wrap gap-2">
                        {projeto.tecnologias.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
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
      {/* SEÇÃO: SKILLS */}
      {/* =========================================== */}
      <section id="skills" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">
              Minhas Skills
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Tecnologias que estou estudando e aprimorando.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {skills.map((skill, index) => {
                const IconeComponente = skill.icone
                return (
                  <motion.div
                    key={skill.nome}
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
                          <span className="ml-auto text-muted-foreground">
                            {skill.nivel}%
                          </span>
                        </div>
                        
                        {/* Barra de progresso */}
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

      {/* =========================================== */}
      {/* SEÇÃO: CONTATO */}
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
            <h2 className="text-3xl font-bold text-center mb-4">
              Entre em Contato
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Tem uma oportunidade ou projeto? Vamos conversar!
            </p>
            
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={enviarFormulario} className="space-y-4">
                  {/*
                    onSubmit = função chamada ao enviar o formulário
                    space-y-4 = espaçamento vertical entre os filhos
                  */}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      placeholder="Seu nome"
                      value={formulario.nome}
                      onChange={(e) => setFormulario({...formulario, nome: e.target.value})}
                      required
                    />
                    {/*
                      placeholder = texto que aparece quando vazio
                      value = valor atual do input (controlado pelo estado)
                      onChange = função chamada ao digitar
                      required = campo obrigatório
                      
                      onChange explicado:
                      - e.target.value = novo valor digitado
                      - setFormulario({...formulario, nome: e.target.value})
                        - ...formulario = mantém os outros campos
                        - nome: e.target.value = atualiza apenas o nome
                    */}
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
            
            {/* Links de redes sociais */}
            <div className="flex justify-center gap-4 mt-8">
              <Button variant="outline" size="icon" asChild>
                <a href="https://github.com/camz-dev" target="_blank" rel="noopener noreferrer">
                  {/*
                    target="_blank" = abre em nova aba
                    rel="noopener noreferrer" = segurança (previne ataques)
                  */}
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="https://www.linkedin.com/in/camile-pereira-52b210236" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="mailto:camile@email.com">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
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
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-20 right-4 w-80 z-50"
        >
          {/*
            fixed = posição fixa na tela
            bottom-20 right-4 = 5rem do baixo, 1rem da direita
            w-80 = largura de 20rem
            z-50 = z-index alto
          */}
          <Card className="shadow-xl">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-5 w-5" />
                Assistente IA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Área de mensagens */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {mensagens.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.autor === 'usuario' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        msg.autor === 'usuario'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.texto}
                    </div>
                  </div>
                ))}
                
                {/* Indicador de "digitando..." */}
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
              
              {/* Input do chat */}
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
      {/* SEÇÃO: FOOTER */}
      {/* =========================================== */}
      <footer className="bg-primary text-primary-foreground py-8 mt-auto">
        {/*
          mt-auto = margin-top automática (empurra o footer para baixo)
          Isso faz o footer ficar "grudado" no fundo quando há pouco conteúdo
        */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-bold">DevPortfolio</p>
              <p className="text-sm opacity-80">
                Feito com Next.js, TypeScript e ❤️
              </p>
            </div>
            
            <Separator orientation="vertical" className="hidden md:block h-8" />
            
            <div className="flex gap-4">
              <a href="https://github.com/camz-dev" target="_blank" rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/camile-pereira-52b210236" target="_blank" rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity">
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
