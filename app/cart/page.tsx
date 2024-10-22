'use client'

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { Product } from '@/app/types';
import ToastManager from '@/components/ToastManger';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useCustomToast } from '@/hooks/useCustomToast';
import { getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import loadRazorpay from '@/hooks/razorpay';
import LoadingAnimation from '@/components/LoadingAnimation';

interface CartItem extends Product {
  quantity: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useCustomToast()
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true)

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

  const handlePayment = async (productId?: string) => {
    const res = await loadRazorpay();
    if (!res) {
      showToast('Please try again later.');
      return;
    }

    try {
      let amount;
      let description;

      if (productId) {
        const product = cart.find(item => item._id === productId);
        if (!product) {
          showToast('Product not found in cart', 'error');
          return;
        }
        amount = (product.price - (product.discount || 0)) * product.quantity;
        description = `Purchase of ${product.name}`;
      } else {
        amount = total;
        description = 'Purchase of multiple items';
      }

      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        showToast('Failed to create order', 'error');
      }

      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Ratanz store',
        description: description,
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
    <div className="relative z-50 px-24 p-10 text-white font-glorich ">
      <div className="logo flex items-center justify-center">
        <Link href="/collections/all">
          <Image src="/images/gorba.png" alt="logo" width={70} height={70} />
        </Link>
      </div>
     
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
                    className="text-white px-2   rounded-full hover:scale-105 transition-transform duration-200 hover:text-red-400"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="text-white px-2 py-1 rounded-md hover:scale-105 transition-transform duration-200 hover:text-green-400"
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
                onClick={() => handlePayment(item._id)}
                className="bg-transparent backdrop-blur-sm text-white px-4 py-2 rounded-xl ml-4 hover:scale-105 transition-all duration-300"
              >
                Buy Now
              </button>
            </div>
          ))}

          <div className="mt-8 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold">Subtotal: ₹{total.toFixed(2)}</p>
            <button 
              className="bg-transparent border border-zinc-600/50 text-white p-2 px-4 rounded-xl mr-2" 
              onClick={() => handlePayment()}
            >
              Checkout with Razorpay
            </button>
          </div>
        </>
      )}
    </div>
    </div>
  );
}

