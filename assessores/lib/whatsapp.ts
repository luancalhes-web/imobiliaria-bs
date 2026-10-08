import { createHmac, timingSafeEqual } from "node:crypto";

// Formato do webhook da WhatsApp Cloud API (só os campos que usamos).
export interface IncomingMessage {
  id: string;
  from: string;
  timestamp: string;
  type: string;
  text?: { body: string };
}

interface WebhookPayload {
  object?: string;
  entry?: Array<{
    changes?: Array<{
      value?: { messages?: IncomingMessage[] };
    }>;
  }>;
}

// A Meta assina cada POST com HMAC-SHA256 do corpo bruto usando a chave secreta do app.
export function isValidSignature(rawBody: string, header: string | null, appSecret: string): boolean {
  if (!header?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", appSecret).update(rawBody, "utf8").digest();
  const received = Buffer.from(header.slice("sha256=".length), "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export function extractMessages(payload: unknown): IncomingMessage[] {
  const p = payload as WebhookPayload;
  if (p?.object !== "whatsapp_business_account") return [];
  return (p.entry ?? []).flatMap((e) =>
    (e.changes ?? []).flatMap((c) => c.value?.messages ?? []),
  );
}

export async function sendText(to: string, body: string): Promise<void> {
  const version = process.env.GRAPH_API_VERSION || "v23.0";
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;
  if (!phoneNumberId || !token) throw new Error("WHATSAPP_PHONE_NUMBER_ID ou WHATSAPP_TOKEN não configurados");

  const res = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  });
  if (!res.ok) {
    throw new Error(`Falha ao enviar mensagem (${res.status}): ${await res.text()}`);
  }
}
