import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isConfigured = process.env.CLOUDFLARE_R2_ENDPOINT && !process.env.CLOUDFLARE_R2_ENDPOINT.includes('<account_id>');

const s3 = isConfigured ? new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
}) : null;

export const uploadImage = async (file, folder = 'products') => {
  if (!isConfigured) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    const uploadDir = path.join(__dirname, `../public/uploads/${folder}`);
    const uploadPath = path.join(uploadDir, filename);
    await fs.promises.mkdir(uploadDir, { recursive: true });
    await fs.promises.writeFile(uploadPath, file.buffer);
    return `${folder}/${filename}`;
  }

  const key = `${folder}/${Date.now()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return key;
};

export const deleteImage = async (key) => {
  if (!isConfigured) {
    console.warn("Storage is not configured. Mocking image deletion.");
    return;
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    }),
  );
};
