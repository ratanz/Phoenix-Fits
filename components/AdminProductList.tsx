'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import EditProductForm from './EditProductForm'
import { useCustomToast } from '@/hooks/useCustomToast'
import { Product } from '@/app/types'
import Image from 'next/image'

interface AdminProductListProps {
  products: Product[]
  onProductUpdated: () => void
  onProductDeleted: () => void
}

export default function AdminProductList({ products, onProductUpdated, onProductDeleted }: AdminProductListProps) {
  console.log('Products received:', JSON.stringify(products, null, 2));
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { showToast } = useCustomToast()

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
        body: JSON.stringify({ ...product, sizes: product.sizes || [] }),
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
      const deleteResponse = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (deleteResponse.ok) {
        toast.success('Product deleted successfully');
        onProductDeleted();
      } else {
        const errorData = await deleteResponse.json();
        showToast(`Failed to delete product: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('An error occurred while deleting the product');
    }
  };

  const getFullImageUrl = (imagePath: string) => {
    if (imagePath && !imagePath.startsWith('http')) {
      return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${imagePath}`;
    }
    return imagePath || '';
  };

  return (
    <div className='flex flex-col justify-center items-start w-full lg:p-24 p-4'>
      <h2 className="text-4xl text-white font-bold mb-4 flex justify-center self-center mt-10">Product List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="lg:mb-2 p-6 border border-zinc-600 rounded-xl bg-transparent backdrop-blur-sm z-10 shadow-lg shadow-zinc-500/50 relative hover:translate-y-[-7px] transition-all duration-300 ease-in-out mt-10">
            <div className="flex flex-col justify-center items-center">
              <h3 className="font-bold text-2xl text-white py-3">{product.name}</h3>
              <p className='text-gray-300 mb-3 text-center'>{product.description}</p>
              <p className='text-zinc-100'>Price: ₹{product.price.toFixed(2)}</p>
              {product.discount && product.discount > 0 && (
                <p className='text-green-400'>
                  Discounted Price: ₹{(product.price - product.discount).toFixed(2)}
                </p>
              )}
              <Image
                src={getFullImageUrl(product.image)}
                alt={product.name}
               width={350}
               height={300}
                className="w-fit h-fit object-cover mt-2 rounded-xl"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
              />
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
              <p className='text-zinc-100/50 text-sm mt-4'>
                Sizes: {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : 'No sizes available'}
              </p>
              <p className={`text-${product.stock === 'in stock' ? 'green' : 'red'}-400 text-sm mt-2`}>
                Stock: {product.stock}
              </p>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-transparent backdrop-blur-md border border-zinc-400/50 p-6 rounded-xl w-full max-w-md">
            <EditProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
