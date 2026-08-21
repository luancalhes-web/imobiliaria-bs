import { anthropic, MODEL } from "./client";
import { MonthlyAggregate } from "../types";

const SYSTEM_PROMPT = `Você é um gestor de patrimônio pessoal extremamente experiente, meticuloso e dedicado,
cuidando das finanças de um único cliente — como cuidaria das finanças de alguém que quer genuinamente
crescer seu patrimônio ao longo do tempo. Você recebe os números já agregados e corretos de um mês de
receitas e despesas do cliente e escreve uma análise curta e direta em português.

Regras importantes:
- Você está analisando os números REAIS deste cliente, não dando conselhos financeiros genéricos de produtos
  (nada de indicação de investimentos específicos, seguros, ou seelo produto financeiro). Não se apresente como
  consultor financeiro licenciado — você é uma leitura experiente dos hábitos financeiros do próprio cliente.
- Aponte de 1 a 3 observações concretas e específicas (ex: categoria que mais cresceu, tendência preocupante,
  taxa de poupança boa ou ruim), cada uma acompanhada de uma sugestão de ação prática e específica — nunca
  conselhos vagos como "gaste menos" sem contexto.
- Não repita os números exatos em excesso — eles já aparecem em um cabeçalho separado gerado por código. Foque
  na interpretação e no conselho.
- Seja conciso: no máximo alguns parágrafos curtos ou uma lista com poucos itens. Isso será enviado como
  mensagem de chat no Telegram, não um relatório extenso.
- Tom: direto, confiante, encorajador quando fizer sentido, mas honesto quando os números pedem atenção.`;

function formatCategoryLines(categories: MonthlyAggregate["expenseByCategory"]): string {
  return categories
    .map((c) => {
      const deltaText =
        c.deltaPercent === null ? "sem dado do mês anterior" : `${c.deltaPercent > 0 ? "+" : ""}${c.deltaPercent.toFixed(0)}% vs. mês anterior`;
      return `- ${c.categoryName}: R$ ${c.total.toFixed(2)} (${c.percentOfTypeTotal.toFixed(0)}% do total, ${deltaText})`;
    })
    .join("\n");
}

export async function generateReportNarrative(aggregate: MonthlyAggregate): Promise<string> {
  const userContent = `Período: ${aggregate.periodLabel}
Receita total: R$ ${aggregate.totalIncome.toFixed(2)}
Despesa total: R$ ${aggregate.totalExpense.toFixed(2)}
Saldo (receita - despesa): R$ ${aggregate.net.toFixed(2)}
Taxa de poupança: ${aggregate.savingsRate === null ? "não aplicável (sem receita)" : `${(aggregate.savingsRate * 100).toFixed(0)}%`}

Despesas por categoria:
${formatCategoryLines(aggregate.expenseByCategory) || "(nenhuma despesa no período)"}

Receitas por categoria:
${formatCategoryLines(aggregate.incomeByCategory) || "(nenhuma receita no período)"}

Maiores transações do período:
${aggregate.topTransactions.map((t) => `- ${t.date}: R$ ${t.amount.toFixed(2)} — ${t.description} (${t.categoryName})`).join("\n") || "(nenhuma)"}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContent }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("O modelo não retornou texto para o relatório.");
  }
  return textBlock.text;
}
