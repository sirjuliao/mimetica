/* Mimetica — shared page bootstrap: reveal-on-scroll, GSAP setup, canvas loop helpers */
window.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
window.narrow = window.innerWidth < 860;
window.TEAL = '43,179,163';
window.WHITE = '244,244,245';

(function(){
  var els = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  els.forEach(function(el){ io.observe(el); });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined'){
    gsap.registerPlugin(ScrollTrigger);
  }
})();

function bindReveal(field, triggerEl, opts){
  opts = opts || {};
  if (typeof ScrollTrigger === 'undefined') return;
  ScrollTrigger.create({
    trigger: triggerEl,
    start: opts.start || 'top 85%',
    end: opts.end || 'bottom 20%',
    scrub: opts.scrub !== undefined ? opts.scrub : 0.6,
    onUpdate: function(self){ field.progress = self.progress; }
  });
}

function startCanvasLoop(fields){
  function loop(t){
    for (var i = 0; i < fields.length; i++){ fields[i].draw(t); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  if (typeof ScrollTrigger !== 'undefined'){
    ScrollTrigger.addEventListener('refreshInit', function(){ window.dispatchEvent(new Event('resize')); });
  }
}
