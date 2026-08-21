import { z } from "zod";

export const parsedTransactionSchema = z.object({
  amount: z.number().positive().nullable(),
  type: z.enum(["INCOME", "EXPENSE"]).nullable(),
  category: z.string().nullable(),
  subcategory: z.string().nullable(),
  description: z.string().nullable(),
  date: z.string().nullable(),
  newCategorySuggested: z.boolean(),
  needsClarification: z.boolean(),
  clarificationQuestion: z.string().nullable(),
});

export type ParsedTransactionResult = z.infer<typeof parsedTransactionSchema>;

export const parseTransactionToolSchema = {
  name: "registrar_transacao",
  description:
    "Extrai os dados estruturados de uma transação financeira (receita ou despesa) a partir de uma mensagem em português.",
  input_schema: {
    type: "object" as const,
    properties: {
      amount: {
        type: ["number", "null"],
        description: "Valor numérico da transação em reais, ex: 45.00. Null se não for possível identificar um valor.",
      },
      type: {
        type: ["string", "null"],
        enum: ["INCOME", "EXPENSE", null],
        description: "INCOME se é um recebimento/ganho, EXPENSE se é um gasto/pagamento.",
      },
      category: {
        type: ["string", "null"],
        description: "Nome da categoria mais específica, reaproveitando uma categoria existente sempre que fizer sentido.",
      },
      subcategory: {
        type: ["string", "null"],
        description: "Refinamento opcional dentro da categoria, ex: 'iFood' dentro de 'Delivery'.",
      },
      description: {
        type: ["string", "null"],
        description: "Descrição curta e limpa da transação, ex: 'Pedido no iFood'.",
      },
      date: {
        type: ["string", "null"],
        description: "Data da transação em formato ISO (YYYY-MM-DD). Null significa hoje.",
      },
      newCategorySuggested: {
        type: "boolean",
        description: "true se nenhuma categoria existente encaixa bem e uma nova está sendo proposta em 'category'.",
      },
      needsClarification: {
        type: "boolean",
        description: "true se a mensagem não contém uma transação financeira clara (valor ausente/ambíguo).",
      },
      clarificationQuestion: {
        type: ["string", "null"],
        description: "Pergunta curta para esclarecer com o usuário, preenchida apenas quando needsClarification é true.",
      },
    },
    required: [
      "amount",
      "type",
      "category",
      "subcategory",
      "description",
      "date",
      "newCategorySuggested",
      "needsClarification",
      "clarificationQuestion",
    ],
  },
};
