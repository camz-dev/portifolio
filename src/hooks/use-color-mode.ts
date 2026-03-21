'use client'

import { useState, useEffect, useCallback } from 'react'

export type ColorMode = 'dark' | 'light'

interface UseColorModeReturn {
  colorMode: ColorMode
  isDark: boolean
  isLight: boolean
  toggleColorMode: () => void
  setColorMode: (mode: ColorMode) => void
}

/**
 * Hook para detectar e gerenciar o modo de cor do sistema
 * Detecta automaticamente quando o usuário muda o tema do sistema
 */
export function useColorMode(): UseColorModeReturn {
  const [colorMode, setColorModeState] = useState<ColorMode>('dark')

  useEffect(() => {
    // Detecta o modo inicial
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const initialMode: ColorMode = mediaQuery.matches ? 'dark' : 'light'
    setColorModeState(initialMode)

    // Listener para mudanças no tema do sistema
    const handleChange = (e: MediaQueryListEvent) => {
      const newMode: ColorMode = e.matches ? 'dark' : 'light'
      setColorModeState(newMode)
    }

    // Adiciona listener
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleColorMode = useCallback(() => {
    setColorModeState(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode)
  }, [])

  return {
    colorMode,
    isDark: colorMode === 'dark',
    isLight: colorMode === 'light',
    toggleColorMode,
    setColorMode,
  }
}

/**
 * Função para gerar cores claras a partir de cores escuras
 * Converte automaticamente um tema escuro para claro
 */
export function generateLightColors(darkTheme: {
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  card_background?: string
  text_color: string
  muted_color?: string
  border_color?: string
}) {
  return {
    light_primary_color: darkTheme.primary_color,
    light_secondary_color: darkTheme.secondary_color,
    light_accent_color: darkTheme.accent_color,
    light_background_color: '#ffffff',
    light_card_background: '#f8fafc',
    light_text_color: '#0f172a',
    light_muted_color: '#64748b',
    light_border_color: '#e2e8f0',
  }
}

/**
 * Função para obter as cores ativas baseado no modo
 */
export function getActiveColors(
  theme: {
    primary_color: string
    secondary_color: string
    accent_color: string
    background_color: string
    card_background?: string
    text_color: string
    muted_color?: string
    border_color?: string
    font_primary?: string
    font_secondary?: string
    border_radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    light_primary_color?: string
    light_secondary_color?: string
    light_accent_color?: string
    light_background_color?: string
    light_card_background?: string
    light_text_color?: string
    light_muted_color?: string
    light_border_color?: string
    light_font_primary?: string
    light_font_secondary?: string
    // Dynamic Elements
    scroll_reveal_animation?: boolean
    counter_animation?: boolean
    timeline_glow_points?: boolean
    noise_texture?: boolean
    particle_effect?: boolean
    particle_style?: string
    cursor_effect?: string
    gradient_animation?: boolean
  },
  colorMode: ColorMode
) {
  if (colorMode === 'light') {
    // Se tiver cores claras definidas, usa elas
    // Senão gera cores claras automaticamente
    return {
      primary_color: theme.light_primary_color || theme.primary_color,
      secondary_color: theme.light_secondary_color || theme.secondary_color,
      accent_color: theme.light_accent_color || theme.accent_color,
      background_color: theme.light_background_color || '#ffffff',
      card_background: theme.light_card_background || '#f8fafc',
      text_color: theme.light_text_color || '#0f172a',
      muted_color: theme.light_muted_color || '#64748b',
      border_color: theme.light_border_color || '#e2e8f0',
      font_primary: theme.font_primary || 'Inter',
      font_secondary: theme.font_secondary || 'Fira Code',
      border_radius: theme.border_radius || 'md',
      // Dynamic Elements - pass through
      scroll_reveal_animation: theme.scroll_reveal_animation,
      counter_animation: theme.counter_animation,
      timeline_glow_points: theme.timeline_glow_points,
      noise_texture: theme.noise_texture,
      particle_effect: theme.particle_effect,
      particle_style: theme.particle_style,
      cursor_effect: theme.cursor_effect,
      gradient_animation: theme.gradient_animation,
    }
  }

  // Modo escuro - usa as cores originais
  return {
    primary_color: theme.primary_color,
    secondary_color: theme.secondary_color,
    accent_color: theme.accent_color,
    background_color: theme.background_color,
    card_background: theme.card_background,
    text_color: theme.text_color,
    muted_color: theme.muted_color,
    border_color: theme.border_color,
    font_primary: theme.font_primary || 'Inter',
    font_secondary: theme.font_secondary || 'Fira Code',
    border_radius: theme.border_radius || 'md',
    // Dynamic Elements - pass through
    scroll_reveal_animation: theme.scroll_reveal_animation,
    counter_animation: theme.counter_animation,
    timeline_glow_points: theme.timeline_glow_points,
    noise_texture: theme.noise_texture,
    particle_effect: theme.particle_effect,
    particle_style: theme.particle_style,
    cursor_effect: theme.cursor_effect,
    gradient_animation: theme.gradient_animation,
  }
}
