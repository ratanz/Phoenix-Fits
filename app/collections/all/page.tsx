'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Search, User, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/app/types'
import { useCustomToast } from '@/hooks/useCustomToast'
import ToastManager from '@/components/ToastManger'
import SearchPopup from '@/components/SearchPopup'
import gsap from 'gsap'
import Magnetic from '@/components/MagnetAnimation'
import LoadingAnimation from '@/components/LoadingAnimation'
import { motion } from 'framer-motion'
import LiveClockUpdate from '@/components/LiveClockUpdate'

const categories = ['Tshirt', 'Hoodies', 'Jackets', 'Pants', 'Jorts', 'Socks']

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function CollectionPage() {
  const { data: session } = useSession()
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([])
  const { showToast } = useCustomToast();
  const contentRef = useRef(null)

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  // const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [loading, setLoading] = useState(true);

  // Fetch products from API when component mounts
  useEffect(() => {
    async function fetchProducts() {
      // Skip if products are already loaded
      if (!loading) return;
      
      try {
        // Make API call to get products
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data as Product[])
        } else {
          showToast('Failed to fetch products')
        }
      } catch {
        showToast('An error occurred while fetching products')
      } finally {
        // Set loading to false after fetch completes
        setLoading(false);
      }
    }
    fetchProducts()
  }, [showToast, loading])

  // Animate content fade in after products load
  useEffect(() => {
    // Only animate if products are loaded and content ref exists
    if (!loading && contentRef.current) {
      // Use GSAP to animate content sliding up and fading in
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 90 }, // Start state
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' } // End state
      )
    }
  }, [loading])

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products

  const handleAddToCart = (product: Product) => {
    if (session) {
      addToCart(product);
    } else {
      showToast('Please sign in to add items to your cart');
    }
  };

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const results = await response.json();
        if (results.length === 0) {
          showToast(`No products found matching "${query}"`);
        } else {
          setProducts(results);
        }
        setIsSearchOpen(false);
      } else {
        showToast('Failed to perform search');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      showToast('An error occurred while searching');
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ToastManager />
      <SearchPopup isOpen={isSearchOpen} onClose={handleSearchClose} onSearch={handleSearch} />
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="/video/starseffect.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
     
      <div
        className="relative p-4 md:p-10 z-10 min-h-screen bg-black bg-opacity-30 text-white font-glorich"
        ref={contentRef}
      >
        <header className="flex justify-between items-center mb-8 px-4">
          <nav className='hidden md:flex'>
            <Link href="/contact" className="hover:text-gray-300 text-lg  bg-gradient-to-tr from-blue-500 to-blue-300 bg-clip-text text-transparent ">Contact</Link>
            <LiveClockUpdate />
          </nav>
          <div className="logo">
            <Image src="/images/gorba.png" alt="GORBA" width={115} height={20} className='w-20 h-20' />
          </div>

          <div className="flex items-center justify-end sm:justify-end w-full sm:w-fit gap-4">
            <Search className="w-6 h-6 mr-4 cursor-pointer hover:text-gray-300" onClick={handleSearchOpen} />
            <div className="flex justify-end mr-4">
              <Link href="/cart">
                <div className="relative cursor-pointer">
                  <ShoppingCart className="h-6 w-6 text-white hover:text-blue-400 transition-all duration-150" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-red-500 to-zinc-900 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {cart.length}
                    </span>
                  )}
                </div>
              </Link>
            </div>
            {session ? (
              <div className="flex items-center">
                {/* <span className="mr-2">{session.user?.name}</span> */}
                <button onClick={() => signOut()} className=" text-white px-2 py-1 rounded-md">
                  <LogOut className="w-6 h-6 mr-1 hover:text-red-500 transition-all duration-150 rounded-md" />
                </button>
              </div>
            ) : (
              <Link href="/auth/signup">
                <User className="w-6 h-6 cursor-pointer" />
              </Link>
            )}
          </div>
        </header>

        <main className="container mx-auto px-2 py-4">
          <div className="flex flex-col md:flex-row">
            <aside className="w-full md:w-1/5 px-4 pr-2 mb-6 md:mb-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
              </div>
              <ul className="flex flex-wrap md:flex-col gap-2 md:gap-0">
                {categories.map((category, index) => (
                  <li key={index} className="mb-2">
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`text-xs md:text-base transition-all duration-300 transform hover:translate-x-2 hover:scale-105 ${
                        selectedCategory === category ? 'font-bold bg-gradient-to-tr from-blue-500 to-blue-300 bg-clip-text text-transparent' : ''
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
                <li className="mb-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`${selectedCategory === null ? 'font-bold bg-gradient-to-tr from-blue-500 to-blue-300 bg-clip-text text-transparent ' : ''}`}
                  >
                    All Products
                  </button>
                </li>
              </ul>
            </aside>

            <div className="w-full md:w-4/5 px-2">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
                variants={container}
                initial="hidden"
                animate="visible"
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product._id} variants={item} className="relative group">
                    <Link href={`/products/${product._id}`}>
                      <div className="relative w-full h-64 md:h-96 mb-4 overflow-hidden rounded-lg">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_S3_URL}${product.image}`}
                          alt={product.name}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-lg transition-transform duration-300 group-hover:scale-105"
                        />
                        <Magnetic>
                          <div className="absolute flex items-center justify-center w-full bottom-0 h-16 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                handleAddToCart(product)
                              }}
                              className="bg-white/10 text-white py-1 px-2 rounded-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-50 hover:bg-white/20 hover:bg-gradient-to-tr from-green-500/90  to-zinc-900  hover:scale-110 border border-white/40"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </Magnetic>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <h3 className="text-xl md:text-2xl font-medium">{product.name}</h3>
                        <p className="text-xs md:text-sm text-gray-400 mt-1 mb-2">{product.description}</p>
                        <p className="text-sm text-gray-300">
                          {product.discount && product.discount > 0 ? (
                            <>
                              <span className="line-through text-gray-400 mr-2">₹{product.price.toFixed(2)}</span>
                              <span className="text-green-400">₹{(product.price - product.discount).toFixed(2)}</span>
                              {/* <span className="text-xs text-green-400 ml-1">
                                ({((product.discount / product.price) * 100).toFixed(0)}% off)
                              </span> */}
                            </>
                          ) : (
                            `₹${product.price.toFixed(2)}`
                          )}
                        </p>
                        {product.stock === 'out of stock' && (
                          <span className="absolute top-2 right-2 bg-gradient-to-b from-red-500 to-zinc-900 text-white text-xs px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 
