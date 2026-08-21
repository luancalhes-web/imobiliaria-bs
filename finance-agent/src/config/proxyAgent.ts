import * as http from "http";
import { HttpsProxyAgent } from "https-proxy-agent";

const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;

// Só usado quando o ambiente de execução exige saída via proxy (ex: sandboxes de
// desenvolvimento). Em produção (Railway/Render) HTTPS_PROXY normalmente não está
// definida, e este valor fica undefined — comportamento padrão dos clientes.
// O cast é necessário porque os tipos do https-proxy-agent não implementam toda a
// interface de http.Agent, embora sejam compatíveis em tempo de execução com
// node-fetch e com o SDK da Anthropic.
export const proxyAgent = proxyUrl ? (new HttpsProxyAgent(proxyUrl) as unknown as http.Agent) : undefined;
