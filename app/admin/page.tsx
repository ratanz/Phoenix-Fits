'use client'

import React, { useState, useEffect } from 'react'
import AdminProductForm from '@/components/AdminProductForm'
import AdminProductList from '@/components/AdminProductList'

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
    <div className="container relative z-10 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex justify-center">Admin Dashboard</h1>
      <AdminProductForm onProductAdded={fetchProducts} />
      <AdminProductList products={products} onProductUpdated={fetchProducts} onProductDeleted={fetchProducts} />
    </div>
    </>
  )
}