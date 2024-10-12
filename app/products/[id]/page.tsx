'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useSwipeable } from 'react-swipeable'
import { useCart } from '@/hooks/useCart'
import { useCustomToast } from '@/hooks/useCustomToast'
import { Product } from '@/app/types'
import Link from 'next/link'
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? (product?.subImages?.length || 0) : prevIndex - 1
    )
  }, [product?.subImages?.length])

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === (product?.subImages?.length || 0) ? 0 : prevIndex + 1
    )
  }, [product?.subImages?.length])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true
  })

  if (isLoading) {
    return <div className='flex justify-center items-center h-screen text-4xl font-judas font-bold text-white'>Loading...</div>
  }

  if (!product) {
    return <div className='flex justify-center items-center h-screen text-4xl font-judas font-bold text-white'>Product not found</div>
  }

  const allImages = [product.image, ...(product.subImages || [])].map(img => `${process.env.NEXT_PUBLIC_S3_URL}${img}`);

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

      <div className="relative z-10 container mx-auto px-10 py-10 font-judas">
       
        <div className="flex justify-between items-center w-full p-4 ">

          <Link href="/collections/all">
            <button className='text-white'>
              <ChevronLeft className='hover:scale-110 transition-all duration-150' />
            </button>
          </Link>
          
          <div className="logo flex w-full justify-center items-center flex-grow">
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

        <div className="bg-opacity-70 p-14 flex flex-col">
          <div className="flex flex-col justify-evenly md:flex-row">
            <div className="md:w-1/2 flex flex-col justify-center items-center md:mb-0">
              <div className="relative w-full h-96" {...swipeHandlers}>
                <Image
                  src={allImages[currentImageIndex]}
                  alt={product.name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:scale-105 transition-all duration-150 p-2 rounded-full border border-white/20 shadow-sm shadow-white/30"
                    >
                      <ChevronLeft className="text-white" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:scale-105 transition-all duration-150 p-2 rounded-full border border-white/20 shadow-sm shadow-white/30"
                    >
                      <ChevronRight className="text-white" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex  justify-center items-center mt-4 space-x-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className={`w-24 h-24 relative cursor-pointer ${currentImageIndex === index ? 'border-2 border-white/80 rounded-md' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-1/3 p-4  flex flex-col justify-center items-center">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-300 mb-4">{product.description}</p>
              <p className="text-2xl font-bold mb-4">₹{product.price.toFixed(2)}</p>
              {/* {product.discount && (b
                <p className="text-green-500 mb-4">Discount: ₹{product.discount.toFixed(2)}</p>
              )} */}
              <p className="mb-4">Category: {product.category}</p>
              <p className="mb-4">Available Sizes: {product.sizes.join(', ')}</p>
              {/* add select size */}
              <select className="mb-4 bg-transparent border border-white/50 text-white rounded-md p-2">
                {product.sizes.map((size) => (
                  <option className='bg-black/90' key={size} value={size}>{size}</option>
                ))}
              </select>
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