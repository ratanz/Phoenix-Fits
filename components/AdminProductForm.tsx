// Mark this component as a client-side component
'use client'

// Import necessary dependencies and components
import { useCustomToast } from '@/hooks/useCustomToast'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Checkbox } from '@/components/Checkbox'
import { Product } from '@/app/types'
import ProductAnimation from './ProductAnimation'

// Define available product categories and sizes
const categories = ['Tshirt', 'Hoodies', 'Jackets', 'Pants', 'Jorts', 'Socks']
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

// Define props interface for the component
interface AdminProductFormProps {
  onProductAdded: () => void // Callback function to be called when a product is successfully added
}

export default function AdminProductForm({ onProductAdded }: AdminProductFormProps) {
  // State management for form fields using useState hooks
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [subImages, setSubImages] = useState<File[]>([])
  const [category, setCategory] = useState('')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [stock, setStock] = useState<Product['stock']>('in stock')
  const {showToast} = useCustomToast() // Custom hook for showing toast notifications
  const [isLoading, setIsLoading] = useState(false)

  // Handler for toggling size selection
  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Handler for multiple sub-images selection
  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSubImages(Array.from(e.target.files))
    }
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Create FormData object to send files and data
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('discount', discount)
      formData.append('category', category)
      formData.append('sizes', JSON.stringify(selectedSizes))
      formData.append('stock', stock)

      // Append main image if selected
      if (image) {
        formData.append('image', image)
      }

      // Append all sub-images
      subImages.forEach((subImage) => {
        formData.append('subImages', subImage)
      })

      // Send POST request to API
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Product added:', data)
        toast.success('Product added successfully')
        onProductAdded()
        // Reset all form fields after successful submission
        setName('')
        setDescription('')
        setPrice('')
        setDiscount('')
        setImage(null)
        setSubImages([])
        setCategory('')
        setSelectedSizes([])
        setStock('in stock')
      } else {
        // Handle error response
        const errorData = await response.json()
        console.error('Failed to add product:', errorData)
        showToast(`Failed to add product: ${errorData.error}`)
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error adding product:', error)
      showToast(`An error occurred while adding the product: ${(error as Error).message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Render the form UI
  return (
    <div className="flex items-center justify-center lg:w-[80%] w-full ml-[0%] lg:ml-[15%]">
      {/* Show loading animation when form is submitting */}
      {isLoading && <ProductAnimation />}
      
      {/* Product form with responsive styling */}
      <form onSubmit={handleSubmit} className="mb-10 w-full lg:w-auto p-4 ">
        {/* Product name input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          required
          className="mb-4 p-2 w-full lg:w-[80%] backdrop-blur-2xl bg-transparent border border-zinc-600 text-white rounded-md hover:scale-105 transition-all duration-300"
        />

        {/* Product description textarea */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="p-2 mb-2 h-16 w-full lg:w-[80%] backdrop-blur-sm bg-transparent border border-zinc-600 text-white rounded-md hover:scale-105 transition-all duration-300"
        />

        {/* Price input */}
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
          className="mb-4 p-2 w-full lg:w-[80%] backdrop-blur-sm bg-transparent border border-zinc-600 text-white rounded-md hover:scale-105 transition-all duration-300"
        />

        {/* Discount input */}
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Discount"
          className="mb-4 p-2 w-full lg:w-6/12 backdrop-blur-sm bg-transparent border border-zinc-600 text-zinc-100 rounded-md hover:scale-105 transition-all duration-300"
        />

        {/* Category selection dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="flex mb-4 p-2 w-full lg:w-6/12 backdrop-blur-sm bg-transparent border border-zinc-600 text-zinc-100 rounded-md  transition-all duration-300 hover:scale-105"
        >
          <option className='bg-zinc-800 text-zinc-800 ' value="">Select Category</option>
          {categories.map((cat) => (
            <option className='bg-zinc-800  text-zinc-300  backdrop-blur-md' key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Stock status selection */}
        <select
          value={stock}
          onChange={(e) => setStock(e.target.value as Product['stock'])}
          required
          className=" p-2 w-full lg:w-6/12 backdrop-blur-sm bg-transparent border border-zinc-600  text-zinc-100 rounded-md transition-all duration-300 hover:scale-105"
        >
          <option className='bg-zinc-800 text-zinc-100' value="in stock">In Stock</option>
          <option className='bg-zinc-800 text-zinc-100' value="out of stock">Out of Stock</option>
        </select>

        {/* Main product image upload */}
        <div className="px-0 lg:px-0 gap-6 w-full lg:w-full p-4">
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            accept="image/*"
            className="p-2 w-[80%] lg:w-6/12 backdrop-blur-sm bg-transparent border border-zinc-600/50 text-white rounded-md hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* Sub-images upload section */}
        <div className="mb-4">
          <p className="text-white mb-2">Sub Images (up to 10):</p>
          <input
            type="file"
            onChange={handleSubImagesChange}
            accept="image/*"
            multiple
            max="10"
            className="p-2 w-full lg:w-6/12 backdrop-blur-sm bg-transparent border border-zinc-600/50 text-white rounded-md hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* Size selection checkboxes */}
        <div className="mb-4">
          <p className="text-white mb-2">Available Sizes:</p>
          <div className="flex flex-wrap gap-4 ">
            {sizes.map((size) => (
              <Checkbox
                key={size}
                label={size}
                checked={selectedSizes.includes(size)}
                onChange={() => handleSizeChange(size)}
              />
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button type="submit" className="w-full lg:w-[80%] bg-transparent border border-zinc-600/90 text-white p-2 rounded-md mt-4 lg:mt-10 hover:scale-105 transition-all duration-300 hover:bg-zinc-200/90 hover:text-black">
            Add Product
          </button>
      </form>
    </div>
  )
}
