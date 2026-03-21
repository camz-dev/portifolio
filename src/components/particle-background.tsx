'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ParticleBackgroundProps {
  quantidade?: number
  style?: 'floating' | 'stars' | 'bubbles' | 'glow' | 'sparkle' | 'fire' | 'snow' | 'hearts' | 'aurora' | 'matrix' | 'geometric'
  color?: string
  enabled?: boolean
}

const Particle = ({ 
  delay, 
  duration, 
  left, 
  size, 
  opacity,
  windowHeight,
  style = 'floating',
  color = '#10b981'
}: { 
  delay: number
  duration: number
  left: string
  size: number
  opacity: number
  windowHeight: number
  style?: string
  color?: string
}) => {
  const getParticleStyle = () => {
    switch (style) {
      case 'stars':
        return {
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          boxShadow: `0 0 ${size * 3}px ${color}`,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        }
      case 'bubbles':
        return {
          background: `radial-gradient(circle at 30% 30%, ${color}30, ${color}10)`,
          border: `1px solid ${color}40`,
          boxShadow: `inset 0 0 ${size}px ${color}20`,
        }
      case 'glow':
        return {
          background: `radial-gradient(circle, ${color} 0%, ${color}50 40%, transparent 70%)`,
          boxShadow: `0 0 ${size * 4}px ${color}, 0 0 ${size * 2}px ${color}`,
        }
      case 'sparkle':
        return {
          background: color,
          boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`,
          clipPath: 'polygon(50% 0%, 55% 45%, 100% 50%, 55% 55%, 50% 100%, 45% 55%, 0% 50%, 45% 45%)',
        }
      case 'fire':
        return {
          background: `radial-gradient(circle, #ff6b35 0%, #f7931e 50%, transparent 70%)`,
          boxShadow: `0 0 ${size * 2}px #ff6b35`,
          filter: 'blur(1px)',
        }
      case 'snow':
        return {
          background: `radial-gradient(circle, #ffffff 0%, #e0e0e0 50%, transparent 70%)`,
          boxShadow: `0 0 ${size}px rgba(255,255,255,0.8)`,
        }
      case 'hearts':
        return {
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")',
        }
      case 'aurora':
        return {
          background: `linear-gradient(135deg, ${color}40, #8b5cf640, #06b6d440)`,
          filter: 'blur(10px)',
          opacity: 0.6,
        }
      case 'matrix':
        return {
          background: `linear-gradient(to bottom, ${color}, transparent)`,
          width: 2,
          height: size * 4,
          filter: 'blur(0.5px)',
        }
      case 'geometric':
        return {
          background: 'transparent',
          border: `1px solid ${color}40`,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }
      default: // floating
        return {
          background: `radial-gradient(circle, ${color} 0%, ${color}00 70%)`,
          boxShadow: `0 0 ${size * 2}px ${color}40`,
        }
    }
  }

  const getAnimation = () => {
    switch (style) {
      case 'fire':
        return {
          y: [0, -windowHeight - 100],
          x: [0, (Math.random() - 0.5) * 50],
          opacity: [0, opacity, opacity, 0],
          scale: [0.5, 1.2, 0.8, 0],
        }
      case 'snow':
        return {
          y: [0, -windowHeight - 100],
          x: [0, (Math.random() - 0.5) * 200],
          opacity: [0, opacity, opacity, 0],
          rotate: [0, 360],
        }
      case 'aurora':
        return {
          x: [0, (Math.random() - 0.5) * 200],
          y: [0, -windowHeight],
          opacity: [0, opacity * 0.8, opacity * 0.8, 0],
          scale: [0.8, 1.2, 1, 0.8],
        }
      case 'matrix':
        return {
          y: [-50, -windowHeight],
          opacity: [0, opacity, opacity, 0],
        }
      default:
        return {
          y: [0, -windowHeight - 100],
          x: [0, (Math.random() - 0.5) * 100],
          opacity: [0, opacity, opacity, 0],
          scale: [0.5, 1, 1, 0.5],
        }
    }
  }

  const particleStyle = getParticleStyle()
  const animation = getAnimation()

  return (
    <motion.div
      className="absolute"
      style={{
        left,
        bottom: style === 'matrix' ? '100%' : `-${size}px`,
        width: size,
        height: style === 'matrix' ? size * 4 : size,
        borderRadius: style === 'geometric' || style === 'stars' || style === 'sparkle' || style === 'hearts' ? 0 : '50%',
        ...particleStyle,
      }}
      initial={{ 
        y: 0, 
        x: 0, 
        opacity: 0,
        scale: 0.5 
      }}
      animate={animation}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: style === 'aurora' ? 'easeInOut' : 'linear',
      }}
    />
  )
}

export default function ParticleBackground({ 
  quantidade = 30, 
  style = 'floating',
  color = '#10b981',
  enabled = true 
}: ParticleBackgroundProps) {
  const [windowHeight, setWindowHeight] = useState(800)
  const [visivel, setVisivel] = useState(true)
  const [opacidade, setOpacidade] = useState(1)

  useEffect(() => {
    setWindowHeight(window.innerHeight)
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const particulas = useMemo(() => {
    return Array.from({ length: quantidade }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      left: `${Math.random() * 100}%`,
      size: style === 'aurora' ? 80 + Math.random() * 120 : 4 + Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.5,
    }))
  }, [quantidade, style])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const height = window.innerHeight
      
      const novaOpacidade = Math.max(0, 1 - (scrollY / (height * 0.3)))
      setOpacidade(novaOpacidade)
      
      if (scrollY > height * 0.5) {
        setVisivel(false)
      } else {
        setVisivel(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!enabled) return null

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          className="fixed inset-0 overflow-hidden pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: opacidade }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 20%, ${color}10 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, ${color}08 0%, transparent 40%)
              `
            }}
          />
          
          {particulas.map((p) => (
            <Particle
              key={p.id}
              delay={p.delay}
              duration={p.duration}
              left={p.left}
              size={p.size}
              opacity={p.opacity}
              windowHeight={windowHeight}
              style={style}
              color={color}
            />
          ))}
          
          {style !== 'aurora' && style !== 'matrix' && particulas.slice(0, 5).map((p) => (
            <Particle
              key={`large-${p.id}`}
              delay={p.delay + 2}
              duration={p.duration + 5}
              left={`${parseFloat(p.left) + 10}%`}
              size={p.size * 2}
              opacity={p.opacity * 0.5}
              windowHeight={windowHeight}
              style={style}
              color={color}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
