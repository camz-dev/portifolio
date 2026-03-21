'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

// ===== CURSOR GLOW EFFECT =====
export function CursorGlow({ color = '#00FF88', enabled = false }: { color?: string; enabled?: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 w-64 h-64 -translate-x-1/2 -translate-y-1/2"
      style={{
        background: `radial-gradient(circle, ${color}40 0%, ${color}10 40%, transparent 70%)`,
        filter: 'blur(20px)',
      }}
    />
  )
}

// ===== SCROLL REVEAL ANIMATION =====
interface ScrollRevealProps {
  children: React.ReactNode
  enabled?: boolean
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
}

export function ScrollReveal({ children, enabled = true, delay = 0, direction = 'up' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: 50 }
      case 'down': return { opacity: 0, y: -50 }
      case 'left': return { opacity: 0, x: 50 }
      case 'right': return { opacity: 0, x: -50 }
      default: return { opacity: 0 }
    }
  }

  if (!enabled) return <>{children}</>

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : getInitialPosition()}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// ===== COUNTER ANIMATION =====
interface CounterProps {
  value: number
  suffix?: string
  prefix?: string
  enabled?: boolean
  duration?: number
}

export function Counter({ value, suffix = '', prefix = '', enabled = true, duration = 2 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [hasAnimated, setHasAnimated] = useState(false)

  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (current) => Math.round(current))

  useEffect(() => {
    if (isInView && enabled && !hasAnimated) {
      spring.set(value)
      setHasAnimated(true)
    }
  }, [isInView, enabled, value, spring, hasAnimated])

  if (!enabled) {
    return <span>{prefix}{value}{suffix}</span>
  }

  return (
    <span ref={ref}>
      {prefix}<motion.span>{display}</motion.span>{suffix}
    </span>
  )
}

// ===== TIMELINE GLOW POINTS =====
interface TimelineGlowPointProps {
  color?: string
  enabled?: boolean
  isLast?: boolean
}

export function TimelineGlowPoint({ color = '#00FF88', enabled = true, isLast = false }: TimelineGlowPointProps) {
  if (!enabled) {
    return (
      <div 
        className="w-4 h-4 rounded-full bg-muted border-2 border-border"
        style={{ borderColor: color }}
      />
    )
  }

  return (
    <div className="relative">
      <motion.div
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ 
          boxShadow: [
            `0 0 5px ${color}`,
            `0 0 20px ${color}`,
            `0 0 5px ${color}`,
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-0 w-4 h-4 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  )
}

// ===== NOISE TEXTURE OVERLAY =====
export function NoiseTexture({ enabled = false, opacity = 0.03 }: { enabled?: boolean; opacity?: number }) {
  if (!enabled) return null

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

// ===== GEOMETRIC SHAPES (PARALLAX) =====
export function GeometricShapes({ enabled = false, color = '#00FF88' }: { enabled?: boolean; color?: string }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [enabled])

  if (!enabled) return null

  const shapes = [
    { type: 'square', size: 60, x: '10%', y: '20%', speed: 0.05 },
    { type: 'circle', size: 40, x: '85%', y: '30%', speed: 0.03 },
    { type: 'triangle', size: 50, x: '15%', y: '60%', speed: 0.04 },
    { type: 'square', size: 30, x: '80%', y: '70%', speed: 0.06 },
    { type: 'circle', size: 45, x: '50%', y: '80%', speed: 0.02 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute opacity-10"
          style={{
            left: shape.x,
            top: shape.y,
            transform: `translateY(${scrollY * shape.speed}px)`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 20 + i * 5, repeat: Infinity, ease: 'linear' },
          }}
        >
          {shape.type === 'square' && (
            <div 
              className="border-2 rounded-sm"
              style={{ 
                width: shape.size, 
                height: shape.size, 
                borderColor: color 
              }} 
            />
          )}
          {shape.type === 'circle' && (
            <div 
              className="border-2 rounded-full"
              style={{ 
                width: shape.size, 
                height: shape.size, 
                borderColor: color 
              }} 
            />
          )}
          {shape.type === 'triangle' && (
            <div 
              style={{ 
                width: 0, 
                height: 0, 
                borderLeft: `${shape.size/2}px solid transparent`,
                borderRight: `${shape.size/2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${color}40`,
              }} 
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ===== COMBINED DYNAMIC ELEMENTS PROVIDER =====
interface DynamicElementsProps {
  theme: {
    cursor_effect?: string
    scroll_reveal_animation?: boolean
    counter_animation?: boolean
    timeline_glow_points?: boolean
    noise_texture?: boolean
    particle_style?: string
    particle_effect?: boolean
    primary_color?: string
  }
  children: React.ReactNode
}

export function DynamicElementsProvider({ theme, children }: DynamicElementsProps) {
  const primaryColor = theme.primary_color || '#00FF88'

  return (
    <>
      {/* Cursor Glow */}
      <CursorGlow 
        color={primaryColor} 
        enabled={theme.cursor_effect === 'glow'} 
      />

      {/* Noise Texture */}
      <NoiseTexture 
        enabled={theme.noise_texture} 
        opacity={0.03} 
      />

      {/* Geometric Shapes */}
      <GeometricShapes 
        enabled={theme.particle_style === 'geometric'} 
        color={primaryColor} 
      />

      {children}
    </>
  )
}
