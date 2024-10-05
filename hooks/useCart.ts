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
    } else {
      setCart([]);
    }
  }, [session]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const cartItems = await response.json();
        setCart(cartItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to fetch cart items');
    }
  };

  const addToCart = async (product: Product) => {
    if (!session) {
      toast.error('Please sign in to add items to your cart');
      return;
    }
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });
      if (response.ok) {
        setCart((prevCart) => [...prevCart, product]);
        toast.success('Item added to cart');
      } else {
        const errorData = await response.json();
        console.error('Failed to add item to cart:', errorData);
        toast.error(`Failed to add item to cart: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error instanceof Error) {
        toast.error(`Failed to add item to cart: ${error.message}`);
      } else {
        toast.error('Failed to add item to cart: Unknown error');
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (response.ok) {
        setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
        toast.success('Item removed from cart');
      } else {
        throw new Error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  return { cart, addToCart, removeFromCart };
}