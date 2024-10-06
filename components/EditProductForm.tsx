import React, { useState } from 'react'
import { Product } from '@/app/types'

interface EditProductFormProps {
  product: Product
  onSave: (product: Product) => void
  onCancel: () => void
}

export default function EditProductForm({ product, onSave, onCancel }: EditProductFormProps) {
  const [editedProduct, setEditedProduct] = useState(product)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProduct({ ...editedProduct, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedProduct)
  }

  return (
    <div className="content flex justify-center items-center w-full lg:pt-16 pt-4 ">
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={editedProduct.name}
        onChange={handleChange}
        className="mb-2 p-2 bg-transparent border border-zinc-600/30 w-full backdrop-blur-sm text-white rounded-md"
      />
      <textarea
        name="description"
        value={editedProduct.description}
        onChange={handleChange}
        className="mb-2 p-2 w-full bg-transparent border border-zinc-600/30 text-white rounded-md"
      />
      <input
        type="number"
        name="price"
        value={editedProduct.price}
        onChange={handleChange}
        className="mb-2 p-2 w-full bg-transparent border border-zinc-600/30 text-white rounded-md"
      />
      <input
        type="number"
        name="discount"
        value={editedProduct.discount || ''}
        onChange={handleChange}
        className="mb-2 p-4 w-full bg-transparent border border-zinc-600/30 text-white rounded-md"
      />
      <button type="submit" className="bg-zinc-800 text-white p-2 rounded mr-2">Save</button>
      <button type="button" onClick={onCancel} className="bg-transparent border border-zinc-600/50 text-white p-2 rounded-md">Cancel</button>
    </form>
    </div>
  )
}