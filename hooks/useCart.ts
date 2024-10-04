import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Product } from '@/app/types';
import { toast } from 'react-toastify';

export function useCart() {
  const [cart, setCart] = useState<Product[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchCart();
    }
  }, [session]);

  const fetchCart = async () => {
    const response = await fetch('/api/cart');
    if (response.ok) {
      const cartItems = await response.json();
      setCart(cartItems);
    }
  };

  const addToCart = async (product: Product) => {
    if (!session) {
      toast.error('Please sign in to add items to your cart');
      return;
    }
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product._id }),
    });
    if (response.ok) {
      setCart((prevCart) => [...prevCart, product]);
      toast.success('Item added to cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (response.ok) {
      setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
      toast.success('Item removed from cart');
    }
  };

  return { cart, addToCart, removeFromCart };
}