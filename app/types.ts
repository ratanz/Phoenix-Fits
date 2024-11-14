export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    discount?: number;
    image: string;
    subImages: string[];
    status?: string;
    category: string; 
    sizes: string[];
    stock: 'in stock' | 'out of stock';
}

// Add this to your types file (e.g., app/types.ts)
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open: () => void;
}

// Add this to your types file
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
