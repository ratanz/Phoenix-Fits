import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number },
  image: { type: String, required: true },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);