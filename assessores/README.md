# Assessores: fase 0

Webhook do WhatsApp rodando na Vercel. Você manda mensagem e o **Diretor** responde (Claude Haiku 5.5).
Os outros assessores entram nas próximas fases (ver `../plano-assessores/PLANO.md`).

## O que já funciona
- Recebe mensagens do WhatsApp (API oficial da Meta) e confere a assinatura de segurança.
- Só responde aos números de `ALLOWED_NUMBERS` (aceita celular com ou sem o nono dígito).
- O Diretor responde assinando `*Diretor:*` e usa as últimas 10 mensagens como contexto.
- Se a Meta reenviar a mesma mensagem, ela não é respondida duas vezes.
- Áudio, foto e PDF recebem um aviso de que chegam na fase 1.

## Passo a passo para colocar no ar

### 1. Chave do Claude
1. Entre em console.anthropic.com, coloque crédito (US$ 5 duram bastante no Haiku 5.5).
2. Em **API Keys**, crie uma chave. Guarde-a: é o `ANTHROPIC_API_KEY`.

### 2. WhatsApp (Meta)
1. Entre em developers.facebook.com > **Meus apps** > **Criar app** > tipo **Empresa**.
2. Adicione o produto **WhatsApp**. A Meta dá um número de teste grátis.
3. Em **WhatsApp > Configuração da API**, anote:
   - **Identificação do número de telefone**: é o `WHATSAPP_PHONE_NUMBER_ID`;
   - **Token de acesso**: é o `WHATSAPP_TOKEN`. O token de teste expira em 24h; para o definitivo, crie um **usuário do sistema** no Gerenciador de Negócios com permissão `whatsapp_business_messaging` e gere um token permanente.
4. Ainda nessa tela, em **Para**, cadastre o seu celular (o número de teste só fala com números cadastrados).
5. Em **Configurações do app > Básico**, copie a **Chave secreta do app**: é o `WHATSAPP_APP_SECRET`.

### 3. Vercel
1. Em vercel.com > **Add New > Project**, importe o repositório `imobiliaria-bs`.
2. Em **Root Directory**, escolha `assessores`.
3. Em **Environment Variables**, preencha tudo do `.env.example`:
   - `WHATSAPP_VERIFY_TOKEN`: invente uma senha qualquer (ex.: `meu-escritorio-123`);
   - `ALLOWED_NUMBERS`: o seu celular com DDI e DDD (ex.: `5511999998888`).
4. Clique em **Deploy**. Anote a URL (ex.: `https://assessores-xxx.vercel.app`).

### 4. Banco de dados (pode ficar para depois)
1. No projeto da Vercel, aba **Storage > Create Database > Neon (Postgres)**. A Vercel cria o `DATABASE_URL` sozinha.
2. No painel do Neon, abra o **SQL Editor**, cole o conteúdo de `db/schema.sql` e rode.
3. Faça **Redeploy** na Vercel.

Sem banco, o Diretor responde, mas não lembra das mensagens anteriores.

### 5. Ligar o WhatsApp na Vercel
1. Na Meta, vá em **WhatsApp > Configuração** > **Webhook > Editar**:
   - **URL de callback**: `https://SUA-URL.vercel.app/api/whatsapp`;
   - **Token de verificação**: o mesmo `WHATSAPP_VERIFY_TOKEN`.
2. Clique em **Verificar e salvar**.
3. Em **Campos do webhook**, assine **messages**.

### 6. Teste
Mande "oi" para o número de teste. O Diretor deve responder em alguns segundos.
Se não responder: Vercel > projeto > **Logs**.

## Desenvolvimento
```bash
npm install
npm test        # testes
npm run typecheck
npm run build
```
