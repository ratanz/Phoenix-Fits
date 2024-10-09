import React, { useState } from 'react'
import { Product } from '@/app/types'
import { Checkbox } from '@/components/Checkbox';

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

interface EditProductFormProps {
  product: Product
  onSave: (product: Product) => Promise<void>
  onCancel: () => void
}

export default function EditProductForm({ product, onSave, onCancel }: EditProductFormProps) {
  const [editedProduct, setEditedProduct] = useState({...product, sizes: product.sizes || []})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedProduct({ ...editedProduct, [name]: value })
  }

  const handleSizeChange = (size: string) => {
    setEditedProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({...editedProduct, sizes: editedProduct.sizes});
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
      <select
        name="stock"
        value={editedProduct.stock}
        onChange={handleChange}
        className="mb-2 p-2 w-full bg-transparent border border-zinc-600/30 text-white rounded-md"
      >
        <option value="in stock">In Stock</option>
        <option value="out of stock">Out of Stock</option>
      </select>
      <div className="mb-4">
        <p className="text-white mb-2">Available Sizes:</p>
        <div className="flex flex-wrap gap-4">
          {sizes.map((size) => (
            <Checkbox
              key={size}
              label={size}
              checked={editedProduct.sizes.includes(size)}
              onChange={() => handleSizeChange(size)}
            />
          ))}
        </div>
      </div>
      <button type="submit" className="bg-zinc-800 text-white p-2 rounded mr-2">Save</button>
      <button type="button" onClick={onCancel} className="bg-transparent border border-zinc-600/50 text-white p-2 rounded-md">Cancel</button>
    </form>
    </div>
  )
}