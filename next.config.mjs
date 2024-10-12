/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gorbaproduct.s3.eu-north-1.amazonaws.com'],
  },
  env: {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  },
};

export default nextConfig;
