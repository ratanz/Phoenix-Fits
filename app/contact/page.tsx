'use client'

import React, { useState } from 'react'

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert('Email sent successfully!')
        setFormData({ name: '', phone: '', email: '', message: '' })
      } else {
        alert('Failed to send email. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    }
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

<div className='p-4 sm:p-8 md:p-16 lg:p-24 min-h-screen relative overflow-hidden'>
  <div className="flex items-center justify-center">
    <h1 className='text-2xl sm:text-3xl md:text-4xl font-judas'>Contact us</h1>
  </div>
  <form onSubmit={handleSubmit} className="detail flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 gap-4 mt-6">
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 w-full max-w-2xl">
      <div className="flex flex-col w-full sm:w-1/2">
        <h3 className='m-2 text-zinc-200/80'>Name</h3>
        <input name="name" value={formData.name} onChange={handleChange} className='bg-transparent backdrop-blur-sm w-full border border-white/20 rounded-md p-2 px-4' type="text" placeholder='Enter your name' required />
      </div>
      <div className="flex flex-col w-full sm:w-1/2">
        <h3 className='m-2 text-zinc-200/80'>Phone</h3>
        <input name="phone" value={formData.phone} onChange={handleChange} className='bg-transparent backdrop-blur-sm w-full border border-white/20 rounded-md p-2 px-4' type="text" placeholder='Enter your number' required />
      </div>
    </div>
    <div className="flex flex-col w-full max-w-2xl">
      <h3 className='m-2 text-zinc-200/80'>Email</h3>
      <input name="email" value={formData.email} onChange={handleChange} className='bg-transparent backdrop-blur-sm w-full border border-white/20 rounded-md p-2 px-4' type="email" placeholder='Enter your email' required />
    </div>
    <div className="flex flex-col w-full max-w-2xl">
      <h3 className='m-2 text-zinc-200/80'>Message</h3>
      <textarea name="message" value={formData.message} onChange={handleChange} className='bg-transparent backdrop-blur-sm w-full h-32 sm:h-52 border border-white/20 rounded-md p-2 px-4' required />
    </div>
    <button type="submit" className='bg-transparent backdrop-blur-xl w-full max-w-2xl text-white border border-white/20 rounded-md p-2 px-4 hover:bg-white/10 transition-colors'>Submit</button>
  </form>
</div>
</div> 
)}  


export default Page