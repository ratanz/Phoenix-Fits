'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import EditProductForm from './EditProductForm'
import { useCustomToast } from '@/hooks/useCustomToast'
import { Product } from '@/app/types'

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
        body: JSON.stringify({...product, sizes: product.sizes || []}),
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
      <h2 className="text-4xl font-bold mb-4 flex justify-center self-center mt-10">Product List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="lg:mb-2 p-6 border border-zinc-600 rounded-xl bg-transparent backdrop-blur-sm z-10 shadow-lg shadow-zinc-500/50 relative hover:translate-y-[-7px] transition-all duration-300 ease-in-out mt-10">
            <div className={`flex flex-col md:flex-row gap-4 ${editingProduct && editingProduct._id === product._id ? 'lg:hidden' : ''}`}>
              <div className="flex justify-center items-center flex-col">
                <h3 className="font-bold text-2xl">{product.name}</h3>
                <p className='text-gray-300 mb-3'>{product.description}</p>
                <p className='text-zinc -100'>Price: ₹{product.price}</p>
                {product.discount && <p className='text-green-400'>Discount: ₹{product.discount}</p>}
                <img src={product.image} alt={product.name} className="w-fit h-fit object-cover mt-2 rounded-xl" />
                <div className="mt-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-transparent border border-zinc-600/50 text-white p-2 px-4 rounded-xl mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 bg-opacity-90 border border-zinc-600/50 text-white p-2 px-4 rounded-xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            {editingProduct && editingProduct._id === product._id && (
              <div className="flex-1 lg:absolute lg:inset-10 lg:bg-white lg:dark:bg-transparent lg:z-10">
                <EditProductForm 
                  product={{...editingProduct, sizes: editingProduct.sizes || []}} 
                  onSave={handleSave} 
                  onCancel={() => setEditingProduct(null)} 
                />
              </div>
            )}
            <p className='text-zinc-100'>
              Sizes: {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : 'No sizes available'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}