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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={editedProduct.name}
        onChange={handleChange}
        className="mb-2 p-2 w-full"
      />
      <textarea
        name="description"
        value={editedProduct.description}
        onChange={handleChange}
        className="mb-2 p-2 w-full"
      />
      <input
        type="number"
        name="price"
        value={editedProduct.price}
        onChange={handleChange}
        className="mb-2 p-2 w-full"
      />
      <input
        type="number"
        name="discount"
        value={editedProduct.discount || ''}
        onChange={handleChange}
        className="mb-2 p-2 w-full"
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
      <button type="button" onClick={onCancel} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
    </form>
  )
}