import { TransactionType } from "@prisma/client";
import { prisma } from "./prisma";

export interface CreateTransactionInput {
  date: Date;
  amount: number;
  type: TransactionType;
  categoryId: string;
  subcategory: string | null;
  description: string;
  rawMessage: string;
}

export function createTransaction(input: CreateTransactionInput) {
  return prisma.transaction.create({ data: input });
}

export function findTransactionsInRange(start: Date, end: Date) {
  return prisma.transaction.findMany({
    where: { date: { gte: start, lt: end } },
    include: { category: true },
    orderBy: { date: "asc" },
  });
}
