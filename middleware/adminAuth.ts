import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';

export function adminAuth(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET as string);
      if (!(decoded as any).admin) {
        throw new Error('Not authorized');
      }
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}