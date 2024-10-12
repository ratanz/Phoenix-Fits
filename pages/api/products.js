import dbConnect from '../../lib/mongodb.js'
import Product from '../../models/Product'
import { IncomingForm } from 'formidable'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(file, fileName) {
  try {
    console.log('Starting S3 upload for file:', fileName);
    const fileBuffer = await fs.promises.readFile(file.filepath);
    console.log('File buffer created');

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `products/${fileName}`,
      Body: fileBuffer,
      ContentType: file.mimetype,
    };
    console.log('S3 upload params:', JSON.stringify(params, null, 2));

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log('File uploaded successfully');
    return `products/${fileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
}

export default async function handler(req, res) {
  await dbConnect();
  console.log('Request method:', req.method);
  console.log('Request method:', req.method);
  console.log('S3 Bucket Name:', process.env.AWS_S3_BUCKET_NAME);
  console.log('AWS Region:', process.env.AWS_REGION);

  if (req.method === 'POST') {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      console.log('Parsed fields:', fields);
      console.log('Parsed files:', files);

      try {
        const { name, description, price, discount, category, sizes, stock } = fields;
        let imagePath = '';
        let subImagePaths = [];

        if (files.image) {
          console.log('Uploading main image');
          const file = Array.isArray(files.image) ? files.image[0] : files.image;
          const fileName = `${uuidv4()}-${file.originalFilename}`;
          imagePath = await uploadToS3(file, fileName);
          console.log('Main image uploaded:', imagePath);
        }

        if (files.subImages) {
          console.log('Uploading sub-images');
          const subImages = Array.isArray(files.subImages) ? files.subImages : [files.subImages];
          for (const subImage of subImages) {
            const fileName = `${uuidv4()}-${subImage.originalFilename}`;
            const subImageUrl = await uploadToS3(subImage, fileName);
            subImagePaths.push(subImageUrl);
          }
          console.log('Sub-images uploaded:', subImagePaths);
        }

        const product = new Product({
          name: Array.isArray(name) ? name[0] : name,
          description: Array.isArray(description) ? description[0] : description,
          price: parseFloat(Array.isArray(price) ? price[0] : price),
          discount: discount ? parseFloat(Array.isArray(discount) ? discount[0] : discount) : undefined,
          image: imagePath,
          subImages: subImagePaths,
          category: Array.isArray(category) ? category[0] : category,
          sizes: JSON.parse(Array.isArray(sizes) ? sizes[0] : sizes),
          stock: Array.isArray(stock) ? stock[0] : stock
        });

        console.log('Product object created:', JSON.stringify(product, null, 2));

        const savedProduct = await product.save();
        console.log('Product saved:', JSON.stringify(savedProduct, null, 2));
        return res.status(201).json(savedProduct);
      } catch (error) {
        console.error('Error creating product:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({ error: 'Unable to create product', details: error.message });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const products = await Product.find({});
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Unable to fetch products' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
