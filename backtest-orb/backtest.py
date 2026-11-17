"""Backtest: rompimento do 1º candle de 15 min + entrada no reteste.

Lê dados/<ATIVO>_15min.csv e gera resultados/ (CSV de trades, métricas e JSON para o relatório).
"""
import os, json
import numpy as np, pandas as pd

ATIVOS = [a for a in ["NVDA", "AAPL", "MSFT", "NEM"] if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), "dados", f"{a}_15min.csv"))]
BASE = os.path.dirname(os.path.abspath(__file__))
CUSTO = 0.0005          # 0,05% por operação (descontado uma vez por trade, ida+volta)
STOP_FIXO = 0.015       # versão A
ULTIMO_DIA_EXCLUIDO = pd.Timestamp("2026-11-17").date()


def carregar(ativo):
    df = pd.read_csv(os.path.join(BASE, "dados", f"{ativo}_15min.csv"), parse_dates=["datetime"])
    for c in ["open", "high", "low", "close"]:
        df[c] = df[c].astype(float)
    df["data"] = df.datetime.dt.date
    df = df[df.data < ULTIMO_DIA_EXCLUIDO]                # 17/11/2026 ainda estava em pregão
    hm = df.datetime.dt.strftime("%H:%M")
    df = df[(hm >= "09:30") & (hm <= "15:45")]          # pregão regular: candles 9h30 ... 15h45-16h00
    # só dias completos com o candle das 9h30
    ok = df.groupby("data").datetime.transform(lambda s: s.dt.strftime("%H:%M").eq("09:30").any())
    return df[ok].reset_index(drop=True)


def simular_dia(d, alvo, versao):
    """d: candles do dia em ordem. Retorna dict do sinal/trade (ou None se não houve sinal)."""
    o, h, l, c = (d[k].to_numpy() for k in ["open", "high", "low", "close"])
    H, L = h[0], l[0]
    # 3. confirmação: primeiro candle a partir das 9h45 que FECHA fora do range
    sinal = None
    for i in range(1, len(d)):
        if c[i] > H: sinal = ("compra", i); break
        if c[i] < L: sinal = ("venda", i); break
    if sinal is None:
        return None
    lado, i = sinal
    res = dict(data=d.datetime.iloc[0].date(), lado=lado, max1=H, min1=L,
               hora_conf=d.datetime.iloc[i].strftime("%H:%M"), executado=False)
    # 4. reteste num candle POSTERIOR ao de confirmação
    j = next((k for k in range(i + 1, len(d))
              if (lado == "compra" and l[k] <= H) or (lado == "venda" and h[k] >= L)), None)
    if j is None:
        return res
    entrada = H if lado == "compra" else L
    if lado == "compra":
        stop = entrada * (1 - STOP_FIXO) if versao == "A" else L
        tgt = entrada * (1 + alvo)
    else:
        stop = entrada * (1 + STOP_FIXO) if versao == "A" else H
        tgt = entrada * (1 - alvo)
    saida, motivo, hora_saida = None, None, None
    for k in range(j, len(d)):
        bate_stop = l[k] <= stop if lado == "compra" else h[k] >= stop
        # no candle da entrada não se sabe se a máxima (compra) / mínima (venda) veio
        # antes ou depois do toque, então ali só o stop é verificado (conservador)
        bate_alvo = k > j and (h[k] >= tgt if lado == "compra" else l[k] <= tgt)
        if bate_stop:                         # 9. stop e alvo no mesmo candle: stop primeiro
            # se o candle abriu além do stop (gap), sai na abertura
            pior = min(o[k], stop) if lado == "compra" else max(o[k], stop)
            saida, motivo = (pior if k > j else stop), "stop"
        elif bate_alvo:
            melhor = max(o[k], tgt) if lado == "compra" else min(o[k], tgt)
            saida, motivo = melhor, "alvo"
        if motivo:
            hora_saida = d.datetime.iloc[k].strftime("%H:%M"); break
    if motivo is None:                        # 8. fecha no fechamento do dia (16h00)
        saida, motivo, hora_saida = c[-1], "fim_do_dia", "16:00"
    bruto = saida / entrada - 1 if lado == "compra" else (entrada - saida) / entrada
    res.update(executado=True, hora_entrada=d.datetime.iloc[j].strftime("%H:%M"), entrada=entrada,
               stop=stop, alvo=tgt, saida=saida, motivo=motivo, hora_saida=hora_saida,
               ret_bruto=bruto, ret=bruto - CUSTO)
    return res


def metricas(t):
    """t: DataFrame de trades executados (coluna ret, em fração)."""
    n = len(t)
    if n == 0:
        return dict(trades=0)
    r = t.ret.to_numpy()
    eq = np.cumprod(1 + r)
    pico = np.maximum.accumulate(np.concatenate([[1.0], eq]))[1:]
    dd = (eq / pico - 1).min()
    seq = mx = 0
    for x in r:
        seq = seq + 1 if x <= 0 else 0; mx = max(mx, seq)
    gan, per = r[r > 0], r[r <= 0]
    return dict(
        trades=n, acerto=len(gan) / n,
        pct_alvo=(t.motivo == "alvo").mean(), pct_stop=(t.motivo == "stop").mean(),
        pct_fim=(t.motivo == "fim_do_dia").mean(),
        ret_total=eq[-1] - 1, ret_soma=r.sum(), ret_medio=r.mean(),
        payoff=(gan.mean() / -per.mean()) if len(gan) and len(per) and per.mean() < 0 else None,
        fator_lucro=(gan.sum() / -per.sum()) if len(per) and per.sum() < 0 else None,
        dd_max=min(dd, 0.0), max_perdas_seguidas=mx)


def rodar():
    os.makedirs(os.path.join(BASE, "resultados"), exist_ok=True)
    saida = dict(ativos={}, periodo=None)
    todos = []
    for ativo in ATIVOS:
        df = carregar(ativo)
        dias = [g for _, g in df.groupby("data")]
        bh = dias[-1].close.iloc[-1] / dias[0].open.iloc[0] - 1
        fech = df.groupby("data").close.last()
        saida["periodo"] = [str(dias[0].data.iloc[0]), str(dias[-1].data.iloc[0])]
        info = dict(dias_pregao=len(dias), buy_hold=bh,
                    bh_curva=[[str(k), v / dias[0].open.iloc[0]] for k, v in fech.items()],
                    cenarios={})
        trades_por_versao = {}
        for alvo in (0.015, 0.02):
            for versao in ("A", "B"):
                regs = [x for x in (simular_dia(g, alvo, versao) for g in dias) if x]
                s = pd.DataFrame(regs)
                s["ativo"], s["alvo_pct"], s["versao"] = ativo, alvo, versao
                todos.append(s)
                ex = s[s.executado]
                trades_por_versao[(alvo, versao)] = ex
                cen = dict(dias_sinal=len(s), com_reteste=len(ex), sem_reteste=len(s) - len(ex),
                           geral=metricas(ex),
                           compras=metricas(ex[ex.lado == "compra"]),
                           vendas=metricas(ex[ex.lado == "venda"]),
                           curva=[[str(d), float(v)] for d, v in zip(ex.data, np.cumprod(1 + ex.ret))])
                info["cenarios"][f"{versao}_{alvo*100:g}"] = cen
        # análise extra: trades do alvo 1,5% que chegariam a +2% antes do stop
        for versao in ("A", "B"):
            t15 = trades_por_versao[(0.015, versao)]
            t20 = trades_por_versao[(0.02, versao)].set_index("data")
            chegou = (t20.loc[t15.data, "motivo"] == "alvo").sum()
            info["cenarios"][f"{versao}_1.5"]["chegaria_2pct"] = dict(n=int(chegou), pct=chegou / len(t15) if len(t15) else 0)
        saida["ativos"][ativo] = info
    pd.concat(todos).to_csv(os.path.join(BASE, "resultados", "trades.csv"), index=False)
    with open(os.path.join(BASE, "resultados", "resultados.json"), "w") as f:
        json.dump(saida, f, default=lambda o: None if o is None else float(o), indent=1)
    return saida


if __name__ == "__main__":
    s = rodar()
    print("Período:", s["periodo"])
    for a, info in s["ativos"].items():
        print(f"\n=== {a}  (buy & hold {info['buy_hold']:+.1%}, {info['dias_pregao']} pregões)")
        for k, c in info["cenarios"].items():
            g = c["geral"]
            if not g["trades"]:
                print(k, "sem trades"); continue
            extra = c.get("chegaria_2pct")
            print(f"{k:6} sinais {c['dias_sinal']:3} reteste {c['com_reteste']:3} sem {c['sem_reteste']:3} | "
                  f"acerto {g['acerto']:.0%} alvo {g['pct_alvo']:.0%} stop {g['pct_stop']:.0%} fim {g['pct_fim']:.0%} | "
                  f"total {g['ret_total']:+.1%} médio {g['ret_medio']:+.3%} PF {g['fator_lucro'] or 0:.2f} "
                  f"DD {g['dd_max']:.1%} perdas seg {g['max_perdas_seguidas']}"
                  + (f" | +2%: {extra['n']} ({extra['pct']:.0%})" if extra else ""))
