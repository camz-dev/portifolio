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
import { Plus, Pencil, Trash2, GraduationCap, School } from 'lucide-react'
import type { Education, EducationInput } from '@/types/portfolio'

const defaultEducation: EducationInput = {
  institution: '',
  degree: '',
  field: '',
  description: '',
  start_date: '',
  end_date: '',
  current: false,
  logo_url: '',
  order_index: 0,
}

export function EducationManager() {
  const { education, setEducation } = useAdminStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [formData, setFormData] = useState<EducationInput>(defaultEducation)
  const [isLoading, setIsLoading] = useState(false)

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/admin/education')
      const data = await response.json()
      if (Array.isArray(data)) {
        setEducation(data)
      }
    } catch (error) {
      console.error('Error fetching education:', error)
    }
  }

  useEffect(() => {
    fetchEducation()
  }, [])

  const handleOpenDialog = (edu?: Education) => {
    if (edu) {
      setEditingEducation(edu)
      setFormData({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        description: edu.description || '',
        start_date: edu.start_date,
        end_date: edu.end_date || '',
        current: edu.current,
        logo_url: edu.logo_url || '',
        order_index: edu.order_index,
      })
    } else {
      setEditingEducation(null)
      setFormData({ ...defaultEducation, order_index: education.length })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingEducation(null)
    setFormData(defaultEducation)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const url = editingEducation
        ? `/api/admin/education/${editingEducation.id}`
        : '/api/admin/education'
      const method = editingEducation ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchEducation()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving education:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta formação?')) return

    try {
      const response = await fetch(`/api/admin/education/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchEducation()
      }
    } catch (error) {
      console.error('Error deleting education:', error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Educação</h1>
          <p className="text-slate-400 mt-1">Gerencie sua formação acadêmica</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Formação
        </Button>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {education.map((edu) => (
          <Card key={edu.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {edu.logo_url ? (
                  <img
                    src={edu.logo_url}
                    alt={edu.institution}
                    className="w-12 h-12 rounded-xl object-contain bg-slate-700 p-2"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <School className="w-6 h-6 text-emerald-400" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{edu.degree}</h3>
                      <p className="text-emerald-400">{edu.field}</p>
                      <p className="text-slate-400">{edu.institution}</p>
                      <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                        <span>
                          {formatDate(edu.start_date)} -{' '}
                          {edu.current ? 'Presente' : edu.end_date ? formatDate(edu.end_date) : ''}
                        </span>
                        {edu.current && (
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
                        onClick={() => handleOpenDialog(edu)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(edu.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-slate-300 mt-3 text-sm">{edu.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {education.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <GraduationCap className="w-12 h-12 mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400">Nenhuma formação cadastrada</p>
            <Button
              onClick={() => handleOpenDialog()}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Formação
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingEducation ? 'Editar Formação' : 'Nova Formação'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Instituição *</Label>
                <Input
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Grau *</Label>
                <Input
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Bacharelado, Mestrado..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Área de estudo *</Label>
                <Input
                  value={formData.field}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Ciência da Computação"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">URL do Logo</Label>
                <Input
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://..."
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

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.current}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, current: checked, end_date: checked ? '' : formData.end_date })
                }
              />
              <Label className="text-slate-300">Cursando atualmente</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.institution || !formData.degree || !formData.field || isLoading}
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
