'use client'

import React, { useState, useEffect, useCallback } from 'react'
import AdminProductForm from '@/components/AdminProductForm'
import AdminProductList from '@/components/AdminProductList'
import ToastManager from '@/components/ToastManger'
import AdminLoginPopup from '@/components/AdminLoginPopup'
import { useCustomToast } from '@/hooks/useCustomToast'

export default function AdminPage() {
  const [products, setProducts] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { showToast } = useCustomToast()

  const checkAuth = useCallback(async () => {
    const response = await fetch('/api/admin/check-auth')
    if (response.ok) {
      setIsAuthenticated(true)
      fetchProducts()
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const fetchProducts = async () => {
    const response = await fetch('/api/products')
    const data = await response.json()
    setProducts(data)
  }

  const handleLogin = async (username: string, password: string) => {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      setIsAuthenticated(true)
      fetchProducts()
      showToast('Login successful', 'success')
    } else {
      showToast('Invalid credentials', 'error')
    }
  }

  if (!isAuthenticated) {
    return <AdminLoginPopup onLogin={handleLogin} />
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        <ToastManager />
        <video
          autoPlay
          loop
          muted
          className="absolute z-0 w-full h-full object-cover"
        >
          <source src="/video/starseffect.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="container relative z-10 mx-auto lg:p-14 p-4 lg:mt-0 mt-6">
          <h1 className="text-2xl font-bold mb-4 flex justify-center">Admin Dashboard</h1>
          <AdminProductForm onProductAdded={fetchProducts} />
          <AdminProductList products={products} onProductUpdated={fetchProducts} onProductDeleted={fetchProducts} />
        </div>
      </div>
    </>
  )
}
