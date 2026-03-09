'use client'

/*
===========================================
📚 EXPLICAÇÃO: COMPONENTE DE PARTÍCULAS
===========================================
Este componente cria partículas flutuantes animadas.

Como funciona:
1. Gera várias partículas com posições e tamanhos aleatórios
2. Cada partícula tem uma animação de flutuação
3. Quando o usuário rola a página, as partículas desaparecem suavemente
*/

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ===========================================
// 📚 EXPLICAÇÃO: INTERFACE DO COMPONENTE
// ===========================================
interface ParticleBackgroundProps {
  quantidade?: number  // Quantas partículas criar (padrão: 30)
}

/*
===========================================
📚 EXPLICAÇÃO: COMPONENTE PARTICLE
===========================================
Cada partícula individual. Usamos memoização
para não recriar as partículas a cada render.
*/
const Particle = ({ 
  delay, 
  duration, 
  left, 
  size, 
  opacity,
  windowHeight 
}: { 
  delay: number
  duration: number
  left: string
  size: number
  opacity: number
  windowHeight: number
}) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left,
        bottom: `-${size}px`,
        width: size,
        height: size,
        background: `radial-gradient(circle, oklch(0.7 0.15 160 / ${opacity}) 0%, oklch(0.5 0.1 160 / 0) 70%)`,
        boxShadow: `0 0 ${size * 2}px oklch(0.7 0.15 160 / ${opacity * 0.5})`,
      }}
      initial={{ 
        y: 0, 
        x: 0, 
        opacity: 0,
        scale: 0.5 
      }}
      animate={{ 
        y: [0, -windowHeight - 100],  // Move para cima (usa altura passada como prop)
        x: [0, (Math.random() - 0.5) * 100],   // Move para os lados
        opacity: [0, opacity, opacity, 0],   // Fade in e fade out
        scale: [0.5, 1, 1, 0.5]              // Cresce e diminui
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,  // Repete para sempre
        ease: "linear",
      }}
    />
  )
}

/*
===========================================
📚 EXPLICAÇÃO: COMPONENTE PRINCIPAL
===========================================
ParticleBackground - O componente que contém todas as partículas
*/
export default function ParticleBackground({ quantidade = 30 }: ParticleBackgroundProps) {
  // Estado para a altura da janela (só disponível no cliente)
  const [windowHeight, setWindowHeight] = useState(800)  // Valor padrão para SSR
  
  // Estado para controlar se as partículas devem ser visíveis
  const [visivel, setVisivel] = useState(true)
  
  // Estado para a opacidade (usado para fade out suave)
  const [opacidade, setOpacidade] = useState(1)

  /*
  ==========================================
  📚 EXPLICAÇÃO: USEEFFECT - WINDOW HEIGHT
  ==========================================
  Este effect obtém a altura da janela apenas no cliente.
  Isso evita o erro "window is not defined" no servidor.
  */
  useEffect(() => {
    // Define a altura real da janela
    setWindowHeight(window.innerHeight)
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /*
  ==========================================
  📚 EXPLICAÇÃO: USEMEMO
  ==========================================
  useMemo "memoriza" um cálculo. Isso significa que as partículas
  só são geradas uma vez, não a cada renderização.
  
  Sem o useMemo, as partículas seriam recriadas toda vez que
  o componente atualizasse, o que causaria flickering.
  */
  const particulas = useMemo(() => {
    return Array.from({ length: quantidade }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,           // Atraso aleatório (0-5s)
      duration: 10 + Math.random() * 10,   // Duração aleatória (10-20s)
      left: `${Math.random() * 100}%`,     // Posição horizontal aleatória
      size: 4 + Math.random() * 8,         // Tamanho aleatório (4-12px)
      opacity: 0.3 + Math.random() * 0.5,  // Opacidade aleatória (0.3-0.8)
    }))
  }, [quantidade])

  /*
  ==========================================
  📚 EXPLICAÇÃO: USEEFFECT - SCROLL LISTENER
  ==========================================
  Este effect monitora o scroll da página.
  Quando o usuário rola mais que 100px, as partículas
  começam a desaparecer gradualmente.
  */
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const height = window.innerHeight
      
      // Calcula a opacidade baseada no scroll
      // Quanto mais rola, mais transparente
      const novaOpacidade = Math.max(0, 1 - (scrollY / (height * 0.3)))
      setOpacidade(novaOpacidade)
      
      // Se passou da primeira seção, esconde as partículas
      if (scrollY > height * 0.5) {
        setVisivel(false)
      } else {
        setVisivel(true)
      }
    }

    // Adiciona o listener de scroll
    window.addEventListener('scroll', handleScroll)
    
    // Limpa o listener quando o componente é desmontado
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /*
  ==========================================
  📚 EXPLICAÇÃO: ANIMATEPRESENCE
  ==========================================
  AnimatePresence permite animar componentes quando eles
  são removidos da tela (como um fade out final).
  */
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
          {/*
            fixed inset-0 = ocupa toda a tela, fixo
            overflow-hidden = esconde partículas que saem da tela
            pointer-events-none = não bloqueia cliques
            z-0 = atrás de tudo
          */}
          
          {/* Gradiente de fundo sutil */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 20%, oklch(0.25 0.04 160 / 0.15) 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, oklch(0.2 0.03 150 / 0.1) 0%, transparent 40%)
              `
            }}
          />
          
          {/* Renderiza todas as partículas */}
          {particulas.map((p) => (
            <Particle
              key={p.id}
              delay={p.delay}
              duration={p.duration}
              left={p.left}
              size={p.size}
              opacity={p.opacity}
              windowHeight={windowHeight}
            />
          ))}
          
          {/* Partículas maiores e mais brilhantes (poucas) */}
          {particulas.slice(0, 5).map((p) => (
            <Particle
              key={`large-${p.id}`}
              delay={p.delay + 2}
              duration={p.duration + 5}
              left={`${parseFloat(p.left) + 10}%`}
              size={p.size * 2}
              opacity={p.opacity * 0.5}
              windowHeight={windowHeight}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/*
===========================================
📚 RESUMO DO QUE APRENDEMOS:
===========================================
1. useMemo - Memoriza cálculos para não repetir
2. useEffect com scroll - Detecta quando o usuário rola a página
3. AnimatePresence - Anima elementos quando aparecem/desaparecem
4. motion.div - Div com animações do Framer Motion
5. Pointer events none - Permite clicar "através" do elemento
6. SSR-safe window - Usa estado para evitar erro no servidor
*/
