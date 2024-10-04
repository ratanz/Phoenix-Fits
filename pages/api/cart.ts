import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import { getSession } from 'next-auth/react';
import Cart from '@/models/Cart';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();
  const userId = session.user.id;

  switch (req.method) {
    case 'GET':
      // Fetch cart items
      const cart = await Cart.findOne({ userId }).populate('items');
      res.status(200).json(cart ? cart.items : []);
      break;
    case 'POST':
      // Add item to cart
      const { productId } = req.body;
      await Cart.findOneAndUpdate(
        { userId },
        { $addToSet: { items: productId } },
        { upsert: true }
      );
      res.status(200).json({ message: 'Item added to cart' });
      break;
    case 'DELETE':
      // Remove item from cart
      const { productId: removeId } = req.body;
      await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: removeId } }
      );
      res.status(200).json({ message: 'Item removed from cart' });
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}