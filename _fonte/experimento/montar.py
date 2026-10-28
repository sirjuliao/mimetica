# Monta as páginas do experimento para o site: injeta as logos e o esqueleto HTML.
# Uso: python3 _fonte/experimento/montar.py
import os
aqui=os.path.dirname(os.path.abspath(__file__)); raiz=os.path.dirname(os.path.dirname(aqui))
apoio=os.path.join(raiz,'_fonte','apoio')
LC='data:image/png;base64,'+open(os.path.join(apoio,'logo-claro.b64')).read().strip()
LE='data:image/png;base64,'+open(os.path.join(apoio,'logo-escuro.b64')).read().strip()
TOPO=('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
 '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
 '<meta name="robots" content="noindex,nofollow">'
 '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
 'body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>')
PAGINAS={'inicio-src.html':'experimento/index.html','gravar-src.html':'experimento/gravar/index.html','sessao.html':'experimento/sessao/index.html','convites-src.html':'experimento/convites/index.html'}
for src,dst in PAGINAS.items():
    s=open(os.path.join(aqui,src)).read().replace('__LC__',LC).replace('__LE__',LE)
    s=s.replace('<meta name="claude:viewport-fit-sides" content="cover">\n','')
    d=os.path.join(raiz,dst); os.makedirs(os.path.dirname(d),exist_ok=True)
    cab,corpo=s.split('<style>',1)
    open(d,'w').write(TOPO.replace('</head><body>',cab.strip()+'</head><body>')+'<style>'+corpo+'</body></html>\n'); print('ok',dst)
