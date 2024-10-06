'use client'

import { useCustomToast } from '@/hooks/useCustomToast'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

interface AdminProductFormProps {
  onProductAdded: () => void
}

export default function AdminProductForm({ onProductAdded }: AdminProductFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const {showToast} = useCustomToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('discount', discount)
    if (image) formData.append('image', image)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Product added:', data)
        toast.success('Product added successfully')
        onProductAdded()
        // Reset form
        setName('')
        setDescription('')
        setPrice('')
        setDiscount('')
        setImage(null)
      } else {
        const errorData = await response.json()
        console.error('Failed to add product:', errorData)
        showToast(`Failed to add product: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error adding product:', error)
      showToast('An error occurred while adding the product', 'error')
    }
  }

  return (
    <div className="flex items-center justify-center lg:w-[80%] w-full ml-[0%] lg:ml-[15%]">
      <form onSubmit={handleSubmit} className="mb-8 w-full lg:w-auto">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          required
          className="mb-2 p-2 w-full lg:w-[80%] backdrop-blur-2xl bg-transparent border border-zinc-600 text-white rounded-md"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="p-2 h-16 w-full lg:w-[80%] backdrop-blur-sm bg-transparent border border-zinc-600 text-white rounded-md"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
          className="mb-2 p-2 w-full lg:w-[80%] backdrop-blur-sm bg-transparent border border-zinc-600 text-zinc-100 rounded-md"
        />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Discount"
          className="mb-2 p-2 w-full lg:w-6/12 backdrop-blur-sm bg-transparent border border-zinc-600 text-zinc-100 rounded-md"
        />
        <div className="px-0 lg:px-0 flex flex-col lg:flex-row items-center justify-center gap-6 w-full lg:w-[80%] mt-10">
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            accept="image/*"
            className="p-2 w-[80%] lg:w-6/12 backdrop-blur-sm bg-transparent border border-zinc-600/50 text-white rounded-md"
          />
          <button type="submit" className="w-[70%] lg:w-auto bg-gray-100 bg-opacity-90 border bg-transparent text-black p-2 rounded-md mt-4 lg:mt-0">
            Add Product
          </button>
        </div>
      </form>
    </div>
  )
}