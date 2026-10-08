# Plano: meus assessores de IA no WhatsApp (cópia do "Meu Assessor")

**Regra do projeto: o site é a referência. Tudo deve ficar idêntico ao meuassessor.com. O que não estiver no site não entra.**
**Exceção: os limites do site (que é um serviço pago). Aqui fica tudo ilimitado, a menos que remover o limite gere custo ou esbarre num limite técnico (ver seção 7).**

Pesquisa feita em 07/10/2026 em meuassessor.com: páginas /assessores, /theo, /martin, /sofi, /luna, /italo, /rita, /funcionalidades, /como-usar e /seguranca.

---

## 1. Como o produto original funciona (resumo)

- Uma **única conversa no WhatsApp** com um "escritório" de assessores. Cada resposta vem assinada pelo assessor responsável (no nosso sistema, a assinatura é só a função: "*Agenda:* Marquei o dentista terça às 10h.").
- Aceita **texto, áudio, foto, PDF e print**.
- O **Diretor** recebe o pedido, divide entre os outros e devolve **uma resposta só**, consolidada.
- Todo registro gera um **recibo** com os botões **Editar** e **Desfazer**, que valem por 24h.
- **Painel web** com uma "mesa" para cada assessor. Os dados vêm da conversa, então não é preciso lançar nada duas vezes.
- Integrações: Google Agenda, Google Meet, Gmail, Open Finance (114 bancos, somente leitura), WhatsApp Business API, Drive próprio.
- Guarda preferências: apelido ("me chama de Rê"), tom ("para de mandar emoji"), datas importantes, fuso horário e horário do resumo. "esquece isso" apaga uma preferência.
- Conta compartilhada: código de convite para sócio, esposa ou secretária, com permissões diferentes para cada um.
- Idiomas: português, inglês e espanhol.
- Nunca pede senha, código ou token.

---

## 2. Lista dos assessores, um por um

No nosso sistema, nenhum assessor tem nome de pessoa: o nome é a própria função, de forma simples.

| No site | Nosso nome |
|---|---|
| Theo | **Diretor** |
| Martin | **Financeiro** |
| Sofi | **Agenda** |
| Luna | **Documentos** |
| Ítalo | **Pesquisa** |
| Rita | **Fiscal** |
| Hugo, Lara, Max, Dante, Iago, Sara, Ravi, Zoe (em seleção) | **Concierge, Nutrição, Treino, Jurídico, Comercial, Conselheiro, Imóveis, Estilo** |

### 2.1 DIRETOR: diretor de operações (o "cérebro", que fala com os outros)
Competências: Gestão de Processos, KPIs, Automação, Delegação, Pendências, Relatórios.

| # | Função | Exemplo |
|---|---|---|
| T1 | Recebe todo pedido e faz a **triagem**: decide qual assessor resolve | áudio "marca reunião com o João e cobra 300 dele" vai para Agenda + Financeiro |
| T2 | **Resposta unificada**: junta o que os outros fizeram numa mensagem só | |
| T3 | **"Lê o seu dia antes de você"**: olha agenda, contas e tarefas e aponta o que importa | |
| T4 | **Pendências**: lista o que está atrasado ou falhou (aviso não entregue, banco desconectado) | |
| T5 | **Priorização** das pendências por urgência | |
| T6 | **Monitoramento 24h** das integrações (banco, Google) | "o Nubank desconectou, reconecte aqui" |
| T7 | **Log de tudo** que os assessores fizeram (no exemplo, 2.610 movimentos em 12 meses) | |
| T8 | **Relatórios / KPIs** do mês | |
| T9 | **Gestão de acesso**: convites, sócios, permissões | "gera um código de convite pra minha sócia", "quem tem acesso à conta?", "meu sócio vê só os gastos da empresa" |
| T10 | **Distribuição** de resumos para outras pessoas | "manda o resumo do dia pra mim e pro Léo" |
| T11 | **Conta PF e PJ** (CPF e CNPJ) | "conecta o banco da empresa no CNPJ também" |

### 2.2 FINANCEIRO: gerente financeiro
Competências: Conciliação Bancária, Fluxo de Caixa, Análise Financeira, Open Finance, Gastos por Categoria, Contas a Receber.

| # | Função | Exemplo |
|---|---|---|
| M1 | Lança gasto ou receita por texto ou áudio, com **categoria automática** | "esqueci de anotar o almoço de ontem, 39" |
| M2 | Gastos **recorrentes** | "minha academia é 89,90 todo mês" |
| M3 | **Parcelados** (até 60x) | "comprei a TV em 10x de 150" |
| M4 | Lê **boleto e comprovante** por foto ou PDF e propõe o lançamento (você confirma com "sim") | |
| M5 | **Orçamento por categoria**, com alerta ao chegar em 70% | "orçamento de 800 por mês pra alimentação" |
| M6 | **Open Finance**, somente leitura: saldo, extrato e fatura sincronizados | "atualiza meu Nubank" |
| M7 | **Consultas** | "qual meu saldo?", "quanto gastei com mercado em 30 dias?", "limite do cartão?" |
| M8 | **Conciliação** linha a linha com o extrato | |
| M9 | **Projeção** do mês e **comprometimento** dos próximos meses | "quanto dos próximos meses já está comprometido?" |
| M10 | **Quanto posso gastar** sem apertar o mês | |
| M11 | **Alertas de anomalia**: assinatura que subiu, cobrança duplicada, fatura acima da média | "Streaming subiu de R$ 39,90 para R$ 55,90" |
| M12 | **Aviso de vencimento** de fatura e contas | |
| M13 | **Contas a receber / empréstimos** | "emprestei 200 pro Lucas", "quem está me devendo?", "recebi os 450 do Rafael" |
| M14 | **Cobrança**: gera link de pagamento e manda no WhatsApp da pessoa, inclusive recorrente | "cobra 300 do João todo dia 5" |
| M15 | **Comparativos** | "compara esse mês com o passado" |
| M16 | **Patrimônio**: saldos e investimentos por tipo (renda fixa, fundos, ações, ETFs, previdência, COE) | |
| M17 | **Relatório em PDF ou planilha** | "me manda um pdf dos gastos de junho" |
| M18 | Por cliente ou fornecedor (PJ) | "quanto recebi da Ótica Vieira esse mês?" |
| | **Regra:** nunca transfere nem paga nada. Só lê e registra. | |

### 2.3 AGENDA: secretária executiva
Competências: Agenda, E-mail, Reuniões, Google Agenda, Lembretes, Atas.

| # | Função | Exemplo |
|---|---|---|
| S1 | Marca compromisso com **linguagem natural** e pergunta o que faltar | "marca dentista terça às dez" |
| S2 | **Recorrência** | "toda segunda 9h aula de inglês" |
| S3 | **Google Agenda nas duas vias**: o que você cria lá o assessor vê, e o que ele cria aparece lá | "puxa minha semana do google agenda" |
| S4 | Lembrete **1h antes**, ou no horário que você pedir | |
| S5 | **Resumo diário** às 7h (horário configurável), em ordem, com o que vence e o que está atrasado | "bom dia! o que eu tenho hoje?" |
| S6 | "**O que vem agora?**" | |
| S7 | **Remarcar** um ou vários compromissos com uma frase, avisando os convidados | "a quarta não dá" |
| S8 | **Horários livres** | "tenho horário livre sexta de manhã?" |
| S9 | **Lembretes soltos** (diário, semanal, mensal, anual) | "me lembra do remédio todo dia 20h" |
| S10 | **Reunião com link do Meet** e convite aos participantes | "alinhamento com os sócios quinta, 1h, com link" |
| S11 | Lembrete da reunião **para todos**, com o link | |
| S12 | **Cancelar e avisar o time** | |
| S13 | **Ata automática** depois da reunião, com tarefas por responsável | "me manda a ata de ontem" |
| S14 | **Conflitos**: olha 14 dias à frente procurando sobreposição | |
| S15 | **Link público de agenda**, tipo Calendly (só mostra horário livre; duração de 15 min a 3h) | "manda o link da minha agenda" |
| S16 | **Aviso de saída** considerando o trânsito | |
| S17 | **E-mail** (Gmail) | |

### 2.4 DOCUMENTOS: organização, documentos e tarefas
Competências: Documentos, Notas Fiscais, Tarefas, Drive, Projetos, Renovações.

| # | Função | Exemplo |
|---|---|---|
| L1 | **Guarda documento** (foto, PDF, print, arquivo de até 50 MB) e põe na pasta certa sozinha | "guarda a apólice do seguro" |
| L2 | **Busca pela descrição**, sem precisar do nome do arquivo | "o contrato do apartamento que assinei em março" |
| L3 | Reconhece o **conteúdo de imagem** | "acha as fotos da praia do ano passado" |
| L4 | **Pastas**: criar, mover, link de compartilhamento, desativar link | "me dá o link da pasta Contratos" |
| L5 | **Lê prazos** dentro do documento e avisa antes | |
| L6 | **Renovações anuais** com 15 dias de antecedência (IPVA, seguro, licenciamento, revisão) | "O IPVA vence em 15 dias. Quer que eu separe o boleto?" |
| L7 | **Tarefas** com prazo e prioridade tirados da frase | "revisar o contrato até quarta" |
| L8 | **Reordena** as tarefas pelo prazo; as atrasadas sobem | |
| L9 | **Projetos**: agrupa tarefas e quebra um projeto em tarefas | "quebra o projeto da mudança em tarefas" |
| L10 | **Concluir tarefa** e ver produtividade | "quantas tarefas você fechou na semana?" |
| L11 | **Listas** (mercado, checklist) | "adiciona sabão em pó na lista" |
| L12 | **Ideias** guardadas sem prazo e achadas por assunto | "o que eu tinha anotado sobre a expansão?" |
| L13 | Passa o gasto da nota para o **Financeiro** lançar | |

### 2.5 PESQUISA: estagiário de pesquisas
Competências: Pesquisas, Cotações, Preços, Regras, Fontes.

| # | Função | Exemplo |
|---|---|---|
| I1 | **Preço médio** de produto | "preço médio desse notebook" (ex.: R$ 2.890, média de 6 anúncios, fonte buscape) |
| I2 | **Cotação** | "quanto tá o euro hoje?" |
| I3 | **Regras e leis em vigor** | "regras do IPVA 2026?", "teto do MEI?" |
| I4 | **Avaliação de lugar** | "esse restaurante é bom mesmo?" |
| I5 | **Comparação** | "qual desses dois fones é melhor?" |
| I6 | **Sempre cita a fonte**, com botão "Ver fonte". Nunca inventa número; se não confirmou, diz isso | |
| I7 | **Entra no meio da resposta de outro assessor** com o dado e a fonte, e o especialista fecha | "esse celular tá caro?": Financeiro abre, Pesquisa traz o preço, Financeiro conclui |
| I8 | **Não manda dados pessoais** para a busca | |
| I9 | **Histórico de pesquisas** por dia | |
| I10 | No site: limite de 5 pesquisas por dia. **Aqui: ilimitado** (ver seção 7) | |

### 2.6 FISCAL: assistente fiscal (nota fiscal)
Competências: Cadastro de Empresas, Emissão de NF, Acompanhamento de NF, Perfil Fiscal, Impostos, Tributos, Alíquota.

| # | Função | Exemplo |
|---|---|---|
| R1 | **Cadastra a empresa** a partir do cartão CNPJ ou do contrato social | |
| R2 | Monta o **perfil fiscal**: regime, atividade, código de serviço, alíquotas | |
| R3 | **Emite a nota pela conversa** e devolve PDF + XML | "nota pra Fulano, consultoria, 2.000" |
| R4 | **Acompanha** a nota até ser autorizada e trata rejeição e cancelamento | |
| R5 | **Calcula o imposto** pelo regime e avisa antes do vencimento (DAS etc.) | |
| R6 | Avisa sobre **mudança de alíquota** e quando o faturamento se aproxima do limite de faixa (ex.: teto do MEI) | |
| R7 | Manda o imposto calculado para o **Financeiro** lançar no fluxo de caixa | |

### 2.7 Assessores "em processo de seleção" no site (ainda não disponíveis lá)
| Assessor | Função |
|---|---|
| **Concierge** | reservas, compras e entregas, dicas da cidade |
| **Nutrição** | cardápio da semana, lista de compras, rotina alimentar |
| **Treino** | treino da semana, cobrança de constância, evolução |
| **Jurídico** | revisa contrato antes de assinar, prazos legais, direitos do dia a dia |
| **Comercial** | follow-up de clientes, propostas e orçamentos, funil organizado |
| **Conselheiro** | decisões difíceis, prós e contras, conversa franca |
| **Imóveis** | busca imóvel, avalia se o preço faz sentido, revisa documentação |
| **Estilo** | looks do dia, guarda-roupa, compras |

---

## 3. Arquitetura proposta (com os créditos da Vercel)

```
Você (WhatsApp)
   │
   ▼
WhatsApp Cloud API (Meta, oficial)  ──webhook──►  Vercel (Next.js, função /api/whatsapp)
                                                     │
                                                     ▼
                                       DIRETOR (orquestrador, Claude API)
          ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
          ▼              ▼              ▼              ▼              ▼              ▼
     Financeiro       Agenda       Documentos       Pesquisa        Fiscal        (fase 2)
          │              │              │              │              │
    Pluggy/Belvo     Google Agenda  Vercel Blob    web search    Focus NFe /
   (Open Finance)    + Meet         + Postgres                   NFE.io
          │
          ▼
   Banco de dados (Neon/Supabase Postgres)
   + Vercel Cron / Upstash QStash (resumo 7h, lembretes)
```

**Como os assessores "conversam entre si":** no WhatsApp tudo acontece numa única conversa com você. A conversa entre os agentes acontece no servidor: o Diretor chama cada especialista como uma "ferramenta" (sub-agente), junta os resultados e responde. Cada mensagem enviada leva a função do assessor em negrito (ex.: *Financeiro:*).

**Peças e serviços:**
| Peça | Opção recomendada | Para quê |
|---|---|---|
| Canal | **WhatsApp Cloud API** (Meta), com um número só para o bot | Oficial e sem risco de banimento. Funciona por webhook, então roda na Vercel |
| Servidor | **Vercel** (Next.js) | O webhook recebe as mensagens. Serverless "acorda" a cada mensagem, então fica 24h no ar sem custo parado |
| Tarefas agendadas | **Vercel Cron** (resumo das 7h, varreduras diárias) + **Upstash QStash** (lembrete no minuto exato) | No plano Hobby o Vercel Cron só roda 1x por dia, então lembretes precisos precisam do QStash ou do plano Pro |
| IA | **Claude API** (cobrada à parte; o plano Pro do Claude não cobre robôs). Modelo **Haiku 5.5** em todos os assessores; só o Diretor sobe para Sonnet 5.5 se errar a triagem | Cérebro de cada assessor |
| Áudio | Transcrição (Whisper/Deepgram ou similar) | "manda áudio" |
| Banco de dados | Postgres (Neon ou Supabase, os dois integram com a Vercel) | Lançamentos, tarefas, preferências, log do Diretor |
| Arquivos | **Vercel Blob** ou Supabase Storage | O "Drive" do assessor Documentos |
| Agenda | Google Calendar API + Meet (OAuth da sua conta) | Agenda |
| Bancos | **Pluggy** ou **Belvo** (agregadores de Open Finance, pagos) | Financeiro. Começar com lançamento manual e entrar com o Open Finance depois |
| Nota fiscal | **Focus NFe**, **NFE.io** ou **PlugNotas** (API de NFS-e) | Fiscal |
| Cobrança | **Asaas** ou **Mercado Pago** (link de pagamento / Pix) | Financeiro M14 |
| Pesquisa | Ferramenta de web search da Claude API | Pesquisa, com fontes e sem limite |

---

## 4. Plano de ação por fases

### Fase 0: Fundação (semana 1)
> **Código pronto** na pasta `assessores/` (passo a passo em `assessores/README.md`). Falta você criar as contas (Meta, Vercel, Anthropic) e preencher as variáveis.

1. Criar um app na Meta for Developers, ativar o WhatsApp Cloud API e registrar um número novo.
2. Criar o projeto Next.js na Vercel com a rota `/api/whatsapp` (verificação do webhook + recebimento de mensagens).
3. Criar o banco Postgres e as tabelas `mensagens`, `preferencias`, `log_acoes`, `tarefas`, `lancamentos`, `compromissos`, `documentos`, `notas_fiscais`.
4. Cadastrar as variáveis de ambiente: token do WhatsApp, chave da Claude API, URL do banco.
5. Restringir o bot para responder **só ao seu número** (e aos convidados).
6. **Teste:** você manda "oi" e o Diretor responde.

### Fase 1: Diretor + Documentos + Agenda (semanas 2 e 3)
7. Diretor como orquestrador: triagem (T1), resposta unificada (T2), log (T7) e preferências.
8. Documentos: tarefas, projetos, listas, ideias e prazos (L7 a L12).
9. Documentos: guardar documento e buscar por descrição (L1 a L4).
10. Agenda: Google Agenda nas duas vias, lembretes e resumo das 7h (S1 a S9).
11. Recibo com Editar e Desfazer (botões interativos do WhatsApp).
12. Áudio: transcrição antes de mandar para o Diretor.
13. **Teste igual ao exemplo do site:** um áudio com dois pedidos (marcar reunião + cobrança). O Diretor manda um para a Agenda e o outro para o Financeiro e responde de forma consolidada em cerca de 2 minutos.

### Fase 2: Financeiro + Pesquisa (semanas 4 e 5)
14. Financeiro manual: lançamentos, recorrentes, parcelas, orçamento, consultas, "quem me deve" (M1 a M5, M7, M9, M10, M13, M15).
15. Financeiro lendo boleto e comprovante por foto (M4).
16. Pesquisa: pesquisa com fonte e o padrão "entra no meio da resposta" (I1 a I7).
17. Relatórios em PDF e planilha (M17).

### Fase 3: integrações pagas (semanas 6 a 8)
18. Open Finance via Pluggy ou Belvo: saldo, extrato, conciliação e alertas de anomalia (M6, M8, M11).
19. Cobrança com link de pagamento (M14).
20. Fiscal: cadastro da empresa, perfil fiscal, emissão de NFS-e e acompanhamento (R1 a R7).
21. Agenda: Meet, convites, remarcar e avisar todos, ata (S10 a S13).

### Fase 4: extras
22. Painel web com as "mesas" de cada assessor (na Vercel mesmo).
23. Link público de agenda (S15) e conflitos (S14).
24. Convites e permissões para sócio ou secretária (T9).
25. Os assessores "em seleção" (2.7) só entram quando forem lançados no site, e do jeito que o site os descrever.

---

## 5. Custos estimados: versão econômica (mensal)

O site cobra **R$ 29,90/mês** (plano anual). A meta é ficar nessa faixa ou abaixo.

**Regras de economia (valem para todo o código):**
1. **Haiku 5.5 em todos os assessores**, inclusive o Diretor (US$ 0,10 por milhão de tokens de entrada e US$ 0,50 de saída). Se o Diretor errar a triagem, só ele sobe para o Sonnet 5.5.
2. **Sem IA no que é repetitivo:** lembretes, resumo das 7h, alertas de vencimento e de orçamento são montados por código a partir do banco de dados.
3. **Prompt caching:** as instruções fixas de cada assessor ficam em cache (leitura a ~1/10 do preço).
4. **Contexto enxuto:** só as últimas mensagens e os dados do assunto, nunca o histórico inteiro.
5. **Um especialista por pedido simples:** o Diretor encaminha direto, sem rodada extra.
6. **Mensagens proativas dentro da janela de 24h** do WhatsApp sempre que possível (de graça).

| Item | Por mês (uso pesado, ~40 msgs/dia) |
|---|---|
| IA (Claude API) | R$ 8 a R$ 20 |
| WhatsApp | R$ 0 a R$ 5 |
| Pesquisa (web search) e transcrição de áudio | R$ 3 a R$ 8 |
| Vercel, banco de dados, arquivos | R$ 0 (créditos e camadas grátis) |
| **Total** | **R$ 11 a R$ 33** (uso leve: abaixo de R$ 15) |

**Fora dessa conta (fase 3, opcionais):** Open Finance (Pluggy/Belvo) e emissão de nota fiscal (Focus NFe/NFE.io) têm mensalidade própria e precisam ser cotados. Cobrança (Asaas) é só uma taxa por cobrança paga.

## 6. Pontos de atenção
- **Grupo de WhatsApp com vários bots:** a API oficial funciona melhor em conversa 1:1. Por isso a recomendação é a mesma do site original: uma conversa só, com cada assessor assinando a sua mensagem.
- **Libs não oficiais** (Baileys/Evolution API) permitem grupos, mas precisam de um servidor ligado 24h (não roda na Vercel) e têm risco de banimento do número.
- **Mensagens proativas** (resumo diário, alertas) fora da janela de 24h exigem templates aprovados pela Meta.
- **Segurança:** o bot nunca move dinheiro (Open Finance é somente leitura) e só responde a números autorizados.

---

## 7. Limites do site vs. o nosso sistema

Regra: se tirar o limite não custa nada, fica **ilimitado**. Se custa ou se existe um limite técnico de outra empresa, está explicado abaixo.

| Limite no site | O que muda para você | Decisão |
|---|---|---|
| Pesquisa: **5 pesquisas por dia** | Cada pesquisa custa centavos na Claude API (cerca de US$ 0,01 por busca, mais o texto processado). Mesmo 50 por dia dariam poucos dólares por mês | **Ilimitado** |
| Parcelamento **até 60x** | Não custa nada | **Ilimitado** |
| Editar/Desfazer **só por 24h** | Não custa nada. Você pode corrigir qualquer lançamento a qualquer momento | **Sem prazo** |
| Conflitos de agenda **só 14 dias à frente** | Não custa nada | **Agenda inteira** (todos os compromissos futuros) |
| Link público de agenda: duração de **15 min a 3h** | Não custa nada | **Qualquer duração** |
| Arquivos de **até 50 MB** | Esse limite vem do WhatsApp, não do site. A API do WhatsApp aceita documento de até 100 MB, imagem até 5 MB, áudio e vídeo até 16 MB. Armazenamento no Vercel Blob/Supabase tem camada grátis e depois custa centavos por GB | **O máximo que o WhatsApp deixar** (100 MB por documento) |
| Mensagens, notas, lembretes, documentos e usuários | Já são ilimitados no site | **Ilimitado** |
| Mensagens que **você** manda para os assessores | A conversa iniciada por você é grátis no WhatsApp; o único custo é a Claude API, de centavos por mensagem | **Ilimitado** |

**Configurações padrão do site** (não são limites, são valores iniciais; mantemos iguais e você pode mudar falando com o assessor):
- Lembrete 1h antes do compromisso
- Aviso de renovação 15 dias antes
- Alerta de orçamento ao chegar em 70%
- Resumo do dia às 7h
- Duração padrão de 30 min por compromisso
- Mapa de calor de 28 dias no painel da Agenda

**Os únicos pontos que custam e não dá para zerar:**
1. **Mensagens que o robô inicia** (resumo das 7h, alertas, lembretes, cobranças para terceiros) quando você não falou com ele nas últimas 24h. O WhatsApp cobra por mensagem de *template*: centavos de real cada uma. Quem usa todo dia quase sempre está dentro da janela de 24h, e aí é grátis.
2. **Open Finance (Pluggy/Belvo), nota fiscal (Focus NFe/NFE.io) e cobrança (Asaas)** cobram por uso das empresas parceiras. O limite delas é o plano que você contratar.
3. **Bancos disponíveis:** o site fala em 114 instituições. Esse número depende do agregador escolhido, não de nós.
