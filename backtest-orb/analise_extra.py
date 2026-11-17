"""Hipóteses extras: custo vs. vantagem bruta, filtros combinados e entrada sem reteste."""
import numpy as np, pandas as pd
import analise_perdas as ap
from backtest import metricas, CUSTO

t = ap.rodar()
print(f"Retorno médio por trade ANTES do custo: {(t.ret + CUSTO).mean():+.3%}  (custo {CUSTO:.2%})")

# Os dias SEM reteste: o que teria acontecido entrando no fechamento do candle de confirmação?
def sem_reteste(i, alvo=0.015, stop_pct=0.015, exigir_reteste=None):
    d = ap.dias[i]; o, h, l, c = (d[k].to_numpy() for k in ["open", "high", "low", "close"])
    H, L = h[0], l[0]
    s = next(((1 if c[k] > H else -1, k) for k in range(1, len(d)) if c[k] > H or c[k] < L), None)
    if s is None: return None
    sg, k0 = s
    linha = H if sg == 1 else L
    teve = any((l[k] <= H) if sg == 1 else (h[k] >= L) for k in range(k0 + 1, len(d)))
    if exigir_reteste is not None and teve != exigir_reteste: return None
    e = c[k0]; st = e * (1 - sg * stop_pct); tg = e * (1 + sg * alvo)
    for k in range(k0 + 1, len(d)):
        if (l[k] <= st) if sg == 1 else (h[k] >= st): x = st; break
        if (h[k] >= tg) if sg == 1 else (l[k] <= tg): x = tg; break
    else: x = c[-1]
    return dict(data=d.data[0], ret=sg * (x - e) / e - CUSTO, motivo="")

for nome, f in [("Entrada no rompimento (fechamento da confirmação), todos os sinais", None),
                ("  ... só dias que depois retestaram", True),
                ("  ... só dias que NUNCA retestaram", False)]:
    r = pd.DataFrame([x for x in (sem_reteste(i, exigir_reteste=f) for i in range(len(ap.dias))) if x])
    m = metricas(r)
    print(f"{nome}: n={m['trades']} acerto {m['acerto']:.0%} total {m['ret_total']:+.1%} médio {m['ret_medio']:+.3%} PF {m['fator_lucro']:.2f}")

tend = lambda x: (x["lado"] == "compra") == (x["tendencia"] == "alta")
gap = lambda x: np.sign(x["gap"]) == (1 if x["lado"] == "compra" else -1)
combos = [
    ("Tendência + gap", dict(filtro=lambda x: tend(x) and gap(x))),
    ("Tendência + entrada até 12h", dict(filtro=tend, corte_entrada="12:00")),
    ("Gap + entrada até 12h", dict(filtro=gap, corte_entrada="12:00")),
    ("Tendência + gap + até 12h", dict(filtro=lambda x: tend(x) and gap(x), corte_entrada="12:00")),
    ("Tendência + gap + até 12h + alvo 0,5%", dict(filtro=lambda x: tend(x) and gap(x), corte_entrada="12:00", alvo=0.005)),
    ("Até 12h + alvo 0,5%", dict(corte_entrada="12:00", alvo=0.005)),
]
print(pd.DataFrame([ap.resumo(ap.rodar(**c), n) for n, c in combos]).to_string(index=False))
