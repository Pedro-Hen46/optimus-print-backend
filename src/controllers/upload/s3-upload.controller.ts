import { Request, Response } from "express";

import {
  getSignedFileUrl,
  uploadFileToS3,
  uploadMultipleFilesToS3,
} from "../../repositories/s3-upload.repository";
import { prisma } from "../../lib/prisma";
import {
  FileUploadSchema,
  MultipleFileUploadSchema,
} from "../../schemas/s3-upload.schama";

export async function uploadSingle(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const validatedData = FileUploadSchema.parse(file);
    const fileKey = await uploadFileToS3(validatedData);

    // Salvar no Prisma
    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        fileKey,
        mimeType: file.mimetype,
      },
    });

    return res.status(201).json({ id: uploadedFile.id, fileKey });
  } catch (error) {
    console.error("Error uploading single file:", error);
    return res.status(400).json({ error: "Falha ao fazer upload do arquivo" });
  }
}

export async function uploadMultiple(req: Request, res: Response) {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const validatedFiles = MultipleFileUploadSchema.parse(files);
    const fileKeys = await uploadMultipleFilesToS3(validatedFiles);

    // Salvar cada arquivo no Prisma
    const uploadedFiles = await Promise.all(
      fileKeys.map((fileKey, index) =>
        prisma.uploadedFile.create({
          data: {
            fileKey,
            mimeType: files[index].mimetype,
          },
        })
      )
    );

    return res.status(201).json({
      files: uploadedFiles.map((file) => ({
        id: file.id,
        fileKey: file.fileKey,
      })),
    });
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    return res
      .status(400)
      .json({ error: "Falha ao fazer upload dos arquivos" });
  }
}

export async function getSignedUrl(req: Request, res: Response) {
  try {
    const { fileId } = req.params;
    const file = await prisma.uploadedFile.findUnique({
      where: { id: fileId },
    });
    if (!file) {
      return res.status(404).json({ error: "Arquivo não encontrado" });
    }
    const signedUrl = await getSignedFileUrl(file.fileKey);
    return res.json({ file: signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return res.status(500).json({ error: "Falha ao gerar URL assinada" });
  }
}
