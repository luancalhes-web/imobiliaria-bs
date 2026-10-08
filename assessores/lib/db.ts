import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// O banco é opcional na fase 0: sem DATABASE_URL o Diretor responde, mas sem histórico.
let sql: NeonQueryFunction<false, false> | null = null;
function db() {
  if (!process.env.DATABASE_URL) return null;
  sql ??= neon(process.env.DATABASE_URL);
  return sql;
}

// Sem banco, a deduplicação fica só na memória da instância.
const seenInMemory = new Set<string>();

export type Role = "user" | "assistant";
export interface StoredMessage {
  role: Role;
  content: string;
}

/**
 * Registra a mensagem recebida. Retorna false se ela já tinha sido processada
 * (a Meta reenvia o webhook quando a resposta demora).
 */
export async function registerIncoming(waMessageId: string, phone: string, content: string): Promise<boolean> {
  const q = db();
  if (!q) {
    if (seenInMemory.has(waMessageId)) return false;
    seenInMemory.add(waMessageId);
    return true;
  }
  const rows = await q`
    INSERT INTO mensagens (wa_message_id, telefone, papel, assessor, conteudo)
    VALUES (${waMessageId}, ${phone}, 'user', NULL, ${content})
    ON CONFLICT (wa_message_id) DO NOTHING
    RETURNING id`;
  return rows.length > 0;
}

export async function saveReply(phone: string, assessor: string, content: string): Promise<void> {
  const q = db();
  if (!q) return;
  await q`
    INSERT INTO mensagens (telefone, papel, assessor, conteudo)
    VALUES (${phone}, 'assistant', ${assessor}, ${content})`;
}

export async function logAction(assessor: string, acao: string, detalhes: unknown): Promise<void> {
  const q = db();
  if (!q) return;
  await q`
    INSERT INTO log_acoes (assessor, acao, detalhes)
    VALUES (${assessor}, ${acao}, ${JSON.stringify(detalhes)})`;
}

/** Últimas mensagens da conversa, da mais antiga para a mais nova (contexto enxuto). */
export async function recentMessages(phone: string, limit = 10): Promise<StoredMessage[]> {
  const q = db();
  if (!q) return [];
  const rows = (await q`
    SELECT papel, conteudo FROM mensagens
    WHERE telefone = ${phone}
    ORDER BY criado_em DESC, id DESC
    LIMIT ${limit}`) as Array<{ papel: Role; conteudo: string }>;
  return rows.reverse().map((r) => ({ role: r.papel, content: r.conteudo }));
}
