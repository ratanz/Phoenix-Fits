import dbConnect from '../../../lib/mongodb.js'
import Product from '../../../models/Product'

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'PUT':
      try {
        const updateData = { ...req.body };
        if (typeof updateData.sizes === 'string') {
          updateData.sizes = JSON.parse(updateData.sizes);
        }
        const product = await Product.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });
        console.log('Updated product:', product); // For debugging
        if (!product) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: product });
      } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break
    case 'DELETE':
      try {
        const deletedProduct = await Product.deleteOne({ _id: id })
        if (!deletedProduct) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}