const { chromium } = require('playwright');
const fs = require('fs');
(async()=>{
  const b = await chromium.launch(); const p = await b.newPage({ viewport:{ width:1600, height:900 } });
  await p.emulateMedia({ media:'screen' });
  const errs=[]; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + process.cwd() + '/deck.html'); await p.waitForTimeout(1500);
  await p.evaluate(() => document.fonts.ready);
  const qr = fs.readFileSync('qr.svg','utf8');
  const estado = () => p.evaluate(() => { const sl=[...document.querySelectorAll('.slide')]; const i=sl.findIndex(s=>s.classList.contains('active')); return [i, +(sl[i].dataset.step||0)]; });
  async function ir(si, st){ for(let n=0;n<80;n++){ const [i,s]=await estado(); if(i===si && s===st) return; await p.keyboard.press('ArrowRight'); await p.waitForTimeout(60);} throw new Error('nao chegou '+si+','+st); }
  async function qrOn(lado){ await p.evaluate(([svg, lado]) => { const d=document.createElement('div'); d.id='qrbox';
    d.style.cssText=(lado==='dir'?'position:absolute;right:92px;bottom:140px;background:#0C0C0E;padding:16px;':'position:absolute;left:107px;bottom:160px;')+'display:flex;align-items:center;gap:18px;z-index:9;color:#F5F4F0;font:500 15px/1.4 "JetBrains Mono",monospace';
    d.innerHTML='<div style="background:#F5F4F0;padding:10px;width:92px;height:92px">'+svg.replace('<svg','<svg width="92" height="92"')+'</div><div>Veja a versão animada<br><b style="font-weight:600">mimetica.institute/apoio</b></div>';
    document.querySelector('.slide.active').appendChild(d); }, [qr, lado]); }
  async function qrOff(){ await p.evaluate(() => { const d=document.getElementById('qrbox'); if(d) d.remove(); }); }
  const quadros = [[0,0,1500,true],[1,5,2800],[2,0,1800],[2,3,3200],[2,5,3400],[2,7,4200],[3,4,8000],[3,6,2000],[4,5,6000],[5,1,3400],[5,2,3600],[5,3,6200],[5,4,3600],[6,7,3000],'tabela',[7,3,3400],[8,0,1500,true]];
  let k=0;
  for (const q of quadros){
    k++; const nome = 'f' + String(k).padStart(2,'0') + '.pdf';
    if (q === 'tabela'){ const t = await b.newPage({ viewport:{ width:1600, height:900 } }); await t.goto('file://' + process.cwd() + '/tabela.html'); await t.evaluate(() => document.fonts.ready); await t.waitForTimeout(500);
      await t.pdf({ path:nome, width:'1600px', height:'900px', printBackground:true, pageRanges:'1' }); await t.screenshot({ path:nome.replace('.pdf','.png') }); await t.close(); continue; }
    const [si, st, w, comQR] = q;
    if (si === 0 && st === 0) { await p.keyboard.press('Home'); }
    await ir(si, st); await p.waitForTimeout(w);
    if (comQR) await qrOn(si === 0 ? 'dir' : 'esq');
    if (si === 8) await p.evaluate(() => { const d=document.createElement('div'); d.id='contato';
      d.style.cssText='position:absolute;right:107px;bottom:160px;text-align:right;color:#F5F4F0;z-index:9';
      d.innerHTML='<div style="font:600 30px/1.2 Space Grotesk,sans-serif;letter-spacing:-.4px">Fernando Julião</div>'
        +'<div style="margin-top:12px;font:500 19px/1.6 JetBrains Mono,monospace;color:#C9C7C0">fernando@mimetica.net<br>+55 11 97633-1881</div>';
      document.querySelector('.slide.active').appendChild(d); });
    await p.pdf({ path:nome, width:'1600px', height:'900px', printBackground:true, pageRanges:'1' });
    await p.screenshot({ path:nome.replace('.pdf','.png') });
    if (comQR) await qrOff();
  }
  console.log('erros', errs); await b.close();
})();
