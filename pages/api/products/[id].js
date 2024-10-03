import dbConnect from '../../../lib/mongodb'
import Product from '../../../models/Product'

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'DELETE':
      try {
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
          return res.status(404).json({ success: false })
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