# Agente Financeiro Pessoal

Assistente financeiro pessoal via Telegram: você digita suas receitas e despesas em
linguagem natural, ele categoriza automaticamente (ex: pedido no iFood → "Delivery"),
guarda tudo num banco de dados e te manda relatórios com análise no estilo de um
gestor de patrimônio experiente — sob demanda ou automaticamente todo início de mês.

## Pré-requisitos

1. **Token do bot no Telegram**: fale com [@BotFather](https://t.me/BotFather) no
   Telegram, use `/newbot` e siga as instruções. Copie o token gerado.
2. **Seu ID numérico do Telegram**: fale com [@userinfobot](https://t.me/userinfobot),
   ele te responde com seu ID numérico. Isso garante que só você consiga usar o bot.
3. **Chave de API da Anthropic**: crie em https://console.anthropic.com/.
4. **Node.js 20+** e **Docker** (para rodar o Postgres localmente).

## Rodando localmente

```bash
cp .env.example .env
# preencha TELEGRAM_BOT_TOKEN, TELEGRAM_OWNER_ID e ANTHROPIC_API_KEY no .env

docker compose up -d          # sobe um Postgres local
npm install
npx prisma migrate dev --name init
npx prisma db seed            # cria as categorias padrão
npm run dev                   # inicia o bot em modo desenvolvimento
```

Depois é só mandar mensagem para o seu bot no Telegram, por exemplo:
`gastei 45 no ifood`.

## Comandos do bot

- Qualquer mensagem de texto é interpretada como uma transação (pede confirmação
  antes de salvar).
- `/resumo` — resumo rápido do mês atual.
- `/relatorio` (ou `/relatorio anterior`) — relatório completo com análise da IA.
- `/categorias` — lista as categorias existentes.
- `/ajuda` — mostra instruções de uso.

## Deploy (Railway, recomendado)

1. Crie um projeto no Railway apontando para este repositório, com o diretório raiz
   do serviço configurado como `finance-agent/`.
2. Adicione o plugin de **PostgreSQL** ao mesmo projeto.
3. Configure as variáveis de ambiente do serviço (mesmas do `.env.example`),
   usando a `DATABASE_URL` gerada pelo plugin do Postgres.
4. Configure o comando de release/deploy para rodar as migrations e o seed:
   `npx prisma migrate deploy && npx prisma db seed`.
5. Como o bot usa long-polling, não é necessário domínio público nem webhook.

Renders alternativos (ex: Render) funcionam da mesma forma, usando o `Dockerfile`
incluso — nesse caso, use um serviço do tipo *Background Worker* (não *Web Service*,
para não sofrer com o "sleep" de inatividade do plano gratuito de web services).
