import { after } from "next/server";
import { diretorReply, signed } from "@/lib/diretor.ts";
import { logAction, recentMessages, registerIncoming, saveReply } from "@/lib/db.ts";
import { isAllowed, parseAllowedNumbers } from "@/lib/phone.ts";
import { extractMessages, isValidSignature, sendText, type IncomingMessage } from "@/lib/whatsapp.ts";

export const runtime = "nodejs";
export const maxDuration = 60;

// Verificação do webhook: a Meta chama GET uma vez ao cadastrar a URL.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// Mensagens recebidas. Responde 200 na hora e processa depois, para a Meta não reenviar.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret || !isValidSignature(rawBody, request.headers.get("x-hub-signature-256"), appSecret)) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const allowed = parseAllowedNumbers(process.env.ALLOWED_NUMBERS);
  const messages = extractMessages(payload).filter((m) => isAllowed(m.from, allowed));

  after(async () => {
    for (const message of messages) {
      try {
        await handleMessage(message);
      } catch (error) {
        console.error("Erro ao processar mensagem", message.id, error);
      }
    }
  });

  return new Response("OK", { status: 200 });
}

async function handleMessage(message: IncomingMessage) {
  if (message.type !== "text" || !message.text?.body) {
    // Áudio, foto e PDF entram na fase 1.
    const isNew = await registerIncoming(message.id, message.from, `[${message.type}]`);
    if (!isNew) return;
    const reply = "Por enquanto só leio mensagens de texto. Áudio, foto e PDF chegam em breve.";
    await sendText(message.from, signed("Diretor", reply));
    await saveReply(message.from, "Diretor", reply);
    return;
  }

  const body = message.text.body;
  const isNew = await registerIncoming(message.id, message.from, body);
  if (!isNew) return;

  const history = await recentMessages(message.from);
  const reply = await diretorReply(history, body);
  await sendText(message.from, signed("Diretor", reply));
  await saveReply(message.from, "Diretor", reply);
  await logAction("Diretor", "resposta", { wa_message_id: message.id });
}
