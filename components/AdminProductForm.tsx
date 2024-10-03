'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

interface AdminProductFormProps {
  onProductAdded: () => void
}

export default function AdminProductForm({ onProductAdded }: AdminProductFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('discount', discount)
    if (image) formData.append('image', image)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        toast.success('Product added successfully')
        onProductAdded()
        // Reset form
        setName('')
        setDescription('')
        setPrice('')
        setDiscount('')
        setImage(null)
      } else {
        toast.error('Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('An error occurred while adding the product')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/placeholder.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <Card className="w-full max-w-md z-10">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Enter the details of the new product below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Enter product description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                placeholder="Enter price"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscount(e.target.value)}
                placeholder="Enter discount (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <Input
                id="image"
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0] || null)}
                accept="image/*"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Add Product
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}