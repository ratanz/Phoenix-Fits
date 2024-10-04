'use client'

import React from 'react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item ) => (
            <div key={item._id} className="flex items-center mb-4 border-b border-gray-700 pb-4">
              <Image src={item.image} alt={item.name} width={100} height={100} className="rounded-md mr-4" />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-400">₹{item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-2xl font-bold">Total: ₹{total.toFixed(2)}</p>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-md mt-4">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}