import { createBot } from "./bot/bot";
import { registerMonthlyJob } from "./scheduler/monthlyJob";

async function main() {
  const bot = createBot();
  registerMonthlyJob(bot);

  await bot.launch();
  console.log("Agente financeiro rodando (long polling)...");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main().catch((err) => {
  console.error("Falha ao iniciar o agente:", err);
  process.exit(1);
});
