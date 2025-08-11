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

export async function uploadSingle(
  req: Request,
  res: Response,
  internalCall = false
) {
  try {
    const file = req.file;
    if (!file) {
      if (internalCall) throw new Error("Nenhum arquivo enviado");
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const validatedData = FileUploadSchema.parse(file);
    const fileKey = await uploadFileToS3(validatedData);

    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        fileKey,
        mimeType: file.mimetype,
      },
    });

    // Se for chamada interna, retorna o objeto para ser usado no create
    if (internalCall) {
      return uploadedFile;
    }

    return res.status(201).json({ id: uploadedFile.id, fileKey });
  } catch (error) {
    console.error("Error uploading single file:", error);
    if (internalCall) throw error;
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

export async function getUrlFileSigned(fileId: string) {
  try {
    const file = await prisma.uploadedFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      console.log("O id da imagem não foi encontrado...");
      return false;
    }

    const signedUrl = await getSignedFileUrl(file.fileKey);

    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return console.log("Falha ao gerar URL assinada");
  }
}

export async function uploadSingleInternal(file: any) {
  try {
    if (!file) {
      console.log("Nenhum arquivo enviado como props");
      return false;
    }

    const validatedData = FileUploadSchema.parse(file);

    if (!validatedData) {
      console.log("O arquivo enviado é incompativel");
      return false;
    }

    const fileKey = await uploadFileToS3(validatedData);

    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        fileKey,
        mimeType: file.mimetype,
      },
    });

    // Se for chamada interna, retorna o objeto para ser usado no create

    return uploadedFile;
  } catch (error) {
    return console.error({ error: "Falha ao fazer upload do arquivo" });
  }
}
