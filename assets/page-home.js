(function(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var engine = MimeticaEngine(window.reduceMotion, window.narrow);
  var TEAL = window.TEAL, WHITE = window.WHITE, narrow = window.narrow;

  var elHero=document.getElementById('c-hero'), elFontes=document.getElementById('c-fontes'),
      elPerfis=document.getElementById('c-perfis'), elDif=document.getElementById('c-dif'),
      elComp=document.getElementById('c-comportamento'), elCen=document.getElementById('c-cenarios'),
      elMon=document.getElementById('c-monitoramento'), elEcom=document.getElementById('c-ecommerce'),
      elBlog=document.getElementById('c-blog-card');
  if (!elHero||!elFontes||!elPerfis||!elDif||!elComp||!elCen||!elMon||!elEcom) return;

  var hero = engine.makePerspective(elHero, WHITE);
  var fontes = engine.makeRoot(elFontes, TEAL);
  var perfis = engine.makeSparse(elPerfis, TEAL, { count: narrow?36:60 });
  var dif = engine.makeSparse(elDif, WHITE, { count: narrow?28:44 });
  var comp = engine.makeConverge(elComp, TEAL);
  var cen = engine.makeBranch(elCen, TEAL, { midY:0.34, spread:0.18 });
  var mon = engine.makePulse(elMon, TEAL, { midY:0.36, amp:0.12 });
  var ecom = engine.makeSparse(elEcom, WHITE, { count: narrow?20:32 });

  var fields = [hero, fontes, perfis, dif, comp, cen, mon, ecom];

  if (elBlog){
    var blog = engine.makeRoot(elBlog, TEAL);
    fields.push(blog);
    bindReveal(blog, '#blog', { start:'top 90%', end:'top 20%' });
  }

  bindReveal(fontes, '#fontes', { start:'top 90%', end:'top 15%' });
  bindReveal(perfis, '#personas', { start:'top 90%', end:'top 25%' });
  bindReveal(dif, '#dif', { start:'top 90%', end:'top 25%' });
  bindReveal(comp, '#c-comportamento', { start:'top 88%', end:'top 35%' });
  bindReveal(cen, '#c-cenarios', { start:'top 88%', end:'top 35%' });
  bindReveal(mon, '#c-monitoramento', { start:'top 88%', end:'top 35%' });
  bindReveal(ecom, '#c-ecommerce', { start:'top 88%', end:'top 35%' });

  if (!window.reduceMotion){
    gsap.to('#c-hero', { yPercent:10, ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:0.6 } });
    gsap.to('#c-hero', { opacity:0, ease:'none', scrollTrigger:{ trigger:'#hero', start:'bottom 90%', end:'bottom 25%', scrub:0.6 } });
  }

  startCanvasLoop(fields);
})();
