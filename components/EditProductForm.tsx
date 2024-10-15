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
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <div className='flex flex-col p-6 px-4 gap-6 '>
      <input
        type="text"
        name="name"
        value={editedProduct.name}
        onChange={handleChange}
        className="w-full p-2 bg-transparent border border-zinc-600/30 text-white rounded-md"
        placeholder="Product Name"
      />
      <textarea
        name="description"
        value={editedProduct.description}
        onChange={handleChange}
        className="w-full p-2 bg-transparent border border-zinc-600/30 text-white rounded-md"
        placeholder="Description"
      />
      <input
        type="number"
        name="price"
        value={editedProduct.price}
        onChange={handleChange}
        className="w-full p-2 bg-transparent border border-zinc-600/30 text-white rounded-md"
        placeholder="Price"
      />
      <input
        type="number"
        name="discount"
        value={editedProduct.discount || ''}
        onChange={handleChange}
        className="w-full p-2 bg-transparent border border-zinc-600/30 text-white rounded-md"
        placeholder="Discount"
      />
      <select
        name="stock"
        value={editedProduct.stock}
        onChange={handleChange}
        className="w-full p-2 bg-transparent border border-zinc-600/30 text-white rounded-md"
      >
        <option value="in stock">In Stock</option>
        <option value="out of stock">Out of Stock</option>
      </select>
      <div>
        <p className="text-white mb-2">Available Sizes:</p>
        <div className="flex flex-wrap gap-2">
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
      <div className="flex justify-between mt-4">
        <button type="submit" className="bg-transparent border border-zinc-600/50 text-white p-2 rounded-md">Save</button>
        <button type="button" onClick={onCancel} className="bg-transparent border border-zinc-600/50 text-white p-2 rounded-md">Cancel</button>
      </div>
    </div>
    </form>
  )
}
