
import { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';

// Initialize Razorpay instance with API keys
// Use nullish coalescing operator to provide empty string as fallback
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? '',
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? '',
});

// Define the API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    // Extract the amount from the request body
    const { amount } = req.body;

    try {
      // Create a new order using Razorpay SDK
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert amount to paise (Razorpay expects amount in paise)
        currency: 'INR', // Set currency to Indian Rupees
        receipt: 'order_' + Date.now(), // Generate a unique receipt ID using current timestamp
      });

      // Send successful response with the order ID
      res.status(200).json({ orderId: order.id });
    } catch (error) {
      // Send error response
      res.status(500).json({ error: 'Error creating order' });
    }
  } else {
    // If the request method is not POST, send method not allowed error
    res.status(405).json({ error: 'Method not allowed' });
  }
}
