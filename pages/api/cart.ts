import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import Cart from '@/models/Cart';
import Product from '@/models/Product';

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
        const cart = await Cart.findOne({ userId }).populate('items');
        res.status(200).json(cart ? cart.items : []);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart items' });
      }
      break;

    case 'POST':
      try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        await Cart.findOneAndUpdate(
          { userId },
          { $addToSet: { items: productId } },
          { upsert: true }
        );
        res.status(200).json({ message: 'Item added to cart' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add item to cart' });
      }
      break;

    case 'DELETE':
      try {
        const { productId } = req.body;
        await Cart.findOneAndUpdate(
          { userId },
          { $pull: { items: productId } }
        );
        res.status(200).json({ message: 'Item removed from cart' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to remove item from cart' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}