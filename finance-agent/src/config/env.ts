import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, "TELEGRAM_BOT_TOKEN é obrigatório"),
  TELEGRAM_OWNER_ID: z.string().min(1, "TELEGRAM_OWNER_ID é obrigatório"),
  ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY é obrigatório"),
  ANTHROPIC_MODEL: z.string().default("claude-sonnet-5"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatório"),
  TZ: z.string().default("America/Sao_Paulo"),
  NODE_ENV: z.string().default("development"),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Variáveis de ambiente inválidas ou faltando:");
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();
