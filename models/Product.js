import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number },
  image: { 
    type: String, 
    required: true,
    get: function(v) {
      if (v && !v.startsWith('http')) {
        return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${v}`;
      }
      return v || '';
    }
  },
  subImages: { 
    type: [String], 
    default: [],
    get: function(v) {
      return v.map(img => {
        if (img && !img.startsWith('http')) {
          return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${img}`;
        }
        return img || '';
      });
    }
  },
  category: { type: String, required: true },
  sizes: { type: [String], default: [] },
  stock: { type: String, enum: ['in stock', 'out of stock'], default: 'in stock' },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
