# Vídeo para o LinkedIn (versão celular em pé)

1. `python3 ../montar.py` e copiar `../apresentacao.html` para esta pasta como `deck.html`.
2. `mkdir frames && node grava.js`: grava a apresentação em 1080×2160 (modo celular), passo a passo, por screencast. Os tempos de cada slide ficam na função `espera`.
3. Montar o MP4 com a lista de quadros e as durações de `frames.json` (ffmpeg concat, 30 fps, H.264, crf 20, faststart).
