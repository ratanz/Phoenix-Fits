import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Product } from '@/app/types';
import { toast } from 'react-toastify';

interface CartItem extends Product {
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
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
        console.log('Fetched cart items in useCart:', cartItems);
        setCart(cartItems);
      } else {
        throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to fetch cart items');
    }
  };

  const addToCart = async (product: Product) => {
    console.log('Adding product to cart:', product);
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
        await fetchCart();
        toast.success('Item added to cart');
      } else {
        const errorData = await response.json();
        console.error('Failed to add item to cart:', errorData);
        toast.error(`Failed to add item to cart: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart: Unknown error');
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      if (response.ok) {
        await fetchCart();
        toast.success('Cart updated');
      } else {
        throw new Error('Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
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
        await fetchCart();
        toast.success('Item removed from cart');
      } else {
        throw new Error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  return { cart, addToCart, updateQuantity, removeFromCart };
}