'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { Spotlight } from '@/components/ui/spotlight'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (
        email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      ) {
        document.cookie = 'admin-auth=true'
        localStorage.setItem('admin-user', 'true')
        router.push('/admin')
      } else {
        setError('Invalid email or password')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#010314]">
      {/* Semi-transparent white background */}
      <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-sm z-0" />
      
      {/* Background beams effect */}
      <BackgroundBeams />
      
      {/* Spotlight effect */}
      <Spotlight 
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .05) 0, hsla(210, 100%, 55%, .01) 50%, hsla(210, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .03) 0, hsla(210, 100%, 55%, .01) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .02) 0, hsla(210, 100%, 45%, .01) 80%, transparent 100%)"
        translateY={-400}
        duration={8}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-8 w-full max-w-md"
        >
          {/* LFA Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-[100px] h-[100px] relative">
              <Image
                src="/assets/LFA.png"
                alt="LFA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-gradient-to-b from-white via-[#a0a0a0] to-[#707070] bg-clip-text">
            Admin Login
          </h2>

          <div className="space-y-4">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />

            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm font-bold">Error</AlertTitle>
                <AlertDescription className="text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
