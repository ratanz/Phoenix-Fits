import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb-adapter'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const client = await clientPromise
    const usersCollection = client.db().collection('users')

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    await usersCollection.insertOne({ name, email, password: hashedPassword })

    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Sign up error:', error)
    res.status(500).json({ error: 'An error occurred during sign up' })
  }
}