'use client'

import React from 'react'
import { toast } from 'react-toastify'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  discount?: number
  image: string
}

interface AdminProductListProps {
  products: Product[]
  onProductUpdated: () => void
  onProductDeleted: () => void
}

export default function AdminProductList({ products, onProductUpdated, onProductDeleted }: AdminProductListProps) {
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast.success('Product deleted successfully')
        onProductDeleted()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('An error occurred while deleting the product')
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Product List</h2>
      {products.map((product) => (
        <div key={product._id} className="mb-4 p-4 border rounded">
          <h3 className="font-bold">{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          {product.discount && <p>Discount: ${product.discount}</p>}
          <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mt-2" />
          <button
            onClick={() => handleDelete(product._id)}
            className="bg-red-500 text-white p-2 rounded mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}