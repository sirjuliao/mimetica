(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var prog = document.getElementById("prog");
  function onScroll(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  var tip = document.getElementById("tip");
  function bindTip(el, text){
    el.addEventListener("mouseenter", function(){ tip.textContent = text; tip.classList.add("on"); });
    el.addEventListener("mousemove", function(e){
      var x = e.clientX + 14, y = e.clientY + 16;
      if (x + 265 > window.innerWidth) x = e.clientX - 265;
      if (y + 70 > window.innerHeight) y = e.clientY - 60;
      tip.style.left = x + "px"; tip.style.top = y + "px";
    });
    el.addEventListener("mouseleave", function(){ tip.classList.remove("on"); });
  }

  function barRows(host, data, opts){
    opts = opts || {};
    var max = opts.max || 100, color = opts.color || "var(--c1)";
    data.forEach(function(d, i){
      var row = document.createElement("div"); row.className = "row";
      var lab = document.createElement("div"); lab.className = "lab"; lab.textContent = d.label;
      var track = document.createElement("div"); track.className = "track";
      var bar = document.createElement("div"); bar.className = "bar";
      bar.style.width = Math.max(0.4, (d.value / max) * 100) + "%";
      bar.style.background = d.color || color;
      bar.style.transitionDelay = (reduce ? 0 : i * 60) + "ms";
      var val = document.createElement("span"); val.className = "val";
      val.textContent = d.display || (String(d.value).replace(".", ",") + "%");
      bindTip(bar, d.tip || (d.label + ": " + val.textContent));
      track.appendChild(bar); track.appendChild(val);
      row.appendChild(lab); row.appendChild(track); host.appendChild(row);
    });
  }

  function stackRows(host, rows, series){
    rows.forEach(function(r, i){
      var row = document.createElement("div"); row.className = "row";
      row.style.gridTemplateColumns = "minmax(56px,74px) 1fr auto";
      var lab = document.createElement("div"); lab.className = "lab"; lab.textContent = r.label;
      var st = document.createElement("div"); st.className = "stack-row";
      r.values.forEach(function(v, j){
        var seg = document.createElement("div"); seg.className = "seg";
        seg.style.flex = v + " 0 0%"; seg.style.background = series[j].color;
        seg.style.transitionDelay = (reduce ? 0 : (i * 70 + j * 50)) + "ms";
        if (v === 0) seg.style.display = "none";
        bindTip(seg, r.label + " · " + series[j].name + ": " + String(v).replace(".", ",") + "%");
        st.appendChild(seg);
      });
      var val = document.createElement("span"); val.className = "val"; val.textContent = "n=" + r.n;
      row.appendChild(lab); row.appendChild(st); row.appendChild(val);
      host.appendChild(row);
    });
  }

  function groupRows(host, rows, series, max){
    rows.forEach(function(r, i){
      var row = document.createElement("div"); row.className = "row";
      row.style.alignItems = "start";
      var lab = document.createElement("div"); lab.className = "lab"; lab.textContent = r.label;
      lab.style.paddingTop = "4px";
      var box = document.createElement("div");
      box.style.display = "flex"; box.style.flexDirection = "column"; box.style.gap = "3px";
      r.values.forEach(function(v, j){
        var track = document.createElement("div"); track.className = "track"; track.style.height = "13px";
        var bar = document.createElement("div"); bar.className = "bar";
        bar.style.height = "13px"; bar.style.width = Math.max(0.4, (v / max) * 100) + "%";
        bar.style.background = series[j].color;
        bar.style.transitionDelay = (reduce ? 0 : (i * 70 + j * 45)) + "ms";
        var val = document.createElement("span"); val.className = "val"; val.style.fontSize = "11px";
        val.textContent = v + "%";
        bindTip(bar, series[j].name + " · " + r.label + ": " + v + "%");
        track.appendChild(bar); track.appendChild(val); box.appendChild(track);
      });
      row.appendChild(lab); row.appendChild(box); host.appendChild(row);
    });
  }

  /* margem de erro vs n */
  (function(){
    var host = document.getElementById("icchart");
    if (!host) return;
    var W = 740, H = 310, ml = 48, mr = 100, mt = 22, mb = 36;
    var pw = W - ml - mr, ph = H - mt - mb;
    var nMin = 10, nMax = 2600;
    function x(n){ return ml + (Math.log(n) - Math.log(nMin)) / (Math.log(nMax) - Math.log(nMin)) * pw; }
    function moe(n){ return 1.96 * Math.sqrt(0.25 / n) * 100; }
    var yMax = 33;
    function y(v){ return mt + ph - (v / yMax) * ph; }

    var d = "";
    for (var n = nMin; n <= nMax; n *= 1.035){
      d += (d ? "L" : "M") + x(n).toFixed(1) + " " + y(moe(n)).toFixed(1) + " ";
    }
    d += "L" + x(nMax).toFixed(1) + " " + y(moe(nMax)).toFixed(1);

    var svg = ['<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="Curva da margem de erro em função do tamanho da célula: ±28 pontos percentuais com n=12, ±12 com n=67, ±6,9 com n=200 e ±2 com n=2516.">'];
    [0, 5, 10, 20, 30].forEach(function(v){
      svg.push('<line class="grid" x1="' + ml + '" x2="' + (ml + pw) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>');
      svg.push('<text class="axl" x="' + (ml - 9) + '" y="' + (y(v) + 3.5) + '" text-anchor="end">±' + v + '</text>');
    });
    [10, 50, 200, 1000, 2500].forEach(function(v){
      svg.push('<text class="axl" x="' + x(v) + '" y="' + (mt + ph + 21) + '" text-anchor="middle">n=' + v + '</text>');
    });
    svg.push('<path class="linePath" d="' + d + '"/>');

    [{n:12, t:"corte SE descartado"}, {n:67, t:"célula de cenário"},
     {n:200, t:"pergunta do omnibus"}, {n:2516, t:"onda completa"}].forEach(function(m){
      var mx = x(m.n), my = y(moe(m.n));
      var end = m.n >= 1000, dx = end ? -11 : 11, anchor = end ? "end" : "start";
      svg.push('<circle class="mk" cx="' + mx.toFixed(1) + '" cy="' + my.toFixed(1) + '" r="5.5"/>');
      svg.push('<text class="mklab" x="' + (mx + dx).toFixed(1) + '" y="' + (my - 26).toFixed(1) + '" text-anchor="' + anchor + '">±' + moe(m.n).toFixed(1).replace(".", ",") + ' p.p.</text>');
      svg.push('<text class="mksub" x="' + (mx + dx).toFixed(1) + '" y="' + (my - 13).toFixed(1) + '" text-anchor="' + anchor + '">' + m.t + '</text>');
    });
    svg.push('</svg>');
    host.innerHTML = svg.join("");
  })();

  barRows(document.getElementById("estrows"), [
    {label:"Considerando",        value:22, tip:"22 de 100 · ainda não iniciou"},
    {label:"Iniciante",           value:20, tip:"20 de 100 · início recente"},
    {label:"Titulação",           value:37, tip:"37 de 100 · ajustando dose"},
    {label:"Manutenção",          value:9,  tip:"9 de 100 · dose estável"},
    {label:"Platô",               value:1,  tip:"1 de 100"},
    {label:"Parou por custo",     value:2,  color:"var(--c2)", tip:"2 de 100 · 1 já retornou dentro da janela"},
    {label:"Parou por colateral", value:1,  color:"var(--c2)", tip:"1 de 100"},
    {label:"Não mencionou",       value:8,  color:"var(--ink-3)", tip:"8 de 100 · sem evidência, declarado, não imputado"}
  ], {max:40});

  barRows(document.getElementById("canalrows"), [
    {label:"Médico ou nutricionista", value:43.5, tip:"87 de 200"},
    {label:"Redes sociais",           value:28,   tip:"56 de 200"},
    {label:"Amigos ou familiares",    value:14,   tip:"28 de 200"},
    {label:"Notícias e jornais",      value:7,    tip:"14 de 200"},
    {label:"Publicidade",             value:4.5,  tip:"9 de 200"},
    {label:"Farmácia",                value:1.5,  tip:"3 de 200"},
    {label:"Outros",                  value:1.5,  color:"var(--ink-3)", tip:"3 de 200"}
  ], {max:50});

  stackRows(document.getElementById("classerows"), [
    {label:"Classe A",  values:[87, 0, 13],  n:15},
    {label:"Classe B1", values:[91, 3, 6],   n:33},
    {label:"Classe B2", values:[69, 19, 11], n:36},
    {label:"Classe C",  values:[62, 32, 5],  n:74},
    {label:"Classe D",  values:[56, 41, 3],  n:32},
    {label:"Classe E",  values:[20, 80, 0],  n:10}
  ], [
    {name:"Perda de peso / obesidade", color:"var(--c1)"},
    {name:"Não sei",                   color:"var(--c4)"},
    {name:"Diabetes tipo 2",           color:"var(--c3)"}
  ]);

  barRows(document.getElementById("ffrows"), [
    {label:"Em uso consolidado", value:100, tip:"17 pessoas · redução universal"},
    {label:"Em uso recente",     value:86,  tip:"28 pessoas"},
    {label:"Ex-usuário",         value:65,  color:"var(--c2)", tip:"33 pessoas · mantêm a redução após parar"},
    {label:"Considerando",       value:8,   color:"var(--ink-3)", tip:"47 pessoas · controle interno"},
    {label:"Nunca usou",         value:1,   color:"var(--ink-3)", tip:"67 pessoas · controle interno"}
  ], {max:100});

  groupRows(document.getElementById("cenrows"), [
    {label:"Até R$ 150", values:[36, 42, 40]},
    {label:"R$ 180",     values:[4, 2, 4]},
    {label:"R$ 250",     values:[4, 7, 4]},
    {label:"R$ 280",     values:[10, 11, 7]},
    {label:"R$ 300",     values:[3, 2, 9]},
    {label:"R$ 350",     values:[9, 7, 9]},
    {label:"R$ 400",     values:[25, 18, 20]},
    {label:"R$ 450",     values:[6, 7, 4]}
  ], [
    {name:"Cenário A · −35%", color:"var(--c1)"},
    {name:"Cenário B · −60%", color:"var(--c2)"},
    {name:"Cenário C · −80%", color:"var(--c3)"}
  ], 45);

  var figs = document.querySelectorAll(".anim");
  if (!("IntersectionObserver" in window) || reduce){
    figs.forEach(function(f){ f.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, {threshold:0.18});
    figs.forEach(function(f){ io.observe(f); });
  }

  /* campo micelial da capa — filamentos que se conectam, discretos */
  (function(){
    var cv = document.getElementById("micelio");
    if (!cv || reduce) return;
    var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [], W = 0, H = 0;
    function ink(){
      var dark = getComputedStyle(document.body).backgroundColor;
      var m = dark.match(/\d+/g);
      var isDark = m && (parseInt(m[0],10) + parseInt(m[1],10) + parseInt(m[2],10)) < 300;
      return isDark ? "194,219,74" : "45,168,5";
    }
    var rgb = ink();
    function resize(){
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = [];
      var count = Math.round(Math.min(110, Math.max(38, W / 13)));
      for (var i = 0; i < count; i++){
        nodes.push({x: Math.random() * W, y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.13, vy: (Math.random() - 0.5) * 0.13});
      }
    }
    function frame(){
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++){
        var a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        for (var j = i + 1; j < nodes.length; j++){
          var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < 14000){
            ctx.strokeStyle = "rgba(" + rgb + "," + (0.15 * (1 - d2 / 14000)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(" + rgb + ",0.26)";
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.2, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    resize(); window.addEventListener("resize", resize); requestAnimationFrame(frame);
  })();
})();
