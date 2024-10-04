import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);

export default Cart;