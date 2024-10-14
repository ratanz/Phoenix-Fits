import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { Types } from 'mongoose';

interface CartItem {
  product: Types.ObjectId | string;
  quantity: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Cart API called, method:', req.method);
  const session = await getServerSession(req, res, authOptions);
  console.log('Session in API route:', session);

  if (!session) {
    console.log('No session found, returning Unauthorized');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();
  const userId = session.user.id;

  switch (req.method) {
    case 'GET':
      try {
        console.log('Fetching cart for user:', userId);
        const cart = await Cart.findOne({ userId }).populate('items.product');
        console.log('Cart found:', cart);
        if (cart && cart.items) {
          const cartItems = cart.items
            .filter((item: CartItem) => item.product && typeof item.product === 'object')
            .map((item: CartItem & { product: any }) => ({
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              discount : item.product.discount,
              image: item.product.image,
              quantity: item.quantity,
            }));
          console.log('Formatted cart items:', cartItems);
          res.status(200).json(cartItems);
        } else {
          res.status(200).json([]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart items', details: (error as Error).message });
      }
      break;

    case 'POST':
      try {
        console.log('Request body:', req.body);
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        let cart = await Cart.findOne({ userId });
        if (!cart) {
          cart = new Cart({ userId, items: [] });
        }
        const existingItemIndex = cart.items.findIndex((item: CartItem) => item.product && item.product.toString() === productId);
        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity += 1;
        } else {
          cart.items.push({ product: productId, quantity: 1 });
        }
        await cart.save();
        console.log('Updated cart:', cart);
        res.status(200).json({ message: 'Item added to cart', cart });
      } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Failed to add item to cart' });
      }
      break;

      case 'PUT':
        try {
          console.log('Request body:', req.body);
          const { productId, quantity } = req.body;
          const cart = await Cart.findOne({ userId });
          if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
          }
          const itemIndex = cart.items.findIndex((item: CartItem) => item.product && item.product.toString() === productId);
          if (itemIndex > -1) {
            if (quantity > 0) {
              cart.items[itemIndex].quantity = quantity;
            } else {
              cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            console.log('Updated cart:', cart);
            res.status(200).json({ success: true, message: 'Cart updated', cart });
          } else {
            res.status(404).json({ success: false, error: 'Item not found in cart' });
          }
        } catch (error) {
          console.error('Error updating cart:', error);
          res.status(500).json({ success: false, error: 'Failed to update cart', details: (error as Error).message });
        }
        break;

    case 'DELETE':
      try {
        console.log('Request body:', req.body);
        const { productId } = req.body;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
          return res.status(404).json({ error: 'Cart not found' });
        }
        cart.items = cart.items.filter((item: CartItem) => item.product && item.product.toString() !== productId);
        await cart.save();
        console.log('Updated cart:', cart);
        res.status(200).json({ message: 'Item removed from cart', cart });
      } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}