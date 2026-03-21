'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Settings, Save, Loader2, Globe, ImageIcon, BarChart3 } from 'lucide-react'
import type { Settings as SettingsType, SettingsInput } from '@/types/portfolio'

const defaultSettings: SettingsInput = {
  site_name: '',
  site_description: '',
  favicon_url: '',
  logo_url: '',
  google_analytics_id: '',
  meta_keywords: [],
  social_image_url: '',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
}

export function SettingsManager() {
  const { settings, setSettings } = useAdminStore()
  const [formData, setFormData] = useState<SettingsInput>(defaultSettings)
  const [keywordInput, setKeywordInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      if (data) {
        setSettings(data)
        setFormData({
          site_name: data.site_name || '',
          site_description: data.site_description || '',
          favicon_url: data.favicon_url || '',
          logo_url: data.logo_url || '',
          google_analytics_id: data.google_analytics_id || '',
          meta_keywords: data.meta_keywords || [],
          social_image_url: data.social_image_url || '',
          language: data.language || 'pt-BR',
          timezone: data.timezone || 'America/Sao_Paulo',
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.meta_keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        meta_keywords: [...formData.meta_keywords, keywordInput.trim()],
      })
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      meta_keywords: formData.meta_keywords.filter((k) => k !== keyword),
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const method = settings ? 'PUT' : 'POST'
      const response = await fetch('/api/admin/settings', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-slate-400 mt-1">Configurações gerais do seu portfólio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Info */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              Informações do Site
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Nome do site</Label>
              <Input
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Meu Portfólio"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Descrição do site</Label>
              <Input
                value={formData.site_description}
                onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Portfólio de desenvolvedor..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Idioma</Label>
                <Input
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="pt-BR"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Fuso horário</Label>
                <Input
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="America/Sao_Paulo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images & Assets */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-400" />
              Imagens e Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">URL do Logo</Label>
              <Input
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">URL do Favicon</Label>
              <Input
                value={formData.favicon_url}
                onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Imagem Social (OG Image)</Label>
              <Input
                value={formData.social_image_url}
                onChange={(e) => setFormData({ ...formData, social_image_url: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO & Analytics */}
        <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              SEO e Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Google Analytics ID</Label>
              <Input
                value={formData.google_analytics_id}
                onChange={(e) =>
                  setFormData({ ...formData, google_analytics_id: e.target.value })
                }
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Palavras-chave (SEO)</Label>
              <div className="flex gap-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Adicionar palavra-chave"
                />
                <Button type="button" onClick={handleAddKeyword} variant="secondary">
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.meta_keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveKeyword(keyword)}
                  >
                    {keyword} ×
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
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
            Salvar Configurações
          </>
        )}
      </Button>
    </div>
  )
}
