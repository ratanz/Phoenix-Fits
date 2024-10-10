'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useCustomToast } from '@/hooks/useCustomToast'
import { Product } from '@/app/types'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import ToastManager from '@/components/ToastManger'

export default function ProductPage() {
  const params = useParams()
  const id = useMemo(() => params?.id as string, [params])
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart, cart } = useCart()
  const { showToast } = useCustomToast()
  const fetchCount = useRef(0)
  const { data: session } = useSession()

  const fetchProduct = useCallback(async () => {
    if (!id || fetchCount.current > 0) return
    console.log('Fetching product:', id)
    fetchCount.current += 1
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product details')
      }
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      showToast('An error occurred while fetching product details')
    } finally {
      setIsLoading(false)
    }
  }, [id, showToast])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const handleAddToCart = useCallback(() => {
    if (product) {
      if (session) {
        addToCart(product)
      } else {
        showToast('Please sign in to add items to your cart')
      }
    }
  }, [product, addToCart, showToast, session])

  const handleBuyNow = useCallback(() => {
    showToast('Buy Now functionality not implemented yet')
  }, [showToast])

  if (isLoading) {
    return <div className='flex justify-center items-center h-screen text-4xl font-judas font-bold text-white'>Loading...</div>
  }

  if (!product) {
    return <div className='flex justify-center items-center h-screen text-4xl font-judas font-bold text-white'>Product not found</div>
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ToastManager />
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="/video/starseffect.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 container mx-auto px-10 py-10">
       
        <div className="flex justify-between items-center p-4 ">
          <div className="flex-grow"></div>
          <div className="logo flex justify-center flex-grow">
            <Link href="/collections/all">
              <Image src="/images/gorba.png" alt="logo" width={80} height={100} />
            </Link>
          </div>
          <div className="flex justify-end flex-grow">
            <Link href="/cart">
              <div className="relative cursor-pointer">
                <ShoppingCart className="h-6 w-6 text-white" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-opacity-70 p-14 rounded-lg shadow-lg flex flex-col">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 flex justify-center items-center md:mb-0">
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                className="rounded-lg"
              />
            </div>
            <div className="md:w-1/4 md:pl-2 flex flex-col justify-center items-center">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-300 mb-4">{product.description}</p>
              <p className="text-2xl font-bold mb-4">₹{product.price.toFixed(2)}</p>
              {/* {product.discount && (
                <p className="text-green-500 mb-4">Discount: ₹{product.discount.toFixed(2)}</p>
              )} */}
              <p className="mb-4">Category: {product.category}</p>
              <p className="mb-4">Available Sizes: {product.sizes.join(', ')}</p>
              <p className="mb-4">Stock: {product.stock}</p>
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-transparent backdrop:blur-sm text-white px-4 py-2 rounded border border-white/50"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-transparent backdrop:blur-sm text-white px-4 py-2 rounded border border-white/50"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}