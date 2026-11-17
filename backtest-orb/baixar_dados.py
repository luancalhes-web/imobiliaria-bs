"""Baixa candles de 15 min (pregão regular) da Twelve Data para os últimos 2 anos.

Uso: TWELVEDATA_KEY=xxx python baixar_dados.py   (ou sem chave, se o proxy injeta o header)
Salva em dados/<ATIVO>_15min.csv (horário de Nova York).
"""
import os, sys, time
from datetime import date, timedelta
import pandas as pd, requests

ATIVOS = ["NVDA", "AAPL", "MSFT", "NEM"]
FIM = date(2026, 11, 17)
INICIO = FIM - timedelta(days=730)
URL = "https://api.twelvedata.com/time_series"
PASTA = os.path.join(os.path.dirname(__file__), "dados")
KEY = os.environ.get("TWELVEDATA_KEY", "")


def baixar(ativo):
    partes, ini = [], INICIO
    while ini < FIM:
        fim = min(ini + timedelta(days=120), FIM)  # ~2.100 candles por chamada (< limite de 5.000)
        p = dict(symbol=ativo, interval="15min", start_date=f"{ini} 00:00:00",
                 end_date=f"{fim} 23:59:59", timezone="America/New_York",
                 outputsize=5000, order="ASC")
        if KEY:
            p["apikey"] = KEY
        for tentativa in range(5):
            r = requests.get(URL, params=p, timeout=60).json()
            if r.get("status") == "ok":
                break
            if r.get("code") == 429:          # limite de 8 chamadas/min do plano gratuito
                time.sleep(65); continue
            sys.exit(f"{ativo} {ini}: {r}")
        partes.append(pd.DataFrame(r["values"]))
        print(ativo, ini, fim, len(r["values"]), "candles")
        ini = fim + timedelta(days=1)
        time.sleep(8)
    df = pd.concat(partes).drop_duplicates("datetime").sort_values("datetime")
    os.makedirs(PASTA, exist_ok=True)
    df.to_csv(os.path.join(PASTA, f"{ativo}_15min.csv"), index=False)


if __name__ == "__main__":
    for a in sys.argv[1:] or ATIVOS:
        baixar(a)
