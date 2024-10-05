export interface Product {
    _id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    discount?: number;
    status?: string;
    quantity: number;
  }