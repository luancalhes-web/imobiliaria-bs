// Mensagens de exemplo para testar manualmente o parsing (ver seção de verificação no plano).
export const sampleMessages = [
  {
    text: "gastei 45 no ifood",
    expected: { type: "EXPENSE", category: "Delivery", subcategory: "iFood" },
  },
  {
    text: "recebi 3000 de salário",
    expected: { type: "INCOME", category: "Salário" },
  },
  {
    text: "gastei 120 no mercado",
    expected: { type: "EXPENSE", category: "Mercado/Supermercado" },
  },
  {
    text: "45",
    expected: { needsClarification: true },
  },
  {
    text: "paguei 200 de multa de trânsito",
    expected: { newCategorySuggested: true },
  },
];
