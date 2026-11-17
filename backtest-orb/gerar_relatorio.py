"""Gera relatorio.html a partir de resultados/resultados.json (curvas com Chart.js)."""
import json, os, html
BASE = os.path.dirname(os.path.abspath(__file__))
R = json.load(open(os.path.join(BASE, "resultados", "resultados.json")))
CEN = [("A_1.5", "A · alvo 1,5%"), ("A_2", "A · alvo 2%"), ("B_1.5", "B · alvo 1,5%"), ("B_2", "B · alvo 2%")]

def pct(x, d=1, sinal=True):
    if x is None: return "–"
    s = f"{x*100:+.{d}f}%" if sinal else f"{x*100:.{d}f}%"
    return s.replace(".", ",")
def num(x, d=2):
    return "–" if x is None else f"{x:.{d}f}".replace(".", ",")
def cls(x): return "" if x is None else ("pos" if x > 0 else "neg" if x < 0 else "")

LINHAS = [
    ("Trades executados", lambda g, c: str(g["trades"]), None),
    ("Taxa de acerto", lambda g, c: pct(g.get("acerto"), 0, False), None),
    ("Bateram o alvo", lambda g, c: pct(g.get("pct_alvo"), 0, False), None),
    ("Bateram o stop", lambda g, c: pct(g.get("pct_stop"), 0, False), None),
    ("Fecharam às 16h", lambda g, c: pct(g.get("pct_fim"), 0, False), None),
    ("Retorno total (composto)", lambda g, c: pct(g.get("ret_total")), "ret_total"),
    ("Soma dos retornos", lambda g, c: pct(g.get("ret_soma")), "ret_soma"),
    ("Retorno médio por trade", lambda g, c: pct(g.get("ret_medio"), 3), "ret_medio"),
    ("Payoff (ganho médio / perda média)", lambda g, c: num(g.get("payoff")), None),
    ("Fator de lucro", lambda g, c: num(g.get("fator_lucro")), None),
    ("Drawdown máximo", lambda g, c: pct(g.get("dd_max")), "dd_max"),
    ("Maior sequência de perdas", lambda g, c: str(g.get("max_perdas_seguidas", "–")), None),
]

def tabela(info, chave):
    th = "".join(f"<th>{n}</th>" for _, n in CEN)
    corpo = []
    if chave == "geral":
        for rot, f in [("Dias com sinal", "dias_sinal"), ("Com reteste (trade)", "com_reteste"), ("Sem reteste", "sem_reteste")]:
            corpo.append(f"<tr><td>{rot}</td>" + "".join(f"<td>{info['cenarios'][k][f]}</td>" for k, _ in CEN) + "</tr>")
    for rot, fn, cor in LINHAS:
        tds = []
        for k, _ in CEN:
            g = info["cenarios"][k][chave]
            if not g.get("trades"): tds.append("<td>–</td>"); continue
            tds.append(f"<td class='{cls(g.get(cor)) if cor else ''}'>{fn(g, info['cenarios'][k])}</td>")
        corpo.append(f"<tr><td>{rot}</td>{''.join(tds)}</tr>")
    if chave == "geral":
        tds = []
        for k, _ in CEN:
            e = info["cenarios"][k].get("chegaria_2pct")
            tds.append(f"<td>{e['n']} ({pct(e['pct'],0,False)})</td>" if e else "<td class='muted'>n/a</td>")
        corpo.append(f"<tr class='destaque'><td>Chegariam a +2% sem tocar o stop</td>{''.join(tds)}</tr>")
        corpo.append(f"<tr><td>Comprar e segurar</td><td colspan='4' class='{cls(info['buy_hold'])}'>{pct(info['buy_hold'])}</td></tr>")
    return f"<div class='tw'><table><thead><tr><th></th>{th}</tr></thead><tbody>{''.join(corpo)}</tbody></table></div>"

def curvas(info):
    dias = [d for d, _ in info["bh_curva"]]
    out = {"labels": dias, "bh": [round(v, 4) for _, v in info["bh_curva"]]}
    for k, _ in CEN:
        m = dict(info["cenarios"][k]["curva"]); v = 1.0; s = []
        for d in dias:
            v = m.get(d, v); s.append(round(v, 4))
        out[k] = s
    return out

secoes, dados_js, resumo = [], {}, []
for ativo, info in R["ativos"].items():
    dados_js[ativo] = curvas(info)
    for k, n in CEN:
        g = info["cenarios"][k]["geral"]
        resumo.append(f"<tr><td>{ativo}</td><td>{n}</td><td>{g['trades']}</td><td>{pct(g['acerto'],0,False)}</td>"
                      f"<td class='{cls(g['ret_total'])}'>{pct(g['ret_total'])}</td><td>{num(g['fator_lucro'])}</td>"
                      f"<td class='neg'>{pct(g['dd_max'])}</td><td class='{cls(info['buy_hold'])}'>{pct(info['buy_hold'])}</td></tr>")
    secoes.append(f"""
<section class="ativo" id="{ativo.lower()}">
  <h2>{ativo} <span class="sub">{info['dias_pregao']} pregões · comprar e segurar {pct(info['buy_hold'])}</span></h2>
  <figure><div class="chart"><canvas id="c_{ativo}" aria-label="Curva de capital {ativo}"></canvas></div>
  <figcaption>Capital inicial = 1,00. Linhas da estratégia são compostas trade a trade (100% do capital por trade); a linha cinza é o fechamento diário do ativo dividido pela abertura do primeiro dia.</figcaption></figure>
  <h3>Todos os trades</h3>{tabela(info, 'geral')}
  <div class="duas"><div><h3>Só compras</h3>{tabela(info, 'compras')}</div><div><h3>Só vendas (short)</h3>{tabela(info, 'vendas')}</div></div>
</section>""")

codigo = "".join(f"<details><summary>{n}</summary><pre><code>{html.escape(open(os.path.join(BASE, n)).read())}</code></pre></details>"
                 for n in ["baixar_dados.py", "backtest.py", "gerar_relatorio.py"])
ini, fim = R["periodo"]

page = f"""<title>Backtest ORB com Reteste</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: relatório de mesa de operações, uma coluna, tabelas densas com números tabulares */
:root {{ --bg:#f7f8f7; --card:#ffffff; --fg:#141816; --fg2:#525a56; --line:#dfe3e0; --pos:#0f7a3d; --neg:#c23a2b;
  --s1:#2a78d6; --s2:#eb6834; --s3:#1baf7a; --s4:#b07a00; --bh:#8a8f8c;
  --sans:"IBM Plex Sans",system-ui,sans-serif; --mono:"IBM Plex Mono",ui-monospace,monospace; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:#121514; --card:#1a1e1c; --fg:#eef1ef; --fg2:#a9b1ad; --line:#2c322f; --pos:#3fbf73; --neg:#ec6a5c;
  --s1:#3987e5; --s2:#d95926; --s3:#199e70; --s4:#c98500; --bh:#7c827f; color-scheme:dark }} }}
:root[data-theme="dark"] {{ --bg:#121514; --card:#1a1e1c; --fg:#eef1ef; --fg2:#a9b1ad; --line:#2c322f; --pos:#3fbf73; --neg:#ec6a5c;
  --s1:#3987e5; --s2:#d95926; --s3:#199e70; --s4:#c98500; --bh:#7c827f; color-scheme:dark }}
body {{ background:var(--bg); color:var(--fg); font:15px/1.55 var(--sans); }}
main {{ max-width:1100px; margin:0 auto; padding-block:32px 64px; padding-left:max(16px,env(safe-area-inset-left,0px)); padding-right:max(16px,env(safe-area-inset-right,0px)); display:grid; gap:40px; }}
h1 {{ font-size:28px; font-weight:600; margin:0 0 6px; text-wrap:balance }}
h2 {{ font-size:22px; font-weight:600; margin:0 0 12px; display:flex; flex-wrap:wrap; gap:4px 12px; align-items:baseline }}
h2 .sub {{ font-size:14px; font-weight:400; color:var(--fg2) }}
h3 {{ font-size:13px; text-transform:uppercase; letter-spacing:.06em; color:var(--fg2); margin:20px 0 8px; font-weight:500 }}
p {{ max-width:70ch; margin:0 0 10px }} .muted {{ color:var(--fg2) }}
.regras {{ color:var(--fg2); font-size:14px }} .regras li {{ margin:2px 0 }}
.tw {{ overflow-x:auto; border:1px solid var(--line); border-radius:6px; background:var(--card) }}
table {{ border-collapse:collapse; width:100%; font-variant-numeric:tabular-nums; font-size:14px }}
th, td {{ padding:6px 10px; text-align:right; border-bottom:1px solid var(--line); white-space:nowrap }}
th:first-child, td:first-child {{ text-align:left }} th {{ font-weight:500; color:var(--fg2); font-size:13px }}
tbody tr:last-child td {{ border-bottom:0 }} tr.destaque td {{ font-weight:600 }}
.pos {{ color:var(--pos) }} .neg {{ color:var(--neg) }}
.duas {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr)); gap:16px }} .duas > div {{ min-width:0 }}
figure {{ margin:0; background:var(--card); border:1px solid var(--line); border-radius:6px; padding:12px }}
.chart {{ position:relative; height:320px }} figcaption {{ font-size:12px; color:var(--fg2); margin-top:8px }}
nav {{ display:flex; flex-wrap:wrap; gap:8px }} nav a {{ color:var(--fg); border:1px solid var(--line); padding:4px 10px; border-radius:4px; text-decoration:none; font-size:14px }}
nav a:focus-visible, summary:focus-visible {{ outline:2px solid var(--s1); outline-offset:2px }}
details {{ background:var(--card); border:1px solid var(--line); border-radius:6px; margin-bottom:8px }}
summary {{ cursor:pointer; padding:10px 14px; font-family:var(--mono); font-size:14px }}
pre {{ margin:0; padding:14px; overflow-x:auto; font:12.5px/1.5 var(--mono); border-top:1px solid var(--line) }}
.aviso {{ border-left:3px solid var(--s4); padding:8px 14px; background:var(--card); font-size:14px }}
</style>
<main>
<header>
  <h1>Rompimento do 1º candle de 15 min com entrada no reteste</h1>
  <p class="muted">Candles reais de 15 min do pregão regular (9h30–16h00, Nova York), Twelve Data · {ini} a {fim} · custo de 0,05% por trade</p>
  <nav>{''.join(f'<a href="#{a.lower()}">{a}</a>' for a in R['ativos'])}<a href="#codigo">Código</a></nav>
</header>
<section>
  <h2>Resumo</h2>
  <div class="tw"><table><thead><tr><th>Ativo</th><th>Versão</th><th>Trades</th><th>Acerto</th><th>Retorno total</th><th>Fator de lucro</th><th>DD máx.</th><th>Comprar e segurar</th></tr></thead><tbody>{''.join(resumo)}</tbody></table></div>
  <h3>Como foi simulado</h3>
  <ul class="regras">
    <li>Range = máxima e mínima do candle 9h30–9h45. Sinal = primeiro candle a partir das 9h45 que fecha acima da máxima (compra) ou abaixo da mínima (venda). Só o primeiro sinal do dia vale.</li>
    <li>Entrada exatamente na linha rompida, no primeiro candle posterior à confirmação cuja mínima (compra) ou máxima (venda) toca a linha. Sem toque até 16h00, não há trade.</li>
    <li>Stop A = 1,5% da entrada. Stop B = outra ponta do range (compra: mínima; venda: máxima). Alvo = +1,5% ou +2%. Sem alvo nem stop, sai no fechamento das 16h00.</li>
    <li>Stop e alvo no mesmo candle: conta o stop. No próprio candle de entrada só o stop é verificado, porque não dá para saber se a máxima/mínima veio antes do toque.</li>
    <li>Se um candle abre além do stop ou do alvo (gap), a saída é na abertura desse candle.</li>
    <li>Custo de 0,05% descontado uma vez por trade. Retorno total = composto, com 100% do capital por trade. Acerto = trade com retorno líquido acima de zero.</li>
    <li>"Chegariam a +2%": entre os trades com alvo de 1,5%, quantos atingiriam +2% no mesmo dia sem tocar o stop antes (equivale ao alvo batido na rodada com alvo de 2%).</li>
  </ul>
</section>
{''.join(secoes)}
<section id="codigo"><h2>Código</h2><p class="muted">Python 3 + pandas. Ordem: <code>baixar_dados.py</code> → <code>backtest.py</code> → <code>gerar_relatorio.py</code>.</p>{codigo}</section>
</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script>
const D = {json.dumps(dados_js)};
const SER = [["A_1.5","A · alvo 1,5%","--s1",[]],["A_2","A · alvo 2%","--s2",[6,3]],["B_1.5","B · alvo 1,5%","--s3",[]],["B_2","B · alvo 2%","--s4",[6,3]],["bh","Comprar e segurar","--bh",[2,2]]];
const charts = [];
function cor(v) {{ return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }}
function desenhar() {{
  charts.forEach(c => c.destroy()); charts.length = 0;
  const fg2 = cor("--fg2"), line = cor("--line");
  for (const [ativo, d] of Object.entries(D)) {{
    const el = document.getElementById("c_" + ativo); if (!el) continue;
    charts.push(new Chart(el, {{ type: "line",
      data: {{ labels: d.labels, datasets: SER.map(([k, n, c, dash]) => ({{ label: n, data: d[k], borderColor: cor(c), backgroundColor: cor(c),
        borderWidth: 2, borderDash: dash, pointRadius: 0, pointHoverRadius: 4, tension: 0 }})) }},
      options: {{ responsive: true, maintainAspectRatio: false, animation: false, interaction: {{ mode: "index", intersect: false }},
        scales: {{ x: {{ ticks: {{ color: fg2, maxTicksLimit: 8, maxRotation: 0 }}, grid: {{ display: false }} }},
                  y: {{ ticks: {{ color: fg2, callback: v => v.toFixed(2).replace(".", ",") }}, grid: {{ color: line }} }} }},
        plugins: {{ legend: {{ labels: {{ color: fg2, boxWidth: 14, boxHeight: 2 }} }},
          tooltip: {{ callbacks: {{ label: c => c.dataset.label + ": " + c.parsed.y.toFixed(3).replace(".", ",") }} }} }} }} }}));
  }}
}}
if (window.Chart) {{ desenhar(); matchMedia("(prefers-color-scheme: dark)").addEventListener("change", desenhar);
  new MutationObserver(desenhar).observe(document.documentElement, {{ attributes: true, attributeFilter: ["data-theme"] }}); }}
</script>
"""
open(os.path.join(BASE, "relatorio.html"), "w").write(page)
print("relatorio.html gerado")
