import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: Buffer, fileName: string): Promise<string> {
  try {
    console.log('Starting S3 upload for file:', fileName);
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      if (Buffer.isBuffer(file)) {
        resolve(file);
      } else if (typeof file === 'object' && file !== null && 'on' in file) {
        const stream = file as NodeJS.ReadableStream;
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      } else {
        reject(new Error('Invalid file type'));
      }
    });
    console.log('File buffer created');

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: 'image/*',
    };
    console.log('S3 upload params:', params);

    const result = await s3Client.send(new PutObjectCommand(params));
    console.log("S3 upload result:", result);
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    console.log('File uploaded to:', fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(`S3 upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteFromS3(fileName: string): Promise<void> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw error;
  }
}