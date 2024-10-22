'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useSwipeable } from 'react-swipeable'
import { useCart } from '@/hooks/useCart'
import { useCustomToast } from '@/hooks/useCustomToast'
import ToastManager from '@/components/ToastManger'
import { Product } from '@/app/types'
import Link from 'next/link'
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import gsap from 'gsap'
import Magnetic from '@/components/MagnetAnimation'
import LoadingAnimation from '@/components/LoadingAnimation';
import { useRouter } from 'next/navigation'
import loadRazorpay from '@/hooks/razorpay';

// razorpay global declaration
declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const productRef = useRef(null)
  const imageRef = useRef(null)
  const router = useRouter()


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

  useEffect(() => {
    if (!isLoading && product) {
      // Initial page load animation
      gsap.fromTo(
        productRef.current,
        { opacity: 0, y: 90 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }
      )
    }
  }, [isLoading, product])

  const animateImageTransition = useCallback((direction: 'next' | 'prev', targetIndex?: number) => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        x: direction === 'next' ? -50 : 50,
        duration: 0.3,
        onComplete: () => {
          setCurrentImageIndex((prevIndex) => {
            let newIndex;
            if (targetIndex !== undefined) {
              newIndex = targetIndex;
            } else {
              newIndex = direction === 'next'
                ? (prevIndex === (product?.subImages?.length || 0) ? 0 : prevIndex + 1)
                : (prevIndex === 0 ? (product?.subImages?.length || 0) : prevIndex - 1);
            }

            gsap.fromTo(
              imageRef.current,
              { opacity: 0, x: direction === 'next' ? 50 : -50 },
              { opacity: 1, x: 0, duration: 0.3, delay: 0.10 }
            )
            return newIndex;
          })
        }
      })
    }
  }, [product?.subImages?.length])

  const handleThumbnailClick = useCallback((index: number) => {
    const direction = index > currentImageIndex ? 'next' : 'prev';
    animateImageTransition(direction, index);
  }, [currentImageIndex, animateImageTransition])

  const handlePrevImage = useCallback(() => {
    animateImageTransition('prev')
  }, [animateImageTransition])

  const handleNextImage = useCallback(() => {
    animateImageTransition('next')
  }, [animateImageTransition])

  const handleAddToCart = useCallback(() => {
    if (product) {
      if (session) {
        addToCart(product)
      } else {
        showToast('Please sign in to add items to your cart')
      }
    }
  }, [product, addToCart, showToast, session])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true
  })

  if (isLoading) {
    return <div className='flex justify-center items-center h-screen text-4xl  font-bold text-white bg-black'>
      <LoadingAnimation />
    </div>
  }

  if (!product) {
    return <div className='flex justify-center items-center h-screen text-4xl font-judas font-bold text-white'>Product not found</div>
  }

  const allImages = [product.image, ...(product.subImages || [])].map(img => `${process.env.NEXT_PUBLIC_S3_URL}${img}`);

  const handleBuyNow = async () => {
    if (!session) {
      showToast('Please sign in to make a purchase', 'error');
      return;
    }
  
    if (!product) {
      showToast('Product information is not available', 'error');
      return;
    }
  
    const amount = product.price - (product.discount || 0);
    if (isNaN(amount) || amount <= 0) {
      showToast('Invalid product price', 'error');
      return;
    }
  
    const res = await loadRazorpay();
    if (!res) {
      showToast('Razorpay SDK failed to load. Please try again later.', 'error');
      return;
    }
  
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
  
      const data = await response.json();
  
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Ratanz store',
        description: `Purchase of ${product.name}`,
        order_id: data.orderId,
        handler: function (response: any) {
          showToast('Payment successful', 'success');
          router.push('/payment-success');
        },
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          contact: '',
        },
        theme: {
          color: '#3399cc',
        },
      };
  
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      showToast('Error initiating payment. Please try again.', 'error');
    }
  };

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

      <div className="relative z-10 container mx-auto p-4 font-glorich" ref={productRef}>

        <div className="flex p-6 items-center w-full  ">

          <Link href="/collections/all">
            <button className='text-white mr-1'>
              <ChevronLeft className='hover:scale-110 transition-all duration-150' />
            </button>
          </Link>

          <div className="logo flex w-full h-20  justify-center items-center flex-grow">
            <Link href="/collections/all">
              <Image src="/images/gorba.png" alt="logo" width={80} height={100} />
            </Link>
          </div>
          <div className="flex justify-end flex-grow">
            <Link href="/cart">
              <div className="relative cursor-pointer ml-10">
                <ShoppingCart className="h-6 w-6 text-white transition-all duration-300" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-opacity-70 p-10 flex flex-col">
          <div className="flex flex-col justify-evenly md:flex-row">
            <div className="md:w-1/2 flex flex-col justify-center items-center md:mb-0">
              <div className="relative w-full h-96" {...swipeHandlers}>
                <div ref={imageRef} className="w-full h-full">
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
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
              <div className="flex justify-center items-center mt-4 space-x-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className={`w-36 h-36 relative cursor-pointer  ${currentImageIndex === index ? 'border border-white/50 rounded-md' : ''
                      }`}
                    onClick={() => handleThumbnailClick(index)}
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

            <div className="w-full md:w-1/3 lg:p-4 p-10 flex flex-col justify-center items-center lg:mt-0 mt-14">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center text-white">{product.name}</h1>
              <p className="text-gray-300 mb-4 text-sm md:text-base text-center">{product.description}</p>
              <p className="text-xl md:text-2xl font-bold mb-4">
                {product.discount && product.discount > 0 ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">₹{product.price.toFixed(2)}</span>
                    <span className="text-green-400">₹{(product.price - product.discount).toFixed(2)}</span>
                    <span className="text-sm text-green-400 ml-2">
                      ({((product.discount / product.price) * 100).toFixed(0)}% off)
                    </span>
                  </>
                ) : (
                  `₹${product.price.toFixed(2)}`
                )}
              </p>
              <p className="mb-4 text-sm md:text-base text-white">Category: {product.category}</p>
              <p className="mb-4 text-sm md:text-base text-white">Available Sizes: {product.sizes.join(', ')}</p>
              {/* add select size */}
              <select className="mb-4 bg-transparent border border-white/50 text-white rounded-md p-2  w-fit max-w-xs hover:scale-105 transition-all duration-300 ">
                {product.sizes.map((size) => (
                  <option className='bg-black/90 ' key={size} value={size}>{size}</option>
                ))}
              </select>
              <p className="mb-4 text-sm md:text-base text-white">Stock: {product.stock}</p>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 lg:mt-0 mt-6 w-full max-w-xs">
                <Magnetic>
                  <button
                    onClick={handleAddToCart}
                    className="bg-transparent backdrop:blur-sm text-white px-4 py-2 rounded border border-white/50 w-full relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-blue-500/80 transform scale-0 transition-transform duration-500 origin-center rounded-full group-hover:scale-100 group-hover:rounded-none"></span>
                    <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                      Add to Cart
                    </span>
                  </button>
                </Magnetic>
                <Magnetic>
                  <button
                    onClick={handleBuyNow}
                    className="bg-transparent backdrop:blur-sm text-white px-4 py-2 rounded border border-white/50 w-full relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-red-500/80 transform scale-0 transition-transform duration-500 origin-center rounded-full group-hover:scale-100 group-hover:rounded-none"></span>
                    <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                      Buy Now
                    </span>
                  </button>
                </Magnetic>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}