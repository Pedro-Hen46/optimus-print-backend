import { z } from "zod";

// Schema para criação
export const MasterTableCreateSchema = z.object({
  model: z.string().min(1, "Model é obrigatório"),
  description: z.string().min(1, "Description é obrigatória"),
  type: z.string().min(1, "Type é obrigatório"),
  observation: z.string().optional(),
  value: z.number().optional(),
});

// Schema para atualização
export const MasterTableUpdateSchema = MasterTableCreateSchema.partial();

// Tipo TypeScript derivado do schema
export type MasterTableCreateInput = z.infer<typeof MasterTableCreateSchema>;
export type MasterTableUpdateInput = z.infer<typeof MasterTableUpdateSchema>;
