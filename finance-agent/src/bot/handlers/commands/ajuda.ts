import { Telegraf } from "telegraf";

const HELP_TEXT = `👋 Eu sou seu assistente financeiro pessoal.

*Como registrar uma transação*
Basta me mandar uma mensagem descrevendo o que aconteceu, por exemplo:
- "gastei 45 no ifood"
- "recebi 3000 de salário"
- "paguei 120 no mercado"

Eu vou interpretar, sugerir a categoria e pedir para você confirmar antes de salvar.

*Comandos disponíveis*
/resumo — resumo rápido do mês atual (receita, despesa, saldo, maiores gastos)
/relatorio — relatório completo do mês atual com análise e recomendações
/relatorio anterior — relatório completo do mês passado
/categorias — lista as categorias de receita e despesa
/ajuda — mostra esta mensagem

Todo dia 1 de cada mês, eu te mando automaticamente o relatório do mês anterior.`;

export function registerAjuda(bot: Telegraf) {
  bot.command("ajuda", async (ctx) => {
    await ctx.reply(HELP_TEXT, { parse_mode: "Markdown" });
  });

  bot.start(async (ctx) => {
    await ctx.reply(HELP_TEXT, { parse_mode: "Markdown" });
  });
}
