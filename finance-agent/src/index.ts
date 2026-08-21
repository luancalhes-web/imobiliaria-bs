import { createBot } from "./bot/bot";
import { registerMonthlyJob } from "./scheduler/monthlyJob";

const bot = createBot();
registerMonthlyJob(bot);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// bot.launch() só resolve quando o bot para (fica em loop de long-polling) — por
// isso o log de "iniciado" usa o callback onLaunch, chamado logo após o getMe(),
// e os handlers de SIGINT/SIGTERM são registrados antes de chamar launch().
bot
  .launch(() => {
    console.log("Agente financeiro rodando (long polling)...");
  })
  .catch((err) => {
    console.error("Falha ao iniciar o agente:", err);
    process.exit(1);
  });
