'use client'

import React, { useState, useEffect } from 'react'
import AdminProductForm from '@/components/AdminProductForm'
import AdminProductList from '@/components/AdminProductList'
import ToastManager from '@/components/ToastManger'

export default function AdminPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const response = await fetch('/api/products')
    const data = await response.json()
    setProducts(data)
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