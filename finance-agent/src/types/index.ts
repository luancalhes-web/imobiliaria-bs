export type TransactionTypeValue = "INCOME" | "EXPENSE";

export interface ParsedTransaction {
  amount: number;
  type: TransactionTypeValue;
  category: string;
  subcategory: string | null;
  description: string;
  date: string | null;
  newCategorySuggested: boolean;
  needsClarification: boolean;
  clarificationQuestion: string | null;
}

export interface CategoryTotal {
  categoryName: string;
  type: TransactionTypeValue;
  total: number;
  percentOfTypeTotal: number;
  previousMonthTotal: number;
  deltaPercent: number | null;
}

export interface MonthlyAggregate {
  periodLabel: string;
  totalIncome: number;
  totalExpense: number;
  net: number;
  savingsRate: number | null;
  expenseByCategory: CategoryTotal[];
  incomeByCategory: CategoryTotal[];
  topTransactions: Array<{
    description: string;
    amount: number;
    categoryName: string;
    date: string;
  }>;
}
