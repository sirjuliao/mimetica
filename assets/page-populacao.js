(function(){
  // chips: toggle active state (multi-select within each group)
  document.querySelectorAll('.chip-row').forEach(function(row){
    row.querySelectorAll('.chip').forEach(function(chip){
      chip.addEventListener('click', function(){ chip.classList.toggle('active'); });
    });
  });

  // sample slider
  var slider = document.getElementById('sample-slider');
  var sampleValue = document.getElementById('sample-value');
  if (slider && sampleValue){
    slider.addEventListener('input', function(){
      var n = parseInt(slider.value, 10).toLocaleString('pt-BR');
      sampleValue.innerHTML = n + '<span class="unit">generativos</span>';
    });
  }

  // form submit: send to the same lead endpoint the site already uses (Formspree)
  var form = document.getElementById('config-form');
  var confirmEl = document.getElementById('config-confirm');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  var chipLabels = { classe: 'Classe Social', geracao: 'Geração', genero: 'Gênero', regiao: 'Região' };
  var confirmDefaultText = confirmEl ? confirmEl.textContent : '';

  if (form && confirmEl){
    form.addEventListener('submit', function(e){
      e.preventDefault();

      var data = new FormData(form);
      data.set('Amostra', slider ? slider.value : '500');
      Object.keys(chipLabels).forEach(function(group){
        var row = form.querySelector('.chip-row[data-group="' + group + '"]');
        if (!row) return;
        var selected = [];
        row.querySelectorAll('.chip.active').forEach(function(c){ selected.push(c.textContent.trim()); });
        data.set(chipLabels[group], selected.join(', '));
      });

      if (submitBtn) submitBtn.disabled = true;
      confirmEl.classList.remove('error');

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function(r){
        if (!r.ok) throw new Error('submit failed');
        confirmEl.textContent = confirmDefaultText;
        confirmEl.classList.add('visible');
        confirmEl.scrollIntoView({ behavior: window.reduceMotion ? 'auto' : 'smooth', block: 'center' });
        form.reset();
        form.querySelectorAll('.chip.active').forEach(function(c){ c.classList.remove('active'); });
        if (slider && sampleValue){ slider.value = 500; sampleValue.innerHTML = '500<span class="unit">generativos</span>'; }
      }).catch(function(){
        confirmEl.textContent = 'Não conseguimos enviar agora. Tente de novo em instantes.';
        confirmEl.classList.add('visible', 'error');
        confirmEl.scrollIntoView({ behavior: window.reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }).finally(function(){
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var engine = MimeticaEngine(window.reduceMotion, window.narrow);
  var WHITE = window.WHITE, narrow = window.narrow;

  var elPageHero=document.getElementById('c-page-hero');
  if (!elPageHero) return;
  var pageHero = engine.makeSparse(elPageHero, WHITE, { count: narrow?30:52 });
  var fields = [pageHero];

  bindReveal(pageHero, '#page-hero', { start:'top 100%', end:'top 20%' });

  startCanvasLoop(fields);
})();
