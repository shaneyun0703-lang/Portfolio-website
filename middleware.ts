export const config = {
  matcher: ["/((?!_vercel|primer|assets|favicon\\.ico|.*\\.[a-z]{2,4}$).*)"],
};

const COOKIE = "pf_auth";

async function token(password: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`portfolio:${password}`)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function cookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of (header ?? "").split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k) out[k.trim()] = v.join("=");
  }
  return out;
}

function gatePage(redirect = "/", error?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Shane Yun · Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
  <script>(function(){try{var skip=${error ? "true" : "false"};var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!skip&&!rm){document.documentElement.className+=' anim';}}catch(e){}})();</script>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;
      background:#1c1c1e;font-family:'Inter',system-ui,sans-serif;overflow:hidden;position:relative}
    .bg{position:absolute;inset:0;pointer-events:none}
    .grid{position:absolute;inset:0;opacity:.06;
      background-image:linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),
        linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px),
        linear-gradient(rgba(255,255,255,.85) 1px,transparent 1px),
        linear-gradient(90deg,rgba(255,255,255,.85) 1px,transparent 1px);
      background-size:24px 24px,24px 24px,120px 120px,120px 120px;background-position:center center}
    #starsWrap{position:absolute;inset:0}
    .anim #starsWrap{opacity:0}
    #starsWrap.in{animation:bloom 2.4s ease-out forwards}
    @keyframes bloom{0%{opacity:0;filter:brightness(2.6) blur(3px)}45%{opacity:1;filter:brightness(1.7) blur(0)}100%{opacity:1;filter:brightness(1) blur(0)}}
    #stars{position:absolute;inset:0;width:100%;height:100%}
    .vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 30%,#1c1c1e 75%)}
    .wrap{position:relative;z-index:10;width:100%;max-width:420px;padding:0 24px}
    .title{text-align:center;margin-bottom:48px}
    .title h1{font-family:'Syne',system-ui,sans-serif;font-size:3.5rem;font-weight:800;
      letter-spacing:-.04em;color:#fff;line-height:1;text-transform:uppercase}
    .title p{margin-top:12px;font-family:'JetBrains Mono',monospace;font-size:15px;
      color:rgba(255,255,255,.5);letter-spacing:.15em;text-transform:uppercase}
    .cardWrap{position:relative;z-index:10}
    .cardShadow{position:absolute;inset:0;border-radius:12px;pointer-events:none;
      box-shadow:0 8px 24px rgba(0,0,0,.3);opacity:1}
    .anim .cardShadow{opacity:0}
    .cardShadow.in{opacity:1;transition:opacity .8s ease .45s}
    .box{position:relative;background:rgba(28,28,32,.28);border:1px solid rgba(255,255,255,.1);
      border-radius:12px;padding:28px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
      transition:clip-path .7s cubic-bezier(.22,1,.36,1)}
    .anim .box{clip-path:inset(0 100% 0 0)}
    .box.in{clip-path:inset(0 0 0 0)}
    .field{position:relative}
    /* The box (bg/border/blur) lives on the wrapper so the input's emoji filter never tints it. */
    .field{position:relative;border-radius:7px;background:rgba(255,255,255,.06);
      border:1px solid ${error ? "rgba(255,80,80,0.5)" : "rgba(255,255,255,0.1)"};
      box-shadow:0 2px 10px rgba(0,0,0,.18);
      backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
    .field:focus-within{border-color:rgba(255,255,255,.2)}
    .field.has{background:rgba(90,210,130,.05);border-color:rgba(120,225,150,.16);
      box-shadow:0 2px 10px rgba(0,0,0,.18),inset 0 0 18px rgba(90,210,130,.05)}
    .field.err-on{border-color:rgba(255,80,80,.5)}
    .disp{width:100%;padding:14px 48px 14px 16px;border-radius:7px;font-size:15px;line-height:24px;outline:none;
      font-family:'JetBrains Mono',monospace;caret-color:#fff;color:rgba(255,255,255,.9);
      white-space:nowrap;overflow:hidden;background:transparent;border:none}
    .disp::placeholder{color:rgba(255,255,255,.25)}
    /* masked emoji glyphs: subtle green tint only on the glyphs (box stays put). Instant (no transition). */
    .disp.masked{filter:grayscale(1) sepia(1) hue-rotate(55deg) saturate(1.4) brightness(1.05);
      text-shadow:0 0 4px rgba(90,210,130,.14);font-size:16px;letter-spacing:.12em}
    .toggle{position:absolute;right:12px;top:50%;transform:translateY(-50%);
      background:none;border:none;cursor:pointer;color:rgba(255,255,255,.3);
      display:flex;align-items:center;justify-content:center;padding:4px;
      transition:opacity .2s,color .2s;width:18px;height:18px;flex-shrink:0;
      opacity:0;pointer-events:none}
    .toggle{color:rgba(255,255,255,.55)}
    .toggle.show{opacity:1;pointer-events:auto}
    .toggle svg{position:absolute;top:0;left:0;transition:opacity .15s}
    .toggle .eye-off{opacity:0}
    .toggle.shown .eye-on{opacity:0}
    .toggle.shown .eye-off{opacity:1}
    .err{font-family:'JetBrains Mono',monospace;color:#ff7a7a;font-size:11px;
      letter-spacing:.04em;text-align:center;margin-top:10px;text-transform:lowercase}
    .submit{width:100%;margin-top:16px;padding:14px;border-radius:7px;min-height:52px;
      font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:600;letter-spacing:.1em;text-transform:lowercase;
      color:#fff;cursor:pointer;transition:background .2s,border-color .2s;
      background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.08);
      backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
    .submit:hover{background:rgba(255,255,255,.17);border-color:rgba(255,255,255,.16)}
    .foot{text-align:center;margin-top:24px;font-family:'JetBrains Mono',monospace;
      font-size:11px;color:rgba(255,255,255,.8);height:16px;line-height:16px;white-space:nowrap;
      letter-spacing:.04em;text-transform:lowercase}
    .foot .hid{opacity:0}
    .anim .foot{visibility:hidden}
    .foot .em{color:#fff;font-weight:500}
    .foot .caret{color:rgba(255,255,255,.4)}
  </style>
</head>
<body>
  <div class="bg">
    <div class="grid"></div>
    <div id="starsWrap"><canvas id="stars"></canvas></div>
    <div class="vignette"></div>
  </div>
  <div class="wrap">
    <div class="title">
      <h1>Shane Yun</h1>
      <p>Portfolio</p>
    </div>
    <div class="cardWrap">
      <div class="cardShadow" id="cardShadow"></div>
      <div class="box" id="box">
        <form method="POST" action="/auth" id="gateForm">
          <input type="hidden" name="redirect" value="${redirect}"/>
          <input type="hidden" name="password" id="pw"/>
          <div class="field">
            <input type="text" id="disp" class="disp" placeholder="enter password"
              autofocus autocomplete="off" autocapitalize="off" spellcheck="false"/>
            <button type="button" class="toggle" id="toggle" aria-label="Show password">
              <svg class="eye-on" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="eye-off" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          <p class="err" id="errMsg"${error ? "" : ' style="display:none"'}>${error ?? "Incorrect password — try again."}</p>
          <button type="submit" class="submit" id="submitBtn">enter</button>
        </form>
      </div>
    </div>
    <p class="foot" id="foot">Request access via <span class="em">shane.yun0703@gmail.com</span></p>
  </div>
  <script>
  /* emoji-masked password: real value mirrored into a hidden field for submit */
  (function(){
    var disp=document.getElementById('disp'),pw=document.getElementById('pw'),toggle=document.getElementById('toggle');
    if(!disp||!pw)return;
    var field=disp.parentNode;
    var POOL=["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦉","🦄","🐝","🐢","🐠","🐬","🐳","🦋","🐞","🐙","🦀","🐌","🍎","🍊","🍋","🍉","🍓","🍒","🍍","🥝","🥥","🍅","🥕","🌽","🍄","🍞","🧀","🍕","🍔","🌮","🍩","🍪","🎂","🍰","🍦","🍫","🍿","🥐","🌵","🌲","🌳","🌴","🌱","🌿","🍀","🍁","🌷","🌸","🌹","🌻","🌼","🌙","⭐","🌟","⚡","🔥","🌈","☀️","⛄","🌊","⚽","🏀","🏈","⚾","🎾","🎱","🎸","🎹","🎺","🎻","🥁","🎨","🚀","✈️","🚗","🚲","⛵","🎈","🎁","🔔","💡","📷","🔭","🧭","⏰","🔑","🧩","🎲","🪁"];
    function rnd(){return POOL[Math.floor(Math.random()*POOL.length)];}
    var real='',emo=[],shown=false;
    function showError(){var em=document.getElementById('errMsg');if(em)em.style.display='';field.classList.add('err-on');}
    function clearError(){var em=document.getElementById('errMsg');if(em)em.style.display='none';field.classList.remove('err-on');}
    function render(){
      if(real.length===0)shown=false;
      var hasText=real.length>0;
      if(shown){disp.value=real;disp.classList.remove('masked');}
      else{disp.value=emo.join('');if(hasText)disp.classList.add('masked');else disp.classList.remove('masked');}
      pw.value=real;
      if(hasText)field.classList.add('has');else field.classList.remove('has');
      // eye toggle only appears once there is text
      if(toggle){if(hasText)toggle.classList.add('show');else toggle.classList.remove('show');if(shown)toggle.classList.add('shown');else toggle.classList.remove('shown');}
      try{if(document.activeElement===disp){var len=disp.value.length;disp.setSelectionRange(len,len);}disp.scrollLeft=disp.scrollWidth;}catch(e){}
    }
    disp.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.metaKey||e.ctrlKey||e.altKey)return; // submit / shortcuts pass through
      clearError();
      if(e.key==='Backspace'){e.preventDefault();real=real.slice(0,-1);emo.pop();render();return;}
      if(e.key&&e.key.length===1){e.preventDefault();real+=e.key;emo.push(rnd());render();}
    });
    disp.addEventListener('paste',function(e){
      e.preventDefault();clearError();
      var t=((e.clipboardData||window.clipboardData)||{getData:function(){return '';}}).getData('text');
      if(!t)return;var arr=Array.from(t);
      for(var i=0;i<arr.length;i++){real+=arr[i];emo.push(rnd());}
      render();
    });
    if(toggle){toggle.addEventListener('click',function(){if(real.length===0)return;shown=!shown;render();disp.focus();});}
    var gForm=document.getElementById('gateForm');
    gForm.addEventListener('submit',function(e){
      pw.value=real;
      if(!window.fetch)return; // no fetch: fall back to a normal POST (full reload)
      e.preventDefault();
      var rEl=gForm.querySelector('input[name=redirect]');var redir=rEl?rEl.value:'/';
      var body='password='+encodeURIComponent(real)+'&redirect='+encodeURIComponent(redir);
      fetch('/auth',{method:'POST',credentials:'same-origin',headers:{'X-Gate-Fetch':'1','Content-Type':'application/x-www-form-urlencoded'},body:body})
        .then(function(r){return r.json().then(function(j){return j;},function(){return null;});})
        .then(function(j){if(j&&j.ok){window.location.href=j.redirect||'/';}else{showError();disp.focus();}})
        .catch(function(){showError();});
    });
  })();
  /* constellation: real shapes hold, then disfigure into a drifting web */
  (function(){
    var canvas=document.getElementById('stars');if(!canvas)return;
    var ctx=canvas.getContext('2d');if(!ctx)return;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var w=0,h=0,dpr=Math.min(window.devicePixelRatio||1,2);
    var pointer={x:-9999,y:-9999,active:false};
    var TEMPLATES=[
      {stars:[[0.18,0.12],[0.34,0.06],[0.40,0.30],[0.66,0.40],[0.74,0.78],[0.46,0.86]],edges:[[0,1],[0,2],[1,2],[2,3],[3,4],[4,5],[5,2]],cx:0.17,cy:0.24,s:0.30},
      {stars:[[0.05,0.45],[0.15,0.25],[0.32,0.13],[0.50,0.10],[0.68,0.16],[0.83,0.30],[0.93,0.52]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],cx:0.50,cy:0.15,s:0.26},
      {stars:[[0.50,0.04],[0.50,0.50],[0.50,0.96],[0.12,0.40],[0.88,0.58]],edges:[[0,1],[1,2],[3,1],[1,4]],cx:0.82,cy:0.22,s:0.30},
      {stars:[[0.55,0.18],[0.72,0.34],[0.58,0.52],[0.42,0.34],[0.22,0.70]],edges:[[0,1],[1,2],[2,3],[3,0],[3,4]],cx:0.18,cy:0.80,s:0.28},
      {stars:[[0.20,0.08],[0.18,0.20],[0.24,0.34],[0.30,0.50],[0.42,0.66],[0.56,0.76],[0.70,0.80],[0.82,0.74],[0.86,0.60]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]],cx:0.82,cy:0.80,s:0.32}
    ];
    var nodes=[],groups=[],realEdges=[],tAccum=0,HOLD=2400,EASE=2000;
    function vis(x,y){var nx=(x-w/2)/360,ny=(y-h/2)/300;var d=Math.sqrt(nx*nx+ny*ny);return Math.max(0,Math.min(1,(d-0.6)/0.4));}
    function init(){
      tAccum=0;nodes=[];groups=[];realEdges=[];var sMin=Math.min(w,h);
      for(var t=0;t<TEMPLATES.length;t++){
        var tpl=TEMPLATES[t],base=nodes.length,px=tpl.cx*w,py=tpl.cy*h,scale=sMin*tpl.s,maxr=0,gi=groups.length;
        for(var si=0;si<tpl.stars.length;si++){
          var lx=tpl.stars[si][0],ly=tpl.stars[si][1],hx=px+(lx-0.5)*scale,hy=py+(ly-0.5)*scale;
          var rr=Math.sqrt((hx-px)*(hx-px)+(hy-py)*(hy-py));if(rr>maxr)maxr=rr;
          nodes.push({hx:hx,hy:hy,x:hx,y:hy,vx:0,vy:0,tw:Math.random()*6.2832,tws:0.015+Math.random()*0.03,member:true,g:gi});
        }
        for(var e=0;e<tpl.edges.length;e++){realEdges.push([base+tpl.edges[e][0],base+tpl.edges[e][1]]);}
        var dir=Math.random()*6.2832,sp=0.09+Math.random()*0.07;
        groups.push({cx:px,cy:py,ox:0,oy:0,vx:Math.cos(dir)*sp,vy:Math.sin(dir)*sp,ang:0,va:(Math.random()-0.5)*0.0008,rad:maxr});
      }
      var filler=Math.min(12,Math.round((w*h)/110000));
      for(var k=0;k<filler;k++){var fx=Math.random()*w,fy=Math.random()*h;nodes.push({hx:fx,hy:fy,x:fx,y:fy,vx:(Math.random()-0.5)*0.10,vy:(Math.random()-0.5)*0.10,tw:Math.random()*6.2832,tws:0.015+Math.random()*0.03,member:false,g:-1});}
    }
    function resize(){w=window.innerWidth;h=window.innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);init();}
    window.addEventListener('resize',resize);
    window.addEventListener('pointermove',function(e){pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true;});
    window.addEventListener('pointerleave',function(){pointer.active=false;});
    var last=performance.now();
    function frame(now){
      var dt=Math.min(50,now-last);last=now;var f=dt/16.67;tAccum+=dt;
      var move=Math.max(0,Math.min(1,(tAccum-HOLD)/EASE)); // hold the shapes, then ease into a gentle float
      ctx.clearRect(0,0,w,h);
      var i,g;
      // each constellation drifts + slowly rotates as one rigid body, bouncing off the edges
      for(i=0;i<groups.length;i++){g=groups[i];g.ox+=g.vx*f*move;g.oy+=g.vy*f*move;g.ang+=g.va*f*move;var ccx=g.cx+g.ox,ccy=g.cy+g.oy,mg=g.rad+24;if(ccx<mg&&g.vx<0)g.vx*=-1;if(ccx>w-mg&&g.vx>0)g.vx*=-1;if(ccy<mg&&g.vy<0)g.vy*=-1;if(ccy>h-mg&&g.vy>0)g.vy*=-1;}
      var X=new Array(nodes.length),Y=new Array(nodes.length);
      for(i=0;i<nodes.length;i++){var n=nodes[i];if(n.g>=0){g=groups[n.g];var lx=n.hx-g.cx,ly=n.hy-g.cy,c=Math.cos(g.ang),s=Math.sin(g.ang);X[i]=g.cx+g.ox+lx*c-ly*s;Y[i]=g.cy+g.oy+lx*s+ly*c;}else{n.x+=n.vx*f*move;n.y+=n.vy*f*move;if(n.x<0||n.x>w)n.vx*=-1;if(n.y<0||n.y>h)n.vy*=-1;n.x=Math.max(0,Math.min(w,n.x));n.y=Math.max(0,Math.min(h,n.y));X[i]=n.x;Y[i]=n.y;}}
      ctx.lineWidth=1;
      for(i=0;i<realEdges.length;i++){var a=realEdges[i][0],b=realEdges[i][1];var m=Math.min(vis(X[a],Y[a]),vis(X[b],Y[b]));if(m<=0)continue;ctx.strokeStyle='rgba(255,255,255,'+(0.34*m)+')';ctx.beginPath();ctx.moveTo(X[a],Y[a]);ctx.lineTo(X[b],Y[b]);ctx.stroke();}
      for(i=0;i<nodes.length;i++){var nk=nodes[i];nk.tw+=nk.tws*f;var mk=vis(X[i],Y[i]);if(mk<=0)continue;var sb=Math.sin(nk.tw)*0.5+0.5,sp=Math.pow(sb,1.7),mem=nk.member;var gr=mem?3.2:2.2;var rg=ctx.createRadialGradient(X[i],Y[i],0,X[i],Y[i],gr);rg.addColorStop(0,'rgba(255,255,255,'+((mem?0.4:0.22)*sp*mk)+')');rg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=rg;ctx.beginPath();ctx.arc(X[i],Y[i],gr,0,6.2832);ctx.fill();ctx.fillStyle='rgba(255,255,255,'+(((mem?0.5:0.3)+0.5*sp)*mk)+')';ctx.beginPath();ctx.arc(X[i],Y[i],mem?1.1:0.85,0,6.2832);ctx.fill();}
      raf=requestAnimationFrame(frame);
    }
    var raf;resize();
    if(reduce){frame(performance.now());}else{raf=requestAnimationFrame(frame);}
  })();
  /* intro choreography (with failsafe so the form is always usable) */
  (function(){
    try{
      var html=document.documentElement;
      if(html.className.indexOf('anim')===-1)return;
      var sw=document.getElementById('starsWrap'),box=document.getElementById('box'),sh=document.getElementById('cardShadow'),disp=document.getElementById('disp'),sub=document.getElementById('submitBtn'),foot=document.getElementById('foot');
      function forceReveal(){try{sw.classList.add('in');box.classList.add('in');sh.classList.add('in');if(!disp.placeholder)disp.placeholder='enter password';var c=sub.textContent;if(!c||c.charCodeAt(0)===160)sub.textContent='enter';foot.style.visibility='visible';if(foot.textContent.indexOf('@')===-1)foot.innerHTML='Request access via <span class="em">shane.yun0703@gmail.com</span>';}catch(e){}}
      setTimeout(forceReveal,5000); // never leave the box hidden
      disp.placeholder='';foot.innerHTML=''; // button keeps its static "enter" label (shown immediately, not typed)
      function typeP(el,text,speed,isPh,done){var i=0;var id=setInterval(function(){i++;if(isPh)el.placeholder=text.slice(0,i);else el.textContent=text.slice(0,i);if(i>=text.length){clearInterval(id);if(done)done();}},speed);}
      function typeFoot(speed){var pre='Request access via ';var em='shane.yun0703@gmail.com';var total=pre.length+em.length;foot.style.visibility='visible';var i=0;var id=setInterval(function(){i++;var pl=Math.min(i,pre.length);var pv=pre.slice(0,pl),ph=pre.slice(pl);var en=i>pre.length?i-pre.length:0;var ev=em.slice(0,en),eh=em.slice(en);foot.innerHTML='<span>'+pv+'</span><span class="hid">'+ph+'</span><span class="em">'+ev+'</span><span class="em hid">'+eh+'</span>';if(i>=total)clearInterval(id);},speed);}
      setTimeout(function(){sw.classList.add('in');},200);
      setTimeout(function(){box.classList.add('in');sh.classList.add('in');},1500);
      setTimeout(function(){typeP(disp,'enter password',72,true,function(){setTimeout(function(){typeFoot(48);},400);});},2350);
    }catch(e){try{document.documentElement.className=document.documentElement.className.replace('anim','');var b=document.getElementById('box');if(b)b.classList.add('in');var f=document.getElementById('foot');if(f)f.style.visibility='visible';}catch(_){}}
  })();
  </script>
</body>
</html>`;
}

export default async function middleware(
  req: Request
): Promise<Response | undefined> {
  const url = new URL(req.url);
  const password = process.env.PORTFOLIO_PASSWORD ?? "openSesame";
  const expected = await token(password);

  // Handle password form POST
  if (req.method === "POST" && url.pathname === "/auth") {
    let submitted = "";
    let redirect = "/";
    try {
      const form = await req.formData();
      submitted = (form.get("password") as string) ?? "";
      const raw = (form.get("redirect") as string) ?? "/";
      // Only allow same-origin paths (no open redirect)
      redirect = raw.startsWith("/") ? raw : "/";
    } catch {
      // ignore parse errors
    }

    const isFetch = req.headers.get("x-gate-fetch") === "1";
    const setCookie = `${COOKIE}=${expected}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`;

    if (submitted === password) {
      // Fetch flow (JS): JSON so the client can redirect without a page reload.
      if (isFetch) {
        return new Response(JSON.stringify({ ok: true, redirect }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Set-Cookie": setCookie },
        });
      }
      // No-JS fallback: classic redirect.
      return new Response(null, {
        status: 302,
        headers: { Location: redirect, "Set-Cookie": setCookie },
      });
    }

    // Wrong password. Fetch flow returns JSON (page/background stay put); no-JS re-renders the gate.
    if (isFetch) {
      return new Response(JSON.stringify({ ok: false }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(gatePage(redirect, "Incorrect password — try again."), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Check auth cookie on every other request
  const jar = cookies(req.headers.get("cookie"));
  if (jar[COOKIE] === expected) return undefined; // authenticated

  return new Response(gatePage(url.pathname), {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
