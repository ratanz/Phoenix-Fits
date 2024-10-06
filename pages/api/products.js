import dbConnect from '../../lib/mongodb.js'
import Product from '../../models/Product'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  await dbConnect()

  switch (req.method) {
    case 'GET':
      try {
        const products = await Product.find({})
        res.status(200).json(products)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' })
      }
      break

    case 'POST':
      try {
        const form = new IncomingForm()
        form.parse(req, async (err, fields, files) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to parse form data' })
          }

          const { name, description, price, discount } = fields
          const imagePath = files.image ? files.image[0].filepath : null

          let imageUrl = ''
          if (imagePath) {
            const data = await fs.readFile(imagePath)
            const fileName = `${Date.now()}-${files.image[0].originalFilename}`
            await fs.writeFile(path.join(process.cwd(), 'public', 'uploads', fileName), data)
            imageUrl = `/uploads/${fileName}`
          }

          const product = new Product({
            name,
            description,
            price,
            discount: discount || 0,
            image: imageUrl,
          })

          await product.save()
          res.status(201).json(product)
        })
      } catch (error) {
        res.status(500).json({ error: 'Failed to create product' })
      }
      break

    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}