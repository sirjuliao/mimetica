(function(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var engine = MimeticaEngine(window.reduceMotion, window.narrow);
  var TEAL = window.TEAL, WHITE = window.WHITE, narrow = window.narrow;

  var elPageHero=document.getElementById('c-page-hero'), elFeatures=document.getElementById('c-features');
  if (!elPageHero||!elFeatures) return;

  var pageHero = engine.makeSparse(elPageHero, WHITE, { count: narrow?30:52 });
  var features = engine.makeSparse(elFeatures, TEAL, { count: narrow?26:46 });

  var fields = [pageHero, features];

  bindReveal(pageHero, '#page-hero', { start:'top 100%', end:'top 20%' });
  bindReveal(features, '#features', { start:'top 90%', end:'top 25%' });

  startCanvasLoop(fields);
})();
