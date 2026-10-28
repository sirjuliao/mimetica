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
OG={
 'experimento/gravar/index.html':('O gêmeo contra o original · convite pessoal','Um gêmeo digital seu, construído a partir da sua história. Grave a entrevista pelo celular, no seu ritmo.'),
 'experimento/index.html':('O gêmeo contra o original','O experimento da Mimetica: um gêmeo digital construído a partir de uma entrevista, testado contra a pessoa real.'),
 'experimento/sessao/index.html':('O gêmeo contra o original · sessão ao vivo','A pessoa responde, a tela revela o que o gêmeo previu.'),
 'financeiro/index.html':('Mimetica · gêmeos digitais para o setor financeiro','Como testar ofertas, mensagens e cenários com gêmeos digitais do brasileiro antes de decidir.'),
 'apoio/gemeo/index.html':('Como nasce o gêmeo de uma pessoa · Mimetica','O passo a passo de como a Mimetica constrói e testa o gêmeo digital de uma pessoa.'),
 'experimento/convites/index.html':('Convites do experimento','Página interna de convites.'),
}
def og(dst):
    t,d=OG.get(dst,('O gêmeo contra o original',''))
    img='https://mimetica.institute/apoio/og.png' if dst.startswith(('apoio/','financeiro/')) else 'https://mimetica.institute/experimento/og.jpg'
    return (f'<meta property="og:type" content="website"><meta property="og:site_name" content="Mimetica">'
            f'<meta property="og:title" content="{t}"><meta property="og:description" content="{d}">'
            f'<meta property="og:image" content="{img}">'
            f'<meta name="twitter:card" content="summary_large_image"><meta name="description" content="{d}">')
PAGINAS={'inicio-src.html':'experimento/index.html','gravar-src.html':'experimento/gravar/index.html','sessao.html':'experimento/sessao/index.html','convites-src.html':'experimento/convites/index.html','demo-src.html':'apoio/gemeo/index.html','financeiro-src.html':'financeiro/index.html'}
for src,dst in PAGINAS.items():
    s=open(os.path.join(aqui,src)).read().replace('__LC__',LC).replace('__LE__',LE)
    s=s.replace('<meta name="claude:viewport-fit-sides" content="cover">\n','')
    d=os.path.join(raiz,dst); os.makedirs(os.path.dirname(d),exist_ok=True)
    cab,corpo=s.split('<style>',1)
    open(d,'w').write(TOPO.replace('</head><body>',og(dst)+cab.strip()+'</head><body>')+'<style>'+corpo+'</body></html>\n'); print('ok',dst)
