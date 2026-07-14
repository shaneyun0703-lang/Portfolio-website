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
    <div class="vignette"></div>
    <div id="starsWrap"><canvas id="stars"></canvas></div>
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
  /* two floating geometric shapes (a large leaf + a large crescent) that morph, twinkle and warp under the cursor */
  (function(){
    var canvas=document.getElementById('stars');if(!canvas)return;
    var ctx=canvas.getContext('2d');if(!ctx)return;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var w=0,h=0,dpr=Math.min(window.devicePixelRatio||1,2);
    var pointer={x:-9999,y:-9999,active:false};
    var SHAPES=[
      {x:0.27,y:0.38,diam:0.54,k:33,form:'blade'},
      {x:0.78,y:0.40,diam:0.42,k:27,form:'arc'}
    ];
    var cls=[],ps=[],mt=0;
    function clearZone(x,y){var nx=(x-w/2)/400,ny=(y-h/2)/320;var d=Math.sqrt(nx*nx+ny*ny);return Math.max(0,Math.min(1,(d-0.5)/0.5));}
    function genOffset(form,cr){
      if(form==='arc'){var a=-2.1+4.2*Math.random(),dd=cr*(0.5+0.5*Math.random());return{hox:Math.cos(a)*dd,hoy:Math.sin(a)*dd};}
      if(form==='bolt'){var t=Math.random(),c=Math.sin(t*Math.PI*3)*cr*0.45;return{hox:(t*2-1)*cr*1.15,hoy:(t*2-1)*cr*0.3+c+(Math.random()-0.5)*cr*0.45};}
      var tt=Math.random()*2-1,prof=Math.max(0.14,Math.cos(tt*1.4));return{hox:tt*cr*1.5,hoy:(Math.random()*2-1)*cr*0.6*prof};
    }
    function init(){
      mt=0;cls=[];ps=[];
      for(var ci=0;ci<SHAPES.length;ci++){
        var s=SHAPES[ci],cr=s.diam*w*0.5;
        var md=s.form==='arc'?cr*0.72:s.form==='bolt'?cr*0.78:cr*0.74;
        cls.push({cx:s.x*w,cy:s.y*h,vx:(Math.random()-0.5)*0.2,vy:(Math.random()-0.5)*0.2,maxD:md});
        for(var k=0;k<s.k;k++){
          var o=genOffset(s.form,cr);
          ps.push({clu:ci,hox:o.hox,hoy:o.hoy,amp:cr*(0.06+0.05*Math.random()),ph:Math.random()*6.2832,w1:0.25+Math.random()*0.3,w2:0.22+Math.random()*0.3,tw:Math.random()*6.2832,tws:0.005+Math.random()*0.012,act:0,x:0,y:0,sx:0,sy:0});
        }
      }
    }
    function resize(){w=window.innerWidth;h=window.innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);init();}
    window.addEventListener('resize',resize);
    window.addEventListener('pointermove',function(e){pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true;});
    window.addEventListener('pointerleave',function(){pointer.active=false;});
    var last=performance.now();
    function frame(now){
      var dt=Math.min(50,now-last);last=now;var f=dt/16.67;mt+=dt*0.001;
      var R=280,R2=R*R,DR=160,DR2=DR*DR,mx=w*0.1,my=h*0.1,i,j,cl,p;
      ctx.clearRect(0,0,w,h);
      for(i=0;i<cls.length;i++){cl=cls[i];cl.cx+=cl.vx*f;cl.cy+=cl.vy*f;if(cl.cx<mx||cl.cx>w-mx)cl.vx*=-1;if(cl.cy<my||cl.cy>h-my)cl.vy*=-1;cl.cx=Math.max(mx,Math.min(w-mx,cl.cx));cl.cy=Math.max(my,Math.min(h-my,cl.cy));}
      for(i=0;i<ps.length;i++){p=ps[i];cl=cls[p.clu];p.x=cl.cx+p.hox+Math.cos(mt*p.w1+p.ph)*p.amp;p.y=cl.cy+p.hoy+Math.sin(mt*p.w2+p.ph*1.3)*p.amp;p.tw+=p.tws*f;p.sx=p.x;p.sy=p.y;var tg=0;if(pointer.active){var ddx=p.x-pointer.x,ddy=p.y-pointer.y,dd2=ddx*ddx+ddy*ddy;if(dd2<R2)tg=1-Math.sqrt(dd2)/R;if(dd2<DR2&&dd2>0.01){var di=Math.sqrt(dd2),kk=1-di/DR,pu=kk*kk*22;p.sx=p.x+(ddx/di)*pu;p.sy=p.y+(ddy/di)*pu;}}p.act+=(tg-p.act)*Math.min(1,0.1*f);}
      ctx.lineWidth=1;
      var deg=new Array(ps.length);for(i=0;i<deg.length;i++)deg[i]=0;
      for(i=0;i<ps.length;i++){for(j=i+1;j<ps.length;j++){if(ps[i].clu!==ps[j].clu)continue;var md=cls[ps[i].clu].maxD,md2=md*md;var dx=ps[i].x-ps[j].x,dy=ps[i].y-ps[j].y,d2=dx*dx+dy*dy;if(d2<md2){var cz=Math.min(clearZone(ps[i].x,ps[i].y),clearZone(ps[j].x,ps[j].y));if(cz<=0)continue;var prox=1-Math.sqrt(d2)/md;var en=Math.max(ps[i].act,ps[j].act);var a=prox*(0.17+0.3*en)*cz;if(a>0.004){deg[i]++;deg[j]++;ctx.strokeStyle='rgba(255,255,255,'+a+')';ctx.beginPath();ctx.moveTo(ps[i].sx,ps[i].sy);ctx.lineTo(ps[j].sx,ps[j].sy);ctx.stroke();}}}}
      if(pointer.active){for(i=0;i<ps.length;i++){p=ps[i];if(deg[i]===0||p.act<=0.01)continue;var cz2=clearZone(p.x,p.y);if(cz2<=0)continue;ctx.strokeStyle='rgba(255,255,255,'+(p.act*0.22*cz2)+')';ctx.beginPath();ctx.moveTo(pointer.x,pointer.y);ctx.lineTo(p.sx,p.sy);ctx.stroke();}}
      for(i=0;i<ps.length;i++){p=ps[i];if(deg[i]===0)continue;var cz3=clearZone(p.x,p.y);if(cz3<=0)continue;var tw=0.64+0.36*Math.sin(p.tw);var aa=(0.52+0.3*p.act)*tw*cz3;var rr=1.8+p.act*0.9;var g=ctx.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,rr*2.7);g.addColorStop(0,'rgba(255,255,255,'+(0.38*aa)+')');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.sx,p.sy,rr*2.7,0,6.2832);ctx.fill();ctx.fillStyle='rgba(255,255,255,'+aa+')';ctx.beginPath();ctx.arc(p.sx,p.sy,rr*0.55,0,6.2832);ctx.fill();}
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
