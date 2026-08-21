import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

const expenseCategories = [
  "Delivery",
  "Mercado/Supermercado",
  "Moradia",
  "Transporte",
  "Saúde",
  "Lazer",
  "Educação",
  "Assinaturas",
  "Investimentos",
  "Outros",
];

const incomeCategories = ["Salário", "Renda Extra"];

async function main() {
  for (const name of expenseCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, type: TransactionType.EXPENSE },
    });
  }

  for (const name of incomeCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, type: TransactionType.INCOME },
    });
  }

  console.log("Categorias padrão semeadas com sucesso.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
