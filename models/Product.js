import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, default: '' },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);