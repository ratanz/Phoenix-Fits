import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // In a real application, you should validate against a database
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { username, admin: true },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    const serialized = serialize('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    res.setHeader('Set-Cookie', serialized);
    res.status(200).json({ message: 'Authentication successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}