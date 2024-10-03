'use client'

import Image from "next/image"

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
      </div>
      
      <div className="z-10 text-center">
        <nav className="mb-8">
          <ul className="space-y-4">
            <li><a href="/collections/all" className="text-2xl hover:text-gray-300 transition-colors">Shop All</a></li>
            <li><a href="/collections/hoodies" className="text-2xl hover:text-gray-300 transition-colors">Hoodies</a></li>
            <li><a href="/collections/t-shirts" className="text-2xl hover:text-gray-300 transition-colors">T-Shirts</a></li>
            <li><a href="#" className="text-2xl hover:text-gray-300 transition-colors">Lookbook</a></li>
          </ul>
        </nav>
        
        <div className="flex justify-center space-x-4 mb-8">
          <a href="#" className="hover:text-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5Z"></path>
              <path d="m10 15 5-3-5-3z"></path>
            </svg>
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>
      </div>
      
      {/* Character image */}
      <div className="absolute right-[25%]  top-1/2 transform -translate-y-1/2">
        <Image unoptimized
          src="/images/logoshop.webp"
          width={400}
          height={400}
          alt="Cartoon character"
          className="w-52 h-52"
        />
      </div>
      
      <style jsx>{`
        .stars {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 120%;
          transform: rotate(-45deg);
        }

        .stars {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: zoom 10s infinite;
          opacity: 0.3;
        }

        @keyframes zoom {
          0% {
            opacity: 0;
            transform: scale(0.5);
            animation-timing-function: ease-in;
          } 
          85% {
            opacity: 1;
            transform: scale(2.8);
            animation-timing-function: linear;
          }
          100% {
            opacity: 0;
            transform: scale(3.5);
          }
        }
      `}</style>
    </div>
  )
}