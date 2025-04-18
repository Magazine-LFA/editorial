'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface BorderGradientProps {
  containerClassName?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  background?: string;
  boxShadow?: string;
  borderWidth?: string;
  className?: string;
  [key: string]: any;
}

const BorderGradient = ({
  containerClassName = '',
  children,
  as: Component = 'div',
  background,
  boxShadow,
  borderWidth = '2px',
  className = '',
  ...otherProps
}: BorderGradientProps) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div 
      className={`relative rounded-xl p-px ${containerClassName}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered 
          ? 'linear-gradient(to right, #4776E6, #8E54E9)'
          : 'linear-gradient(to right, #141414, #141414)',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? boxShadow : 'none',
      }}
    >
      <Component
        className={className}
        style={{ 
          background,
        }}
        {...otherProps}
      >
        {children}
      </Component>
    </div>
  )
}

export const HoverBorderGradient = BorderGradient