import { z } from "zod";
import dotenv from "dotenv";

dotenv.config(); // carrega o .env

const envSchema = z.object({
  PORT: z.string().default("3333"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Erro ao carregar variáveis de ambiente!", _env.error.format());
  process.exit(1); // encerra a aplicação
}

export const env = _env.data;
