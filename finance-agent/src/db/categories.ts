import { TransactionType } from "@prisma/client";
import { prisma } from "./prisma";

export function listCategories() {
  return prisma.category.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }] });
}

export function findCategoryByName(name: string) {
  return prisma.category.findUnique({ where: { name } });
}

export function createCategory(name: string, type: TransactionType, isCustom = true) {
  return prisma.category.create({ data: { name, type, isCustom } });
}

export async function getOrCreateCategory(name: string, type: TransactionType) {
  const existing = await findCategoryByName(name);
  if (existing) return existing;
  return createCategory(name, type, true);
}
