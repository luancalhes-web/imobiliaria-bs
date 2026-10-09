export const metadata = { title: "Política de Privacidade | Assessores" };

export default function Privacidade() {
  return (
    <main style={{ maxWidth: 720, lineHeight: 1.6 }}>
      <h1>Política de Privacidade</h1>
      <p>Última atualização: 9 de outubro de 2026.</p>

      <h2>O que é este serviço</h2>
      <p>
        Assessores é um assistente pessoal de uso privado que funciona pelo WhatsApp. Ele atende apenas os números
        autorizados pelo próprio dono e não é oferecido ao público.
      </p>

      <h2>Dados coletados</h2>
      <p>
        Coletamos apenas o que é enviado na conversa do WhatsApp: número de telefone, texto das mensagens e, quando
        enviados, arquivos como fotos, áudios e documentos. Esses dados são usados exclusivamente para responder aos
        pedidos feitos na conversa.
      </p>

      <h2>Com quem os dados são compartilhados</h2>
      <p>
        As mensagens são processadas pela Meta (WhatsApp Business Platform), pela Anthropic (modelo de IA que gera as
        respostas) e pela Vercel (hospedagem). Os dados não são vendidos nem compartilhados para publicidade.
      </p>

      <h2>Armazenamento</h2>
      <p>
        O histórico da conversa fica guardado em banco de dados privado, acessível apenas ao dono do serviço, pelo
        tempo necessário para o funcionamento do assistente.
      </p>

      <h2>Exclusão de dados</h2>
      <p>
        Para pedir a exclusão dos seus dados, envie a mensagem &quot;apagar meus dados&quot; na conversa. A exclusão é feita em até 30 dias.
      </p>

      <h2>Contato</h2>
      <p>Pela própria conversa do WhatsApp com o assistente.</p>
    </main>
  );
}
