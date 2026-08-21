import { Markup, Telegraf } from "telegraf";
import { TransactionType } from "@prisma/client";
import { getPending, clearPending } from "../pendingStore";
import { getOrCreateCategory, listCategories } from "../../db/categories";
import { createTransaction } from "../../db/transactions";

export function registerConfirmations(bot: Telegraf) {
  bot.action("tx_confirm", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    const pending = getPending(chatId);
    if (!pending) {
      await ctx.answerCbQuery("Nada pendente para confirmar.");
      return;
    }

    const { parsed, rawMessage } = pending;
    if (parsed.amount === null || parsed.type === null || parsed.category === null) {
      await ctx.answerCbQuery("Dados incompletos, não foi possível salvar.");
      return;
    }

    const category = await getOrCreateCategory(parsed.category, parsed.type as TransactionType);

    await createTransaction({
      date: parsed.date ? new Date(parsed.date) : new Date(),
      amount: parsed.amount,
      type: parsed.type as TransactionType,
      categoryId: category.id,
      subcategory: parsed.subcategory,
      description: parsed.description ?? rawMessage,
      rawMessage,
    });

    clearPending(chatId);
    await ctx.editMessageText("Salvo ✅");
    await ctx.answerCbQuery();
  });

  bot.action("tx_cancel", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    clearPending(chatId);
    await ctx.editMessageText("Ok, descartado.");
    await ctx.answerCbQuery();
  });

  bot.action("tx_edit_category", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    const pending = getPending(chatId);
    if (!pending) {
      await ctx.answerCbQuery("Nada pendente para editar.");
      return;
    }

    const categories = await listCategories();
    const buttons = categories.map((c) => [Markup.button.callback(`${c.name} (${c.type})`, `tx_setcat:${c.id}`)]);

    await ctx.editMessageText("Escolha a categoria correta:", Markup.inlineKeyboard(buttons));
    await ctx.answerCbQuery();
  });

  bot.action(/^tx_setcat:(.+)$/, async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    const pending = getPending(chatId);
    if (!pending) {
      await ctx.answerCbQuery("Nada pendente para editar.");
      return;
    }

    const categoryId = ctx.match[1];
    const categories = await listCategories();
    const category = categories.find((c) => c.id === categoryId);
    if (!category) {
      await ctx.answerCbQuery("Categoria não encontrada.");
      return;
    }

    pending.parsed.category = category.name;
    pending.parsed.type = category.type;

    await ctx.editMessageText(
      `Categoria atualizada para ${category.name}.\n\nConfirmar?`,
      Markup.inlineKeyboard([
        [Markup.button.callback("✅ Confirmar", "tx_confirm"), Markup.button.callback("❌ Cancelar", "tx_cancel")],
      ])
    );
    await ctx.answerCbQuery();
  });
}
