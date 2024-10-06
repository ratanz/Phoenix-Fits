'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import EditProductForm from './EditProductForm'
import { useCustomToast } from '@/hooks/useCustomToast'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  discount?: number
  image: string
  quantity: number
}

interface AdminProductListProps {
  products: Product[]
  onProductUpdated: () => void
  onProductDeleted: () => void
}

export default function AdminProductList({ products, onProductUpdated, onProductDeleted }: AdminProductListProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const {showToast} = useCustomToast()

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
        showToast('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      showToast('An error occurred while updating the product')
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
        showToast('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast('An error occurred while deleting the product')
    }
  }

  return (
    <div className='flex flex-col justify-center items-start w-full lg:p-24 p-4'>
      <h2 className="text-4xl font-bold mb-4 flex justify-center mt-10">Product List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="mb-4 p-6 border border-zinc-600 rounded backdrop-blur-sm relative">
            <div className={`flex flex-col md:flex-row gap-4 ${editingProduct && editingProduct._id === product._id ? 'lg:hidden' : ''}`}>
              <div className="flex-1">
                <h3 className="font-bold text-2xl">{product.name}</h3>
                <p className='text-gray-400'>{product.description}</p>
                <p className='text-blue-500'>Price: ₹{product.price}</p>
                {product.discount && <p className='text-green-300'>Discount: ₹{product.discount}</p>}
                <img src={product.image} alt={product.name} className="w-fit h-fit object-cover mt-2" />
                <div className="mt-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            {editingProduct && editingProduct._id === product._id && (
              <div className="flex-1 lg:absolute lg:inset-20  lg:bg-white lg:dark:bg-transparent lg:z-10">
                <EditProductForm 
                  product={editingProduct} 
                  onSave={handleSave} 
                  onCancel={() => setEditingProduct(null)} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}