'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export const BackgroundBeams = ({ 
  className = '', 
  beamOpacity = 0.5, 
  beamOrigin = 'right',
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
      />
      <div className="absolute inset-0 bg-black [mask-image:radial-gradient(transparent,white)]" />
      
      {/* Animated beams */}
      <motion.div
        className={`absolute ${beamOrigin === 'right' ? 'right-0' : 'left-0'} w-full h-full`}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundImage: 'linear-gradient(45deg, rgba(0,64,255,0.3) 0%, rgba(0,0,0,0) 70%)',
          opacity: beamOpacity,
        }}
      />
      
      <motion.div
        className={`absolute ${beamOrigin === 'right' ? 'left-0' : 'right-0'} w-full h-full`}
        animate={{
          backgroundPosition: ['100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundImage: 'linear-gradient(-45deg, rgba(128,0,255,0.3) 0%, rgba(0,0,0,0) 70%)',
          opacity: beamOpacity,
        }}
      />
    </div>
  )
}