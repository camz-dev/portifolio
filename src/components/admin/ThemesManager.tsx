'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
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
import { 
  Plus, Pencil, Trash2, Palette, Check, Sun, Moon, Sparkles,
  Waves, Trees, Sunset, Zap, Heart, Globe, Monitor, Copy,
  MousePointer, Move, Layers, Cloud, Star, Circle, Hexagon,
  Snowflake, Flame, Droplets, Wind, Box, Eye, Hash, Timer
} from 'lucide-react'
import type { Theme, ThemeInput } from '@/types/portfolio'

// Temas predefinidos com animações e modo claro/escuro
const themePresets = [
  // ===== TEMAS ESCUROS =====
  {
    name: 'Emerald Dark',
    icon: Moon,
    mode: 'dark' as const,
    colors: {
      primary_color: '#10b981',
      secondary_color: '#14b8a6',
      accent_color: '#06b6d4',
      background_color: '#0f172a',
      card_background: '#1e293b',
      text_color: '#f8fafc',
      muted_color: '#94a3b8',
      border_color: '#334155',
    },
    font_primary: 'Inter',
    font_secondary: 'Fira Code',
    border_radius: 'md' as const,
    animations: {
      animation_type: 'fade' as const,
      animation_duration: 300,
      hover_effect: 'scale' as const,
      particle_effect: true,
      particle_style: 'floating' as const,
      gradient_animation: false,
      cursor_effect: 'none' as const,
    },
  },
  {
    name: 'Green Gradient Dark',
    icon: Trees,
    mode: 'dark' as const,
    colors: {
      primary_color: '#22c55e',
      secondary_color: '#10b981',
      accent_color: '#34d399',
      background_color: '#022c22',
      card_background: '#064e3b',
      text_color: '#ecfdf5',
      muted_color: '#6ee7b7',
      border_color: '#065f46',
    },
    font_primary: 'Inter',
    font_secondary: 'JetBrains Mono',
    border_radius: 'lg' as const,
    animations: {
      animation_type: 'scale' as const,
      animation_duration: 400,
      hover_effect: 'glow' as const,
      particle_effect: true,
      particle_style: 'glow' as const,
      gradient_animation: true,
      cursor_effect: 'sparkle' as const,
    },
  },
  {
    name: 'Neon Green',
    icon: Zap,
    mode: 'dark' as const,
    colors: {
      primary_color: '#00ff88',
      secondary_color: '#00cc6a',
      accent_color: '#39ff14',
      background_color: '#0a0f0a',
      card_background: '#141f14',
      text_color: '#e0ffe0',
      muted_color: '#66b366',
      border_color: '#1a331a',
    },
    font_primary: 'Orbitron',
    font_secondary: 'JetBrains Mono',
    border_radius: 'none' as const,
    animations: {
      animation_type: 'flip' as const,
      animation_duration: 500,
      hover_effect: 'glow' as const,
      particle_effect: true,
      particle_style: 'stars' as const,
      gradient_animation: true,
      cursor_effect: 'trail' as const,
    },
  },
  {
    name: 'Forest Mist',
    icon: Cloud,
    mode: 'dark' as const,
    colors: {
      primary_color: '#4ade80',
      secondary_color: '#86efac',
      accent_color: '#bbf7d0',
      background_color: '#052e16',
      card_background: '#14532d',
      text_color: '#f0fdf4',
      muted_color: '#86efac',
      border_color: '#166534',
    },
    font_primary: 'Poppins',
    font_secondary: 'Fira Code',
    border_radius: 'xl' as const,
    animations: {
      animation_type: 'fade' as const,
      animation_duration: 350,
      hover_effect: 'lift' as const,
      particle_effect: true,
      particle_style: 'bubbles' as const,
      gradient_animation: false,
      cursor_effect: 'none' as const,
    },
  },
  {
    name: 'Ocean Blue',
    icon: Waves,
    mode: 'dark' as const,
    colors: {
      primary_color: '#3b82f6',
      secondary_color: '#6366f1',
      accent_color: '#8b5cf6',
      background_color: '#0c1222',
      card_background: '#1a1f35',
      text_color: '#f1f5f9',
      muted_color: '#64748b',
      border_color: '#1e3a5f',
    },
    font_primary: 'Inter',
    font_secondary: 'JetBrains Mono',
    border_radius: 'lg' as const,
    animations: {
      animation_type: 'slide' as const,
      animation_duration: 400,
      hover_effect: 'lift' as const,
      particle_effect: true,
      particle_style: 'floating' as const,
      gradient_animation: true,
      cursor_effect: 'bubble' as const,
    },
  },
  {
    name: 'Sunset Orange',
    icon: Sunset,
    mode: 'dark' as const,
    colors: {
      primary_color: '#f97316',
      secondary_color: '#fb923c',
      accent_color: '#fbbf24',
      background_color: '#1c1917',
      card_background: '#292524',
      text_color: '#fef3c7',
      muted_color: '#a8a29e',
      border_color: '#44403c',
    },
    font_primary: 'Inter',
    font_secondary: 'Fira Code',
    border_radius: 'lg' as const,
    animations: {
      animation_type: 'fade' as const,
      animation_duration: 350,
      hover_effect: 'shine' as const,
      particle_effect: true,
      particle_style: 'fire' as const,
      gradient_animation: true,
      cursor_effect: 'none' as const,
    },
  },
  {
    name: 'Purple Dream',
    icon: Sparkles,
    mode: 'dark' as const,
    colors: {
      primary_color: '#a855f7',
      secondary_color: '#c084fc',
      accent_color: '#e879f9',
      background_color: '#13111c',
      card_background: '#1e1b2e',
      text_color: '#faf5ff',
      muted_color: '#a1a1aa',
      border_color: '#3f3a5a',
    },
    font_primary: 'Inter',
    font_secondary: 'JetBrains Mono',
    border_radius: 'full' as const,
    animations: {
      animation_type: 'bounce' as const,
      animation_duration: 400,
      hover_effect: 'glow' as const,
      particle_effect: true,
      particle_style: 'sparkle' as const,
      gradient_animation: true,
      cursor_effect: 'sparkle' as const,
    },
  },
  {
    name: 'Rose Pink',
    icon: Heart,
    mode: 'dark' as const,
    colors: {
      primary_color: '#f43f5e',
      secondary_color: '#fb7185',
      accent_color: '#fda4af',
      background_color: '#1f1318',
      card_background: '#2a1f24',
      text_color: '#fff1f2',
      muted_color: '#be123c',
      border_color: '#4c0519',
    },
    font_primary: 'Poppins',
    font_secondary: 'Fira Code',
    border_radius: 'md' as const,
    animations: {
      animation_type: 'fade' as const,
      animation_duration: 300,
      hover_effect: 'scale' as const,
      particle_effect: true,
      particle_style: 'hearts' as const,
      gradient_animation: false,
      cursor_effect: 'none' as const,
    },
  },
  {
    name: 'Cyberpunk',
    icon: Zap,
    mode: 'dark' as const,
    colors: {
      primary_color: '#00ff88',
      secondary_color: '#00d4ff',
      accent_color: '#ff00ff',
      background_color: '#0a0a0a',
      card_background: '#1a1a1a',
      text_color: '#ffffff',
      muted_color: '#666666',
      border_color: '#333333',
    },
    font_primary: 'Orbitron',
    font_secondary: 'JetBrains Mono',
    border_radius: 'none' as const,
    animations: {
      animation_type: 'flip' as const,
      animation_duration: 500,
      hover_effect: 'glow' as const,
      particle_effect: true,
      particle_style: 'matrix' as const,
      gradient_animation: true,
      cursor_effect: 'trail' as const,
    },
  },
  {
    name: 'Aurora Borealis',
    icon: Waves,
    mode: 'dark' as const,
    colors: {
      primary_color: '#06b6d4',
      secondary_color: '#8b5cf6',
      accent_color: '#22c55e',
      background_color: '#030712',
      card_background: '#111827',
      text_color: '#f9fafb',
      muted_color: '#6b7280',
      border_color: '#1f2937',
    },
    font_primary: 'Inter',
    font_secondary: 'Fira Code',
    border_radius: 'lg' as const,
    animations: {
      animation_type: 'slide' as const,
      animation_duration: 600,
      hover_effect: 'glow' as const,
      particle_effect: true,
      particle_style: 'aurora' as const,
      gradient_animation: true,
      cursor_effect: 'sparkle' as const,
    },
  },
  
  // ===== TEMAS CLAROS =====
  {
    name: 'Creator Utility',
    icon: Monitor,
    mode: 'light' as const,
    colors: {
      primary_color: '#00FF88',
      secondary_color: '#1A1A1A',
      accent_color: '#00CC6A',
      background_color: '#F7F7F5',
      card_background: '#FFFFFF',
      text_color: '#1A1A1A',
      muted_color: '#666666',
      border_color: '#E0E0E0',
    },
    font_primary: 'JetBrains Mono',
    font_secondary: 'Inter',
    border_radius: 'md' as const,
    animations: {
      animation_type: 'fade' as const,
      animation_duration: 300,
      hover_effect: 'lift' as const,
      particle_effect: true,
      particle_style: 'geometric' as const,
      gradient_animation: false,
      cursor_effect: 'glow' as const,
    },
    dynamic_elements: {
      scroll_reveal_animation: true,
      counter_animation: true,
      timeline_glow_points: true,
      noise_texture: true,
    },
  },
  {
    name: 'Light Clean',
    icon: Sun,
    mode: 'light' as const,
    colors: {
      primary_color: '#10b981',
      secondary_color: '#14b8a6',
      accent_color: '#06b6d4',
      background_color: '#ffffff',
      card_background: '#f8fafc',
      text_color: '#0f172a',
      muted_color: '#64748b',
      border_color: '#e2e8f0',
    },
    font_primary: 'Inter',
    font_secondary: 'Fira Code',
    border_radius: 'md' as const,
    animations: {
      animation_type: 'fade' as const,
      animation_duration: 200,
      hover_effect: 'lift' as const,
      particle_effect: false,
      particle_style: 'floating' as const,
      gradient_animation: false,
      cursor_effect: 'none' as const,
    },
  },
  {
    name: 'Light Green',
    icon: Trees,
    mode: 'light' as const,
    colors: {
      primary_color: '#22c55e',
      secondary_color: '#16a34a',
      accent_color: '#15803d',
      background_color: '#f0fdf4',
      card_background: '#ffffff',
      text_color: '#14532d',
      muted_color: '#166534',
      border_color: '#bbf7d0',
    },
    font_primary: 'Inter',
    font_secondary: 'Fira Code',
    border_radius: 'lg' as const,
    animations: {
      animation_type: 'fade' as const,
      animation_duration: 250,
      hover_effect: 'scale' as const,
      particle_effect: true,
      particle_style: 'floating' as const,
      gradient_animation: false,
      cursor_effect: 'none' as const,
    },
  },
  {
    name: 'Light Ocean',
    icon: Waves,
    mode: 'light' as const,
    colors: {
      primary_color: '#0ea5e9',
      secondary_color: '#0284c7',
      accent_color: '#06b6d4',
      background_color: '#f0f9ff',
      card_background: '#ffffff',
      text_color: '#0c4a6e',
      muted_color: '#0369a1',
      border_color: '#bae6fd',
    },
    font_primary: 'Inter',
    font_secondary: 'JetBrains Mono',
    border_radius: 'lg' as const,
    animations: {
      animation_type: 'slide' as const,
      animation_duration: 300,
      hover_effect: 'lift' as const,
      particle_effect: true,
      particle_style: 'bubbles' as const,
      gradient_animation: false,
      cursor_effect: 'none' as const,
    },
  },
  {
    name: 'Warm Light',
    icon: Sunset,
    mode: 'light' as const,
    colors: {
      primary_color: '#f97316',
      secondary_color: '#ea580c',
      accent_color: '#fb923c',
      background_color: '#fffbeb',
      card_background: '#ffffff',
      text_color: '#451a03',
      muted_color: '#92400e',
      border_color: '#fed7aa',
    },
    font_primary: 'Poppins',
    font_secondary: 'Fira Code',
    border_radius: 'md' as const,
    animations: {
      animation_type: 'fade' as const,
      animation_duration: 250,
      hover_effect: 'scale' as const,
      particle_effect: false,
      particle_style: 'floating' as const,
      gradient_animation: false,
      cursor_effect: 'none' as const,
    },
  },
  {
    name: 'Minimal White',
    icon: Sun,
    mode: 'light' as const,
    colors: {
      primary_color: '#18181b',
      secondary_color: '#3f3f46',
      accent_color: '#71717a',
      background_color: '#ffffff',
      card_background: '#fafafa',
      text_color: '#09090b',
      muted_color: '#71717a',
      border_color: '#e4e4e7',
    },
    font_primary: 'Inter',
    font_secondary: 'JetBrains Mono',
    border_radius: 'sm' as const,
    animations: {
      animation_type: 'fade' as const,
      animation_duration: 150,
      hover_effect: 'lift' as const,
      particle_effect: false,
      particle_style: 'floating' as const,
      gradient_animation: false,
      cursor_effect: 'none' as const,
    },
  },
]

const fontOptions = [
  'Inter',
  'Poppins',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Fira Code',
  'JetBrains Mono',
  'Source Code Pro',
  'Orbitron',
]

const borderRadiusOptions = [
  { value: 'none', label: 'Nenhum' },
  { value: 'sm', label: 'Pequeno' },
  { value: 'md', label: 'Médio' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Extra Grande' },
  { value: 'full', label: 'Completo' },
]

const animationTypeOptions = [
  { value: 'none', label: 'Nenhuma', icon: Layers },
  { value: 'fade', label: 'Fade', icon: Sparkles },
  { value: 'slide', label: 'Slide', icon: Move },
  { value: 'scale', label: 'Scale', icon: Monitor },
  { value: 'bounce', label: 'Bounce', icon: Zap },
  { value: 'flip', label: 'Flip', icon: Palette },
]

const hoverEffectOptions = [
  { value: 'none', label: 'Nenhum' },
  { value: 'scale', label: 'Escalar' },
  { value: 'lift', label: 'Elevar' },
  { value: 'glow', label: 'Brilho' },
  { value: 'shine', label: 'Resplandecer' },
]

const cursorEffectOptions = [
  { value: 'none', label: 'Nenhum' },
  { value: 'trail', label: 'Rastro' },
  { value: 'sparkle', label: 'Brilho' },
  { value: 'bubble', label: 'Bolhas' },
  { value: 'glow', label: 'Brilho no Cursor' },
]

const particleStyleOptions = [
  { value: 'floating', label: 'Flutuantes', icon: Wind, description: 'Partículas suaves flutuando' },
  { value: 'stars', label: 'Estrelas', icon: Star, description: 'Estrelas cintilantes' },
  { value: 'bubbles', label: 'Bolhas', icon: Circle, description: 'Bolhas subindo' },
  { value: 'glow', label: 'Brilho', icon: Sparkles, description: 'Pontos luminosos' },
  { value: 'sparkle', label: 'Cintilante', icon: Star, description: 'Brilhos animados' },
  { value: 'fire', label: 'Fogo', icon: Flame, description: 'Partículas de fogo' },
  { value: 'snow', label: 'Neve', icon: Snowflake, description: 'Flocos de neve caindo' },
  { value: 'hearts', label: 'Corações', icon: Heart, description: 'Corações flutuantes' },
  { value: 'aurora', label: 'Aurora', icon: Waves, description: 'Ondas de luz' },
  { value: 'matrix', label: 'Matrix', icon: Hexagon, description: 'Estilo código matrix' },
  { value: 'geometric', label: 'Geométricas', icon: Box, description: 'Formas geométricas flutuantes com parallax' },
]

const defaultTheme: ThemeInput = {
  name: '',
  primary_color: '#10b981',
  secondary_color: '#14b8a6',
  accent_color: '#06b6d4',
  background_color: '#0f172a',
  card_background: '#1e293b',
  text_color: '#f8fafc',
  muted_color: '#94a3b8',
  border_color: '#334155',
  // Light mode colors (auto-generated)
  light_primary_color: '#10b981',
  light_secondary_color: '#14b8a6',
  light_accent_color: '#06b6d4',
  light_background_color: '#ffffff',
  light_card_background: '#f8fafc',
  light_text_color: '#0f172a',
  light_muted_color: '#64748b',
  light_border_color: '#e2e8f0',
  font_primary: 'Inter',
  font_secondary: 'Fira Code',
  border_radius: 'md',
  animation_type: 'fade',
  animation_duration: 300,
  animation_delay: 0,
  hover_effect: 'scale',
  particle_effect: true,
  particle_style: 'floating',
  gradient_animation: false,
  cursor_effect: 'none',
  theme_mode: 'dark',
  // Dynamic Elements
  scroll_reveal_animation: false,
  counter_animation: false,
  timeline_glow_points: false,
  noise_texture: false,
  active: false,
}

export function ThemesManager() {
  const { themes, setThemes } = useAdminStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null)
  const [formData, setFormData] = useState<ThemeInput>(defaultTheme)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('presets')
  const [filterMode, setFilterMode] = useState<'all' | 'dark' | 'light'>('all')

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/admin/themes')
      const data = await response.json()
      if (Array.isArray(data)) {
        setThemes(data)
      }
    } catch (error) {
      console.error('Error fetching themes:', error)
    }
  }

  useEffect(() => {
    fetchThemes()
  }, [])

  const handleOpenDialog = (theme?: Theme) => {
    if (theme) {
      setEditingTheme(theme)
      setFormData({
        name: theme.name,
        primary_color: theme.primary_color,
        secondary_color: theme.secondary_color,
        accent_color: theme.accent_color,
        background_color: theme.background_color,
        card_background: theme.card_background || '#1e293b',
        text_color: theme.text_color,
        muted_color: theme.muted_color || '#94a3b8',
        border_color: theme.border_color || '#334155',
        font_primary: theme.font_primary,
        font_secondary: theme.font_secondary,
        border_radius: theme.border_radius,
        animation_type: theme.animation_type || 'fade',
        animation_duration: theme.animation_duration || 300,
        animation_delay: theme.animation_delay || 0,
        hover_effect: theme.hover_effect || 'scale',
        particle_effect: theme.particle_effect ?? true,
        particle_style: theme.particle_style || 'floating',
        gradient_animation: theme.gradient_animation ?? false,
        cursor_effect: theme.cursor_effect || 'none',
        theme_mode: theme.theme_mode || 'dark',
        // Dynamic Elements
        scroll_reveal_animation: theme.scroll_reveal_animation ?? false,
        counter_animation: theme.counter_animation ?? false,
        timeline_glow_points: theme.timeline_glow_points ?? false,
        noise_texture: theme.noise_texture ?? false,
        active: theme.active,
      })
      setActiveTab('custom')
    } else {
      setEditingTheme(null)
      setFormData(defaultTheme)
      setActiveTab('presets')
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTheme(null)
    setFormData(defaultTheme)
  }

  const handleApplyPreset = (preset: typeof themePresets[0]) => {
    setFormData({
      ...formData,
      name: formData.name || preset.name,
      ...preset.colors,
      font_primary: preset.font_primary,
      font_secondary: preset.font_secondary,
      border_radius: preset.border_radius,
      ...preset.animations,
      theme_mode: preset.mode,
      // Dynamic Elements
      scroll_reveal_animation: (preset as any).dynamic_elements?.scroll_reveal_animation ?? false,
      counter_animation: (preset as any).dynamic_elements?.counter_animation ?? false,
      timeline_glow_points: (preset as any).dynamic_elements?.timeline_glow_points ?? false,
      noise_texture: (preset as any).dynamic_elements?.noise_texture ?? false,
    })
    setActiveTab('custom')
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const url = editingTheme
        ? `/api/admin/themes/${editingTheme.id}`
        : '/api/admin/themes'
      const method = editingTheme ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchThemes()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving theme:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este tema?')) return

    try {
      const response = await fetch(`/api/admin/themes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchThemes()
      }
    } catch (error) {
      console.error('Error deleting theme:', error)
    }
  }

  const handleActivate = async (id: string) => {
    try {
      await fetch(`/api/admin/themes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: true }),
      })
      await fetchThemes()
    } catch (error) {
      console.error('Error activating theme:', error)
    }
  }

  const handleDuplicate = async (theme: Theme) => {
    try {
      const response = await fetch('/api/admin/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...theme,
          name: `${theme.name} (cópia)`,
          active: false,
        }),
      })

      if (response.ok) {
        await fetchThemes()
      }
    } catch (error) {
      console.error('Error duplicating theme:', error)
    }
  }

  const filteredPresets = themePresets.filter(preset => 
    filterMode === 'all' || preset.mode === filterMode
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Temas</h1>
          <p className="text-slate-400 mt-1">Crie e gerencie temas responsivos com animações para seu portfólio</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Tema
        </Button>
      </div>

      {/* Temas Salvos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            className={`bg-slate-800/50 border-slate-700 overflow-hidden transition-all hover:scale-[1.02] ${
              theme.active ? 'ring-2 ring-emerald-500' : ''
            }`}
          >
            {/* Preview */}
            <div
              className="h-44 p-4 flex flex-col items-center justify-center relative"
              style={{ backgroundColor: theme.background_color }}
            >
              {theme.active && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-emerald-500 text-white text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Ativo
                  </Badge>
                </div>
              )}
              
              <div className="absolute top-2 left-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${theme.theme_mode === 'light' ? 'border-yellow-500 text-yellow-500' : 'border-slate-400 text-slate-400'}`}
                >
                  {theme.theme_mode === 'light' ? <Sun className="w-3 h-3 mr-1" /> : <Moon className="w-3 h-3 mr-1" />}
                  {theme.theme_mode === 'light' ? 'Claro' : 'Escuro'}
                </Badge>
              </div>
              
              <h3 
                className="font-bold text-xl mb-2"
                style={{ color: theme.text_color, fontFamily: theme.font_primary }}
              >
                {theme.name}
              </h3>
              
              <div className="flex gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg shadow-lg"
                  style={{ backgroundColor: theme.primary_color }}
                />
                <div
                  className="w-8 h-8 rounded-lg shadow-lg"
                  style={{ backgroundColor: theme.secondary_color }}
                />
                <div
                  className="w-8 h-8 rounded-lg shadow-lg"
                  style={{ backgroundColor: theme.accent_color }}
                />
              </div>
              
              <div className="flex gap-2 items-center">
                <div 
                  className="px-3 py-1 text-sm"
                  style={{ 
                    backgroundColor: theme.primary_color,
                    color: theme.text_color,
                    borderRadius: theme.border_radius === 'none' ? '0' : 
                      theme.border_radius === 'full' ? '9999px' : '0.5rem'
                  }}
                >
                  Botão
                </div>
                {theme.particle_effect && (
                  <Badge variant="outline" className="text-xs" style={{ borderColor: theme.primary_color, color: theme.primary_color }}>
                    <Sparkles className="w-3 h-3 mr-1" />
                    {theme.particle_style || 'Partículas'}
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">{theme.font_primary}</Badge>
                  {theme.gradient_animation && (
                    <Badge variant="outline" className="text-xs border-purple-500 text-purple-400">Gradiente</Badge>
                  )}
                  {theme.cursor_effect && theme.cursor_effect !== 'none' && (
                    <Badge variant="outline" className="text-xs border-cyan-500 text-cyan-400">Cursor</Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {!theme.active && (
                  <Button
                    size="sm"
                    onClick={() => handleActivate(theme.id)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  >
                    Ativar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDuplicate(theme)}
                  className="text-slate-400 hover:text-white"
                  title="Duplicar"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenDialog(theme)}
                  className="text-slate-400 hover:text-white"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(theme.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {themes.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center">
            <Palette className="w-12 h-12 mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400">Nenhum tema cadastrado</p>
            <p className="text-slate-500 text-sm mt-2">Escolha um preset ou crie seu próprio tema</p>
            <Button
              onClick={() => handleOpenDialog()}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Tema
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {editingTheme ? 'Editar Tema' : 'Novo Tema'}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-900">
              <TabsTrigger value="presets" className="data-[state=active]:bg-emerald-500">
                <Sparkles className="w-4 h-4 mr-2" />
                Presets
              </TabsTrigger>
              <TabsTrigger value="custom" className="data-[state=active]:bg-emerald-500">
                <Palette className="w-4 h-4 mr-2" />
                Personalizar
              </TabsTrigger>
            </TabsList>

            {/* Presets Tab */}
            <TabsContent value="presets" className="mt-4">
              {/* Filter Buttons */}
              <div className="flex gap-2 mb-4">
                <Button
                  size="sm"
                  variant={filterMode === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterMode('all')}
                  className={filterMode === 'all' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-slate-600 text-slate-300'}
                >
                  Todos
                </Button>
                <Button
                  size="sm"
                  variant={filterMode === 'dark' ? 'default' : 'outline'}
                  onClick={() => setFilterMode('dark')}
                  className={filterMode === 'dark' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-slate-600 text-slate-300'}
                >
                  <Moon className="w-4 h-4 mr-1" />
                  Escuros
                </Button>
                <Button
                  size="sm"
                  variant={filterMode === 'light' ? 'default' : 'outline'}
                  onClick={() => setFilterMode('light')}
                  className={filterMode === 'light' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-slate-600 text-slate-300'}
                >
                  <Sun className="w-4 h-4 mr-1" />
                  Claros
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredPresets.map((preset) => {
                  const Icon = preset.icon
                  return (
                    <button
                      key={preset.name}
                      onClick={() => handleApplyPreset(preset)}
                      className="group relative overflow-hidden rounded-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <div
                        className="aspect-square p-4 flex flex-col items-center justify-center"
                        style={{ backgroundColor: preset.colors.background_color }}
                      >
                        {/* Mode Badge */}
                        <div className="absolute top-2 right-2">
                          {preset.mode === 'light' ? (
                            <Sun className="w-4 h-4" style={{ color: preset.colors.primary_color }} />
                          ) : (
                            <Moon className="w-4 h-4" style={{ color: preset.colors.primary_color }} />
                          )}
                        </div>
                        
                        <div className="flex gap-1.5 mb-3">
                          <div
                            className="w-6 h-6 rounded-md"
                            style={{ backgroundColor: preset.colors.primary_color }}
                          />
                          <div
                            className="w-6 h-6 rounded-md"
                            style={{ backgroundColor: preset.colors.secondary_color }}
                          />
                          <div
                            className="w-6 h-6 rounded-md"
                            style={{ backgroundColor: preset.colors.accent_color }}
                          />
                        </div>
                        
                        <Icon 
                          className="w-5 h-5 mb-2" 
                          style={{ color: preset.colors.primary_color }}
                        />
                        
                        <span 
                          className="text-xs font-medium text-center"
                          style={{ color: preset.colors.text_color }}
                        >
                          {preset.name}
                        </span>
                        
                        {/* Animation badges */}
                        <div className="flex gap-1 mt-2 flex-wrap justify-center">
                          {preset.animations.particle_effect && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20" style={{ color: preset.colors.text_color }}>
                              {preset.animations.particle_style}
                            </span>
                          )}
                          {preset.animations.gradient_animation && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20" style={{ color: preset.colors.text_color }}>
                              Grad
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white text-sm font-medium bg-emerald-500 px-3 py-1 rounded-full">
                          Aplicar
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </TabsContent>

            {/* Custom Tab */}
            <TabsContent value="custom" className="mt-4 space-y-6">
              {/* Preview ao vivo */}
              <div
                className="rounded-xl p-6 transition-all"
                style={{ 
                  backgroundColor: formData.background_color,
                  animation: formData.gradient_animation ? 'gradient 3s ease infinite' : undefined,
                  background: formData.gradient_animation 
                    ? `linear-gradient(-45deg, ${formData.background_color}, ${formData.primary_color}20, ${formData.secondary_color}20, ${formData.background_color})`
                    : undefined,
                  backgroundSize: formData.gradient_animation ? '400% 400%' : undefined,
                }}
              >
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {formData.theme_mode === 'light' ? (
                      <Sun className="w-5 h-5" style={{ color: formData.primary_color }} />
                    ) : (
                      <Moon className="w-5 h-5" style={{ color: formData.primary_color }} />
                    )}
                    <span className="text-xs px-2 py-0.5 rounded" style={{ 
                      backgroundColor: formData.primary_color + '30',
                      color: formData.primary_color 
                    }}>
                      {formData.theme_mode === 'light' ? 'Tema Claro' : 'Tema Escuro'}
                    </span>
                  </div>
                  <h3 
                    className="text-2xl font-bold mb-2"
                    style={{ color: formData.text_color }}
                  >
                    {formData.name || 'Preview do Tema'}
                  </h3>
                  <p style={{ color: formData.primary_color }}>
                    Cor primária do tema
                  </p>
                </div>
                
                <div className="flex justify-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 shadow-lg transition-transform hover:scale-110"
                    style={{ 
                      backgroundColor: formData.primary_color,
                      borderRadius: formData.border_radius === 'none' ? '0' : 
                        formData.border_radius === 'full' ? '9999px' : '0.75rem'
                    }}
                  />
                  <div
                    className="w-10 h-10 shadow-lg transition-transform hover:scale-110"
                    style={{ 
                      backgroundColor: formData.secondary_color,
                      borderRadius: formData.border_radius === 'none' ? '0' : 
                        formData.border_radius === 'full' ? '9999px' : '0.75rem'
                    }}
                  />
                  <div
                    className="w-10 h-10 shadow-lg transition-transform hover:scale-110"
                    style={{ 
                      backgroundColor: formData.accent_color,
                      borderRadius: formData.border_radius === 'none' ? '0' : 
                        formData.border_radius === 'full' ? '9999px' : '0.75rem'
                    }}
                  />
                </div>
                
                <div className="flex justify-center gap-2">
                  <button
                    className="px-4 py-2 font-medium transition-all hover:opacity-90"
                    style={{ 
                      backgroundColor: formData.primary_color,
                      color: formData.text_color,
                      borderRadius: formData.border_radius === 'none' ? '0' : 
                        formData.border_radius === 'full' ? '9999px' : '0.5rem'
                    }}
                  >
                    Botão Primário
                  </button>
                  <button
                    className="px-4 py-2 font-medium border-2 transition-all hover:opacity-90"
                    style={{ 
                      borderColor: formData.primary_color,
                      color: formData.primary_color,
                      backgroundColor: 'transparent',
                      borderRadius: formData.border_radius === 'none' ? '0' : 
                        formData.border_radius === 'full' ? '9999px' : '0.5rem'
                    }}
                  >
                    Botão Outline
                  </button>
                </div>
              </div>

              {/* Nome do tema e Modo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Nome do tema *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Meu Tema Personalizado"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Modo do Tema</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formData.theme_mode === 'dark' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, theme_mode: 'dark' })}
                      className={`flex-1 ${formData.theme_mode === 'dark' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-slate-600 text-slate-300'}`}
                    >
                      <Moon className="w-4 h-4 mr-2" />
                      Escuro
                    </Button>
                    <Button
                      type="button"
                      variant={formData.theme_mode === 'light' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, theme_mode: 'light' })}
                      className={`flex-1 ${formData.theme_mode === 'light' ? 'bg-emerald-500 hover:bg-emerald-600' : 'border-slate-600 text-slate-300'}`}
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Claro
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cores principais */}
              <div className="space-y-4">
                <h4 className="text-slate-300 font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Cores Principais (Modo Escuro)
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ColorField
                    label="Primária"
                    value={formData.primary_color}
                    onChange={(value) => setFormData({ ...formData, primary_color: value })}
                  />
                  <ColorField
                    label="Secundária"
                    value={formData.secondary_color}
                    onChange={(value) => setFormData({ ...formData, secondary_color: value })}
                  />
                  <ColorField
                    label="Destaque"
                    value={formData.accent_color}
                    onChange={(value) => setFormData({ ...formData, accent_color: value })}
                  />
                  <ColorField
                    label="Fundo"
                    value={formData.background_color}
                    onChange={(value) => setFormData({ ...formData, background_color: value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <ColorField
                    label="Card Background"
                    value={formData.card_background || '#1e293b'}
                    onChange={(value) => setFormData({ ...formData, card_background: value })}
                  />
                  <ColorField
                    label="Texto"
                    value={formData.text_color}
                    onChange={(value) => setFormData({ ...formData, text_color: value })}
                  />
                  <ColorField
                    label="Bordas"
                    value={formData.border_color || '#334155'}
                    onChange={(value) => setFormData({ ...formData, border_color: value })}
                  />
                </div>
              </div>

              {/* Cores do Modo Claro */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-slate-300 font-medium flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Cores do Modo Claro
                  </h4>
                  <p className="text-xs text-slate-500">
                    Usadas automaticamente quando o sistema estiver em modo claro
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ColorField
                    label="Primária Clara"
                    value={formData.light_primary_color || formData.primary_color}
                    onChange={(value) => setFormData({ ...formData, light_primary_color: value })}
                  />
                  <ColorField
                    label="Secundária Clara"
                    value={formData.light_secondary_color || formData.secondary_color}
                    onChange={(value) => setFormData({ ...formData, light_secondary_color: value })}
                  />
                  <ColorField
                    label="Destaque Claro"
                    value={formData.light_accent_color || formData.accent_color}
                    onChange={(value) => setFormData({ ...formData, light_accent_color: value })}
                  />
                  <ColorField
                    label="Fundo Claro"
                    value={formData.light_background_color || '#ffffff'}
                    onChange={(value) => setFormData({ ...formData, light_background_color: value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <ColorField
                    label="Card Claro"
                    value={formData.light_card_background || '#f8fafc'}
                    onChange={(value) => setFormData({ ...formData, light_card_background: value })}
                  />
                  <ColorField
                    label="Texto Claro"
                    value={formData.light_text_color || '#0f172a'}
                    onChange={(value) => setFormData({ ...formData, light_text_color: value })}
                  />
                  <ColorField
                    label="Bordas Claras"
                    value={formData.light_border_color || '#e2e8f0'}
                    onChange={(value) => setFormData({ ...formData, light_border_color: value })}
                  />
                </div>
              </div>

              {/* Tipografia e Bordas */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-slate-300 font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Tipografia
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-slate-300 text-sm">Fonte Principal</Label>
                      <Select
                        value={formData.font_primary}
                        onValueChange={(value) => setFormData({ ...formData, font_primary: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {fontOptions.map((font) => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300 text-sm">Fonte Secundária</Label>
                      <Select
                        value={formData.font_secondary}
                        onValueChange={(value) => setFormData({ ...formData, font_secondary: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {fontOptions.map((font) => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-slate-300 font-medium">Bordas Arredondadas</h4>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {borderRadiusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, border_radius: option.value as ThemeInput['border_radius'] })}
                        className={`p-2 text-xs transition-all ${
                          formData.border_radius === option.value
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                        style={{
                          borderRadius: option.value === 'none' ? '0' : 
                            option.value === 'full' ? '9999px' : 
                            option.value === 'sm' ? '0.25rem' :
                            option.value === 'md' ? '0.5rem' :
                            option.value === 'lg' ? '0.75rem' : '1rem'
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Animações */}
              <div className="space-y-4">
                <h4 className="text-slate-300 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Efeitos de Animação
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tipo de Animação */}
                  <div className="space-y-3">
                    <Label className="text-slate-300 text-sm">Animação de Entrada</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {animationTypeOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, animation_type: option.value as ThemeInput['animation_type'] })}
                            className={`p-2 text-xs flex flex-col items-center gap-1 transition-all rounded-lg ${
                              formData.animation_type === option.value
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Efeito Hover */}
                  <div className="space-y-3">
                    <Label className="text-slate-300 text-sm">Efeito Hover</Label>
                    <Select
                      value={formData.hover_effect}
                      onValueChange={(value) => setFormData({ ...formData, hover_effect: value as ThemeInput['hover_effect'] })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {hoverEffectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Duração da Animação */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">Duração (ms)</Label>
                    <Input
                      type="number"
                      value={formData.animation_duration || 300}
                      onChange={(e) => setFormData({ ...formData, animation_duration: parseInt(e.target.value) || 300 })}
                      className="bg-slate-700 border-slate-600 text-white"
                      min={100}
                      max={2000}
                      step={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm">Delay (ms)</Label>
                    <Input
                      type="number"
                      value={formData.animation_delay || 0}
                      onChange={(e) => setFormData({ ...formData, animation_delay: parseInt(e.target.value) || 0 })}
                      className="bg-slate-700 border-slate-600 text-white"
                      min={0}
                      max={1000}
                      step={50}
                    />
                  </div>
                </div>
              </div>

              {/* Partículas Animadas */}
              <div className="space-y-4">
                <h4 className="text-slate-300 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Partículas Animadas
                </h4>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <Label className="text-slate-300">Ativar Partículas</Label>
                    <p className="text-xs text-slate-500">Efeito de partículas animadas no background</p>
                  </div>
                  <Switch
                    checked={formData.particle_effect}
                    onCheckedChange={(checked) => setFormData({ ...formData, particle_effect: checked })}
                  />
                </div>
                
                {formData.particle_effect && (
                  <div className="space-y-3">
                    <Label className="text-slate-300 text-sm">Estilo das Partículas</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {particleStyleOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, particle_style: option.value as ThemeInput['particle_style'] })}
                            className={`p-3 text-xs flex flex-col items-center gap-2 transition-all rounded-lg ${
                              formData.particle_style === option.value
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                            title={option.description}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{option.label}</span>
                          </button>
                        )
                      })}
                    </div>
                    <p className="text-xs text-slate-500">
                      {particleStyleOptions.find(o => o.value === formData.particle_style)?.description || 'Selecione um estilo de partícula'}
                    </p>
                  </div>
                )}
              </div>

              {/* Efeitos Especiais */}
              <div className="space-y-4">
                <h4 className="text-slate-300 font-medium flex items-center gap-2">
                  <MousePointer className="w-4 h-4" />
                  Efeitos Especiais
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Toggles */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <Label className="text-slate-300">Gradiente Animado</Label>
                        <p className="text-xs text-slate-500">Background com gradiente em movimento</p>
                      </div>
                      <Switch
                        checked={formData.gradient_animation}
                        onCheckedChange={(checked) => setFormData({ ...formData, gradient_animation: checked })}
                      />
                    </div>
                  </div>
                  
                  {/* Efeito do Cursor */}
                  <div className="space-y-3">
                    <Label className="text-slate-300 text-sm">Efeito do Cursor</Label>
                    <Select
                      value={formData.cursor_effect}
                      onValueChange={(value) => setFormData({ ...formData, cursor_effect: value as ThemeInput['cursor_effect'] })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {cursorEffectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500">
                      Efeitos visuais que seguem o movimento do mouse
                    </p>
                  </div>
                </div>
              </div>

              {/* Elementos Dinâmicos */}
              <div className="space-y-4">
                <h4 className="text-slate-300 font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Elementos Dinâmicos
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Efeito de Brilho no Cursor */}
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MousePointer className="w-4 h-4 text-emerald-400" />
                      <div>
                        <Label className="text-slate-300">Brilho no Cursor</Label>
                        <p className="text-xs text-slate-500">Um brilho sutil segue o mouse</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.cursor_effect === 'glow'}
                      onCheckedChange={(checked) => setFormData({ ...formData, cursor_effect: checked ? 'glow' : 'none' })}
                    />
                  </div>

                  {/* Animação de Revelação ao Rolar */}
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <div>
                        <Label className="text-slate-300">Revelação ao Rolar</Label>
                        <p className="text-xs text-slate-500">Itens aparecem gradualmente ao rolar</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.scroll_reveal_animation}
                      onCheckedChange={(checked) => setFormData({ ...formData, scroll_reveal_animation: checked })}
                    />
                  </div>

                  {/* Animação de Contador */}
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Timer className="w-4 h-4 text-emerald-400" />
                      <div>
                        <Label className="text-slate-300">Animação de Contador</Label>
                        <p className="text-xs text-slate-500">Números aumentam quando visíveis</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.counter_animation}
                      onCheckedChange={(checked) => setFormData({ ...formData, counter_animation: checked })}
                    />
                  </div>

                  {/* Pontos Interativos da Linha do Tempo */}
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <div>
                        <Label className="text-slate-300">Pontos da Timeline</Label>
                        <p className="text-xs text-slate-500">Efeito de brilho ao passar o mouse</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.timeline_glow_points}
                      onCheckedChange={(checked) => setFormData({ ...formData, timeline_glow_points: checked })}
                    />
                  </div>

                  {/* Textura de Ruído */}
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg md:col-span-2">
                    <div className="flex items-center gap-3">
                      <Hash className="w-4 h-4 text-emerald-400" />
                      <div>
                        <Label className="text-slate-300">Textura de Ruído</Label>
                        <p className="text-xs text-slate-500">Sobreposição sutil para estética utilitária de criador</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.noise_texture}
                      onCheckedChange={(checked) => setFormData({ ...formData, noise_texture: checked })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name || isLoading}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isLoading ? 'Salvando...' : 'Salvar Tema'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente auxiliar para campo de cor
function ColorField({ 
  label, 
  value, 
  onChange 
}: { 
  label: string
  value: string
  onChange: (value: string) => void 
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-300 text-xs">{label}</Label>
      <div className="flex gap-1.5">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-9 p-1 bg-slate-700 border-slate-600 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white flex-1 font-mono text-xs"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
