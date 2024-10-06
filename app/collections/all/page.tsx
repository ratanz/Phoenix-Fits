'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Search, User, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/app/types';
import { useCustomToast } from '@/hooks/useCustomToast'
import ToastManager from '@/components/ToastManger'

const categories = ['New', 'Hoodies', 'Tees', 'Jackets', 'Pants', 'Skate']
export default function CollectionPage() {
  const { data: session } = useSession()
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([])
  const { showToast } = useCustomToast();

  console.log('Current session:', session);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data as Product[])
    }
    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    if (session) {
      addToCart(product);
    } else {
      showToast('Please sign in to add items to your cart');
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

      <div className="relative p-4 z-10 min-h-screen bg-black bg-opacity-50 text-white">
        <header className="p-2 pl-10 flex justify-between items-center">
          <nav>
            <Link href="/shop" className="mr-4 hover:text-gray-300">Shop</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          </nav>
          <div className="flex-1 flex justify-center">
            <Image src="/images/textlogo.png" alt="Logo" width={100} height={10} className="mx-auto h-fit w-40 text-white" />
          </div>
          <div className="flex items-center justify-end w-fit ">
            <Search className="w-6 h-6 mr-4 cursor-pointer" />
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
                    <Link href="#" className="hover:text-gray-300">{category}</Link>
                  </li>
                ))}
              </ul>
            </aside>
            <div className="w-4/5 px-6">
              <div className="grid grid-cols-4 gap-10">
                {products.map((product) => (
                  <div key={product._id} className="relative group">
                    <div className="relative w-full h-64 mb-4 border-2 border-white shadow-white shadow-md rounded-lg overflow-hidden">
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
                    <p className="text-xs text-gray-400 mt-1 mb-2">{product.description}</p>
                    <p className="text-sm text-gray-400">
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