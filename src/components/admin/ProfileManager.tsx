'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, Save, Loader2, Upload, X } from 'lucide-react'
import type { Profile, ProfileInput } from '@/types/portfolio'

const defaultProfile: ProfileInput = {
  name: '',
  title: '',
  bio: '',
  avatar_url: '',
  resume_url: '',
  location: '',
  email: '',
  phone: '',
  whatsapp: '',
  availability: 'available',
  years_experience: 0,
}

export function ProfileManager() {
  const { profile, setProfile } = useAdminStore()
  const [formData, setFormData] = useState<ProfileInput>(defaultProfile)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile')
      const data = await response.json()
      if (data) {
        setProfile(data)
        setFormData({
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          resume_url: data.resume_url || '',
          location: data.location || '',
          email: data.email || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          availability: data.availability || 'available',
          years_experience: data.years_experience || 0,
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'avatars')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, avatar_url: data.url })
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao fazer upload do avatar')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Erro ao fazer upload do avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const method = profile ? 'PUT' : 'POST'
      const response = await fetch('/api/admin/profile', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Sobre Mim</h1>
        <p className="text-slate-400 mt-1">Configure suas informações pessoais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Preview */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={formData.avatar_url} />
                <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-4xl">
                  {formData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Upload button overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-white" />
                )}
              </button>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            
            <h3 className="text-white font-semibold text-xl">{formData.name || 'Seu Nome'}</h3>
            <p className="text-emerald-400">{formData.title || 'Seu Título'}</p>
            <p className="text-slate-400 text-sm mt-2">{formData.location}</p>

            <div className="mt-4 flex justify-center">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  formData.availability === 'available'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : formData.availability === 'busy'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {formData.availability === 'available'
                  ? 'Disponível'
                  : formData.availability === 'busy'
                  ? 'Ocupado'
                  : 'Indisponível'}
              </span>
            </div>

            {/* Contact info preview */}
            <div className="mt-6 space-y-2 text-sm text-left">
              {formData.email && (
                <p className="text-slate-400">
                  <span className="text-slate-500">Email:</span> {formData.email}
                </p>
              )}
              {formData.whatsapp && (
                <p className="text-slate-400">
                  <span className="text-slate-500">WhatsApp:</span> {formData.whatsapp}
                </p>
              )}
              {formData.phone && (
                <p className="text-slate-400">
                  <span className="text-slate-500">Telefone:</span> {formData.phone}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Nome completo</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Título/Profissão</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Desenvolvedor Full Stack"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                placeholder="Fale um pouco sobre você..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">URL do Avatar</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                    placeholder="https://..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">URL do Currículo</Label>
                <Input
                  value={formData.resume_url}
                  onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://..."
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
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">
                  WhatsApp
                  <span className="text-emerald-400 text-xs ml-2">(com código do país)</span>
                </Label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="+55 11 99999-9999"
                />
                <p className="text-xs text-slate-500">Ex: +55 11 99999-9999</p>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Telefone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="+55 11 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Disponibilidade</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value: ProfileInput['availability']) =>
                    setFormData({ ...formData, availability: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="busy">Ocupado</SelectItem>
                    <SelectItem value="unavailable">Indisponível</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Anos de Experiência</Label>
                <Input
                  type="number"
                  value={formData.years_experience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      years_experience: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
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
