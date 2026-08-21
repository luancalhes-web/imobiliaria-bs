import { findTransactionsInRange } from "../db/transactions";
import { MonthlyAggregate, CategoryTotal, TransactionTypeValue } from "../types";

const MONTH_NAMES_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

function monthRange(year: number, month: number) {
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  };
}

function previousMonth(year: number, month: number) {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

export async function computeMonthlyAggregate({ year, month }: { year: number; month: number }): Promise<MonthlyAggregate> {
  const { start, end } = monthRange(year, month);
  const prev = previousMonth(year, month);
  const prevRange = monthRange(prev.year, prev.month);

  const [transactions, prevTransactions] = await Promise.all([
    findTransactionsInRange(start, end),
    findTransactionsInRange(prevRange.start, prevRange.end),
  ]);

  const totalIncome = sum(transactions.filter((t) => t.type === "INCOME").map((t) => Number(t.amount)));
  const totalExpense = sum(transactions.filter((t) => t.type === "EXPENSE").map((t) => Number(t.amount)));
  const net = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? net / totalIncome : null;

  function categoryTotals(type: TransactionTypeValue): CategoryTotal[] {
    const totalForType = type === "INCOME" ? totalIncome : totalExpense;

    const byCategory = new Map<string, number>();
    for (const t of transactions.filter((t) => t.type === type)) {
      byCategory.set(t.category.name, (byCategory.get(t.category.name) ?? 0) + Number(t.amount));
    }

    const prevByCategory = new Map<string, number>();
    for (const t of prevTransactions.filter((t) => t.type === type)) {
      prevByCategory.set(t.category.name, (prevByCategory.get(t.category.name) ?? 0) + Number(t.amount));
    }

    return Array.from(byCategory.entries())
      .map(([categoryName, total]) => {
        const previousMonthTotal = prevByCategory.get(categoryName) ?? 0;
        const deltaPercent = previousMonthTotal > 0 ? ((total - previousMonthTotal) / previousMonthTotal) * 100 : null;
        return {
          categoryName,
          type,
          total,
          percentOfTypeTotal: totalForType > 0 ? (total / totalForType) * 100 : 0,
          previousMonthTotal,
          deltaPercent,
        };
      })
      .sort((a, b) => b.total - a.total);
  }

  const topTransactions = transactions
    .slice()
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 5)
    .map((t) => ({
      description: t.description,
      amount: Number(t.amount),
      categoryName: t.category.name,
      date: t.date.toISOString().slice(0, 10),
    }));

  return {
    periodLabel: `${MONTH_NAMES_PT[month - 1]} de ${year}`,
    totalIncome,
    totalExpense,
    net,
    savingsRate,
    expenseByCategory: categoryTotals("EXPENSE"),
    incomeByCategory: categoryTotals("INCOME"),
    topTransactions,
  };
}
