'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSignUp) {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        if (res.ok) {
          toast.success('Sign up successful! Redirecting...')
          await signIn('credentials', { email, password, redirect: false })
          router.push('/collections/all')
        } else {
          const error = await res.text()
          toast.error(error)
        }
      } catch (error) {
        toast.error('An error occurred during sign up')
      }
    } else {
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        })
        if (result?.error) {
          toast.error(result.error)
        } else {
          toast.success('Logged in successfully')
          router.push('/collections/all')
        }
      } catch (error) {
        toast.error('An error occurred during login')
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
          )}
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
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <button
          onClick={() => signIn('google', { callbackUrl: '/collections/all' })}
          className="w-full bg-red-500 text-white p-2 rounded mb-4"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'} with Google
        </button>
        <p className="text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-400 ml-2">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}