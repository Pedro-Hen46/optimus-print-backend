import { z } from "zod";

export const CustomerSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  alias: z.string().optional(),
  cnpj: z.string().length(14),
  ie: z.string().optional(),
  telefone: z.string().min(10),
});

export const updateCustomerSchema = CustomerSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Pelo menos um campo deve ser fornecido" }
);
