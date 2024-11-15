'use client'

import React, { useRef,  useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import ToastManager from '@/components/ToastManger';
import { useRouter } from 'next/navigation';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import loadRazorpay from '@/hooks/razorpay';
import gsap from 'gsap';
import { RazorpayOptions, RazorpayInstance } from '@/app/types';


// interface CartItem extends Product {
//   quantity: number;
// }

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useCustomToast()
  const { data: session } = useSession();
  const contentRef = useRef(null)

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

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: amount * 100,
        currency: 'INR',
        name: 'Ratanz store',
        description: description,
        order_id: data.orderId,
        handler: function () {
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

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      showToast('Error initiating payment. Please try again.', 'error');
    }
  };

  // gsap 
  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      {opacity: 0, y: 50},
      {opacity: 1, y: 0, duration: 0.7, ease: 'power2.inOut'}
    );
  }, [])

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

    <div ref={contentRef} className="relative z-50 px-4 sm:px-8 md:px-16 lg:px-24 py-6 sm:py-10 text-white font-glorich">
    
      <div className="logo flex items-center justify-center mb-6">
        <Link href="/collections/all">
          <Image src="/images/gorba.png" alt="logo" width={70} height={70} />
        </Link>
      </div>
     
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center mb-6 border-b border-gray-300/40 pb-4">
              <div className="w-full sm:w-auto flex justify-center sm:justify-start mb-4 sm:mb-0">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  width={100} 
                  height={100} 
                  className="rounded-md"
                />
              </div>
              
              <div className="flex-grow px-4 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-semibold">{item.name}</h2>
                <div className="flex items-center justify-center sm:justify-start mt-2">
                  {item.discount && item.discount > 0 ? (
                    <>
                      <p className="text-gray-400 line-through mr-2">₹{item.price.toFixed(2)}</p>
                      <p className="text-green-400">₹{(item.price - item.discount).toFixed(2)}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">₹{item.price.toFixed(2)}</p>
                  )}
                </div>

                <div className="flex items-center justify-center sm:justify-start mt-2">
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
                className="bg-gradient-to-tr from-red-500/90  to-zinc-900  text-white px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300"
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
          
          <div className="mt-8 flex flex-col items-center justify-center p-4">
            <p className="text-2xl font-bold">Subtotal: ₹{total.toFixed(2)}</p>
            <button
              className="bg-transparent border border-zinc-600/50 text-white mt-2 p-2 px-4 rounded-xl mr-2 hover:scale-105 transition-all duration-300 hover:bg-gradient-to-tr from-green-500/90  to-zinc-900 " 
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
