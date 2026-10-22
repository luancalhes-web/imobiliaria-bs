// Monta o roteiro do áudio de cada comércio usando as mesmas funções do painel.
// Uso: node roteiros.js <id> [<id> ...] > roteiros.json   (depois: python gerar_audio.py roteiros.json)
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'painel.html'), 'utf8');
const js = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const leads = JSON.parse(html.match(/<script type="application\/json" id="leads-data">([\s\S]*?)<\/script>/)[1]);
const corte = (de, ate) => { const i = js.indexOf(de); return js.slice(i, js.indexOf(ate, i)); };
const codigo = corte('const PLURAL=', 'const DAY') + corte('const fmt=', 'function toast') +
  corte('/* ---------- como chamar', 'const MSG_PRECO') + '\nfunction st(){return {}}\nreturn msgAudio;';
const msgAudio = new Function(codigo)();

const saida = process.argv.slice(2).map(id => {
  const l = leads.find(x => x.id === id);
  if (!l) throw new Error(`Comércio não encontrado: ${id}`);
  return { id, nome: l.n, texto: msgAudio(l) };
});
process.stdout.write(JSON.stringify(saida, null, 2));
