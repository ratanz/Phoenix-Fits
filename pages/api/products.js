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

  if (req.method === 'GET') {
    try {
      const products = await Product.find({})
      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch products' })
    }
  } else if (req.method === 'POST') {
    const form = new IncomingForm()

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' })
      }

      try {
        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name
        const description = Array.isArray(fields.description) ? fields.description[0] : fields.description
        const price = Array.isArray(fields.price) ? fields.price[0] : fields.price
        const discount = Array.isArray(fields.discount) ? fields.discount[0] : fields.discount

        let imagePath = ''

        if (files.image && files.image.length > 0) {
          const file = files.image[0]
          const fileName = `${Date.now()}-${file.originalFilename}`
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
          await fs.mkdir(uploadsDir, { recursive: true })
          const newPath = path.join(uploadsDir, fileName)
          await fs.copyFile(file.filepath, newPath)
          imagePath = `/uploads/${fileName}`
        } else {
          imagePath = '/default-product-image.jpg'
        }

        const product = new Product({
          name,
          description,
          price: parseFloat(price),
          discount: discount ? parseFloat(discount) : undefined,
          image: imagePath,
        })

        await product.save()
        res.status(201).json(product)
      } catch (error) {
        console.error('Error creating product:', error)
        res.status(500).json({ error: 'Unable to create product' })
      }
    })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}