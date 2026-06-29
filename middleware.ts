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
    .disp{width:100%;padding:14px 48px 14px 16px;border-radius:7px;font-size:15px;line-height:24px;outline:none;
      font-family:'JetBrains Mono',monospace;caret-color:#fff;
      white-space:nowrap;overflow:hidden;
      background:rgba(255,255,255,.06);color:rgba(255,255,255,.9);
      backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
      border:1px solid ${error ? "rgba(255,80,80,0.5)" : "rgba(255,255,255,0.1)"}}
    .disp::placeholder{color:rgba(255,255,255,.25)}
    .disp:focus{border-color:rgba(255,255,255,.2)}
    /* once something is typed: subtle green container */
    .disp.has{background:rgba(90,210,130,.05);border-color:rgba(120,225,150,.16);
      box-shadow:0 2px 10px rgba(0,0,0,.18),inset 0 0 18px rgba(90,210,130,.05)}
    /* masked emoji glyphs: very subtle green tint + slightly larger/spaced. Instant (no transition) so reveal doesn't flash color */
    .disp.masked{filter:grayscale(1) sepia(1) hue-rotate(55deg) saturate(1.4) brightness(1.05);
      text-shadow:0 0 4px rgba(90,210,130,.14);font-size:16px;letter-spacing:.12em}
    .disp.err-on{border-color:rgba(255,80,80,.5)}
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
    var POOL=["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦉","🦄","🐝","🐢","🐠","🐬","🐳","🦋","🐞","🐙","🦀","🐌","🍎","🍊","🍋","🍉","🍓","🍒","🍍","🥝","🥥","🍅","🥕","🌽","🍄","🍞","🧀","🍕","🍔","🌮","🍩","🍪","🎂","🍰","🍦","🍫","🍿","🥐","🌵","🌲","🌳","🌴","🌱","🌿","🍀","🍁","🌷","🌸","🌹","🌻","🌼","🌙","⭐","🌟","⚡","🔥","🌈","☀️","⛄","🌊","⚽","🏀","🏈","⚾","🎾","🎱","🎸","🎹","🎺","🎻","🥁","🎨","🚀","✈️","🚗","🚲","⛵","🎈","🎁","🔔","💡","📷","🔭","🧭","⏰","🔑","🧩","🎲","🪁"];
    function rnd(){return POOL[Math.floor(Math.random()*POOL.length)];}
    var real='',emo=[],shown=false;
    function showError(){var em=document.getElementById('errMsg');if(em)em.style.display='';disp.classList.add('err-on');}
    function clearError(){var em=document.getElementById('errMsg');if(em)em.style.display='none';disp.classList.remove('err-on');}
    function render(){
      if(real.length===0)shown=false;
      var hasText=real.length>0;
      if(shown){disp.value=real;disp.classList.remove('masked');}
      else{disp.value=emo.join('');if(hasText)disp.classList.add('masked');else disp.classList.remove('masked');}
      pw.value=real;
      if(hasText)disp.classList.add('has');else disp.classList.remove('has');
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
    var nodes=[],realEdges=[],tAccum=0,HOLD=3400,MORPH=2800;
    function vis(x,y){var nx=(x-w/2)/360,ny=(y-h/2)/300;var d=Math.sqrt(nx*nx+ny*ny);return Math.max(0,Math.min(1,(d-0.6)/0.4));}
    function init(){
      tAccum=0;nodes=[];realEdges=[];var sMin=Math.min(w,h);
      for(var t=0;t<TEMPLATES.length;t++){
        var tpl=TEMPLATES[t],base=nodes.length,px=tpl.cx*w,py=tpl.cy*h,scale=sMin*tpl.s;
        for(var si=0;si<tpl.stars.length;si++){
          var lx=tpl.stars[si][0],ly=tpl.stars[si][1],hx=px+(lx-0.5)*scale,hy=py+(ly-0.5)*scale;
          nodes.push({x:hx,y:hy,hx:hx,hy:hy,vx:(Math.random()-0.5)*0.22,vy:(Math.random()-0.5)*0.22,tw:Math.random()*6.2832,tws:0.015+Math.random()*0.03,member:true});
        }
        for(var e=0;e<tpl.edges.length;e++){realEdges.push([base+tpl.edges[e][0],base+tpl.edges[e][1]]);}
      }
      var target=Math.min(62,Math.round((w*h)/26000)),filler=Math.max(0,target-nodes.length);
      for(var k=0;k<filler;k++){var rx=Math.random()*w,ry=Math.random()*h;nodes.push({x:rx,y:ry,hx:rx,hy:ry,vx:(Math.random()-0.5)*0.22,vy:(Math.random()-0.5)*0.22,tw:Math.random()*6.2832,tws:0.015+Math.random()*0.03,member:false});}
    }
    function resize(){w=window.innerWidth;h=window.innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);init();}
    window.addEventListener('resize',resize);
    window.addEventListener('pointermove',function(e){pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true;});
    window.addEventListener('pointerleave',function(){pointer.active=false;});
    var last=performance.now();
    function frame(now){
      var dt=Math.min(50,now-last);last=now;var f=dt/16.67;tAccum+=dt;
      var morph=Math.max(0,Math.min(1,(tAccum-HOLD)/MORPH));
      ctx.clearRect(0,0,w,h);
      var i,j;
      for(i=0;i<nodes.length;i++){var n=nodes[i];n.x+=n.vx*f*morph;n.y+=n.vy*f*morph;if(n.x<0||n.x>w)n.vx*=-1;if(n.y<0||n.y>h)n.vy*=-1;n.x=Math.max(0,Math.min(w,n.x));n.y=Math.max(0,Math.min(h,n.y));}
      ctx.lineWidth=1;
      if(morph<1){var ra=1-morph;for(var re=0;re<realEdges.length;re++){var ni=nodes[realEdges[re][0]],nj=nodes[realEdges[re][1]];var m0=Math.min(vis(ni.x,ni.y),vis(nj.x,nj.y));if(m0<=0)continue;ctx.strokeStyle='rgba(255,255,255,'+(0.55*ra*m0)+')';ctx.beginPath();ctx.moveTo(ni.x,ni.y);ctx.lineTo(nj.x,nj.y);ctx.stroke();}}
      var maxD=178,maxD2=maxD*maxD;var deg=new Array(nodes.length);for(i=0;i<deg.length;i++)deg[i]=0;
      for(i=0;i<nodes.length;i++){for(j=i+1;j<nodes.length;j++){var dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d2=dx*dx+dy*dy;if(d2<maxD2){var m=Math.min(vis(nodes[i].x,nodes[i].y),vis(nodes[j].x,nodes[j].y));if(m<=0)continue;var a=(1-Math.sqrt(d2)/maxD)*0.36*m*morph;if(a>0.002){ctx.strokeStyle='rgba(255,255,255,'+a+')';ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();}deg[i]++;deg[j]++;}}}
      if(pointer.active){var cD=200,cD2=cD*cD;for(i=0;i<nodes.length;i++){var nn=nodes[i];var px2=nn.x-pointer.x,py2=nn.y-pointer.y,pd2=px2*px2+py2*py2;if(pd2<cD2){var pa=(1-Math.sqrt(pd2)/cD)*0.3*vis(nn.x,nn.y)*morph;if(pa>0){ctx.strokeStyle='rgba(255,255,255,'+pa+')';ctx.beginPath();ctx.moveTo(nn.x,nn.y);ctx.lineTo(pointer.x,pointer.y);ctx.stroke();}nn.vx+=(pointer.x-nn.x)*0.000018*f;nn.vy+=(pointer.y-nn.y)*0.000018*f;}}}
      for(i=0;i<nodes.length;i++){var nk=nodes[i];nk.tw+=nk.tws*f;var mk=vis(nk.x,nk.y);if(mk<=0)continue;if(!nk.member&&deg[i]===0)continue;var sb=Math.sin(nk.tw)*0.5+0.5;var sp=Math.pow(sb,1.7);var hold=nk.member?(1-morph):0;var gr=3.2+hold*1.0;var g=ctx.createRadialGradient(nk.x,nk.y,0,nk.x,nk.y,gr);g.addColorStop(0,'rgba(255,255,255,'+((0.4+0.25*hold)*sp*mk)+')');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(nk.x,nk.y,gr,0,6.2832);ctx.fill();ctx.fillStyle='rgba(255,255,255,'+((0.42+0.6*sp+0.3*hold)*mk)+')';ctx.beginPath();ctx.arc(nk.x,nk.y,1.0+hold*0.5,0,6.2832);ctx.fill();}
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
