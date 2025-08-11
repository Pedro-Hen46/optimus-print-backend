import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.MINIO_REGION,
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const bucket = process.env.MINIO_BUCKET_NAME!;

export async function uploadFileToS3(
  file: Express.Multer.File
): Promise<string> {
  const fileName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
  const mimeType = file.mimetype;

  let compressedBuffer: Buffer;

  try {
    const image = sharp(file.buffer);
    const metadata = await image.metadata();

    switch (metadata.format) {
      case "jpeg":
      case "jpg":
        compressedBuffer = await image.jpeg({ quality: 60 }).toBuffer();
        break;
      case "png":
        compressedBuffer = await image.png({ compressionLevel: 7 }).toBuffer();
        break;
      case "webp":
        compressedBuffer = await image.webp({ quality: 60 }).toBuffer();
        break;
      case "tiff":
        compressedBuffer = await image.tiff({ quality: 60 }).toBuffer();
        break;
      default:
        compressedBuffer = file.buffer;
        break;
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: compressedBuffer,
      ContentType: mimeType,
      ACL: "private", // Bucket privado
    });

    await s3Client.send(command);
    return fileName; // Retorna a chave do arquivo
  } catch (err) {
    throw new Error(`Erro ao fazer upload do arquivo ${fileName}: ${err}`);
  }
}

export async function uploadMultipleFilesToS3(
  files: Express.Multer.File[]
): Promise<string[]> {
  const uploads = files.map(async (file) => {
    return uploadFileToS3(file);
  });

  return Promise.all(uploads);
}

export async function getSignedFileUrl(fileKey: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileKey,
    });
    // Gera URL pré-assinada válida por 1 hora
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  } catch (err) {
    throw new Error(`Erro ao gerar URL assinada para ${fileKey}: ${err}`);
  }
}
