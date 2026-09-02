(function(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var engine = MimeticaEngine(window.reduceMotion, window.narrow);
  var TEAL = window.TEAL, WHITE = window.WHITE, narrow = window.narrow;

  var elPageHero=document.getElementById('c-page-hero'), elPost=document.getElementById('c-post-card');
  if (!elPageHero||!elPost) return;

  var pageHero = engine.makeSparse(elPageHero, WHITE, { count: narrow?30:52 });
  var post = engine.makeRoot(elPost, TEAL);

  var fields = [pageHero, post];

  bindReveal(pageHero, '#page-hero', { start:'top 100%', end:'top 20%' });
  bindReveal(post, '.post-feature', { start:'top 90%', end:'top 25%' });

  startCanvasLoop(fields);
})();
