"""Análise das perdas e teste de variações da estratégia (ORB 15 min + reteste).

Simulador generalizado: mesmas regras do backtest.py, com opções extras
(stop no zero a zero, trailing stop, alvo menor, horário limite, filtros).
Para evitar overfitting: escolhe-se no 1º ano (treino) e confere-se no 2º (teste).
"""
import sys, numpy as np, pandas as pd
from backtest import carregar, metricas, CUSTO

ATIVO = sys.argv[1] if len(sys.argv) > 1 else "AAPL"
df = carregar(ATIVO)
dias = [g.reset_index(drop=True) for _, g in df.groupby("data")]
# contexto diário (só informação disponível antes da abertura)
fech = pd.Series([g.close.iloc[-1] for g in dias])
sma20 = fech.rolling(20).mean().shift(1)
prev = fech.shift(1)


def simular(i, alvo=0.015, stop="pct", stop_pct=0.015, be=None, trail=None,
            corte_entrada="15:45", saida="15:45", lados=("compra", "venda"), filtro=None):
    d = dias[i]
    o, h, l, c = (d[k].to_numpy() for k in ["open", "high", "low", "close"])
    hm = d.datetime.dt.strftime("%H:%M").to_numpy()
    H, L = h[0], l[0]
    s = next(((("compra" if c[k] > H else "venda"), k) for k in range(1, len(d)) if c[k] > H or c[k] < L), None)
    if s is None: return None
    lado, k0 = s
    ctx = dict(data=d.data[0], lado=lado, hora_conf=hm[k0], range_pct=(H - L) / o[0],
               gap=(o[0] / prev[i] - 1) if i else np.nan,
               tendencia=("alta" if prev[i] > sma20[i] else "baixa") if i >= 20 else None,
               esticada=abs(c[k0] - (H if lado == "compra" else L)) / o[0])
    if lado not in lados or (filtro and not filtro(ctx)): return None
    j = next((k for k in range(k0 + 1, len(d)) if hm[k] <= corte_entrada and
              ((lado == "compra" and l[k] <= H) or (lado == "venda" and h[k] >= L))), None)
    if j is None: return dict(ctx, executado=False)
    sg = 1 if lado == "compra" else -1
    e = H if lado == "compra" else L
    if stop == "pct": st = e * (1 - sg * stop_pct)
    elif stop == "range": st = L if lado == "compra" else H
    elif stop == "meio": st = (H + L) / 2
    tg = e * (1 + sg * alvo) if alvo else None
    melhor, pior = e, e            # preço mais favorável / desfavorável já visto (candles fechados)
    fim = max(k for k in range(len(d)) if hm[k] <= saida)
    sai = mot = None
    for k in range(j, fim + 1):
        fav, adv = (h[k], l[k]) if sg == 1 else (l[k], h[k])
        if (adv <= st) if sg == 1 else (adv >= st):
            sai, mot = (st if k == j else (min(o[k], st) if sg == 1 else max(o[k], st))), "stop"
        elif tg and k > j and ((fav >= tg) if sg == 1 else (fav <= tg)):
            sai, mot = (max(o[k], tg) if sg == 1 else min(o[k], tg)), "alvo"
        if k > j: melhor = max(melhor, fav) if sg == 1 else min(melhor, fav)
        pior = min(pior, adv) if sg == 1 else max(pior, adv)
        if mot: break
        # ajustes de stop valem a partir do candle SEGUINTE (conservador)
        ganho = sg * (melhor - e) / e
        if be is not None and ganho >= be:
            st = max(st, e * (1 + CUSTO)) if sg == 1 else min(st, e * (1 - CUSTO))
        if trail is not None and ganho >= trail:
            novo = melhor * (1 - sg * trail)
            st = max(st, novo) if sg == 1 else min(st, novo)
    if mot is None: sai, mot = c[fim], "fim_do_dia"
    r = sg * (sai - e) / e
    return dict(ctx, executado=True, hora_entrada=hm[j], motivo=mot, ret=r - CUSTO,
                mfe=sg * (melhor - e) / e, mae=-sg * (pior - e) / e)


def rodar(**cfg):
    t = pd.DataFrame([x for x in (simular(i, **cfg) for i in range(len(dias))) if x])
    return t[t.executado].reset_index(drop=True) if len(t) else t

meio = dias[len(dias) // 2].data[0]
def resumo(t, nome):
    out = {"cenário": nome}
    for rot, p in [("treino", t[t.data < meio]), ("teste", t[t.data >= meio]), ("total", t)]:
        m = metricas(p)
        out[f"{rot} n"] = m["trades"]
        out[f"{rot} acerto"] = f"{m['acerto']:.0%}"
        out[f"{rot} ret"] = f"{m['ret_total']:+.1%}"
        out[f"{rot} PF"] = f"{m['fator_lucro'] or 0:.2f}"
    return out

if __name__ == "__main__":
    pd.set_option("display.width", 250); pd.set_option("display.max_columns", 30)
    print(f"{ATIVO}: treino até {meio}, teste depois\n")
    for nome, cfg in [("A 1,5%", dict()), ("B 1,5%", dict(stop="range"))]:
        t = rodar(**cfg)
        print(f"===== Diagnóstico das perdas: versão {nome} =====")
        ganhos, perdas = t[t.ret > 0], t[t.ret <= 0]
        print(f"{len(t)} trades, {len(perdas)} perdas. Soma ganhos {ganhos.ret.sum():+.1%}, soma perdas {perdas.ret.sum():+.1%}")
        print("Perdas por motivo de saída:")
        print(perdas.groupby("motivo").ret.agg(qtd="count", soma="sum", media="mean").to_string(), "\n")
        print("Quanto as PERDAS andaram a favor antes de virar (MFE):")
        for x in [0.0025, 0.005, 0.0075, 0.01]:
            print(f"  chegaram a +{x:.2%} a favor: {(perdas.mfe >= x).mean():.0%} das perdas")
        print("Mediana MFE ganhos / perdas:", f"{ganhos.mfe.median():.2%} / {perdas.mfe.median():.2%}")
        print("\nPor lado / tendência / horário da confirmação / tamanho do range:")
        t["faixa_range"] = pd.qcut(t.range_pct, 3, labels=["range pequeno", "médio", "grande"])
        t["hora"] = np.where(t.hora_conf <= "10:00", "conf 9h45-10h", np.where(t.hora_conf <= "11:00", "conf 10h15-11h", "conf após 11h"))
        t["alinhado"] = np.where((t.lado == "compra") == (t.tendencia == "alta"), "a favor da tendência", "contra a tendência")
        t["gap_lado"] = np.where(np.sign(t.gap) == np.where(t.lado == "compra", 1, -1), "rompe na direção do gap", "rompe contra o gap")
        for col in ["lado", "alinhado", "gap_lado", "hora", "faixa_range"]:
            g = t.groupby(col, observed=True).ret.agg(n="count", acerto=lambda r: (r > 0).mean(), media="mean", soma="sum")
            print(g.to_string(float_format=lambda v: f"{v:.3%}" if abs(v) < 1 else f"{v:.0f}"), "\n")

    print("===== Variações (escolher olhando o TREINO; o TESTE é a prova) =====")
    var = [
        ("A original (stop 1,5%, alvo 1,5%)", dict()),
        ("B original (stop range, alvo 1,5%)", dict(stop="range")),
        ("A + zero a zero após +0,5%", dict(be=0.005)),
        ("A + zero a zero após +0,75%", dict(be=0.0075)),
        ("A + trailing 0,5% (ativa em +0,5%)", dict(trail=0.005)),
        ("A + trailing 0,75%", dict(trail=0.0075)),
        ("A alvo 0,5%", dict(alvo=0.005)),
        ("A alvo 0,75%", dict(alvo=0.0075)),
        ("A alvo 1%", dict(alvo=0.01)),
        ("A stop 0,75% alvo 1,5%", dict(stop_pct=0.0075)),
        ("A stop 0,5% alvo 1%", dict(stop_pct=0.005, alvo=0.01)),
        ("Stop no meio do range", dict(stop="meio")),
        ("A sem entradas após 12h", dict(corte_entrada="12:00")),
        ("A saída às 12h", dict(saida="11:45")),
        ("A saída às 14h", dict(saida="13:45")),
        ("A só compras", dict(lados=("compra",))),
        ("A só a favor da tendência (SMA20)", dict(filtro=lambda x: (x["lado"] == "compra") == (x["tendencia"] == "alta"))),
        ("A só confirmação até 10h", dict(filtro=lambda x: x["hora_conf"] <= "10:00")),
        ("A só range < 1%", dict(filtro=lambda x: x["range_pct"] < 0.01)),
        ("A rompe na direção do gap", dict(filtro=lambda x: np.sign(x["gap"]) == (1 if x["lado"] == "compra" else -1))),
        ("A tendência + zero a zero 0,5%", dict(be=0.005, filtro=lambda x: (x["lado"] == "compra") == (x["tendencia"] == "alta"))),
    ]
    print(pd.DataFrame([resumo(rodar(**c), n) for n, c in var]).to_string(index=False))
