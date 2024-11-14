import dbConnect from '../../../lib/mongodb.js'
import Product from '../../../models/Product'
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function deleteFromS3(imageUrl) {
  const key = imageUrl.split('/').pop();
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `products/${key}`,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`Deleted image from S3: ${imageUrl}`);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const product = await Product.findById(id)
        if (!product) {
          return res.status(404).json({ success: false, error: 'Product not found' })
        }
        res.status(200).json(product)
      } catch {
        res.status(400).json({ success: false, error: 'Error fetching product' })
      }
      break

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
        const product = await Product.findById(id)
        if (!product) {
          return res.status(404).json({ success: false, error: 'Product not found' })
        }

        // Delete main image from S3
        await deleteFromS3(product.image)

        // Delete sub-images from S3
        for (const subImage of product.subImages) {
          await deleteFromS3(subImage)
        }

        const deletedProduct = await Product.deleteOne({ _id: id })
        if (!deletedProduct) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        console.error('Error deleting product:', error)
        res.status(400).json({ success: false, error: error.message })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}