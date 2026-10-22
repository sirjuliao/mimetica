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
    aConfirmar: true,   // mostra o aviso "números a confirmar" no fecho
    id: "Gêmeo digital nº 1.274",
    resumo: "Mulher · 47 anos · interior de Minas Gerais",
    // [campo, valor, tipo (m = medido, i = inferido, ia = IA), origem]
    linhas: [
      ["Estado · situação", "Minas Gerais · urbana", "m", "Censo"],
      ["Sexo · idade", "Feminino · 47 anos", "m", "Censo"],
      ["Escolaridade", "Ensino médio completo", "m", "PNAD"],
      ["Renda familiar", "2 a 3 salários mínimos", "m", "PNAD"],
      ["Ocupação", "Assalariada, comércio", "m", "PNAD"],
      ["Gasto com alimentação", "R$ 800 a 1.200 por mês", "m", "POF"],
      ["Saúde declarada", "Hipertensão", "m", "PNS"],
      ["Uso de remédio para obesidade", "Não usa; conhece pelo noticiário", "i", "dado oficial"],
      ["Sensibilidade a preço", "Alta; troca de marca com frequência", "i", "renda × gasto"],
      ["Personalidade", "Organizada, reservada, cuidadosa", "ia", "cinco traços"],
      ["Como decide uma compra", "Consulta a família; compara em duas lojas", "ia", "IA"],
      ["Voz", "Direta, sem jargão; cita a mãe e o custo do gás", "ia", "IA"]
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
      <div class="cf-cab"><svg class="cf-sil" id="cfSil" viewBox="2 170 1178 1649" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="{D}"/></svg>
        <div><p class="cf-id" id="cfId"></p><p class="cf-res" id="cfRes"></p></div>
        <div class="cf-leg"><span class="tg m">Medido</span><span class="tg i">Inferido</span><span class="tg ia">IA</span></div></div>
      <div class="cf-cols"><span>Campo</span><span>Valor</span><span>Origem</span></div>
      <div class="cf-linhas" id="cfLinhas"></div>
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
.cf-card{position:absolute; left:600px; top:150px; width:900px; box-sizing:border-box; border:1px solid var(--fio); border-radius:6px; background:#FBFAF7; padding:22px 26px 18px}
.cf-cab{display:grid; grid-template-columns:54px 1fr auto; gap:18px; align-items:center; padding-bottom:16px; border-bottom:1px solid var(--fio)}
.cf-sil{width:54px; height:66px; display:block}
.cf-sil path{fill:var(--texto)}
.cf-id{font:600 24px/1.1 var(--f-tit); color:var(--texto)}
.cf-res{margin-top:6px; font:500 14px/1.3 var(--f-mono); color:var(--texto2)}
.cf-leg{display:flex; gap:8px}
.tg{display:inline-block; font:600 11.5px/1 var(--f-mono); letter-spacing:1px; text-transform:uppercase; padding:6px 8px; border-radius:3px; white-space:nowrap}
.tg.m{background:var(--texto); color:var(--osso); border:1px solid var(--texto)}
.tg.i{border:1px solid var(--texto); color:var(--texto)}
.tg.ia{border:1px dashed var(--texto2); color:var(--texto2)}
.cf-cols{display:grid; grid-template-columns:250px 1fr 210px; gap:14px; padding:12px 0 6px; font:500 12px/1 var(--f-mono); letter-spacing:1.5px; text-transform:uppercase; color:#8E8C86}
.cf-linhas{display:flex; flex-direction:column}
.cf-ln{display:grid; grid-template-columns:250px 1fr 210px; gap:14px; align-items:center; padding:7px 0; border-top:1px solid rgba(29,29,27,.08); font-size:17px; line-height:1.3}
.cf-ln .c{color:var(--texto2); font-size:15.5px}
.cf-ln .v{color:var(--texto); position:relative}
.cf-ln .v i{font-style:normal}
.cf-ln .v i{opacity:0; transition:opacity .4s}
.cf-ln .o{display:flex; align-items:center; gap:8px; opacity:0; transform:translateX(8px); transition:opacity .4s, transform .4s}
.cf-ln.on .v i, .cf-ln.on .o{opacity:1; transform:none}
.cf-ln .cad{width:12px; height:13px; opacity:0; transition:opacity .4s}
.cf-ln .cad svg{display:block}
.cf-card.travado .cf-ln.m .cad{opacity:1}
.cf-card.semia .cf-ln.ia{opacity:.25; transition:opacity .6s}
.cf-card.semia .cf-ln.ia .v{text-decoration:line-through; text-decoration-color:rgba(29,29,27,.5)}
.cf-ln .cursor{display:inline-block; width:2px; height:1em; background:var(--texto); vertical-align:-2px; margin-left:1px; animation:cfPisca .8s steps(1) infinite}
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
html.retrato .cf-card{left:60px; top:140px; width:780px; padding:24px 26px 20px}
html.retrato .cf-cab{grid-template-columns:64px 1fr; gap:18px}
html.retrato .cf-sil{width:64px; height:78px}
html.retrato .cf-leg{grid-column:1 / -1}
html.retrato .tg{font-size:18px; padding:8px 10px}
html.retrato .cf-id{font-size:34px}
html.retrato .cf-res{font-size:21px}
html.retrato .cf-cols{grid-template-columns:210px 1fr 215px; font-size:16px}
html.retrato .cf-ln{grid-template-columns:210px 1fr 215px; font-size:22px; padding:9px 0}
html.retrato .cf-ln .c{font-size:20px}
html.retrato .cf-ln .o .tg{font-size:12.5px; padding:6px 6px; letter-spacing:.5px}
html.retrato .cf-painel{left:60px; top:1110px; width:780px; gap:18px}
html.retrato .cf-rot{font-size:24px; letter-spacing:3px}
html.retrato .cf-tit{font-size:56px; line-height:1.08}
html.retrato .cf-txt{font-size:34px; line-height:1.42}
html.retrato .cf-tl{grid-template-columns:150px 1fr 100px}
html.retrato .cf-tl b, html.retrato .cf-tl em{font-size:24px}
html.retrato .cf-ok i{width:34px; height:34px}
html.retrato .cf-frase{font-size:38px}
html.retrato .cf-fecho{left:60px; top:1110px; width:780px; padding:34px 36px}
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
    $('cfId').textContent = C.id; $('cfRes').textContent = C.resumo; $('cfFecho').textContent = C.fecho;
    $('cfAviso').style.display = C.aConfirmar ? '' : 'none';
    const NOME = { m: "Medido", i: "Inferido", ia: "IA" };
    const CAD = '<svg width="12" height="13" viewBox="0 0 12 13"><rect x="1" y="5.5" width="10" height="7" rx="1" fill="#1D1D1B"/><path d="M3.2 5.5V3.8a2.8 2.8 0 0 1 5.6 0v1.7" fill="none" stroke="#1D1D1B" stroke-width="1.4"/></svg>';
    const linhas = C.linhas.map(([campo, valor, tipo, origem]) => {
      const d = document.createElement('div'); d.className = 'cf-ln ' + tipo;
      d.innerHTML = '<span class="c"></span><span class="v"><i></i></span><span class="o"><span class="tg ' + tipo + '"></span><span class="cad">' + (tipo === 'm' ? CAD : '') + '</span></span>';
      d.querySelector('.c').textContent = campo; d.querySelector('.v i').textContent = valor;
      d.querySelector('.tg').textContent = tipo === 'ia' ? (origem === 'IA' ? 'IA' : 'IA · ' + origem) : NOME[tipo] + ' · ' + origem;
      $('cfLinhas').appendChild(d); return { d, tipo, valor };
    });
    C.numeros.forEach(([n, t]) => { const d = document.createElement('div'); d.innerHTML = '<b></b><span></span>'; d.firstChild.textContent = n; d.lastChild.textContent = t; $('cfNums').appendChild(d); });
    [$('cfOk1'), $('cfOk2')].forEach(el => { for (let k = 0; k < 6; k++){ const i = document.createElement('i'); i.style.setProperty('--k', k + (el.id === 'cfOk2' ? 7 : 0)); el.appendChild(i); } });
    let timers = [], ultimo = -1;
    const limpa = () => { timers.forEach(clearTimeout); timers = []; };
    function digita(L, atraso){
      const v = L.d.querySelector('.v i'); v.textContent = '';
      timers.push(setTimeout(() => { let k = 0; L.d.classList.add('on'); const cur = document.createElement('span'); cur.className = 'cursor'; L.d.querySelector('.v').appendChild(cur);
        const passo = () => { v.textContent = L.valor.slice(0, ++k); if (k < L.valor.length) timers.push(setTimeout(passo, 26)); else cur.remove(); }; passo(); }, atraso));
    }
    function setPasso(p, instant){
      limpa(); const card = $('cfCard'), P = C.passos[p], pn = $('cfPainel');
      linhas.forEach(L => { L.d.classList.remove('on'); L.d.querySelector('.v i').textContent = L.valor; const c = L.d.querySelector('.cursor'); if (c) c.remove(); });
      card.classList.toggle('travado', p >= 4); card.classList.toggle('semia', p >= 5);
      const mostra = (tipo, base) => linhas.filter(L => L.tipo === tipo).forEach((L, k) => { if (instant) L.d.classList.add('on'); else timers.push(setTimeout(() => L.d.classList.add('on'), base + k * 230)); });
      if (p >= 2) mostra('m', p === 2 ? 200 : -1e4);
      if (p >= 3) mostra('i', p === 3 ? 200 : -1e4);
      if (p >= 4){ const ia = linhas.filter(L => L.tipo === 'ia');
        if (p === 4 && !instant){ let t = 700; ia.forEach(L => { digita(L, t); t += 300 + L.valor.length * 26; }); } else ia.forEach(L => L.d.classList.add('on')); }
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
