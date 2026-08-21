import { Telegraf } from "telegraf";
import { env } from "../config/env";
import { proxyAgent } from "../config/proxyAgent";
import { ownerOnly } from "./auth";
import { registerOnText } from "./handlers/onText";
import { registerConfirmations } from "./handlers/confirmations";
import { registerResumo } from "./handlers/commands/resumo";
import { registerRelatorio } from "./handlers/commands/relatorio";
import { registerCategorias } from "./handlers/commands/categorias";
import { registerAjuda } from "./handlers/commands/ajuda";

export function createBot(): Telegraf {
  const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN, proxyAgent ? { telegram: { agent: proxyAgent } } : undefined);

  bot.use(ownerOnly);

  registerAjuda(bot);
  registerResumo(bot);
  registerRelatorio(bot);
  registerCategorias(bot);
  registerConfirmations(bot);
  registerOnText(bot);

  return bot;
}
