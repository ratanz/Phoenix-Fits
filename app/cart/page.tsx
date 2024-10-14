'use client'

import React from 'react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { Product } from '@/app/types';
import ToastManager from '@/components/ToastManger';

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  console.log('Cart contents in CartPage:', cart);

  const total = cart.reduce((sum, item) => {
    const itemPrice = item.discount && item.discount > 0 ? item.price - item.discount : item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
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
    <div className="relative z-50 px-24 p-10 text-white font-spacer ">
      <h1 className="text-3xl font-bold mb-8 p-3 flex items-center justify-center">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="flex items-center mb-4 border-b border-gray-300/40 pb-4">
              <Image src={item.image} alt={item.name} width={150} height={150} className="rounded-md mr-2" />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <div className="flex items-center mt-2">
                  {item.discount && item.discount > 0 ? (
                    <>
                      <p className="text-gray-400 line-through mr-2">₹{item.price.toFixed(2)}</p>
                      <p className="text-green-400">₹{(item.price - item.discount).toFixed(2)}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">₹{item.price.toFixed(2)}</p>
                  )}
                </div>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="text-white px-2 rounded-md"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="text-white px-2 py-1 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-xl font-semibold mr-4">
                ₹{((item.discount && item.discount > 0 ? item.price - item.discount : item.price) * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300"
              >
                Remove
              </button>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-transparent backdrop-blur-sm text-white px-4 py-2 rounded-xl ml-4 hover:scale-105 transition-all duration-300"
              >
                Buy Now
              </button>
            </div>
          ))}
          <div className="mt-8 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold">Subtotal: ₹{total.toFixed(2)}</p>
            <button className="bg-transparent border border-zinc-600/50 text-white p-2 px-4 rounded-xl mr-2">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
    </div>
  );
}
