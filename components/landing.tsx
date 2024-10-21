'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import LoadingAnimation from "./LoadingAnimation"

export default function Landing() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // Adjust this time as needed

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <div className='flex justify-center items-center h-screen text-4xl font-judas font-bold text-white bg-black'>
      <LoadingAnimation />
    </div>
  }


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
    
      <div className="z-10 text-center relative flex flex-col justify-center items-center h-screen">
        <nav className="mb-8">
          <ul className="space-y-4 text-white">
            <li><a href="/collections/all" className="text-2xl hover:text-gray-300 transition-colors">Shop All</a></li>
            <li><a href="/collections/hoodies" className="text-2xl hover:text-gray-300 transition-colors">Hoodies</a></li>
            <li><a href="/collections/t-shirts" className="text-2xl hover:text-gray-300 transition-colors">T-Shirts</a></li>
            <li><a href="#" className="text-2xl hover:text-gray-300 transition-colors">Lookbook</a></li>
          </ul>
        </nav>

      {/* Character image */}
      <div className="absolute right-[25%] top-1/2 transform -translate-y-1/2">
        <Image unoptimized
          src="/images/gorbalogo.jpg"
          width={400}
          height={400}
          alt="logo"
          className="w-52 h-52 animate-pulse"
          style={{
            animation: 'scaleUpDown 1.3s infinite ease-in-out'
          }}
        />
      </div>
    </div>
    </div>
  )
}