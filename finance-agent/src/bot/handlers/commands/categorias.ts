import { Telegraf } from "telegraf";
import { listCategories } from "../../../db/categories";

export function registerCategorias(bot: Telegraf) {
  bot.command("categorias", async (ctx) => {
    const categories = await listCategories();
    const income = categories.filter((c) => c.type === "INCOME");
    const expense = categories.filter((c) => c.type === "EXPENSE");

    const format = (list: typeof categories) =>
      list.map((c) => `- ${c.name}${c.isCustom ? " (criada pela IA)" : ""}`).join("\n") || "(nenhuma)";

    await ctx.reply(
      `📂 Categorias de despesa:\n${format(expense)}\n\n📂 Categorias de receita:\n${format(income)}`
    );
  });
}
