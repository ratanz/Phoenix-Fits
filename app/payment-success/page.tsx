'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ToastManager from '@/components/ToastManger';
import Magnetic from '@/components/MagnetAnimation';
import { ConfettiFireworks } from '@/components/ui/magicui/confettifireworks';

export default function PaymentSuccess() {
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white font-spacer">
        <div className="p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-6">
            <Image src="/images/gorba.png" alt="logo" width={80} height={100} />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-center">Payment Successful!</h1>
          <p className="text-center mb-6">Thank you for your purchase. Your order has been confirmed.</p>
          <div className="flex justify-center">
            <Magnetic>
              <Link href="/collections/all">
                <button className="bg-transparent backdrop-blur-sm text-white font-bold py-2 px-4 rounded border border-white/50 relative overflow-hidden group">
                  <span className="absolute inset-0 bg-blue-500/80 transform scale-0 transition-transform duration-500 origin-center rounded-full group-hover:scale-100 group-hover:rounded-none"></span>
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                    Continue Shopping
                  </span>
                </button>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
      <ConfettiFireworks />
    </div>
  );
}
