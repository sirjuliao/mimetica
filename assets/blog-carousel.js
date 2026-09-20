/* Carrossel de posts do blog — scroll-snap nativo + botões, contador e teclado. Sem dependências. */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-carousel]').forEach(function(root){
    var track = root.querySelector('.pc-track');
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var count = root.querySelector('.pc-count');
    if (!track || !prev || !next) return;
    var items = Array.prototype.slice.call(track.children);

    function step(){
      var first = items[0];
      if (!first) return 320;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      return first.getBoundingClientRect().width + gap;
    }
    function perPage(){ return Math.max(1, Math.floor(track.clientWidth / step())); }

    function update(){
      var max = track.scrollWidth - track.clientWidth - 1;
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= max;
      if (count){
        var i = Math.min(items.length - 1, Math.round(track.scrollLeft / step()));
        count.textContent = (i + 1) + ' / ' + items.length;
      }
    }
    function go(dir){
      track.scrollBy({ left: dir * step() * perPage(), behavior: reduce ? 'auto' : 'smooth' });
    }

    prev.addEventListener('click', function(){ go(-1); });
    next.addEventListener('click', function(){ go(1); });
    track.addEventListener('scroll', function(){ window.requestAnimationFrame(update); }, { passive: true });
    track.addEventListener('keydown', function(e){
      if (e.target !== track) return;
      if (e.key === 'ArrowRight'){ e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft'){ e.preventDefault(); go(-1); }
    });
    window.addEventListener('resize', update);
    update();
  });
})();
