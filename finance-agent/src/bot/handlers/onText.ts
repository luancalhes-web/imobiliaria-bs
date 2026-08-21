import { Context, Markup } from "telegraf";
import { message } from "telegraf/filters";
import { parseTransaction } from "../../llm/parseTransaction";
import { listCategories } from "../../db/categories";
import { setPending } from "../pendingStore";

function formatAmount(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function buildConfirmationMessage(parsed: {
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  subcategory: string | null;
}): string {
  const emoji = parsed.type === "EXPENSE" ? "💸 Gasto detectado" : "💰 Receita detectada";
  const categoryLine = parsed.subcategory ? `${parsed.category} > ${parsed.subcategory}` : parsed.category;
  return `${emoji}:\nR$ ${formatAmount(parsed.amount)} — ${categoryLine}`;
}

export function registerOnText(bot: import("telegraf").Telegraf) {
  bot.on(message("text"), async (ctx: Context) => {
    const text = (ctx.message as { text: string }).text;
    if (text.startsWith("/")) return; // comandos são tratados em handlers próprios

    const chatId = ctx.chat?.id;
    if (!chatId) return;

    const categories = await listCategories();
    const today = new Date().toISOString().slice(0, 10);

    let parsed;
    try {
      parsed = await parseTransaction(text, today, categories);
    } catch (err) {
      console.error("Erro ao interpretar mensagem:", err);
      await ctx.reply("Não consegui interpretar essa mensagem agora. Tente novamente em instantes.");
      return;
    }

    if (parsed.needsClarification || parsed.amount === null || parsed.type === null || parsed.category === null) {
      await ctx.reply(parsed.clarificationQuestion ?? "Não entendi bem. Pode reformular com o valor e do que se trata?");
      return;
    }

    const confirmation = buildConfirmationMessage({
      amount: parsed.amount,
      type: parsed.type,
      category: parsed.category,
      subcategory: parsed.subcategory,
    });

    setPending(chatId, { parsed, rawMessage: text });

    await ctx.reply(
      `${confirmation}\n"${text}"\n\nConfirmar?`,
      Markup.inlineKeyboard([
        [Markup.button.callback("✅ Confirmar", "tx_confirm"), Markup.button.callback("✏️ Editar categoria", "tx_edit_category")],
        [Markup.button.callback("❌ Cancelar", "tx_cancel")],
      ])
    );
  });
}
