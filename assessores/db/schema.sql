-- Rode uma vez no banco (Neon: painel > SQL Editor).
-- As tabelas das fases seguintes já ficam criadas para não precisar mexer depois.

CREATE TABLE IF NOT EXISTS mensagens (
  id            BIGSERIAL PRIMARY KEY,
  wa_message_id TEXT UNIQUE,            -- id da Meta; evita processar a mesma mensagem duas vezes
  telefone      TEXT NOT NULL,
  papel         TEXT NOT NULL CHECK (papel IN ('user', 'assistant')),
  assessor      TEXT,                   -- Diretor, Financeiro, Agenda, Documentos, Pesquisa, Fiscal
  conteudo      TEXT NOT NULL,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mensagens_telefone_criado_em ON mensagens (telefone, criado_em DESC);

-- Apelido, tom, fuso, horário do resumo, datas importantes ("esquece isso" apaga)
CREATE TABLE IF NOT EXISTS preferencias (
  telefone      TEXT NOT NULL,
  chave         TEXT NOT NULL,
  valor         TEXT NOT NULL,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (telefone, chave)
);

-- Tudo o que os assessores fizeram (mesa do Diretor)
CREATE TABLE IF NOT EXISTS log_acoes (
  id        BIGSERIAL PRIMARY KEY,
  assessor  TEXT NOT NULL,
  acao      TEXT NOT NULL,
  detalhes  JSONB,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Documentos: tarefas, projetos, listas e ideias
CREATE TABLE IF NOT EXISTS tarefas (
  id           BIGSERIAL PRIMARY KEY,
  tipo         TEXT NOT NULL DEFAULT 'tarefa' CHECK (tipo IN ('tarefa', 'item_lista', 'ideia')),
  titulo       TEXT NOT NULL,
  projeto      TEXT,
  lista        TEXT,
  prioridade   TEXT CHECK (prioridade IN ('urgente', 'alta', 'normal')),
  prazo        TIMESTAMPTZ,
  concluida_em TIMESTAMPTZ,
  criado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Financeiro: gastos, receitas, parcelas, recorrências, a receber
CREATE TABLE IF NOT EXISTS lancamentos (
  id             BIGSERIAL PRIMARY KEY,
  tipo           TEXT NOT NULL CHECK (tipo IN ('gasto', 'receita', 'a_receber', 'a_pagar')),
  descricao      TEXT NOT NULL,
  categoria      TEXT,
  valor_centavos BIGINT NOT NULL,
  data           DATE NOT NULL,
  conta          TEXT,                  -- ex.: "cartão Itaú", "Nubank"
  pessoa         TEXT,                  -- quem deve / a quem se deve
  serie_id       BIGINT,                -- agrupa parcelas e recorrências
  parcela        INT,
  total_parcelas INT,
  quitado_em     TIMESTAMPTZ,
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agenda: compromissos e lembretes
CREATE TABLE IF NOT EXISTS compromissos (
  id              BIGSERIAL PRIMARY KEY,
  titulo          TEXT NOT NULL,
  inicio          TIMESTAMPTZ NOT NULL,
  fim             TIMESTAMPTZ,
  recorrencia     TEXT,                 -- regra RRULE
  lembrar_em      TIMESTAMPTZ,
  lembrete_enviado BOOLEAN NOT NULL DEFAULT false,
  google_event_id TEXT,
  link_reuniao    TEXT,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Documentos: arquivos guardados
CREATE TABLE IF NOT EXISTS documentos (
  id          BIGSERIAL PRIMARY KEY,
  pasta       TEXT NOT NULL DEFAULT 'Geral',
  nome        TEXT NOT NULL,
  descricao   TEXT,                     -- usada na busca por descrição
  etiquetas   TEXT[],
  url         TEXT NOT NULL,            -- Vercel Blob
  tipo_mime   TEXT,
  tamanho     BIGINT,
  vence_em    DATE,                     -- prazos lidos do documento
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fiscal: notas emitidas
CREATE TABLE IF NOT EXISTS notas_fiscais (
  id             BIGSERIAL PRIMARY KEY,
  tomador        TEXT NOT NULL,
  descricao      TEXT NOT NULL,
  valor_centavos BIGINT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pendente',
  pdf_url        TEXT,
  xml_url        TEXT,
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT now()
);
