import { anthropic, MODEL } from "./client";
import { parseTransactionToolSchema, parsedTransactionSchema, ParsedTransactionResult } from "./schemas";
import { Category } from "@prisma/client";

const SYSTEM_PROMPT = `Você é o módulo de extração de transações financeiras de um assistente pessoal de finanças.
Sua única tarefa é ler UMA mensagem curta em português (enviada por WhatsApp/Telegram) e extrair os dados
estruturados de uma transação financeira, chamando a ferramenta "registrar_transacao".

Regras:
- Classifique o tipo pelo verbo/contexto: "gastei", "paguei", "comprei" => EXPENSE; "recebi", "ganhei", "caiu", "depositaram" => INCOME.
- Extraia o valor numérico mesmo com formatação informal ("45", "45,00", "45 reais", "45k" = 45000).
- Escolha a categoria mais específica possível. Você recebe a lista de categorias já existentes — reaproveite uma
  existente sempre que ela fizer sentido razoável. Só marque newCategorySuggested=true e proponha um nome novo em
  "category" quando nenhuma categoria existente encaixar bem (ex: um pedido do iFood deve cair em "Delivery", não
  em uma categoria genérica de alimentação, se "Delivery" existir na lista).
- Use "subcategory" para detalhar dentro da categoria quando fizer sentido (ex: category="Delivery", subcategory="iFood").
- Se a mensagem não tiver um valor claro ou não parecer uma transação financeira, defina needsClarification=true,
  preencha clarificationQuestion com uma pergunta curta, e deixe os outros campos como null/false quando não puder
  inferi-los com segurança. NUNCA invente um valor.
- "date": use formato ISO (YYYY-MM-DD) se a mensagem mencionar uma data relativa como "ontem"; caso contrário null.`;

export async function parseTransaction(
  message: string,
  today: string,
  existingCategories: Pick<Category, "name" | "type">[]
): Promise<ParsedTransactionResult> {
  const categoriesList = existingCategories.map((c) => `${c.name} (${c.type})`).join(", ");

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    tools: [parseTransactionToolSchema],
    tool_choice: { type: "tool", name: parseTransactionToolSchema.name },
    messages: [
      {
        role: "user",
        content: `Data de hoje: ${today}\nCategorias existentes: ${categoriesList}\n\nMensagem do usuário: "${message}"`,
      },
    ],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("O modelo não retornou uma chamada de ferramenta estruturada.");
  }

  return parsedTransactionSchema.parse(toolUse.input);
}
