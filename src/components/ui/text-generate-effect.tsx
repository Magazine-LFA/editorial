'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TextGenerateEffectProps {
  words: string;
  className?: string;
}

export const TextGenerateEffect = ({
  words,
  className = '',
}: TextGenerateEffectProps) => {
  const [completed, setCompleted] = useState(false)
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCompleted(true)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])
  
  const characters = words.split('')
  
  return (
    <h1 className={className}>
      {characters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
            delay: 0.05 * i,
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h1>
  )
}