'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
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
import { Plus, Pencil, Trash2, Code2 } from 'lucide-react'
import type { Skill, SkillInput } from '@/types/portfolio'

const defaultSkill: SkillInput = {
  name: '',
  category: 'frontend',
  level: 50,
  icon_url: '',
  description: '',
  order_index: 0,
}

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Banco de Dados',
  devops: 'DevOps',
  design: 'Design',
  other: 'Outros',
}

const categoryColors: Record<string, string> = {
  frontend: 'bg-blue-500/20 text-blue-400',
  backend: 'bg-green-500/20 text-green-400',
  database: 'bg-purple-500/20 text-purple-400',
  devops: 'bg-orange-500/20 text-orange-400',
  design: 'bg-pink-500/20 text-pink-400',
  other: 'bg-slate-500/20 text-slate-400',
}

export function SkillsManager() {
  const { skills, setSkills } = useAdminStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState<SkillInput>(defaultSkill)
  const [isLoading, setIsLoading] = useState(false)

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/admin/skills')
      const data = await response.json()
      if (Array.isArray(data)) {
        setSkills(data)
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleOpenDialog = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill)
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        icon_url: skill.icon_url || '',
        description: skill.description || '',
        order_index: skill.order_index,
      })
    } else {
      setEditingSkill(null)
      setFormData({ ...defaultSkill, order_index: skills.length })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingSkill(null)
    setFormData(defaultSkill)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const url = editingSkill
        ? `/api/admin/skills/${editingSkill.id}`
        : '/api/admin/skills'
      const method = editingSkill ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchSkills()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving skill:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta skill?')) return

    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchSkills()
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Skills</h1>
          <p className="text-slate-400 mt-1">Gerencie suas habilidades técnicas</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Skill
        </Button>
      </div>

      {/* Skills by Category */}
      {Object.keys(groupedSkills).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Badge className={categoryColors[category]}>
                  {categoryLabels[category]}
                </Badge>
                <span className="text-slate-400 text-sm font-normal">
                  ({categorySkills.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <Card key={skill.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {skill.icon_url ? (
                            <img
                              src={skill.icon_url}
                              alt={skill.name}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                              <Code2 className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium">{skill.name}</p>
                            {skill.description && (
                              <p className="text-slate-400 text-xs">{skill.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenDialog(skill)}
                            className="text-slate-400 hover:text-white h-8 w-8 p-0"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(skill.id)}
                            className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Nível</span>
                          <span className="text-white">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <Code2 className="w-12 h-12 mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400">Nenhuma skill cadastrada</p>
            <Button
              onClick={() => handleOpenDialog()}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Skill
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingSkill ? 'Editar Skill' : 'Nova Skill'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Nome *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="React, Node.js, etc."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: SkillInput['category']) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Nível: {formData.level}%</Label>
              <Input
                type="range"
                min="1"
                max="100"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">URL do ícone</Label>
              <Input
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Descrição</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Breve descrição"
              />
            </div>

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
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name || isLoading}
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
