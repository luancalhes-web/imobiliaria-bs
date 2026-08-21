import { Telegraf } from "telegraf";
import { computeMonthlyAggregate } from "../../../reports/aggregate";

function formatAmount(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function registerResumo(bot: Telegraf) {
  bot.command("resumo", async (ctx) => {
    const now = new Date();
    const aggregate = await computeMonthlyAggregate({ year: now.getFullYear(), month: now.getMonth() + 1 });

    const topCategories = aggregate.expenseByCategory
      .slice()
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
      .map((c, i) => `${i + 1}. ${c.categoryName}: R$ ${formatAmount(c.total)} (${c.percentOfTypeTotal.toFixed(0)}%)`)
      .join("\n");

    const message = `📊 Resumo — ${aggregate.periodLabel}

Receita: R$ ${formatAmount(aggregate.totalIncome)}
Despesa: R$ ${formatAmount(aggregate.totalExpense)}
Saldo: R$ ${formatAmount(aggregate.net)}
${aggregate.savingsRate !== null ? `Taxa de poupança: ${(aggregate.savingsRate * 100).toFixed(0)}%` : ""}

Maiores categorias de gasto:
${topCategories || "(nenhum gasto ainda este mês)"}`;

    await ctx.reply(message);
  });
}
