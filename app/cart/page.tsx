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
        <div className="text-center">
          <p className="mb-4">Your cart is empty.</p>
          <Link 
            href="/collections/all"
            className="inline-block bg-transparent backdrop-blur-sm border border-zinc-500/50 text-white px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row items-center gap-4 mb-6 border-b border-gray-300/40 pb-6">
              <div className="w-full sm:w-32 flex justify-center">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  width={120} 
                  height={120} 
                  className="rounded-lg object-cover"
                />
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-semibold mb-2">{item.name}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {item.discount && item.discount > 0 ? (
                    <>
                      <p className="text-gray-400 line-through">₹{item.price.toFixed(2)}</p>
                      <p className="text-green-400">₹{(item.price - item.discount).toFixed(2)}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">₹{item.price.toFixed(2)}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center justify-center border border-zinc-500/50 rounded-lg px-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="text-white px-2   rounded-full hover:scale-105 transition-transform duration-200 hover:text-red-400"
                  >
                    -
                  </button>
                  <span className="mx-4 min-w-[20px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="text-white px-3 py-1 hover:text-green-400 text-lg"
                  >
                    +
                  </button>
                </div>

                <p className="text-lg font-semibold whitespace-nowrap">
                  ₹{((item.discount && item.discount > 0 ? item.price - item.discount : item.price) * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex flex-row sm:flex-col gap-2">
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-gradient-to-tr from-red-500/90 to-zinc-900 text-white px-3 py-1.5 rounded-lg hover:scale-105 transition-all duration-300 text-sm"
                >
                  Remove
                </button>
                <button
                  onClick={() => handlePayment(item._id)}
                  className="bg-transparent backdrop-blur-sm border border-zinc-500/50 text-white px-3 py-1.5 rounded-lg hover:scale-105 transition-all duration-300 text-sm"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-8 flex flex-col items-center justify-center p-4 border-t border-zinc-500/50">
            <p className="text-xl sm:text-2xl font-bold mb-4">Subtotal: ₹{total.toFixed(2)}</p>
            <button
              className="w-full sm:w-auto bg-transparent border border-zinc-600/50 text-white px-8 py-2 rounded-xl hover:scale-105 transition-all duration-300 hover:bg-gradient-to-tr from-green-500/90 to-zinc-900"
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
