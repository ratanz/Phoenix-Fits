'use client'

import { useCustomToast } from '@/hooks/useCustomToast'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const categories = ['Tshirt', 'Hoodies', 'Jackets', 'Pants', 'Jorts', 'Socks']

interface AdminProductFormProps {
  onProductAdded: () => void
}

export default function AdminProductForm({ onProductAdded }: AdminProductFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [category, setCategory] = useState('')
  const {showToast} = useCustomToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('discount', discount)
    formData.append('category', category)
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
        setCategory('')
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
          className="mb-2 p-2 w-full lg:w-[80%] backdrop-blur-2xl bg-transparent border border-zinc-600 text-white rounded-md hover:scale-105 transition-all duration-300"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="p-2 h-16 w-full lg:w-[80%] backdrop-blur-sm bg-transparent border border-zinc-600 text-white rounded-md hover:scale-105 transition-all duration-300"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
          className="mb-2 p-2 w-full lg:w-[80%] backdrop-blur-sm bg-transparent border border-zinc-600 text-zinc-100 rounded-md hover:scale-105 transition-all duration-300"
        />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Discount"
          className="mb-2 p-2 w-full lg:w-6/12 backdrop-blur-sm bg-transparent border border-zinc-600 text-zinc-100 rounded-md hover:scale-105 transition-all duration-300"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="flex mb-2 p-2 w-full lg:w-6/12 backdrop-blur-sm bg-transparent border border-zinc-600 bg-black text-zinc-100 rounded-md  transition-all duration-300"
        >
          <option className='bg-zinc-900  text-zinc-100  backdrop-blur-md' value="">Select Category</option>
          {categories.map((cat) => (
            <option className='bg-zinc-900  text-zinc-100  backdrop-blur-md' key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="px-0 lg:px-0 flex flex-col lg:flex-row items-center justify-center gap-6 w-full lg:w-[80%] mt-10">
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            accept="image/*"
            className="p-2 w-[80%] lg:w-6/12 backdrop-blur-sm bg-transparent border border-zinc-600/50 text-white rounded-md hover:scale-105 transition-all duration-300"
          />
          <button type="submit" className="w-[70%] lg:w-auto bg-gray-100 bg-opacity-90 border text-black p-2 rounded-md mt-4 lg:mt-0">
            Add Product
          </button>
        </div>
      </form>
    </div>
  )
}