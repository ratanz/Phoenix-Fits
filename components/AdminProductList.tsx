'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import EditProductForm from './EditProductForm'

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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleSave = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
      if (response.ok) {
        toast.success('Product updated successfully')
        onProductUpdated()
        setEditingProduct(null)
      } else {
        toast.error('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('An error occurred while updating the product')
    }
  }

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
    <div className=''>
      <h2 className="text-4xl font-bold mb-4 flex justify-center mt-10 ">Product List</h2>
      <div className="flex">
      {products.map((product) => (
        <div key={product._id} className="mb-4 p-4  ">
          {editingProduct && editingProduct._id === product._id ? (
            <EditProductForm product={editingProduct} onSave={handleSave} onCancel={() => setEditingProduct(null)} />
          ) : (
            <>
              <h3 className="font-bold">{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              {product.discount && <p>Discount: ${product.discount}</p>}
              <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mt-2" />
              <button
                onClick={() => handleEdit(product)}
                className="bg-blue-500 text-white p-2 rounded mt-2 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white p-2 rounded mt-2"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
      </div>
    </div>
  )
}