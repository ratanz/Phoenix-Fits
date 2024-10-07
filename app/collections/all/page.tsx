'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Search, User, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/app/types'
import { useCustomToast } from '@/hooks/useCustomToast'
import ToastManager from '@/components/ToastManger'
import SearchPopup from '@/components/SearchPopup'

const categories = ['Tshirt', 'Hoodies', 'Jackets', 'Pants', 'Jorts', 'Socks']
export default function CollectionPage() {
  const { data: session } = useSession()
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([])
  const { showToast } = useCustomToast();

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[]>([])

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  console.log('Current session:', session);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products')
      const data = await response.json()
      console.log('Fetched products:', data) 
      setProducts(data as Product[])
    }
    fetchProducts()
  }, [])

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

      <div className="relative p-4 z-10 min-h-screen bg-black bg-opacity-50 text-white font-spacer ">
        <header className="p-4  pl-10 flex justify-between items-center ">
          <nav className='flex justify-center items-center '>
            <Link href="/shop" className="mr-4 hover:text-gray-300">Shop</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          </nav>
          <div className="logo">
            {/* <h3 className='text-4xl font-judas'>GORBA</h3> */}
            <Image src="/images/gorba.png" alt="GORBA" width={110} height={20} className='w-24 h-24' />
          </div>
          
          <div className="flex items-center justify-end w-fit ">
            <Search className="w-6 h-6 mr-4 cursor-pointer" onClick={handleSearchOpen} />
            <Link href="/cart" className="flex items-center cursor-pointer mr-4">
              <ShoppingCart className="w-6 h-6 mr-2" />
              <span> ({cart.length})</span>
            </Link>
            {session ? (
              <div className="flex items-center">
                <span className="mr-2">{session.user?.name}</span>
                <button onClick={() => signOut()} className=" text-white px-2 py-1 rounded">
                  <LogOut className="w-4 h-4 mr-1" />
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
            <aside className="w-1/5 px-12 pr-4">
              <h2 className="text-xl font-bold mb-4">Categories</h2>
              <ul>
                {categories.map((category, index) => (
                  <li key={index} className="mb-2">
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`hover:text-gray-300 ${selectedCategory === category ? 'font-bold' : ''}`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
                <li className="mb-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="hover:text-gray-300"
                  >
                    All Products
                  </button>
                </li>
              </ul>
            </aside>
            <div className="w-4/5 px-6">
              <div className="grid grid-cols-3 gap-10">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="relative group">
                    <div className="relative w-full h-80 mb-4 border-2 border-white shadow-white shadow-md rounded-lg overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute flex items-center justify-center w-full bottom-0 h-16 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-white text-black py-2 px-4 rounded-md transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
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
                    {product.status && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {product.status}
                      </span>
                    )}
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