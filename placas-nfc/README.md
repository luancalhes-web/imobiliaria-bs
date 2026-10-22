# Placas NFC de avaliação · Baixada Santista

Negócio do Luan: vender placas NFC + QR code ("aproxime o celular") que levam o cliente direto para a tela de avaliação no Google (ou para o perfil do Instagram). Prospecção 100% pelo WhatsApp.

## Produto e preço

- Modelos: **Google azul**, **Google preta**, **Instagram rosa**, **Instagram preta**. Não personalizadas para o cliente final. Vêm com adesivo.
- **R$ 80 cada** · **3 ou mais: R$ 75 cada** · Google + Instagram = R$ 160. Pagamento único, sem mensalidade. Pix na entrega.
- O **chip NFC** é gravado com o app **NFC Tools** e o **QR code** é cadastrado pelo Luan com o mesmo link (o QR vem para cadastrar o site).
- Link de avaliação do Google: `https://search.google.com/local/writereview?placeid=<PLACE_ID>` (o painel já tem o botão "Copiar link de avaliação" por comércio).

## Onde vende

Santos, São Vicente, Praia Grande e Guarujá. O Luan mora no **Itararé, São Vicente**. Tem **2 números de WhatsApp**.

## Painel de prospecção

- **https://claude.ai/artifact/FW3t5ycv2bp3snLosBLTxL** ("Placas Baixada", artifact privado do Luan)
- Progresso sincroniza na nuvem (db do artifact) entre celular e PC, logado na mesma conta do Claude.
- 543 comércios tirados do Google Maps em 01/10/2026: nota 4,3+, celular cadastrado, concorrente do mesmo tipo a até 2,5 km com 2x+ avaliações (até 800). Cada cartão: WhatsApp com "oi" pronto, roteiro do áudio, link de avaliação, status (Novo → Chamado → Respondeu → Negociando → Fechou/Perdido), follow-ups de 2 e 5 dias e pedido de indicação 7 dias após a entrega.
- Regras de comparação pedidas pelo Luan: **quiosque × quiosque** (pé na areia), **bar × bar**, **restaurante × restaurante**. Sem um maior por perto: quiosque é comparado com bar/restaurante **de frente pra praia** (o cartão avisa). Buffets, salgaderias e redes grandes ficam fora da comparação.
- Fonte do painel e scripts de coleta (Google Maps) ficaram no scratchpad da sessão web; para atualizar a lista, recriar a coleta.

## Método (base: donodapraca.com.br, Gabriel Pezzuol)

Ordem da conversa: **oi → áudio → vídeo de prova → esperar reagir → preço → pergunta de escolha → entrega**. Mandar uma coisa por vez. Meta: 20 chamadas por número por dia (começar com 10–15 para não bloquear o número).

## Scripts que funcionaram

**Oi (atual, desde 22/10/2026):** "Bom dia, tudo bem?? Esse é o número do [nome curto]?" (Bom dia / Boa tarde / Boa noite pela hora). Nome curto, como uma pessoa falaria: "Dra. Fernanda Pires | Biomedicina Estética em São Vicente SP" → "da Dra. Fernanda"; "Clínica de estética de sobrancelhas, unhas e facial dra Claudia" → "da Dra. Claudia" / "da estética da Claudia". O painel gera sozinho e tem o campo "Chamar de" para corrigir.

**Áudio (atual), nota 4,8 ou mais:** "Eu vou ser rápido pra não tomar seu tempo, tá? Eu tava dando uma olhada aqui nos [nicho] da região e vi que vocês têm nota [X] no Google, o que tá excelente. Só que vocês têm [N] avaliações, e outros concorrentes da região têm por volta de [faixa] avaliações. Pra quem tá procurando no Google, esse número maior de avaliação acaba passando um pouco mais de credibilidade. / Eu trabalho com uma plaquinha NFC, que é uma placa de avaliação do Google, onde o cliente encosta o celular e já abre direto a tela pra avaliar vocês. / Posso te mandar um vídeo rapidinho mostrando como funciona?"
- **Nunca falar o nome do concorrente.** Faixa = centena de baixo até a centena do concorrente: 753 → "600 a 700". Abaixo de 200: "mais de 100".

**Áudio (atual), nota 4,7 ou menos:** mesmo começo + "vi que vocês têm [N] avaliações e nota [X] no Google, o que dá pra melhorar. O problema é que as pessoas que têm reclamação geralmente são quem lembra de fazer a avaliação no Google, e quem sai satisfeito não lembra." + mesmo parágrafo da plaquinha + "Posso te mandar um vídeo...".

Depois do áudio, sempre fixos: vídeo + foto do produto, e o áudio fixo de cores / "já levo tudo configurado" / preço. Voz clonada na ElevenLabs (feita em 22/10/2026). Plano: caminho semi-automático, fila de 25 por dia, o Luan aperta enviar.

**Antigos (antes de 22/10):** Oi: "Oi, tudo bem? Aqui é o Luan, sou aqui do Itararé, em São Vicente 🙂". Áudio: elogio da nota → "vocês têm X avaliações e o [concorrente], a Y km, tem Z" → temporada → placa → vídeo.

Variações criadas (áudios curtos, ~20 s):
- **Já tem muitas avaliações** (ex.: Quiosque Bom Gosto, 100): centenas de clientes por fim de semana e quase ninguém avalia porque esquece. O concorrente já tem quase 700.
- **Nota mediana** (4,3–4,5): "quem tem reclamação sempre avalia, quem sai feliz esquece". A placa pega o cliente ainda satisfeito e a média sobe. Pet shop: momento em que o tutor busca o pet cheiroso, placa no balcão de entrega.
- **Concorrente do painel não serve** (ex.: Teruo Gastronomia, self-service por quilo no Centro de SV, 4,7/173): comparar com self-services iguais, Espaço da Mama (788) e Danielli (1.353). Argumento: "nota maior que os dois, mas eles aparecem mais". Placa no caixa e na balança.
- **Nicho específico / perfil parado** (Zanotta Fish, peixes e aves, 4,8/205, ~5 avaliações em 6 meses): "o Google entende como perfil parado". Concorrente real: Flora e Fish Aquários (Santos, 397). Havia um perfil possivelmente duplicado "Pet Shop & Aquarismo" no mesmo endereço.
- **Quem parou de responder:** "Com a placa, os clientes avaliam toda semana. O Google vê esse movimento e mostra vocês mais em cima quando alguém procura [nicho] na região. Quer que eu reserve uma?"

**Vídeo de prova (10–15 s, vertical):** placa → encosta o celular → abre a tela de avaliação com as estrelas → (opcional) câmera lendo o QR. Precisa de 2 celulares. Gravar o link da barraca do Luan ou de um conhecido para a demonstração.

**Preço (opções):**
1. Impulsionamento: "Um impulsionamento de uma semana no Instagram custa isso e acaba. A placa fica aí trabalhando todo dia."
2. "Se trouxer um cliente novo só, já se pagou."
3. Custo por dia: ~20 centavos/dia em um ano.
4. Comparar com o que ele vende: quiosque (porção + 2 cervejas), barbearia (2 cortes), pet shop (menos que um banho e tosa), self-service (almoço de 3 clientes).
5. Preço + escolha: "Fica melhor a azul ou a preta? Só a do Google ou já leva a do Instagram junto?"

**Objeções:** "tá caro" (1 cliente paga), "vou pensar" (fechando entregas da semana no bairro, reservo?), "já peço avaliação" (a placa tira o atrito), "vai me colocar em 1º?" (**nunca prometer posição**: dizer "mais em cima" / "entre os primeiros"), "cliente não sabe NFC" (tem QR).

**Follow-up:** D+2 "Conseguiu ver o vídeo?" · D+5 "vou estar no [bairro] fazendo entregas" · 7 dias após a entrega: pedir indicação.

## Próximos passos combinados

- Depois da primeira semana: ajustar scripts com as objeções reais.
- Lista velha (~2 meses) ou acabou: atualizar avaliações e incluir cidades/nichos novos (Cubatão, Mongaguá, academias, clínicas).
- Talvez: roteiro automático no painel para quem já tem 80+ avaliações.

## Histórico

- 2026-10-01 a 2026-10-20: sessão web `session_014moZfXhegfH2TXP56Py93k` (teleport: `claude --teleport session_014moZfXhegfH2TXP56Py93k`). Continuada no PC em 2026-10-22, sessão `c580b587-7784-4248-b997-b02e2fe9c6b6` (`claude --resume c580b587-7784-4248-b997-b02e2fe9c6b6`).
