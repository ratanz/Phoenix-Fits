'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCustomToast } from '@/hooks/useCustomToast'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { showToast } = useCustomToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (res.ok) {
        showToast('Sign up successful! Redirecting to login...')
        router.push('/auth/login')
      } else {
        const error = await res.text()
        showToast(error)
      }
    } catch {
      showToast('An error occurred during sign up')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="/video/starseffect.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="min-h-screen z-50 relative bg-black bg-opacity-40 text-white flex items-center justify-center p-4">
        <div className="bg-transparent backdrop-blur-sm border border-zinc-500/50 p-4 sm:p-8 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[30%] max-w-md">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Sign Up</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-transparent backdrop-blur-sm border border-zinc-500/50 rounded-md text-sm sm:text-base"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-transparent backdrop-blur-sm border border-zinc-500/50 rounded-md text-sm sm:text-base"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-transparent backdrop-blur-sm border border-zinc-500/50 rounded-md text-sm sm:text-base"
            />
            <button 
              type="submit" 
              className="w-full p-2 bg-transparent backdrop-blur-sm border border-zinc-500/50 rounded-md hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Sign Up
            </button>
          </form>
          
          <div className="my-4 flex items-center justify-center">
            <div className="border-t border-zinc-500/50 flex-grow"></div>
            <span className="px-4 text-sm text-zinc-400">or</span>
            <div className="border-t border-zinc-500/50 flex-grow"></div>
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl: '/collections/all' })}
            className="w-full bg-transparent backdrop-blur-sm border border-zinc-500/50 text-white p-2 rounded mb-4 flex items-center justify-center hover:bg-white/10 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign Up with Google
          </button>
          <p className="text-center">
            Already have an account? <Link href="/auth/login" className="text-blue-400">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}