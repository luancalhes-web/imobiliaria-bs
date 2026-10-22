"""Gera os áudios personalizados com a voz clonada do Luan (ElevenLabs).

Uso:
  python gerar_audio.py roteiros.json        # [{"nome": "Quiosque Magela", "texto": "..."}]
  python gerar_audio.py --texto "Olá..." --nome teste

Salva em Área de Trabalho/audios-placas/AAAA-MM-DD/<nome>.mp3 e <nome>.ogg
(.ogg = Opus mono, o mesmo formato dos áudios do WhatsApp). Config em .env, ao lado deste arquivo.
"""
import argparse
import datetime
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

AQUI = Path(__file__).resolve().parent


def carregar_env():
    env = {}
    for linha in (AQUI / ".env").read_text(encoding="utf-8-sig").splitlines():
        linha = linha.strip()
        if linha and not linha.startswith("#") and "=" in linha:
            k, v = linha.split("=", 1)
            env[k.strip()] = v.strip()
    if not env.get("ELEVENLABS_API_KEY"):
        sys.exit("Falta a ELEVENLABS_API_KEY no placas-nfc/.env")
    return env


def tts(env, texto):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{env['ELEVENLABS_VOICE_ID']}?output_format=mp3_44100_128"
    corpo = {
        "text": texto,
        "model_id": env.get("ELEVENLABS_MODEL", "eleven_v4"),
        "language_code": "pt",
        "voice_settings": {
            "stability": float(env.get("ELEVENLABS_STABILITY", 0)),
            "similarity_boost": float(env.get("ELEVENLABS_SIMILARITY", 0.75)),
        },
    }
    if env.get("ELEVENLABS_SPEED"):
        corpo["voice_settings"]["speed"] = float(env["ELEVENLABS_SPEED"])
    req = urllib.request.Request(
        url,
        data=json.dumps(corpo).encode(),
        headers={"xi-api-key": env["ELEVENLABS_API_KEY"], "Content-Type": "application/json", "Accept": "audio/mpeg"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs recusou ({e.code}): {e.read().decode(errors='replace')[:500]}")


def nome_arquivo(nome):
    return re.sub(r'[<>:"/\\|?*]+', "", nome).strip()[:60] or "audio"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("arquivo", nargs="?")
    ap.add_argument("--texto")
    ap.add_argument("--nome", default="teste")
    a = ap.parse_args()
    env = carregar_env()
    itens = [{"nome": a.nome, "texto": a.texto}] if a.texto else json.loads(Path(a.arquivo).read_text(encoding="utf-8-sig"))

    desktop = next((d for d in (Path.home() / "OneDrive" / "Área de Trabalho", Path.home() / "OneDrive" / "Desktop") if d.exists()), Path.home() / "Desktop")
    pasta = desktop / "audios-placas" / datetime.date.today().isoformat()
    pasta.mkdir(parents=True, exist_ok=True)
    ffmpeg = shutil.which("ffmpeg") or sys.exit("Falta o ffmpeg no PATH")
    tempo = env.get("TEMPO", "1.3")  # acelera sem mudar o tom da voz (a voz clonada sai lenta)
    for item in itens:
        base = pasta / nome_arquivo(item["nome"])
        mp3 = base.with_suffix(".mp3")
        mp3.write_bytes(tts(env, item["texto"]))
        ogg = base.with_suffix(".ogg")
        subprocess.run([ffmpeg, "-y", "-loglevel", "error", "-i", str(mp3), "-filter:a", f"atempo={tempo}",
                        "-ac", "1", "-c:a", "libopus", "-b:a", "32k", str(ogg)], check=True)
        mp3.unlink()
        print(f"ok  {ogg}")


if __name__ == "__main__":
    main()
