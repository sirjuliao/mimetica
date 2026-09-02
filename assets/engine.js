/* Mimetica — shared canvas generative-field engine, used across all pages. */
function MimeticaEngine(reduceMotion, narrow){

  function rand(a,b){ return a + Math.random()*(b-a); }
  function lerp(a,b,t){ return a + (b-a)*t; }
  function clampNum(v,a,b){ return Math.max(a, Math.min(b,v)); }
  function smoothstep(e0,e1,x){ var t = clampNum((x-e0)/(e1-e0),0,1); return t*t*(3-2*t); }
  function debounce(fn,ms){ var t; return function(){ clearTimeout(t); t=setTimeout(fn,ms); }; }
  function glow(ctx,color,blur){ ctx.shadowColor='rgb('+color+')'; ctx.shadowBlur=blur; }
  function noGlow(ctx){ ctx.shadowBlur=0; }
  function quadPoint(sx,sy,cx,cy,ex,ey,tt){
    return { x:(1-tt)*(1-tt)*sx+2*(1-tt)*tt*cx+tt*tt*ex, y:(1-tt)*(1-tt)*sy+2*(1-tt)*tt*cy+tt*tt*ey };
  }

  function setupCanvas(canvas){
    var dpr = Math.min(window.devicePixelRatio||1, 2);
    function resize(){
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width*dpr));
      canvas.height = Math.max(1, Math.round(rect.height*dpr));
      canvas.style.width = rect.width+'px'; canvas.style.height = rect.height+'px';
    }
    resize();
    window.addEventListener('resize', debounce(resize,150));
    return { ctx: canvas.getContext('2d'), get w(){return canvas.width;}, get h(){return canvas.height;}, dpr:dpr };
  }

  /* malha em perspectiva, reage sutilmente ao cursor (hero) */
  function makePerspective(canvas,color){
    var c = setupCanvas(canvas); var pts=[];
    var mouse = { x:-9999, y:-9999 };
    canvas.parentElement.addEventListener('mousemove', function(e){
      var rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX-rect.left)*c.dpr; mouse.y = (e.clientY-rect.top)*c.dpr;
    });
    canvas.parentElement.addEventListener('mouseleave', function(){ mouse.x=-9999; mouse.y=-9999; });
    function build(){ pts=[]; var w=c.w,h=c.h; var rows=narrow?16:24, cols=narrow?26:44; var vx=w*1.05, vy=-h*0.18;
      for (var r=0;r<rows;r++){ var d=Math.pow(r/(rows-1),1.6); var y=lerp(vy,h*1.05,d);
        for (var col=0;col<cols;col++){ var bx=lerp(-w*0.12,w*1.12,col/(cols-1)); var x=lerp(vx,bx,d); pts.push({bx:x,by:y,depth:d,phase:Math.random()*6.28}); } } }
    build();
    return { c:c, progress:1, draw:function(t){ var ctx=c.ctx; ctx.clearRect(0,0,c.w,c.h); ctx.fillStyle='rgb('+color+')';
      var influence = c.w*0.1;
      for (var i=0;i<pts.length;i++){ var p=pts[i];
        var j=reduceMotion?0:Math.sin(t*0.0006+p.phase)*1.4*p.depth;
        var px=p.bx, py=p.by+j;
        var dx=px-mouse.x, dy=py-mouse.y, dist=Math.sqrt(dx*dx+dy*dy);
        if (!reduceMotion && dist < influence){ var f=(1-dist/influence)*16*c.dpr; var inv=1/(dist||1); px+=dx*inv*f; py+=dy*inv*f; }
        var r=lerp(0.6,2.2,p.depth)*c.dpr; var a=lerp(0.06,0.42,p.depth)*this.progress;
        ctx.globalAlpha=a; ctx.beginPath(); ctx.arc(px,py,r,0,6.283); ctx.fill(); }
      ctx.globalAlpha=1; } };
  }

  /* raízes subindo + pulso de dado viajando por cada linha */
  function makeRoot(canvas,color){
    var c = setupCanvas(canvas); var cluster=[], roots=[];
    function build(){ var w=c.w,h=c.h; cluster=[]; var n=narrow?180:360;
      for (var i=0;i<n;i++){ var ang=Math.random()*6.283; var rad=Math.sqrt(Math.random())*w*0.22; cluster.push({x:w*0.5+Math.cos(ang)*rad,y:h*0.92+Math.sin(ang)*rad*0.18,r:rand(1,2.6)*c.dpr,phase:Math.random()*6.28}); }
      roots=[]; var lines=narrow?9:16;
      for (var j=0;j<lines;j++){ var sx=w*0.5+rand(-w*0.18,w*0.18), sy=h*0.9+rand(-h*0.02,h*0.02), ex=sx+rand(-w*0.28,w*0.28), ey=-h*0.05, cx=lerp(sx,ex,0.5)+rand(-w*0.15,w*0.15), cy=lerp(sy,ey,0.4);
        roots.push({sx:sx,sy:sy,cx:cx,cy:cy,ex:ex,ey:ey,revealAt:j/lines*0.7,pulseOffset:Math.random(),speed:rand(0.00018,0.00032)}); } }
    build();
    return { c:c, progress:0, draw:function(t){ var ctx=c.ctx; ctx.clearRect(0,0,c.w,c.h); ctx.strokeStyle='rgba('+color+',0.45)'; ctx.lineWidth=Math.max(1,c.dpr);
      for (var i=0;i<roots.length;i++){ var rt=roots[i]; var local=smoothstep(rt.revealAt,rt.revealAt+0.28,this.progress); if(local<=0) continue;
        ctx.globalAlpha=local*0.7; ctx.beginPath(); ctx.moveTo(rt.sx,rt.sy); var steps=24;
        for (var s=1;s<=steps*local;s++){ var tt=s/steps; var pt=quadPoint(rt.sx,rt.sy,rt.cx,rt.cy,rt.ex,rt.ey,tt); ctx.lineTo(pt.x,pt.y); } ctx.stroke();
        if (local>=1 && !reduceMotion){ var tt2=((t*rt.speed)+rt.pulseOffset)%1; var pp=quadPoint(rt.sx,rt.sy,rt.cx,rt.cy,rt.ex,rt.ey,tt2);
          var fade = Math.sin(tt2*Math.PI);
          ctx.save(); glow(ctx,color,7*c.dpr); ctx.fillStyle='rgb('+color+')'; ctx.globalAlpha=fade*0.95;
          ctx.beginPath(); ctx.arc(pp.x,pp.y,2*c.dpr,0,6.283); ctx.fill(); ctx.restore(); } }
      noGlow(ctx); ctx.fillStyle='rgb('+color+')'; ctx.globalAlpha=clampNum(this.progress*1.4,0,1)*0.85;
      for (var k=0;k<cluster.length;k++){ var p=cluster[k]; var br=reduceMotion?0:Math.sin(t*0.0012+p.phase)*0.3;
        ctx.beginPath(); ctx.arc(p.x,p.y+br,p.r+br,0,6.283); ctx.fill(); } ctx.globalAlpha=1; } };
  }

  /* pontos convergindo, sinais viajando até o centro */
  function makeConverge(canvas,color){
    var c = setupCanvas(canvas); var pts=[], cx=0, cy=0;
    function build(){ var w=c.w,h=c.h; cx=w*0.5; cy=h*0.5; pts=[]; var n=narrow?14:22;
      for (var i=0;i<n;i++){ var ang=Math.random()*6.283; var rad=rand(w*0.22,w*0.42); pts.push({x:cx+Math.cos(ang)*rad,y:cy+Math.sin(ang)*rad*0.7,r:rand(1.2,2.4)*c.dpr,phase:Math.random()*6.28,pulseOffset:Math.random(),speed:rand(0.00022,0.00038)}); } }
    build();
    return { c:c, progress:0, draw:function(t){ var ctx=c.ctx; ctx.clearRect(0,0,c.w,c.h);
      ctx.strokeStyle='rgba('+color+',0.18)'; ctx.lineWidth=Math.max(1,c.dpr*0.7);
      for (var i=0;i<pts.length;i++){ var p=pts[i]; var j=reduceMotion?0:Math.sin(t*0.0006+p.phase)*2;
        var px=p.x, py=p.y+j;
        ctx.globalAlpha=0.45*this.progress; ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(cx,cy); ctx.stroke();
        ctx.fillStyle='rgb('+color+')'; ctx.globalAlpha=0.7*this.progress; ctx.beginPath(); ctx.arc(px,py,p.r,0,6.283); ctx.fill();
        if (!reduceMotion && this.progress>0.4){ var tt=((t*p.speed)+p.pulseOffset)%1; var sx=px+(cx-px)*tt, sy=py+(cy-py)*tt; var fade=Math.sin(tt*Math.PI);
          ctx.save(); glow(ctx,color,6*c.dpr); ctx.globalAlpha=fade*0.9; ctx.beginPath(); ctx.arc(sx,sy,1.7*c.dpr,0,6.283); ctx.fill(); ctx.restore(); } }
      noGlow(ctx);
      var pulse = reduceMotion?0:Math.sin(t*0.0022)*0.4+0.6;
      ctx.strokeStyle='rgba('+color+','+(0.5*this.progress)+')'; ctx.lineWidth=Math.max(1,c.dpr);
      ctx.beginPath(); ctx.arc(cx,cy,(5+pulse*4)*c.dpr,0,6.283); ctx.stroke();
      ctx.fillStyle='rgb('+color+')'; ctx.globalAlpha=this.progress; ctx.beginPath(); ctx.arc(cx,cy,3*c.dpr,0,6.283); ctx.fill(); ctx.globalAlpha=1; } };
  }

  /* árvore de decisão, dado fluindo pelo caminho em destaque */
  function makeBranch(canvas,color,opts){
    opts = opts || {};
    var c = setupCanvas(canvas); var trunk=null, branches=[], mainPath=[];
    var midY = opts.midY !== undefined ? opts.midY : 0.5;
    function build(){ var w=c.w,h=c.h; trunk={sx:w*0.1,sy:h*midY,ex:w*0.4,ey:h*midY};
      var spread = opts.spread !== undefined ? opts.spread : 0.28;
      branches=[
        {sx:w*0.4,sy:h*midY,ex:w*0.68,ey:h*(midY-spread),main:false},
        {sx:w*0.4,sy:h*midY,ex:w*0.68,ey:h*midY,main:true},
        {sx:w*0.4,sy:h*midY,ex:w*0.68,ey:h*(midY+spread),main:false},
        {sx:w*0.68,sy:h*midY,ex:w*0.92,ey:h*(midY-spread*0.5),main:false},
        {sx:w*0.68,sy:h*midY,ex:w*0.92,ey:h*(midY+spread*0.5),main:true}
      ];
      mainPath = [trunk.sx,trunk.sy, trunk.ex,trunk.ey, branches[1].ex,branches[1].ey, branches[4].ex,branches[4].ey]; }
    build();
    return { c:c, progress:0, draw:function(t){ var ctx=c.ctx; ctx.clearRect(0,0,c.w,c.h);
      ctx.lineWidth=Math.max(1.2,c.dpr); ctx.strokeStyle='rgba('+color+',0.3)';
      ctx.globalAlpha=this.progress; ctx.beginPath(); ctx.moveTo(trunk.sx,trunk.sy); ctx.lineTo(trunk.ex,trunk.ey); ctx.stroke();
      for (var i=0;i<branches.length;i++){ var b=branches[i]; ctx.strokeStyle = b.main ? 'rgba('+color+',0.85)' : 'rgba('+color+',0.24)';
        ctx.globalAlpha=this.progress; ctx.beginPath(); ctx.moveTo(b.sx,b.sy); ctx.lineTo(b.ex,b.ey); ctx.stroke();
        ctx.fillStyle = b.main ? 'rgb('+color+')' : 'rgba('+color+',0.4)'; ctx.beginPath(); ctx.arc(b.ex,b.ey,(b.main?2.6:1.6)*c.dpr,0,6.283); ctx.fill(); }
      ctx.fillStyle='rgb('+color+')'; ctx.beginPath(); ctx.arc(trunk.sx,trunk.sy,2.2*c.dpr,0,6.283); ctx.fill();
      if (!reduceMotion && this.progress>0.7){
        var segs = mainPath.length/2 - 1; var loopT = (t*0.00035)%1; var seg = Math.min(segs-1, Math.floor(loopT*segs)); var segT = loopT*segs - seg;
        var x0=mainPath[seg*2], y0=mainPath[seg*2+1], x1=mainPath[seg*2+2], y1=mainPath[seg*2+3];
        var px=lerp(x0,x1,segT), py=lerp(y0,y1,segT);
        ctx.save(); glow(ctx,color,9*c.dpr); ctx.globalAlpha=0.95; ctx.fillStyle='rgb('+color+')';
        ctx.beginPath(); ctx.arc(px,py,2.4*c.dpr,0,6.283); ctx.fill(); ctx.restore();
      }
      ctx.globalAlpha=1; } };
  }

  /* linha de pulso contínua + ping no ponto de alerta */
  function makePulse(canvas,color,opts){
    opts = opts || {};
    var c = setupCanvas(canvas);
    var midY = opts.midY !== undefined ? opts.midY : 0.5;
    var amp = opts.amp !== undefined ? opts.amp : 0.15;
    return { c:c, progress:0, draw:function(t){ var ctx=c.ctx; var w=c.w,h=c.h; ctx.clearRect(0,0,w,h);
      var my=h*midY, a=h*amp; ctx.lineWidth=Math.max(1.4,c.dpr); ctx.lineJoin='round'; ctx.lineCap='round';
      ctx.strokeStyle='rgba('+color+',0.2)'; ctx.beginPath();
      for (var x=0;x<=w;x+=6){ var y=my+Math.sin(x*0.012+(reduceMotion?0:t*0.0004))*a*0.3; if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); } ctx.stroke();
      ctx.strokeStyle='rgba('+color+',0.9)'; ctx.globalAlpha=this.progress; ctx.beginPath();
      var alertX = w*0.62;
      for (var xx=0;xx<=w*this.progress;xx+=4){ var yy=my;
        if (Math.abs(xx-alertX) < w*0.05){ yy = my - Math.sin((xx-(alertX-w*0.05))/(w*0.1)*Math.PI)*a; } else { yy = my + Math.sin(xx*0.02+(reduceMotion?0:t*0.001))*a*0.15; }
        if (xx===0) ctx.moveTo(xx,yy); else ctx.lineTo(xx,yy); } ctx.stroke();
      if (this.progress > 0.6){ var pAlpha=(this.progress-0.6)/0.4;
        ctx.save(); glow(ctx,color,8*c.dpr); ctx.fillStyle='rgb('+color+')'; ctx.globalAlpha=pAlpha; ctx.beginPath(); ctx.arc(alertX, my-a, 3*c.dpr, 0, 6.283); ctx.fill(); ctx.restore();
        if (!reduceMotion){ var ringT=(t*0.0009)%1; ctx.strokeStyle='rgba('+color+','+(pAlpha*(1-ringT)*0.7)+')'; ctx.lineWidth=Math.max(1,c.dpr);
          ctx.beginPath(); ctx.arc(alertX, my-a, (3+ringT*16)*c.dpr, 0, 6.283); ctx.stroke(); } }
      ctx.globalAlpha=1; } };
  }

  /* campo esparso com micro-rede — pontos conectam vizinhos próximos */
  function makeSparse(canvas,color,opts){
    opts=opts||{}; var c=setupCanvas(canvas); var pts=[];
    function build(){ pts=[]; var w=c.w,h=c.h; var n=opts.count||(narrow?32:50);
      for (var i=0;i<n;i++){ pts.push({x:rand(0,w),y:rand(0,h),r:rand(0.9,1.9)*c.dpr,phase:Math.random()*6.28}); } }
    build();
    return { c:c, progress:0, draw:function(t){ var ctx=c.ctx; ctx.clearRect(0,0,c.w,c.h);
      var maxDist = Math.min(c.w,c.h)*(opts.linkFactor||0.16); ctx.lineWidth=Math.max(0.6,c.dpr*0.5);
      for (var i=0;i<pts.length;i++){ for (var j=i+1;j<pts.length;j++){ var dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y; var dist=Math.sqrt(dx*dx+dy*dy);
        if (dist<maxDist){ var a=(1-dist/maxDist)*0.22*this.progress; ctx.strokeStyle='rgba('+color+','+a+')'; ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); } } }
      ctx.fillStyle='rgb('+color+')';
      for (var k=0;k<pts.length;k++){ var p=pts[k]; var j2=reduceMotion?0:Math.sin(t*0.0006+p.phase)*1.4;
        ctx.globalAlpha=0.65*this.progress; ctx.beginPath(); ctx.arc(p.x,p.y+j2,p.r,0,6.283); ctx.fill(); } ctx.globalAlpha=1; } };
  }

  return {
    setupCanvas: setupCanvas,
    makePerspective: makePerspective,
    makeRoot: makeRoot,
    makeConverge: makeConverge,
    makeBranch: makeBranch,
    makePulse: makePulse,
    makeSparse: makeSparse
  };
}
