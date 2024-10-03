'use client'

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
        toast.error(`Failed to add product: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('An error occurred while adding the product')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center ">
      <form onSubmit={handleSubmit} className="mb-8">
        <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        required
        className="mb-2 p-2 w-4/5 bg-zinc-900 text-white "
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        className="mb-2 p-2 w-4/5 bg-zinc-900 text-white"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
        className="mb-2 p-2 w-4/5 bg-zinc-900 text-white"
      />
      <input
        type="number"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        placeholder="Discount"
        className="mb-2 p-2 w-4/5 bg-zinc-900 text-white"
      />
      <div className="flex justify-center items-center">
      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        accept="image/*"
        className="mb-2 p-2 w-fit bg-zinc-900 text-white"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Product
      </button>
      </div>
    </form>
    </div>
  )
}