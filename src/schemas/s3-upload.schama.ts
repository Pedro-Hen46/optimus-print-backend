import { z } from "zod";

export const FileUploadSchema = z.object({
  buffer: z.instanceof(Buffer),
  originalname: z.string().min(1, "Nome do arquivo é obrigatório"),
  mimetype: z
    .string()
    .regex(
      /^image\/(jpeg|jpg|png|webp|tiff|jfif)$/,
      "Formato de arquivo inválido. Use JPEG, PNG, WebP ou TIFF."
    ),
  size: z.number().max(10 * 1024 * 1024, "Arquivo deve ter no máximo 5MB"),
});

export const MultipleFileUploadSchema = z.array(FileUploadSchema);

export type FileUploadInput = z.infer<typeof FileUploadSchema>;
export type MultipleFileUploadInput = z.infer<typeof MultipleFileUploadSchema>;
