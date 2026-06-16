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
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
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
      letter-spacing:-.04em;color:#fff;line-height:1}
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
    input{width:100%;padding:14px 48px 14px 16px;border-radius:7px;font-size:15px;outline:none;
      font-family:'JetBrains Mono',monospace;
      background:rgba(255,255,255,.06);color:rgba(255,255,255,.9);
      backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
      border:1px solid ${error ? "rgba(255,80,80,0.5)" : "rgba(255,255,255,0.05)"}}
    input::placeholder{color:rgba(255,255,255,.25)}
    input:focus{border-color:rgba(255,255,255,.2)}
    .toggle{position:absolute;right:12px;top:50%;transform:translateY(-50%);
      background:none;border:none;cursor:pointer;color:rgba(255,255,255,.3);
      display:flex;align-items:center;justify-content:center;padding:4px;
      transition:color .2s;width:18px;height:18px;flex-shrink:0}
    .toggle:hover{color:rgba(255,255,255,.6)}
    .toggle svg{position:absolute;top:0;left:0;transition:opacity .15s}
    .toggle .eye-off{opacity:0}
    .toggle.shown .eye-on{opacity:0}
    .toggle.shown .eye-off{opacity:1}
    .err{color:#ff5050;font-size:12px;text-align:center;margin-top:8px}
    .submit{width:100%;margin-top:16px;padding:14px;border-radius:7px;min-height:52px;
      font-family:'Syne',system-ui,sans-serif;font-size:17px;font-weight:600;
      color:#fff;cursor:pointer;transition:background .2s,border-color .2s;
      background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.08);
      backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
    .submit:hover{background:rgba(255,255,255,.17);border-color:rgba(255,255,255,.16)}
    .foot{text-align:center;margin-top:24px;font-family:'JetBrains Mono',monospace;
      font-size:11px;color:rgba(255,255,255,.55);height:16px;line-height:16px;white-space:nowrap}
    .foot .hid{opacity:0}
    .anim .foot{visibility:hidden}
    .foot .em{color:rgba(255,255,255,.8);font-weight:500}
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
        <form method="POST" action="/auth">
          <input type="hidden" name="redirect" value="${redirect}"/>
          <div class="field">
            <input type="password" id="pw" name="password" placeholder="Enter password"
              autofocus autocomplete="current-password"/>
            <button type="button" class="toggle" onclick="var i=document.getElementById('pw');i.type=i.type==='password'?'text':'password';this.classList.toggle('shown')">
              <svg class="eye-on" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="eye-off" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          ${error ? `<p class="err">${error}</p>` : ""}
          <button type="submit" class="submit" id="submitBtn">Enter</button>
        </form>
      </div>
    </div>
    <p class="foot" id="foot">Request access via <span class="em">shane.yun0703@gmail.com</span></p>
  </div>
  <script>
  /* constellation */
  (function(){
    var canvas=document.getElementById('stars');if(!canvas)return;
    var ctx=canvas.getContext('2d');if(!ctx)return;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var w=0,h=0,dpr=Math.min(window.devicePixelRatio||1,2);
    var pointer={x:-9999,y:-9999,active:false};var nodes=[];
    function vis(x,y){var nx=(x-w/2)/360,ny=(y-h/2)/300;var d=Math.sqrt(nx*nx+ny*ny);return Math.max(0,Math.min(1,(d-0.6)/0.4));}
    function init(){var count=Math.min(58,Math.round((w*h)/30000));nodes=[];for(var i=0;i<count;i++){nodes.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.22,vy:(Math.random()-0.5)*0.22,tw:Math.random()*6.2832,tws:0.015+Math.random()*0.03});}}
    function resize(){w=window.innerWidth;h=window.innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);init();}
    window.addEventListener('resize',resize);
    window.addEventListener('pointermove',function(e){pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true;});
    window.addEventListener('pointerleave',function(){pointer.active=false;});
    var last=performance.now();
    function frame(now){
      var dt=Math.min(50,now-last);last=now;var f=dt/16.67;
      ctx.clearRect(0,0,w,h);
      var i,j;
      for(i=0;i<nodes.length;i++){var n=nodes[i];n.x+=n.vx*f;n.y+=n.vy*f;if(n.x<0||n.x>w)n.vx*=-1;if(n.y<0||n.y>h)n.vy*=-1;n.x=Math.max(0,Math.min(w,n.x));n.y=Math.max(0,Math.min(h,n.y));}
      var maxD=178,maxD2=maxD*maxD;var deg=new Array(nodes.length);for(i=0;i<deg.length;i++)deg[i]=0;
      ctx.lineWidth=1;
      for(i=0;i<nodes.length;i++){for(j=i+1;j<nodes.length;j++){var dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d2=dx*dx+dy*dy;if(d2<maxD2){var m=Math.min(vis(nodes[i].x,nodes[i].y),vis(nodes[j].x,nodes[j].y));if(m<=0)continue;var a=(1-Math.sqrt(d2)/maxD)*0.36*m;ctx.strokeStyle='rgba(255,255,255,'+a+')';ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();deg[i]++;deg[j]++;}}}
      if(pointer.active){var cD=200,cD2=cD*cD;for(i=0;i<nodes.length;i++){var nn=nodes[i];var px=nn.x-pointer.x,py=nn.y-pointer.y,pd2=px*px+py*py;if(pd2<cD2){var pa=(1-Math.sqrt(pd2)/cD)*0.3*vis(nn.x,nn.y);if(pa>0){ctx.strokeStyle='rgba(255,255,255,'+pa+')';ctx.beginPath();ctx.moveTo(nn.x,nn.y);ctx.lineTo(pointer.x,pointer.y);ctx.stroke();}nn.vx+=(pointer.x-nn.x)*0.000018*f;nn.vy+=(pointer.y-nn.y)*0.000018*f;}}}
      for(i=0;i<nodes.length;i++){var nk=nodes[i];nk.tw+=nk.tws*f;var mk=vis(nk.x,nk.y);if(mk<=0||deg[i]===0)continue;var sb=Math.sin(nk.tw)*0.5+0.5;var sp=Math.pow(sb,1.7);var gr=3.2;var g=ctx.createRadialGradient(nk.x,nk.y,0,nk.x,nk.y,gr);g.addColorStop(0,'rgba(255,255,255,'+(0.4*sp*mk)+')');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(nk.x,nk.y,gr,0,6.2832);ctx.fill();ctx.fillStyle='rgba(255,255,255,'+((0.42+0.6*sp)*mk)+')';ctx.beginPath();ctx.arc(nk.x,nk.y,1.0,0,6.2832);ctx.fill();}
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
      var sw=document.getElementById('starsWrap'),box=document.getElementById('box'),sh=document.getElementById('cardShadow'),pw=document.getElementById('pw'),sub=document.getElementById('submitBtn'),foot=document.getElementById('foot');
      function forceReveal(){try{sw.classList.add('in');box.classList.add('in');sh.classList.add('in');if(!pw.placeholder)pw.placeholder='Enter password';var c=sub.textContent;if(!c||c.charCodeAt(0)===160)sub.textContent='Enter';foot.style.visibility='visible';if(foot.textContent.indexOf('@')===-1)foot.innerHTML='Request access via <span class="em">shane.yun0703@gmail.com</span>';}catch(e){}}
      setTimeout(forceReveal,5000); // never leave the box hidden
      pw.placeholder='';sub.textContent=String.fromCharCode(160);foot.innerHTML='';
      function typeP(el,text,speed,isPh,done){var i=0;var id=setInterval(function(){i++;if(isPh)el.placeholder=text.slice(0,i);else el.textContent=text.slice(0,i);if(i>=text.length){clearInterval(id);if(done)done();}},speed);}
      function typeFoot(speed){var pre='Request access via ';var em='shane.yun0703@gmail.com';var total=pre.length+em.length;foot.innerHTML='<span></span><span class="hid">'+pre+'</span><span class="em"></span><span class="em hid">'+em+'</span>';foot.style.visibility='visible';var i=0;var id=setInterval(function(){i++;var pl=Math.min(i,pre.length);var pv=pre.slice(0,pl),ph=pre.slice(pl);var en=i>pre.length?i-pre.length:0;var ev=em.slice(0,en),eh=em.slice(en);foot.innerHTML='<span>'+pv+'</span><span class="hid">'+ph+'</span><span class="em">'+ev+'</span><span class="em hid">'+eh+'</span>';if(i>=total)clearInterval(id);},speed);}
      setTimeout(function(){sw.classList.add('in');},200);
      setTimeout(function(){box.classList.add('in');sh.classList.add('in');},1500);
      setTimeout(function(){typeP(pw,'Enter password',72,true,function(){setTimeout(function(){typeP(sub,'Enter',95,false,function(){setTimeout(function(){typeFoot(48);},400);});},300);});},2350);
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

    if (submitted === password) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirect,
          "Set-Cookie": `${COOKIE}=${expected}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`,
        },
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
