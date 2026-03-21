'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil, Trash2, ExternalLink, Github, FolderKanban, X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import type { Project, ProjectInput } from '@/types/portfolio'

const defaultProject: ProjectInput = {
  title: '',
  description: '',
  long_description: '',
  image_url: '',
  demo_url: '',
  github_url: '',
  technologies: [],
  category: '',
  featured: false,
  order_index: 0,
  status: 'draft',
}

export function ProjectsManager() {
  const { projects, setProjects } = useAdminStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<ProjectInput>(defaultProject)
  const [techInput, setTechInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      const data = await response.json()
      if (Array.isArray(data)) {
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        description: project.description,
        long_description: project.long_description || '',
        image_url: project.image_url || '',
        demo_url: project.demo_url || '',
        github_url: project.github_url || '',
        technologies: project.technologies,
        category: project.category,
        featured: project.featured,
        order_index: project.order_index,
        status: project.status,
      })
    } else {
      setEditingProject(null)
      setFormData({ ...defaultProject, order_index: projects.length })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProject(null)
    setFormData(defaultProject)
    setTechInput('')
  }

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      })
      setTechInput('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'projects')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, image_url: data.url })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao fazer upload da imagem')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const url = editingProject
        ? `/api/admin/projects/${editingProject.id}`
        : '/api/admin/projects'
      const method = editingProject ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchProjects()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchProjects()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projetos</h1>
          <p className="text-slate-400 mt-1">Gerencie os projetos do seu portfólio</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="bg-slate-800/50 border-slate-700 overflow-hidden">
            {project.image_url ? (
              <div className="aspect-video bg-slate-700 relative">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.featured && (
                  <Badge className="absolute top-2 right-2 bg-emerald-500">
                    Destaque
                  </Badge>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-slate-700/50 flex items-center justify-center relative">
                <ImageIcon className="w-12 h-12 text-slate-500" />
                {project.featured && (
                  <Badge className="absolute top-2 right-2 bg-emerald-500">
                    Destaque
                  </Badge>
                )}
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                  <p className="text-slate-400 text-sm">{project.category}</p>
                </div>
                <Badge
                  variant={
                    project.status === 'published'
                      ? 'default'
                      : project.status === 'draft'
                      ? 'secondary'
                      : 'outline'
                  }
                  className={
                    project.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : project.status === 'draft'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : ''
                  }
                >
                  {project.status === 'published' ? 'Publicado' : project.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm line-clamp-2">{project.description}</p>

              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 4).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.technologies.length - 4}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenDialog(project)}
                  className="text-slate-400 hover:text-white"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(project.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {project.demo_url && (
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                    className="text-slate-400 hover:text-white ml-auto"
                  >
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {project.github_url && (
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                    className="text-slate-400 hover:text-white"
                  >
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <FolderKanban className="w-12 h-12 mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400">Nenhum projeto cadastrado</p>
            <Button
              onClick={() => handleOpenDialog()}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Projeto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Título *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Nome do projeto"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Categoria</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Web App, Mobile, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Descrição curta *</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Breve descrição do projeto"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Descrição longa</Label>
              <Textarea
                value={formData.long_description}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                placeholder="Descrição detalhada do projeto"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label className="text-slate-300">Imagem do Projeto</Label>
              
              {/* Image Preview */}
              {formData.image_url ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-700">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="aspect-video rounded-lg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingImage ? (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">Enviando imagem...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">Clique para fazer upload</p>
                      <p className="text-slate-500 text-xs mt-1">PNG, JPG, GIF até 5MB</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {/* Upload button */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingImage ? 'Enviando...' : 'Upload da Galeria'}
                </Button>
              </div>
              
              {/* Or paste URL */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-slate-500 text-xs">ou cole uma URL</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>
              
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">URL do demo</Label>
                <Input
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">URL do GitHub</Label>
                <Input
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'published' | 'archived') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Tecnologias</Label>
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Adicionar tecnologia (ex: React, Node.js)"
                />
                <Button type="button" onClick={handleAddTech} variant="secondary">
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer hover:bg-slate-600"
                    onClick={() => handleRemoveTech(tech)}
                  >
                    {tech}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
              {formData.technologies.length === 0 && (
                <p className="text-slate-500 text-xs">Clique em "Adicionar" ou pressione Enter para adicionar tecnologias</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Ordem</Label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label className="text-slate-300">Destaque</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.description || isLoading}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
