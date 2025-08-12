import { z } from "zod";

export const StockPrinterCreateSchema = z.object({
  serialNumber: z
    .string()
    .min(3, "Número de série deve ter pelo menos 3 caracteres"),
  modelId: z.string().uuid("ID do modelo inválido"),
  userId: z.string(),
  counterPb: z.number().int().nonnegative().optional().default(0),
  counterColor: z.number().int().nonnegative().optional().default(0),
  isColor: z.boolean().default(false),
  state: z.enum(["NOVO", "SEMINOVO", "RECONDICIONADO"]),
  destiny: z.enum(["LOCACAO", "VENDA", "PARTICULAR"]),
  observations: z.string().optional(),
});

export const StockPrinterUpdateSchema =
  StockPrinterCreateSchema.partial().extend({
    serialNumber: z.string().min(3).optional(),
  });

export type StockPrinterCreateInput = z.infer<typeof StockPrinterCreateSchema>;
export type StockPrinterUpdateInput = z.infer<typeof StockPrinterUpdateSchema>;
