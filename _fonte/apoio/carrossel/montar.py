import re, base64, io, os
from PIL import Image
A='/home/claude/mimetica/_fonte/apoio/'; aqui=os.path.dirname(os.path.abspath(__file__))
s=open(os.path.join(aqui,os.environ.get('SRC','carrossel-src.html')),encoding='utf8').read()
L='data:image/png;base64,'
s=s.replace('__LOGO_CLARO__',L+open(A+'logo-claro.b64').read().strip()).replace('__LOGO_ESCURO__',L+open(A+'logo-escuro.b64').read().strip())
im=Image.open(os.path.join(aqui,'cidade.png')).convert('RGB'); b=io.BytesIO(); im.save(b,'JPEG',quality=88)
s=s.replace('__CIDADE__','data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode())
qr=open(A+'pdf/qr.svg',encoding='utf8').read(); qr=re.sub(r'width="[^"]*" height="[^"]*"','width="162" height="162"',qr,1)
s=s.replace('__QR__',qr)
qr2=open(os.path.join(aqui,'qr-gemeos.svg'),encoding='utf8').read() if os.path.exists(os.path.join(aqui,'qr-gemeos.svg')) else ''
qr2=re.sub(r'width="[^"]*" height="[^"]*"','width="162" height="162"',qr2,count=1)
s=s.replace('__QR2__',qr2)
if '__CABECA__' in s:
    b2=io.BytesIO(); Image.open(os.path.join(aqui,'cabeca-crop.jpg')).save(b2,'JPEG',quality=86); s=s.replace('__CABECA__','data:image/jpeg;base64,'+base64.b64encode(b2.getvalue()).decode())
g='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap">'
open(os.path.join(aqui,os.environ.get('OUT','carrossel')+'.html'),'w',encoding='utf8').write(s.replace('__FONTS__',g))
t=open(A+'pdf/tabela.html',encoding='utf8').read(); ff=''.join(re.findall(r'@font-face\{[^}]*\}',t))
P='/tmp/claude-0/-home-claude/9562b97a-a0ca-5a12-8578-b7c4da322c09/scratchpad/pdf/'
open(P+os.environ.get('OUT','carrossel')+'.html','w',encoding='utf8').write(s.replace('__FONTS__','<style>'+ff+'</style>'))
print('ok')
