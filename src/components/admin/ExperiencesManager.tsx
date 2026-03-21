'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Briefcase, Building2 } from 'lucide-react'
import type { Experience, ExperienceInput } from '@/types/portfolio'

const defaultExperience: ExperienceInput = {
  company: '',
  position: '',
  description: '',
  start_date: '',
  end_date: '',
  current: false,
  location: '',
  technologies: [],
  order_index: 0,
}

export function ExperiencesManager() {
  const { experiences, setExperiences } = useAdminStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [formData, setFormData] = useState<ExperienceInput>(defaultExperience)
  const [techInput, setTechInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/admin/experiences')
      const data = await response.json()
      if (Array.isArray(data)) {
        setExperiences(data)
      }
    } catch (error) {
      console.error('Error fetching experiences:', error)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  const handleOpenDialog = (experience?: Experience) => {
    if (experience) {
      setEditingExperience(experience)
      setFormData({
        company: experience.company,
        position: experience.position,
        description: experience.description,
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        current: experience.current,
        location: experience.location || '',
        technologies: experience.technologies,
        order_index: experience.order_index,
      })
    } else {
      setEditingExperience(null)
      setFormData({ ...defaultExperience, order_index: experiences.length })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingExperience(null)
    setFormData(defaultExperience)
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

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const url = editingExperience
        ? `/api/admin/experiences/${editingExperience.id}`
        : '/api/admin/experiences'
      const method = editingExperience ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchExperiences()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving experience:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta experiência?')) return

    try {
      const response = await fetch(`/api/admin/experiences/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchExperiences()
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Experiências</h1>
          <p className="text-slate-400 mt-1">Gerencie suas experiências profissionais</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Experiência
        </Button>
      </div>

      {/* Experiences Timeline */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{exp.position}</h3>
                      <p className="text-emerald-400">{exp.company}</p>
                      <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                        <span>
                          {formatDate(exp.start_date)} -{' '}
                          {exp.current ? 'Presente' : exp.end_date ? formatDate(exp.end_date) : ''}
                        </span>
                        {exp.location && (
                          <>
                            <span>•</span>
                            <span>{exp.location}</span>
                          </>
                        )}
                        {exp.current && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                            Atual
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(exp)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(exp.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-slate-300 mt-3 text-sm">{exp.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400">Nenhuma experiência cadastrada</p>
            <Button
              onClick={() => handleOpenDialog()}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Experiência
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingExperience ? 'Editar Experiência' : 'Nova Experiência'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Empresa *</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Cargo *</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Data de início *</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Data de fim</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={formData.current}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Localização</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="São Paulo, Brasil"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={formData.current}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, current: checked, end_date: checked ? '' : formData.end_date })
                  }
                />
                <Label className="text-slate-300">Emprego atual</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Tecnologias</Label>
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Adicionar tecnologia"
                />
                <Button type="button" onClick={handleAddTech} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTech(tech)}
                  >
                    {tech} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.company || !formData.position || isLoading}
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
