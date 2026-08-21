import cron from "node-cron";
import { Telegraf } from "telegraf";
import { env } from "../config/env";
import { buildMonthlyReport } from "../reports/monthlyReport";

export function registerMonthlyJob(bot: Telegraf) {
  cron.schedule(
    "0 8 1 * *",
    async () => {
      try {
        const report = await buildMonthlyReport("previous");
        await bot.telegram.sendMessage(env.TELEGRAM_OWNER_ID, report, { parse_mode: "Markdown" });
      } catch (err) {
        console.error("Erro ao gerar relatório mensal agendado:", err);
      }
    },
    { timezone: env.TZ }
  );
}
