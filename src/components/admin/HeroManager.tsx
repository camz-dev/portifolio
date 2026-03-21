'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sparkles, Save, Loader2 } from 'lucide-react'
import type { Hero, HeroInput } from '@/types/portfolio'

const defaultHero: HeroInput = {
  title: '',
  subtitle: '',
  description: '',
  background_image: '',
  background_color: '#0f172a',
  cta_text: '',
  cta_url: '',
  secondary_cta_text: '',
  secondary_cta_url: '',
  show_avatar: true,
  animation_type: 'fade',
}

export function HeroManager() {
  const { hero, setHero } = useAdminStore()
  const [formData, setFormData] = useState<HeroInput>(defaultHero)
  const [isLoading, setIsLoading] = useState(false)

  const fetchHero = async () => {
    try {
      const response = await fetch('/api/admin/hero')
      const data = await response.json()
      if (data) {
        setHero(data)
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          background_image: data.background_image || '',
          background_color: data.background_color || '#0f172a',
          cta_text: data.cta_text || '',
          cta_url: data.cta_url || '',
          secondary_cta_text: data.secondary_cta_text || '',
          secondary_cta_url: data.secondary_cta_url || '',
          show_avatar: data.show_avatar ?? true,
          animation_type: data.animation_type || 'fade',
        })
      }
    } catch (error) {
      console.error('Error fetching hero:', error)
    }
  }

  useEffect(() => {
    fetchHero()
  }, [])

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const method = hero ? 'PUT' : 'POST'
      const response = await fetch('/api/admin/hero', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setHero(data)
      }
    } catch (error) {
      console.error('Error saving hero:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Página Inicial</h1>
        <p className="text-slate-400 mt-1">Configure a seção hero do seu portfólio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="rounded-xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center"
              style={{
                backgroundColor: formData.background_color,
                backgroundImage: formData.background_image
                  ? `url(${formData.background_image})`
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">{formData.title || 'Seu Título'}</h1>
              <h2 className="text-xl text-emerald-400 mb-4">{formData.subtitle || 'Seu Subtítulo'}</h2>
              <p className="text-slate-300 max-w-md mb-6">{formData.description || 'Sua descrição...'}</p>
              <div className="flex gap-3">
                {formData.cta_text && (
                  <Button className="bg-emerald-500 hover:bg-emerald-600">
                    {formData.cta_text}
                  </Button>
                )}
                {formData.secondary_cta_text && (
                  <Button variant="outline" className="border-slate-600 text-white">
                    {formData.secondary_cta_text}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Título principal</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Olá, eu sou..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Subtítulo</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Desenvolvedor Full Stack"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                placeholder="Uma breve descrição sobre você..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Cor de fundo</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.background_color}
                    onChange={(e) =>
                      setFormData({ ...formData, background_color: e.target.value })
                    }
                    className="w-12 h-10 p-1 bg-slate-700 border-slate-600"
                  />
                  <Input
                    value={formData.background_color}
                    onChange={(e) =>
                      setFormData({ ...formData, background_color: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Imagem de fundo</Label>
                <Input
                  value={formData.background_image}
                  onChange={(e) =>
                    setFormData({ ...formData, background_image: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="URL da imagem"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Texto do botão principal</Label>
                <Input
                  value={formData.cta_text}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Ver Projetos"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">URL do botão principal</Label>
                <Input
                  value={formData.cta_url}
                  onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="#projects"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Texto do botão secundário</Label>
                <Input
                  value={formData.secondary_cta_text}
                  onChange={(e) =>
                    setFormData({ ...formData, secondary_cta_text: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Contato"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">URL do botão secundário</Label>
                <Input
                  value={formData.secondary_cta_url}
                  onChange={(e) =>
                    setFormData({ ...formData, secondary_cta_url: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="#contact"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Tipo de animação</Label>
                <Select
                  value={formData.animation_type}
                  onValueChange={(value: HeroInput['animation_type']) =>
                    setFormData({ ...formData, animation_type: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="none">Sem animação</SelectItem>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="typewriter">Typewriter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={formData.show_avatar}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, show_avatar: checked })
                  }
                />
                <Label className="text-slate-300">Mostrar avatar</Label>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
