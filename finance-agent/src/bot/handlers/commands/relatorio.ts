import { Telegraf } from "telegraf";
import { buildMonthlyReport } from "../../../reports/monthlyReport";

export function registerRelatorio(bot: Telegraf) {
  bot.command("relatorio", async (ctx) => {
    const arg = ctx.message.text.split(" ").slice(1).join(" ").trim().toLowerCase();
    const period = arg === "anterior" ? "previous" : "current";

    await ctx.reply("Gerando relatório, um instante...");
    try {
      const report = await buildMonthlyReport(period);
      await ctx.reply(report, { parse_mode: "Markdown" });
    } catch (err) {
      console.error("Erro ao gerar relatório:", err);
      await ctx.reply("Não consegui gerar o relatório agora. Tente novamente em instantes.");
    }
  });
}
