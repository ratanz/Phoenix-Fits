'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Search } from 'lucide-react'

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount?: number;
  status?: string;
}

const categories = ['New', 'Hoodies', 'Tees', 'Jackets', 'Pants', 'Skate']

export default function CollectionPage() {

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data as Product[])
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="/video/starseffect.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative p-10 z-10 min-h-screen bg-black bg-opacity-50 text-white">
        <header className="p-4 pl-10 flex justify-between items-center">
          <nav>
            <Link href="/shop" className="mr-4 hover:text-gray-300">Shop</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          </nav>
          <div className="flex-1 flex justify-center">
            <Image src="/images/textlogo.png" alt="Logo" width={100} height={50} className="mx-auto text-white" />
          </div>
          <div className="flex items-center justify-center w-fit ">
            <Search className="w-6 h-6 mr-4 cursor-pointer" />
            <div className="flex items-center cursor-pointer">
              <ShoppingCart className="w-6 h-6 mr-2" />
              <span>Cart (0)</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex">
            <aside className="w-1/5 p-10  pr-4">
              <h2 className="text-xl font-bold mb-4">Categories</h2>
              <ul>
                {categories.map((category, index) => (
                  <li key={index} className="mb-2">
                    <Link href="#" className="hover:text-gray-300">{category}</Link>
                  </li>
                ))}
              </ul>
            </aside>
            <div className="w-full h-full">
              <div className="flex gap-8 flex-row justify-between">
                {products.map((product) => (
                  <div key={product._id} className="relative group">
                    <div className="w-full h-full mb-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={100}
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-400">
                      ${product.discount ? (
                        <>
                          <span className="line-through">{product.price.toFixed(2)}</span>{' '}
                          ${(product.price - product.discount).toFixed(2)}
                        </>
                      ) : (
                        product.price.toFixed(2)
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