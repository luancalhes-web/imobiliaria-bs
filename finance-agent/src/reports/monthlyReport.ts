import { computeMonthlyAggregate } from "./aggregate";
import { generateReportNarrative } from "../llm/generateReport";

function formatAmount(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function targetPeriod(period: "current" | "previous"): { year: number; month: number } {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  if (period === "previous") {
    month -= 1;
    if (month === 0) {
      month = 12;
      year -= 1;
    }
  }
  return { year, month };
}

export async function buildMonthlyReport(period: "current" | "previous"): Promise<string> {
  const aggregate = await computeMonthlyAggregate(targetPeriod(period));
  const narrative = await generateReportNarrative(aggregate);

  const header = `📈 *Relatório — ${aggregate.periodLabel}*

Receita: R$ ${formatAmount(aggregate.totalIncome)}
Despesa: R$ ${formatAmount(aggregate.totalExpense)}
Saldo: R$ ${formatAmount(aggregate.net)}${
    aggregate.savingsRate !== null ? `\nTaxa de poupança: ${(aggregate.savingsRate * 100).toFixed(0)}%` : ""
  }`;

  return `${header}\n\n${narrative}`;
}
