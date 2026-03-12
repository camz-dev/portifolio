'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  LogOut,
  Lock,
  Code,
  Database,
  Brain,
  Globe,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
} from 'lucide-react'

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
  // Configurações de contato
  contato_email?: string
  contato_telefone?: string
  contato_whatsapp?: string
  contato_endereco?: string
}

const CORES_SKILLS = [
  { valor: 'bg-emerald-500', label: 'Verde Claro' },
  { valor: 'bg-green-500', label: 'Verde' },
  { valor: 'bg-teal-500', label: 'Verde Azulado' },
  { valor: 'bg-emerald-600', label: 'Verde Escuro' },
  { valor: 'bg-green-600', label: 'Verde Médio' },
  { valor: 'bg-teal-600', label: 'Teal Escuro' },
  { valor: 'bg-amber-500', label: 'Âmbar' },
  { valor: 'bg-orange-500', label: 'Laranja' },
  { valor: 'bg-rose-500', label: 'Rosa' },
]

const ICONES_SKILLS = [
  { valor: 'Code', label: 'Código' },
  { valor: 'Database', label: 'Banco de Dados' },
  { valor: 'Brain', label: 'IA/Cérebro' },
  { valor: 'Globe', label: 'Web/Globo' },
]

const IMAGENS_PROJETOS = [
  { valor: '/projetos/cripto-analyzer.png', label: 'Cripto Analyzer' },
  { valor: '/projetos/portfolio-web.png', label: 'Portfolio Web' },
  { valor: '/projetos/sistema-tarefas.png', label: 'Sistema de Tarefas' },
  { valor: '/projetos/chatbot-ia.png', label: 'Chatbot IA' },
]

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false)
  const [senha, setSenha] = useState('')
  const [erroLogin, setErroLogin] = useState('')
  const [abaAtiva, setAbaAtiva] = useState<'projetos' | 'skills' | 'perfil' | 'contato'>('projetos')
  
  // Estados dos dados
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  
  // Estados de edição
  const [editandoProjeto, setEditandoProjeto] = useState<Projeto | null>(null)
  const [editandoSkill, setEditandoSkill] = useState<Skill | null>(null)
  const [novoProjeto, setNovoProjeto] = useState<Partial<Projeto>>({
    titulo: '',
    descricao: '',
    tecnologias: [],
    link: '',
    categoria: 'frontend',
    imagem: '/projetos/default.png',
  })
  const [novaSkill, setNovaSkill] = useState<Partial<Skill>>({
    nome: '',
    nivel: 50,
    cor: 'bg-emerald-500',
    icone: 'Code',
  })
  const [techInput, setTechInput] = useState('')
  const [urlImagem, setUrlImagem] = useState('')

  // Carregar dados
  useEffect(() => {
    if (autenticado) {
      carregarProjetos()
      carregarSkills()
      carregarPerfil()
    }
  }, [autenticado])

  // Verificar autenticação salva
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      verificarToken(token)
    }
  }, [])

  const verificarToken = async (token: string) => {
    try {
      const res = await fetch('/api/auth', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setAutenticado(true)
      }
    } catch {
      localStorage.removeItem('admin_token')
    }
  }

  const login = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: senha })
      })
      const data = await res.json()
      
      if (data.success) {
        localStorage.setItem('admin_token', data.token)
        setAutenticado(true)
        setSenha('')
        setErroLogin('')
      } else {
        setErroLogin('Senha incorreta')
      }
    } catch {
      setErroLogin('Erro ao autenticar')
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setAutenticado(false)
  }

  const carregarProjetos = async () => {
    const res = await fetch('/api/projetos')
    const data = await res.json()
    setProjetos(data)
  }

  const carregarSkills = async () => {
    const res = await fetch('/api/skills')
    const data = await res.json()
    setSkills(data)
  }

  const carregarPerfil = async () => {
    const res = await fetch('/api/perfil')
    const data = await res.json()
    setPerfil(data)
  }

  // CRUD Projetos
  const salvarProjeto = async (projeto: Partial<Projeto>) => {
    if (projeto.id) {
      await fetch('/api/projetos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projeto)
      })
    } else {
      await fetch('/api/projetos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...projeto, ordem: projetos.length + 1 })
      })
    }
    carregarProjetos()
    setEditandoProjeto(null)
    setNovoProjeto({ titulo: '', descricao: '', tecnologias: [], link: '', categoria: 'frontend', imagem: '/projetos/default.png' })
  }

  const deletarProjeto = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      await fetch(`/api/projetos?id=${id}`, { method: 'DELETE' })
      carregarProjetos()
    }
  }

  const moverProjeto = async (projeto: Projeto, direcao: 'up' | 'down') => {
    const index = projetos.findIndex(p => p.id === projeto.id)
    if (
      (direcao === 'up' && index === 0) || 
      (direcao === 'down' && index === projetos.length - 1)
    ) return

    const novoIndex = direcao === 'up' ? index - 1 : index + 1
    const projetoTrocar = projetos[novoIndex]

    await fetch('/api/projetos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: projeto.id, ordem: projetoTrocar.ordem })
    })
    await fetch('/api/projetos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: projetoTrocar.id, ordem: projeto.ordem })
    })
    carregarProjetos()
  }

  // CRUD Skills
  const salvarSkill = async (skill: Partial<Skill>) => {
    if (skill.id) {
      await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill)
      })
    } else {
      await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...skill, ordem: skills.length + 1 })
      })
    }
    carregarSkills()
    setEditandoSkill(null)
    setNovaSkill({ nome: '', nivel: 50, cor: 'bg-emerald-500', icone: 'Code' })
  }

  const deletarSkill = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta skill?')) {
      await fetch(`/api/skills?id=${id}`, { method: 'DELETE' })
      carregarSkills()
    }
  }

  // Salvar Perfil
  const salvarPerfil = async () => {
    if (!perfil) return
    await fetch('/api/perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(perfil)
    })
    alert('Perfil atualizado!')
  }

  const adicionarTech = () => {
    if (techInput.trim()) {
      const projeto = editandoProjeto || novoProjeto
      const novasTechs = [...(projeto.tecnologias || []), techInput.trim()]
      
      if (editandoProjeto) {
        setEditandoProjeto({ ...editandoProjeto, tecnologias: novasTechs })
      } else {
        setNovoProjeto({ ...novoProjeto, tecnologias: novasTechs })
      }
      setTechInput('')
    }
  }

  const removerTech = (index: number) => {
    const projeto = editandoProjeto || novoProjeto
    const novasTechs = projeto.tecnologias?.filter((_, i) => i !== index) || []
    
    if (editandoProjeto) {
      setEditandoProjeto({ ...editandoProjeto, tecnologias: novasTechs })
    } else {
      setNovoProjeto({ ...novoProjeto, tecnologias: novasTechs })
    }
  }

  const adicionarImagem = () => {
    if (urlImagem.trim()) {
      if (editandoProjeto) {
        setEditandoProjeto({ ...editandoProjeto, imagem: urlImagem.trim() })
      } else {
        setNovoProjeto({ ...novoProjeto, imagem: urlImagem.trim() })
      }
      setUrlImagem('')
    }
  }

  // Tela de Login
  if (!autenticado) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Acesso Administrativo
            </DialogTitle>
            <DialogDescription>
              Digite a senha para acessar o painel de administração.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Senha de admin"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
            />
            {erroLogin && <p className="text-sm text-destructive">{erroLogin}</p>}
            <Button onClick={login} className="w-full">
              Entrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Painel Admin
  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie seu portfolio</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={abaAtiva === 'projetos' ? 'default' : 'outline'}
            onClick={() => setAbaAtiva('projetos')}
          >
            Projetos
          </Button>
          <Button 
            variant={abaAtiva === 'skills' ? 'default' : 'outline'}
            onClick={() => setAbaAtiva('skills')}
          >
            Skills
          </Button>
          <Button 
            variant={abaAtiva === 'perfil' ? 'default' : 'outline'}
            onClick={() => setAbaAtiva('perfil')}
          >
            Perfil
          </Button>
          <Button 
            variant={abaAtiva === 'contato' ? 'default' : 'outline'}
            onClick={() => setAbaAtiva('contato')}
          >
            Contato
          </Button>
        </div>

        {/* Conteúdo das Abas */}
        {abaAtiva === 'projetos' && (
          <div className="space-y-6">
            {/* Adicionar Projeto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adicionar Novo Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Título do projeto"
                    value={novoProjeto.titulo}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, titulo: e.target.value })}
                  />
                  <Input
                    placeholder="Link do projeto"
                    value={novoProjeto.link}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, link: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Descrição do projeto"
                  value={novoProjeto.descricao}
                  onChange={(e) => setNovoProjeto({ ...novoProjeto, descricao: e.target.value })}
                />
                
                {/* Imagem do Projeto */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Imagem do Projeto
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="URL da imagem"
                        value={urlImagem}
                        onChange={(e) => setUrlImagem(e.target.value)}
                      />
                      <Button onClick={adicionarImagem} variant="outline" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      value={novoProjeto.imagem || ''}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, imagem: e.target.value })}
                    >
                      <option value="">Selecione uma imagem</option>
                      {IMAGENS_PROJETOS.map((img) => (
                        <option key={img.valor} value={img.valor}>{img.label}</option>
                      ))}
                    </select>
                  </div>
                  {novoProjeto.imagem && (
                    <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border">
                      <img 
                        src={novoProjeto.imagem} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Tecnologias */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tecnologias</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nova tecnologia"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarTech())}
                    />
                    <Button onClick={adicionarTech} variant="outline">Adicionar</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {novoProjeto.tecnologias?.map((tech, i) => (
                      <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removerTech(i)}>
                        {tech} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Categoria */}
                <div className="w-full md:w-1/2">
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={novoProjeto.categoria}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, categoria: e.target.value })}
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Full Stack</option>
                    <option value="ia">IA</option>
                  </select>
                </div>
                
                <Button onClick={() => salvarProjeto(novoProjeto)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Projeto
                </Button>
              </CardContent>
            </Card>

            {/* Lista de Projetos */}
            <div className="space-y-4">
              <h3 className="font-semibold">Projetos Existentes</h3>
              {projetos.map((projeto) => (
                <Card key={projeto.id}>
                  <CardContent className="pt-6">
                    {editandoProjeto?.id === projeto.id ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            value={editandoProjeto.titulo}
                            onChange={(e) => setEditandoProjeto({ ...editandoProjeto, titulo: e.target.value })}
                          />
                          <Input
                            value={editandoProjeto.link}
                            onChange={(e) => setEditandoProjeto({ ...editandoProjeto, link: e.target.value })}
                          />
                        </div>
                        <Textarea
                          value={editandoProjeto.descricao}
                          onChange={(e) => setEditandoProjeto({ ...editandoProjeto, descricao: e.target.value })}
                        />
                        
                        {/* Imagem */}
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="URL da imagem"
                              value={urlImagem}
                              onChange={(e) => setUrlImagem(e.target.value)}
                            />
                            <Button onClick={() => {
                              if (urlImagem.trim()) {
                                setEditandoProjeto({ ...editandoProjeto, imagem: urlImagem.trim() })
                                setUrlImagem('')
                              }
                            }} variant="outline" size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                          <select 
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            value={editandoProjeto.imagem || ''}
                            onChange={(e) => setEditandoProjeto({ ...editandoProjeto, imagem: e.target.value })}
                          >
                            <option value="">Selecione uma imagem</option>
                            {IMAGENS_PROJETOS.map((img) => (
                              <option key={img.valor} value={img.valor}>{img.label}</option>
                            ))}
                          </select>
                          {editandoProjeto.imagem && (
                            <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border">
                              <img 
                                src={editandoProjeto.imagem} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* Tecnologias */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Tecnologia"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarTech())}
                          />
                          <Button onClick={adicionarTech} variant="outline" size="sm">+</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editandoProjeto.tecnologias?.map((tech, i) => (
                            <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removerTech(i)}>
                              {tech} <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => salvarProjeto(editandoProjeto)}>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </Button>
                          <Button variant="outline" onClick={() => setEditandoProjeto(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        {/* Miniatura da imagem */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {projeto.imagem ? (
                            <img 
                              src={projeto.imagem} 
                              alt={projeto.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{projeto.titulo}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{projeto.descricao}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {projeto.tecnologias?.map((tech) => (
                                  <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => moverProjeto(projeto, 'up')}>
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => moverProjeto(projeto, 'down')}>
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setEditandoProjeto(projeto)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => deletarProjeto(projeto.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {abaAtiva === 'skills' && (
          <div className="space-y-6">
            {/* Adicionar Skill */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adicionar Nova Skill</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Nome da skill"
                    value={novaSkill.nome}
                    onChange={(e) => setNovaSkill({ ...novaSkill, nome: e.target.value })}
                  />
                  <div className="flex items-center gap-4">
                    <span className="text-sm">Nível: {novaSkill.nivel}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={novaSkill.nivel}
                      onChange={(e) => setNovaSkill({ ...novaSkill, nivel: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={novaSkill.cor}
                    onChange={(e) => setNovaSkill({ ...novaSkill, cor: e.target.value })}
                  >
                    {CORES_SKILLS.map((cor) => (
                      <option key={cor.valor} value={cor.valor}>{cor.label}</option>
                    ))}
                  </select>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={novaSkill.icone}
                    onChange={(e) => setNovaSkill({ ...novaSkill, icone: e.target.value })}
                  >
                    {ICONES_SKILLS.map((icone) => (
                      <option key={icone.valor} value={icone.valor}>{icone.label}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={() => salvarSkill(novaSkill)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Skill
                </Button>
              </CardContent>
            </Card>

            {/* Lista de Skills */}
            <div className="grid md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <Card key={skill.id}>
                  <CardContent className="pt-6">
                    {editandoSkill?.id === skill.id ? (
                      <div className="space-y-4">
                        <Input
                          value={editandoSkill.nome}
                          onChange={(e) => setEditandoSkill({ ...editandoSkill, nome: e.target.value })}
                        />
                        <div className="flex items-center gap-4">
                          <span className="text-sm">Nível: {editandoSkill.nivel}%</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editandoSkill.nivel}
                            onChange={(e) => setEditandoSkill({ ...editandoSkill, nivel: parseInt(e.target.value) })}
                            className="flex-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select 
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            value={editandoSkill.cor}
                            onChange={(e) => setEditandoSkill({ ...editandoSkill, cor: e.target.value })}
                          >
                            {CORES_SKILLS.map((cor) => (
                              <option key={cor.valor} value={cor.valor}>{cor.label}</option>
                            ))}
                          </select>
                          <select 
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            value={editandoSkill.icone}
                            onChange={(e) => setEditandoSkill({ ...editandoSkill, icone: e.target.value })}
                          >
                            {ICONES_SKILLS.map((icone) => (
                              <option key={icone.valor} value={icone.valor}>{icone.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => salvarSkill(editandoSkill)}>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditandoSkill(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${skill.cor} text-white`}>
                            {skill.icone === 'Code' && <Code className="h-4 w-4" />}
                            {skill.icone === 'Database' && <Database className="h-4 w-4" />}
                            {skill.icone === 'Brain' && <Brain className="h-4 w-4" />}
                            {skill.icone === 'Globe' && <Globe className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium">{skill.nome}</p>
                            <p className="text-sm text-muted-foreground">{skill.nivel}%</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditandoSkill(skill)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deletarSkill(skill.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {abaAtiva === 'perfil' && perfil && (
          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>Informações pessoais que aparecem no portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    value={perfil.nome}
                    onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título Profissional</label>
                  <Input
                    value={perfil.titulo}
                    onChange={(e) => setPerfil({ ...perfil, titulo: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição Curta</label>
                <Input
                  value={perfil.descricao}
                  onChange={(e) => setPerfil({ ...perfil, descricao: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sobre Mim</label>
                <Textarea
                  value={perfil.sobre}
                  onChange={(e) => setPerfil({ ...perfil, sobre: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={perfil.email}
                    onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Disponibilidade</label>
                  <Input
                    value={perfil.disponibilidade}
                    onChange={(e) => setPerfil({ ...perfil, disponibilidade: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub URL</label>
                  <Input
                    value={perfil.github_url || ''}
                    onChange={(e) => setPerfil({ ...perfil, github_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    value={perfil.linkedin_url || ''}
                    onChange={(e) => setPerfil({ ...perfil, linkedin_url: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">Interesses (separados por vírgula)</label>
                <Input
                  value={perfil.interesses?.join(', ') || ''}
                  onChange={(e) => setPerfil({ ...perfil, interesses: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>

              <Button onClick={salvarPerfil}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Perfil
              </Button>
            </CardContent>
          </Card>
        )}

        {abaAtiva === 'contato' && perfil && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Configurações de Contato
                </CardTitle>
                <CardDescription>
                  Configure como as pessoas podem entrar em contato com você
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email de Contato */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email de Contato
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={perfil.contato_email || perfil.email || ''}
                    onChange={(e) => setPerfil({ ...perfil, contato_email: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Este email será exibido no formulário de contato
                  </p>
                </div>

                <Separator />

                {/* Telefone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={perfil.contato_telefone || ''}
                    onChange={(e) => setPerfil({ ...perfil, contato_telefone: e.target.value })}
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </label>
                  <Input
                    type="tel"
                    placeholder="5511999999999"
                    value={perfil.contato_whatsapp || ''}
                    onChange={(e) => setPerfil({ ...perfil, contato_whatsapp: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Número no formato internacional (código do país + DDD + número)
                  </p>
                </div>

                <Separator />

                {/* Endereço */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localização
                  </label>
                  <Input
                    placeholder="São Paulo, SP - Brasil"
                    value={perfil.contato_endereco || ''}
                    onChange={(e) => setPerfil({ ...perfil, contato_endereco: e.target.value })}
                  />
                </div>

                <Button onClick={salvarPerfil}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>

            {/* Preview do Contato */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview da Seção de Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  {(perfil.contato_email || perfil.email) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{perfil.contato_email || perfil.email}</span>
                    </div>
                  )}
                  {perfil.contato_telefone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{perfil.contato_telefone}</span>
                    </div>
                  )}
                  {perfil.contato_whatsapp && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <a 
                        href={`https://wa.me/${perfil.contato_whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Enviar mensagem no WhatsApp
                      </a>
                    </div>
                  )}
                  {perfil.contato_endereco && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{perfil.contato_endereco}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Integração com Email */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Integração com Email</CardTitle>
                <CardDescription>
                  Configure como as mensagens do formulário serão enviadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    <strong>Dica:</strong> Para receber emails do formulário de contato, você pode integrar com serviços como:
                  </p>
                  <ul className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-2 space-y-1">
                    <li>• <strong>EmailJS</strong> - Gratuito para até 200 emails/mês</li>
                    <li>• <strong>Formspree</strong> - Gratuito para até 50 emails/mês</li>
                    <li>• <strong>Resend</strong> - Gratuito para até 3.000 emails/mês</li>
                    <li>• <strong>SendGrid</strong> - Gratuito para até 100 emails/dia</li>
                  </ul>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  As mensagens enviadas pelo formulário serão direcionadas para: <strong>{perfil.contato_email || perfil.email || 'seu@email.com'}</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
