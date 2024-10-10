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