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
    } catch (error) {
      showToast('An error occurred during sign up')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mb-4">
            Sign in
          </button>
        </form>
        <button
          onClick={() => signIn('google', { callbackUrl: '/collections/all' })}
          className="w-full bg-red-500 text-white p-2 rounded mb-4"
        >
          Sign in with Google
        </button>
        <p className="text-center">
          Already have an account? <Link href="/auth/login" className="text-blue-400">Log In</Link>
        </p>
      </div>
    </div>
  )
}