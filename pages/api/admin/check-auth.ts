import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/middleware/adminAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Authenticated' });
}

export default adminAuth(handler);