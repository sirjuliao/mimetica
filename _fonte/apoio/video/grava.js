const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport:{ width:1080, height:2160 }, screen:{ width:540, height:1080 }, deviceScaleFactor:1 });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + process.cwd() + '/deck.html'); await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '#dica{display:none!important}' });
  await p.waitForTimeout(1500);
  console.log('retrato', await p.evaluate(() => document.documentElement.classList.contains('retrato')));
  const cdp = await ctx.newCDPSession(p); const frames = []; let t0 = null;
  cdp.on('Page.screencastFrame', async f => { const t = f.metadata.timestamp; if (t0 === null) t0 = t;
    const n = 'frames/f' + String(frames.length).padStart(5,'0') + '.jpg'; fs.writeFileSync(n, Buffer.from(f.data, 'base64')); frames.push([n, t - t0]);
    try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch(e){} });
  await cdp.send('Page.startScreencast', { format:'jpeg', quality:92, everyNthFrame:1 });
  const estado = () => p.evaluate(() => { const sl=[...document.querySelectorAll('.slide')]; const i=sl.findIndex(s=>s.classList.contains('active')); return [i, sl[i].id || 'fim', +(sl[i].dataset.step||0), sl.length]; });
  const espera = (id, st) => {
    if (id === 's-capa') return 2600; if (id === 'fim') return 3800;
    if (st === 0) return 2000;
    const m = { 's-twin':3500, 's-confia':3500, 's-cidade':3300, 's-mos':3300, 's-areas':2200, 's-renda':3200, 's-equipe':4200, 's-modelos':3200, 's-serve':2400, 's-contrata':3200 };
    return m[id] || 2600; };
  let [i, id, st, total] = await estado(); await p.waitForTimeout(espera(id, st));
  for (let k = 0; k < 120; k++){
    await p.keyboard.press('ArrowRight'); await p.waitForTimeout(80);
    const [i2, id2, st2] = await estado(); if (i2 === i && st2 === st) break; [i, id, st] = [i2, id2, st2];
    await p.waitForTimeout(espera(id, st));
  }
  await p.waitForTimeout(500); await cdp.send('Page.stopScreencast'); await p.waitForTimeout(300);
  fs.writeFileSync('frames.json', JSON.stringify(frames)); console.log('frames', frames.length, 'dur', frames.at(-1)[1].toFixed(1), errs);
  await b.close();
})();
