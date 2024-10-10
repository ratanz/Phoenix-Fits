import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number },
  image: { type: String, required: true },
  subImages: { type: [String], default: [] },
  category: { type: String, required: true },
  sizes: { type: [String], default: [] },
  stock: { type: String, enum: ['in stock', 'out of stock'], default: 'in stock' },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);