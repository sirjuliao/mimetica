import sys
p=sys.argv[1]; s=open(p,encoding='utf8').read()
D=open('deck/head.d').read().strip()
def R(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)

# ---------- CONFIG ----------
cfg='''  // Slide por que confiar (ficha do gêmeo digital)
  confHero: "Primeiro medimos o Brasil. A IA entra por último.",
  confia: {
    aConfirmar: false,  // true mostra o aviso "números a confirmar" no fecho
    id: "Gêmeo digital nº 1.274",
    sub: "um dos milhares da população artificial",
    resumo: "Mulher · 47 anos · interior de Minas Gerais",
    // [campo, valor, fonte]
    medidos: [
      ["Estado", "Minas Gerais · urbana", "Censo"],
      ["Sexo e idade", "Feminino · 47 anos", "Censo"],
      ["Escolaridade", "Ensino médio completo", "PNAD"],
      ["Renda familiar", "2 a 3 salários mínimos", "PNAD"],
      ["Gasto com alimentação", "R$ 800 a 1.200 por mês", "POF"],
      ["Saúde declarada", "Hipertensão", "PNS"]
    ],
    // [campo, valor, método]
    inferidos: [
      ["Remédio para obesidade", "Não usa; conhece pelo noticiário", "taxa oficial por idade e renda"],
      ["Sensibilidade a preço", "Alta; troca de marca com frequência", "cruzamento de renda e gasto"]
    ],
    // [campo, valor]; a última linha é a voz, mostrada como citação
    ia: [
      ["Personalidade", "Organizada, reservada, cuidadosa"],
      ["Como decide uma compra", "Consulta a família e compara em duas lojas"],
      ["Voz", "Olha, eu sempre pergunto pra minha mãe antes. E com o preço do gás como está…"]
    ],
    passos: [
      null,
      { rot: "Um gêmeo digital por dentro", tit: "Cada gêmeo digital tem uma ficha.",
        txt: "Cada informação da ficha diz de onde veio. É assim que separamos o que sabemos do que estimamos." },
      { rot: "Primeiro: o que é medido", tit: "Começamos pelos dados oficiais do Brasil.",
        txt: "Idade, renda, escolaridade, saúde e gastos vêm do Censo e das pesquisas do IBGE. Em cada eixo, a população artificial fica a menos de 1 ponto do Brasil real." },
      { rot: "Depois: o que é inferido", tit: "O que não é medido é estimado com método.",
        txt: "Cruzando dados oficiais, estimamos o que nenhuma pesquisa mede diretamente, como a sensibilidade a preço. Cada estimativa registra de onde veio." },
      { rot: "Por último: a IA", tit: "A IA dá voz, sem mudar o que foi medido.",
        txt: "Ela escreve a personalidade, o jeito de decidir e o jeito de falar. Os dados medidos ficam travados." },
      { rot: "A prova", tit: "Tiramos a IA, e as respostas não mudaram.",
        txt: "Repetimos seis experimentos clássicos de comportamento sem a IA. A direção das respostas foi a mesma nos seis.", teste: true },
      null
    ],
    fecho: "Testado contra o Brasil real.",
    numeros: [
      ["15 de 16", "pesquisas brasileiras reproduzidas dentro da margem de erro"],
      ["< 3 pontos", "de erro médio em eleições para o Senado, como as pesquisas de véspera"],
      ["0,98", "de consistência: a mesma pessoa dá a mesma resposta"],
      ["2 modelos", "de IA diferentes, o mesmo resultado"]
    ]
  },

  // Slide cidade do tema'''
R("  // Slide cidade do tema", cfg)

# ---------- cidade: moldura "sua empresa" ----------
R('cidHero: "Para cada tema, os gêmeos digitais se mudam para uma cidade.",','cidHero: "Para aprender sobre a sua empresa, os gêmeos digitais se mudam para uma cidade.",')
R('''      { rot: "A cidade do tema", tit: "Cada tema ganha uma cidade.",
        txt: "Aqui, a cidade do GLP-1. É nela que os gêmeos digitais vão viver o assunto, todos os dias." },''','''      { rot: "A cidade da sua empresa", tit: "Cada empresa ganha uma cidade.",
        txt: "Ela é montada em torno do assunto que importa para o seu negócio. Aqui, GLP-1. É nela que os gêmeos digitais vão viver esse assunto, todos os dias." },''')
R('txt: "Milhares de gêmeos digitais, com a mesma composição do Brasil, passam a morar na cidade do tema." },','txt: "Milhares de gêmeos digitais, com a mesma composição do Brasil, passam a morar na cidade da sua empresa." },')
R('<p class="lbl topo">Cidade do tema</p>','<p class="lbl topo">Como aprendem sobre a sua empresa</p>')
R("$('cdEtiq').textContent = 'Tema · ' + C.tema;","$('cdEtiq').textContent = 'Sua empresa · ' + C.tema;")

# ---------- HTML ----------
html=f'''  <!-- ============ SLIDE · POR QUE CONFIAR (7 cliques; textos no CONFIG.confia) ============ -->
  <section class="slide cena" data-steps="6" id="s-confia">
    <img class="logo-sm" src="__LOGO_ESCURO__" alt="Mimetica">
    <p class="lbl topo">Por que confiar</p>
    <h2 class="hero rv" data-in="0" data-out="1" data-cfg="confHero"></h2>
    <div class="cf-card" id="cfCard" data-in="1">
      <div class="cf-cab"><span class="cf-ponto" aria-hidden="true"></span>
        <div><p class="cf-id"><span id="cfId"></span> <small id="cfSub"></small></p><p class="cf-res" id="cfRes"></p></div></div>
      <div class="cf-corpo">
        <div class="cf-escala" aria-hidden="true"><span>mais certeza</span><i></i><span>menos certeza</span></div>
        <div class="cf-faixas">
          <div class="cf-fx m" id="cfFxM"><div class="cf-fxc"><b>Medido</b><span>fontes oficiais</span><em class="cf-cad" aria-label="travado"></em></div><div class="cf-grade" id="cfGM"></div></div>
          <div class="cf-fx i" id="cfFxI"><div class="cf-fxc"><b>Inferido</b><span>com método</span></div><div class="cf-grade" id="cfGI"></div></div>
          <div class="cf-fx ia" id="cfFxA"><div class="cf-fxc"><b>IA</b><span>voz e personalidade</span><em class="cf-ret">retirada no teste</em></div><div class="cf-grade" id="cfGA"></div></div>
        </div>
      </div>
    </div>
    <div class="cf-painel" id="cfPainel"><p class="cf-rot" id="cfRot"></p><p class="cf-tit" id="cfTit"></p><p class="cf-txt" id="cfTxt"></p>
      <div class="cf-teste" id="cfTeste">
        <div class="cf-tl"><b>Com IA</b><span class="cf-ok" id="cfOk1"></span><em>6 de 6</em></div>
        <div class="cf-tl"><b>Sem IA</b><span class="cf-ok" id="cfOk2"></span><em>6 de 6</em></div>
        <p class="cf-frase">A resposta vem do dado. A IA só dá a voz.</p>
      </div></div>
    <div class="cf-fecho" data-in="6"><p class="cf-ftit" id="cfFecho"></p><div class="cf-nums" id="cfNums"></div><p class="cf-aviso" id="cfAviso">Números a confirmar</p></div>
    <p class="pag"></p>
  </section>

'''
anc='  <!-- ============ SLIDE · CIDADE DO TEMA'
R(anc, html+anc)

# ---------- CSS ----------
css='''/* slide por que confiar */
.cf-card{position:absolute; left:600px; top:150px; width:900px; box-sizing:border-box; border:1px solid var(--fio); border-radius:6px; background:#FBFAF7; padding:20px 24px 22px}
.cf-cab{display:flex; gap:16px; align-items:center; padding-bottom:16px; border-bottom:1px solid var(--fio)}
.cf-ponto{width:22px; height:22px; border-radius:50%; background:var(--texto); flex:none; box-shadow:0 0 0 6px rgba(29,29,27,.08)}
.cf-id{font:600 24px/1.1 var(--f-tit); color:var(--texto)}
.cf-id small{font:500 15px/1 var(--f-txt); color:var(--texto2); margin-left:6px}
.cf-res{margin-top:6px; font:500 14px/1.3 var(--f-mono); color:var(--texto2)}
.cf-corpo{display:grid; grid-template-columns:22px 1fr; gap:16px; margin-top:16px}
.cf-escala{display:flex; flex-direction:column; align-items:center; gap:8px}
.cf-escala span{writing-mode:vertical-rl; transform:rotate(180deg); font:500 11px/1 var(--f-mono); letter-spacing:1.2px; text-transform:uppercase; color:#8E8C86}
.cf-escala i{flex:1; width:3px; border-radius:2px; background:linear-gradient(#1D1D1B, #1D1D1B 40%, #8E8C86 70%, #D6D4CD)}
.cf-faixas{display:flex; flex-direction:column; gap:12px}
.cf-fx{border-radius:5px; overflow:hidden; transition:opacity .6s, max-height .7s cubic-bezier(.65,0,.25,1); max-height:400px}
.cf-fx.m{border:1.5px solid var(--texto)}
.cf-fx.i{border:1.5px solid rgba(29,29,27,.55)}
.cf-fx.ia{border:1.5px dashed rgba(29,29,27,.5)}
.cf-fxc{display:flex; align-items:baseline; gap:10px; padding:9px 14px; font:500 13px/1 var(--f-mono); color:var(--texto2)}
.cf-fxc b{font:700 13px/1 var(--f-mono); letter-spacing:1.6px; text-transform:uppercase; color:var(--texto)}
.cf-fx.m .cf-fxc{background:var(--texto); color:#C9C7C0}
.cf-fx.m .cf-fxc b{color:var(--osso)}
.cf-cad{margin-left:auto; width:13px; height:14px; opacity:0; transition:opacity .4s; background:no-repeat center/contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 13'%3E%3Crect x='1' y='5.5' width='10' height='7' rx='1' fill='%23F5F4F0'/%3E%3Cpath d='M3.2 5.5V3.8a2.8 2.8 0 0 1 5.6 0v1.7' fill='none' stroke='%23F5F4F0' stroke-width='1.4'/%3E%3C/svg%3E")}
.cf-card.travado .cf-cad{opacity:1}
.cf-ret{margin-left:auto; font-style:normal; font:600 11px/1 var(--f-mono); letter-spacing:1px; text-transform:uppercase; color:var(--texto); opacity:0; transition:opacity .4s}
.cf-grade{display:grid; gap:12px 22px; padding:12px 14px 14px}
.cf-fx.m .cf-grade{grid-template-columns:repeat(3,1fr)}
.cf-fx.i .cf-grade{grid-template-columns:repeat(2,1fr)}
.cf-fx.ia .cf-grade{grid-template-columns:1fr 1fr}
.cf-f{opacity:0; transform:translateY(6px); transition:opacity .4s, transform .4s}
.cf-f.on{opacity:1; transform:none}
.cf-f .c{display:block; font:500 11.5px/1.2 var(--f-mono); letter-spacing:1px; text-transform:uppercase; color:#8E8C86; margin-bottom:5px}
.cf-f .v{display:block; font-size:17px; line-height:1.3; color:var(--texto)}
.cf-f .o{display:block; margin-top:4px; font:500 12px/1.3 var(--f-mono); color:var(--texto2)}
.cf-f.voz{grid-column:1 / -1}
.cf-f.voz .v{font:500 19px/1.35 var(--f-tit); color:var(--texto)}
.cf-f.voz .v::before{content:"“"}
.cf-f.voz .v::after{content:"”"}
.cf-card.semia .cf-fx.ia{max-height:34px; opacity:.55}
.cf-card.semia .cf-ret{opacity:1}
.cf-f .cursor{display:inline-block; width:2px; height:1em; background:var(--texto); vertical-align:-2px; margin-left:1px; animation:cfPisca .8s steps(1) infinite}
@keyframes cfPisca{50%{opacity:0}}
.cf-painel{position:absolute; left:100px; top:200px; width:450px; display:flex; flex-direction:column; gap:16px; opacity:0; transition:opacity .4s}
.cf-painel.on{opacity:1}
.cf-painel.troca{animation:cdSobe .45s ease both}
.cf-rot{font:600 15px/1 var(--f-mono); letter-spacing:2.5px; text-transform:uppercase; color:var(--texto2)}
.cf-tit{font:600 40px/1.12 var(--f-tit); letter-spacing:-.6px; color:var(--texto)}
.cf-txt{font-size:21px; line-height:1.48; color:var(--texto2)}
.cf-teste{display:none; flex-direction:column; gap:12px; margin-top:10px}
.cf-teste.on{display:flex}
.cf-tl{display:grid; grid-template-columns:90px 1fr 60px; gap:12px; align-items:center; border-top:1px solid var(--fio); padding-top:12px}
.cf-tl b{font:600 15px/1 var(--f-mono); letter-spacing:1px; text-transform:uppercase; color:var(--texto)}
.cf-tl em{font:600 15px/1 var(--f-mono); font-style:normal; text-align:right; color:var(--texto)}
.cf-ok{display:flex; gap:8px}
.cf-ok i{width:22px; height:22px; border-radius:50%; background:#DAD8D1; transition:background .3s; transition-delay:calc(.25s + var(--k) * 140ms)}
.cf-teste.on .cf-ok i{background:var(--texto)}
.cf-frase{margin-top:8px; font:600 24px/1.25 var(--f-tit); color:var(--texto)}
.cf-fecho{position:absolute; left:100px; top:200px; width:450px; box-sizing:border-box; background:var(--preto); border-radius:4px; padding:28px 30px; transform:translateY(12px); transition:opacity .5s, transform .5s}
.cf-fecho.on{transform:none}
.cf-ftit{font:600 32px/1.2 var(--f-tit); letter-spacing:-.4px; color:var(--osso); margin-bottom:18px}
.cf-nums{display:grid; grid-template-columns:1fr 1fr; gap:18px 20px}
.cf-nums b{display:block; font:700 30px/1 var(--f-tit); letter-spacing:-.6px; color:var(--osso); margin-bottom:6px}
.cf-nums span{font-size:14.5px; line-height:1.38; color:var(--claro2)}
.cf-aviso{margin-top:18px; font:500 12px/1 var(--f-mono); letter-spacing:1.5px; text-transform:uppercase; color:#8E8C86}
html.retrato .cf-card{left:60px; top:140px; width:780px; padding:24px 24px 24px}
html.retrato .cf-ponto{width:30px; height:30px}
html.retrato .cf-id{font-size:34px}
html.retrato .cf-id small{display:block; margin:8px 0 0; font-size:22px}
html.retrato .cf-res{font-size:21px}
html.retrato .cf-corpo{grid-template-columns:26px 1fr}
html.retrato .cf-escala span{font-size:15px}
html.retrato .cf-fxc{font-size:19px; padding:12px 16px}
html.retrato .cf-fxc b{font-size:19px}
html.retrato .cf-cad{width:18px; height:19px}
html.retrato .cf-ret{font-size:16px}
html.retrato .cf-fx.i .cf-grade, html.retrato .cf-fx.ia .cf-grade{grid-template-columns:1fr 1fr; gap:12px 18px; padding:12px 16px 14px}
html.retrato .cf-fx.m .cf-grade{grid-template-columns:repeat(3,1fr); gap:12px 14px; padding:12px 16px 14px}
html.retrato .cf-f .c{font-size:15px}
html.retrato .cf-f .v{font-size:22px}
html.retrato .cf-f .o{font-size:17px}
html.retrato .cf-f.voz .v{font-size:25px}
html.retrato .cf-card.semia .cf-fx.ia{max-height:46px}
html.retrato .cf-painel{left:60px; top:1140px; width:780px; gap:18px}
html.retrato .cf-rot{font-size:24px; letter-spacing:3px}
html.retrato .cf-tit{font-size:56px; line-height:1.08}
html.retrato .cf-txt{font-size:34px; line-height:1.42}
html.retrato .cf-tl{grid-template-columns:150px 1fr 100px}
html.retrato .cf-tl b, html.retrato .cf-tl em{font-size:24px}
html.retrato .cf-ok i{width:34px; height:34px}
html.retrato .cf-frase{font-size:38px}
html.retrato .cf-fecho{left:60px; top:1140px; width:780px; padding:34px 36px}
html.retrato .cf-ftit{font-size:48px}
html.retrato .cf-nums b{font-size:46px}
html.retrato .cf-nums span{font-size:24px}
html.retrato .cf-aviso{font-size:18px}

/* slide cidade do tema */'''
R("/* slide cidade do tema */", css)

# ---------- controller ----------
ctrl='''  /* ================================================================
     SLIDE · POR QUE CONFIAR (textos em CONFIG.confia)
     ================================================================ */
  const confia = (() => {
    const C = CONFIG.confia, $ = id => document.getElementById(id);
    if (!$('cfCard')) return { passo(){} };
    $('cfId').textContent = C.id; $('cfSub').textContent = C.sub; $('cfRes').textContent = C.resumo; $('cfFecho').textContent = C.fecho;
    $('cfAviso').style.display = C.aConfirmar ? '' : 'none';
    const campo = (alvo, tipo, [c, v, o], voz) => { const d = document.createElement('div'); d.className = 'cf-f' + (voz ? ' voz' : '');
      d.innerHTML = '<span class="c"></span><span class="v"></span>' + (o ? '<span class="o"></span>' : '');
      d.querySelector('.c').textContent = c; d.querySelector('.v').textContent = v; if (o) d.querySelector('.o').textContent = (tipo === 'm' ? 'fonte: ' : 'método: ') + o;
      $(alvo).appendChild(d); return { d, tipo, valor: v }; };
    const campos = [
      ...C.medidos.map(x => campo('cfGM', 'm', x)),
      ...C.inferidos.map(x => campo('cfGI', 'i', x)),
      ...C.ia.map((x, k) => campo('cfGA', 'ia', x, k === C.ia.length - 1))
    ];
    C.numeros.forEach(([n, t]) => { const d = document.createElement('div'); d.innerHTML = '<b></b><span></span>'; d.firstChild.textContent = n; d.lastChild.textContent = t; $('cfNums').appendChild(d); });
    [$('cfOk1'), $('cfOk2')].forEach(el => { for (let k = 0; k < 6; k++){ const i = document.createElement('i'); i.style.setProperty('--k', k + (el.id === 'cfOk2' ? 7 : 0)); el.appendChild(i); } });
    let timers = [], ultimo = -1;
    const limpa = () => { timers.forEach(clearTimeout); timers = []; };
    function digita(F, atraso){
      const v = F.d.querySelector('.v'); v.textContent = '';
      timers.push(setTimeout(() => { let k = 0; F.d.classList.add('on'); const cur = document.createElement('span'); cur.className = 'cursor'; v.after(cur);
        const passo = () => { v.textContent = F.valor.slice(0, ++k); if (k < F.valor.length) timers.push(setTimeout(passo, 24)); else cur.remove(); }; passo(); }, atraso));
    }
    function setPasso(p, instant){
      limpa(); const card = $('cfCard'), P = C.passos[p], pn = $('cfPainel');
      campos.forEach(F => { F.d.classList.remove('on'); F.d.querySelector('.v').textContent = F.valor; const c = F.d.querySelector('.cursor'); if (c) c.remove(); });
      card.classList.toggle('travado', p >= 4); card.classList.toggle('semia', p >= 5);
      const mostra = (tipo, anima) => campos.filter(F => F.tipo === tipo).forEach((F, k) => { if (!anima) F.d.classList.add('on'); else timers.push(setTimeout(() => F.d.classList.add('on'), 200 + k * 220)); });
      if (p >= 2) mostra('m', p === 2 && !instant);
      if (p >= 3) mostra('i', p === 3 && !instant);
      if (p >= 4){ const ia = campos.filter(F => F.tipo === 'ia');
        if (p === 4 && !instant){ let t = 700; ia.forEach(F => { digita(F, t); t += 300 + F.valor.length * 24; }); } else ia.forEach(F => F.d.classList.add('on')); }
      pn.classList.toggle('on', p >= 1 && p <= 5);
      if (p > 5 || p < 1) pn.classList.remove('troca');
      if (P && p >= 1 && p <= 5){ $('cfRot').textContent = P.rot; $('cfTit').textContent = P.tit; $('cfTxt').textContent = P.txt || '';
        pn.classList.remove('troca'); void pn.offsetWidth; pn.classList.add('troca'); }
      $('cfTeste').classList.remove('on'); if (p === 5) requestAnimationFrame(() => requestAnimationFrame(() => $('cfTeste').classList.add('on')));
    }
    return { passo(p, instant){ if (p !== ultimo || instant){ ultimo = p; setPasso(p, instant); } } };
  })();

'''
nav="  /* ================================================================\n     SLIDE · CIDADE DO TEMA"
R(nav, ctrl+nav)
R("  const cidIdx = slides.findIndex(s => s.id === 's-cidade');","  const cidIdx = slides.findIndex(s => s.id === 's-cidade');\n  const cfIdx = slides.findIndex(s => s.id === 's-confia');")
R("    cidade.ativar(cur === cidIdx); if (cur === cidIdx) cidade.passo(passo, instant);","    cidade.ativar(cur === cidIdx); if (cur === cidIdx) cidade.passo(passo, instant);\n    if (cur === cfIdx) confia.passo(passo, instant);")
open(p,'w',encoding='utf8').write(s); print('ok')
