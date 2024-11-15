'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCustomToast } from '@/hooks/useCustomToast'
import { FcGoogle } from 'react-icons/fc'

export default function Login() {
  // State management for email and password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { showToast } = useCustomToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result?.error) {
        showToast(result.error)
      } else {
        showToast('Logged in successfully')
        router.push('/collections/all')
      }
    } catch {
      showToast('An error occurred during login')
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
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Log In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              Log In
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
            <FcGoogle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Log In with Google
          </button>
          
          <p className="text-center text-sm sm:text-base">
            Don&apos;t have an account? <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 transition-colors">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}