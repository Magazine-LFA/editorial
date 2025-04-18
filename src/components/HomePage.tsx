'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TextGenerateEffect } from './ui/text-generate-effect'
import { BackgroundBeams } from './ui/background-beams'
import { HoverBorderGradient } from './ui/hover-border-gradient.tsx'
import Image from 'next/image'
import { TextHoverEffect } from './ui/text-hover-effect'
import { TypingAnimation } from './ui/typing-animation'
import { Spotlight } from './ui/spotlight'
import { motion } from 'framer-motion'

// Animated Logos Component
const AnimatedLogos = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mt-8 sm:mt-16 flex justify-center items-center px-2"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative group w-[280px] sm:w-auto"
      >
        {/* Gradient border container */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-white/40 via-white/80 to-white/40 rounded-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300 blur-sm group-hover:blur-md" />
        
        {/* Logo container with dark blue background */}
        <div className="relative h-16 sm:h-20 px-8 py-4 bg-[#0a1a3b]/60 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
          <div className="h-8 sm:h-10 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/assets/ljku.png"
              alt="LJKU Logo"
              width={140}
              height={42}
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Layout component for the LFA background
export function LFABackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#010314]">
      {/* Semi-transparent white background */}
      <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-sm z-0" />
      
      {/* Background beams effect with reduced opacity */}
      <BackgroundBeams />
      
      {/* Spotlight effect */}
      <Spotlight 
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .05) 0, hsla(210, 100%, 55%, .01) 50%, hsla(210, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .03) 0, hsla(210, 100%, 55%, .01) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .02) 0, hsla(210, 100%, 45%, .01) 80%, transparent 100%)"
        translateY={-400}
        duration={8}
      />
      
      {/* Large LFA text overlay with hover effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-0">
        <div className="w-screen h-screen scale-[2] sm:scale-[1.5] opacity-20 break-words whitespace-pre-wrap">
          <TextHoverEffect
            text="LFA"
            duration={0.3}
          />
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}

// Home page component
export default function HomePage() {
  const router = useRouter()
  
  return (
    <LFABackground>
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-3 sm:px-6 lg:px-8">
        <div className="text-center w-full max-w-5xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 pt-2 sm:pt-4">
          {/* Main LFA logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-2 sm:mb-4 relative w-full flex justify-center"
          >
            <div className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] md:w-[200px] md:h-[200px]">
              <Image
                src="/assets/LFA.png"
                alt="LFA Logo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 200px"
              />
            </div>
          </motion.div>
          
          {/* Main title with typing animation */}
          <div className="overflow-hidden px-2 sm:px-4 w-full max-w-[95%] sm:max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-2">
              <TypingAnimation
                text="Welcome to LFA"
                delay={0.5}
                className="text-[1.5rem] xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug sm:leading-normal tracking-normal sm:tracking-wide"
              />
              <TypingAnimation
                text="Editorial"
                delay={1}
                className="text-[1.5rem] xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug sm:leading-normal tracking-normal sm:tracking-wide"
              />
            </div>
          </div>
          
          {/* Subtitle with typing animation and Latin styling */}
          <div className="overflow-hidden px-2 sm:px-4 w-full max-w-[90%] sm:max-w-2xl mx-auto">
            <TypingAnimation
              text="LJites' Fetalis Aevum"
              delay={1.5}
              className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-400 tracking-[0.15em] sm:tracking-[0.2em] font-serif italic leading-relaxed"
            />
          </div>
          
          {/* Navigation buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center px-2 mb-4 sm:mb-6"
          >
            <Link
              href="/magazine"
              className="w-full sm:w-auto px-5 sm:px-7 py-2 sm:py-2.5 bg-[#0f0f2f]/80 backdrop-blur-sm rounded-full text-white font-medium text-sm sm:text-base hover:bg-[#1a1a4f] transition-all duration-300 min-w-[120px] sm:min-w-[140px] border border-[#2a2a6e] hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]"
            >
              MAGAZINE
            </Link>
            
            <Link
              href="/editorial"
              className="w-full sm:w-auto px-5 sm:px-7 py-2 sm:py-2.5 bg-transparent backdrop-blur-sm rounded-full text-white font-medium text-sm sm:text-base hover:bg-white/10 transition-all duration-300 min-w-[120px] sm:min-w-[140px] border border-white/30 hover:border-white/50"
            >
              EDITORIAL
            </Link>
          </motion.div>
          
          {/* University logos */}
          <AnimatedLogos />
        </div>
      </div>
    </LFABackground>
  )
}