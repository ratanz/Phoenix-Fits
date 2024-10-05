'use client'

import React from 'react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { Product } from '@/app/types';

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  console.log('Cart contents in CartPage:', cart);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="flex items-center mb-4 border-b border-gray-700 pb-4">
              <Image src={item.image} alt={item.name} width={100} height={100} className="rounded-md mr-4" />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-400">₹{item.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="bg-gray-700 text-white px-2 py-1 rounded-md"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="bg-gray-700 text-white px-2 py-1 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-xl font-semibold mr-4">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-2xl font-bold">Subtotal: ₹{total.toFixed(2)}</p>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-md mt-4">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}