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

const categories = ['Tshirt', 'Hoodies', 'Jackets', 'Pants', 'Jorts', 'Socks']

export default function CollectionPage() {
  const { data: session } = useSession()
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([])
  const { showToast } = useCustomToast();
  const contentRef = useRef(null)

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  console.log('Current session:', session);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      if (!loading) return;
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          console.log('Fetched products:', data)
          setProducts(data as Product[])
        } else {
          showToast('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        showToast('An error occurred while fetching products')
      } finally {
        setLoading(false);
      }
    }
    fetchProducts()
  }, [showToast, loading])

  useEffect(() => {
    if (!loading && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 90 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }
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
        className="relative p-6 z-10 min-h-screen bg-black bg-opacity-30 text-white font-spacer opacity-0" 
        ref={contentRef}
      >
        <header className="flex justify-between items-center mb-8">
          <nav className='flex justify-center items-center '>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          </nav>
          <div className="logo">
            <Image src="/images/gorba.png" alt="GORBA" width={115} height={20} className='w-20 h-20' />
          </div>
          
          <div className="flex items-center justify-end w-fit ">
            <Search className="w-6 h-6 mr-4 cursor-pointer hover:text-gray-300" onClick={handleSearchOpen} />
            <div className="flex justify-end mr-4">
              <Link href="/cart">
                <div className="relative cursor-pointer">
                  <ShoppingCart className="h-6 w-6 text-white hover:text-blue-400 transition-all duration-150" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
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
          <div className="flex">
            <aside className="w-1/5 px-8 pr-2">
              <h2 className="text-xl font-bold mb-4">Categories</h2>
              <ul>
                {categories.map((category, index) => (
                  <li key={index} className="mb-2">
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={` transition-all duration-300 transform hover:translate-x-2 hover:scale-105 ${selectedCategory === category ? 'font-bold text-blue-500' : ''}`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
                <li className="mb-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`${selectedCategory === null ? 'font-bold text-blue-500 transition-all duration-300 transform hover:translate-x-2 hover:scale-105 ' : ''}`}
                  >
                    All Products
                  </button>
                </li>
              </ul>
            </aside>
            <div className="w-4/5 px-2">
              <div className="grid grid-cols-3 gap-10">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="relative group">
                    <Link href={`/products/${product._id}`}>
                    <div className="relative w-full h-96 mb-4 overflow-hidden rounded-lg">
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
                          className="bg-white/10 text-white py-2 px-4 rounded-md transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-50"
                        >
                          Add to Cart
                        </button>
                      </div>
                        </Magnetic>
                    </div>
                    <div className="flex flex-col items-center">
                      <h3 className="text-2xl font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-400 mt-1 mb-2">{product.description}</p>
                      <p className="text-sm text-gray-00">
                      ₹{product.price.toFixed(2)}
                      {product.discount && (
                        <>
                          {' '}
                          <span className="line-through">₹{(product.price - product.discount).toFixed(2)}</span>
                        </>
                      )}
                    </p>
                    {/* {product.status && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {product.status}
                      </span>
                    )} */}
                    {product.stock === 'out of stock' && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  </Link>
                </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
