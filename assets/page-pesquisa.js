(function(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var engine = MimeticaEngine(window.reduceMotion, window.narrow);
  var TEAL = window.TEAL, WHITE = window.WHITE, narrow = window.narrow;

  var elPageHero=document.getElementById('c-page-hero'),
      elComp=document.getElementById('c-p-comportamento'), elCen=document.getElementById('c-p-cenarios'),
      elMon=document.getElementById('c-p-monitoramento'), elEcom=document.getElementById('c-p-ecommerce');
  if (!elPageHero||!elComp||!elCen||!elMon||!elEcom) return;

  var pageHero = engine.makeSparse(elPageHero, WHITE, { count: narrow?30:52 });
  var comp = engine.makeConverge(elComp, TEAL);
  var cen = engine.makeBranch(elCen, TEAL);
  var mon = engine.makePulse(elMon, TEAL);
  var ecom = engine.makeSparse(elEcom, WHITE, { count: narrow?22:34 });

  var fields = [pageHero, comp, cen, mon, ecom];

  bindReveal(pageHero, '#page-hero', { start:'top 100%', end:'top 20%' });
  bindReveal(comp, '#p-comportamento', { start:'top 88%', end:'top 35%' });
  bindReveal(cen, '#p-cenarios', { start:'top 88%', end:'top 35%' });
  bindReveal(mon, '#p-monitoramento', { start:'top 88%', end:'top 35%' });
  bindReveal(ecom, '#p-ecommerce', { start:'top 88%', end:'top 35%' });

  startCanvasLoop(fields);
})();
