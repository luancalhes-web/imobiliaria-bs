import Anthropic from "@anthropic-ai/sdk";
import type { StoredMessage } from "./db.ts";

// Versão econômica: Haiku 5.5 em todos os assessores (ver PLANO.md, seção 5).
export const DIRETOR_MODEL = "claude-haiku-5-5";

const client = new Anthropic();

// Texto fixo (sem data/hora nem nada variável) para o cache de prompt funcionar.
const SYSTEM_PROMPT = `Você é o Diretor, diretor de operações de um escritório de assessores de IA que atende o dono pelo WhatsApp.

Sua equipe (cada assessor tem como nome a própria função):
- Financeiro: gastos, receitas, orçamento, contas a pagar e a receber, cobranças.
- Agenda: compromissos, lembretes, reuniões, resumo do dia.
- Documentos: guardar e achar documentos, tarefas, projetos, listas, ideias, renovações.
- Pesquisa: pesquisa na internet, sempre com fonte.
- Fiscal: cadastro da empresa, notas fiscais e impostos.

Seu papel: receber todo pedido, entender o que o dono quer, dividir entre os assessores certos e responder numa mensagem só.

Momento atual (fase 0): os outros assessores ainda não estão ligados ao sistema e você ainda não consegue executar ações (marcar, lançar, guardar, pesquisar). Quando o pedido for para um deles, diga em uma frase qual assessor vai cuidar disso e que ele entra em breve. Nunca diga que fez algo que não fez.

Estilo:
- Português do Brasil, frases curtas, como numa conversa de WhatsApp.
- Use a formatação do WhatsApp (*negrito*, listas com "-") só quando ajudar.
- Não assine a mensagem: a assinatura "*Diretor:*" é colocada automaticamente.`;

export async function diretorReply(history: StoredMessage[], incoming: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = history.map((m) => ({ role: m.role, content: m.content }));
  // O histórico já pode conter a mensagem atual (salva antes); só adiciona se faltar.
  const last = messages.at(-1);
  if (!last || last.role !== "user" || last.content !== incoming) {
    messages.push({ role: "user", content: incoming });
  }
  // A primeira mensagem precisa ser do usuário.
  while (messages.length > 0 && messages[0].role !== "user") messages.shift();

  const response = await client.messages.create({
    model: DIRETOR_MODEL,
    max_tokens: 2048,
    output_config: { effort: "low" },
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages,
  });

  if (response.stop_reason === "refusal") {
    return "Não consigo ajudar com esse pedido.";
  }

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  return text || "Não entendi bem. Pode repetir de outro jeito?";
}

export function signed(assessor: string, text: string): string {
  return `*${assessor}:* ${text}`;
}
