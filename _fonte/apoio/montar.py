# Monta a apresentação a partir de fonte.html.
# Uso: python3 montar.py  -> gera ../../apoio/index.html (site) e apresentacao.html (versão solta)
import os
aqui = os.path.dirname(os.path.abspath(__file__))
L = 'data:image/png;base64,'
s = open(os.path.join(aqui, 'fonte.html'), encoding='utf8').read()
s = s.replace('__LOGO_CLARO__', L + open(os.path.join(aqui, 'logo-claro.b64')).read().strip())
s = s.replace('__LOGO_ESCURO__', L + open(os.path.join(aqui, 'logo-escuro.b64')).read().strip())
open(os.path.join(aqui, 'apresentacao.html'), 'w', encoding='utf8').write(s)
# Página do site: mesmo conteúdo com o cabeçalho do site (OG, favicon, Google Fonts)
site = os.path.join(aqui, '..', '..', 'apoio', 'index.html')
live = open(site, encoding='utf8').read().split('\n'); new = s.split('\n')
assert live[18:21] == new[2:5], 'cabeçalho mudou: conferir manualmente'
out = live[:18] + new[2:5] + live[21:24] + new[5:] + live[-4:]
open(site, 'w', encoding='utf8').write('\n'.join(out))
print('ok: apoio/index.html e apresentacao.html')
