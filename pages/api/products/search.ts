import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await dbConnect();
      const { q } = req.query;
      
      if (typeof q !== 'string') {
        return res.status(400).json({ error: 'Invalid search query' });
      }

      const products = await Product.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      });

      res.status(200).json(products);
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ error: 'Unable to search products' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}