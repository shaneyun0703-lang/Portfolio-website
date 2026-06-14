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
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;
      background:#1c1c1e;font-family:'Inter',system-ui,sans-serif;overflow:hidden;position:relative}
    .grid{position:absolute;inset:0;opacity:.12;pointer-events:none;
      background-image:linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),
        linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px),
        linear-gradient(rgba(255,255,255,.85) 1px,transparent 1px),
        linear-gradient(90deg,rgba(255,255,255,.85) 1px,transparent 1px);
      background-size:24px 24px,24px 24px,120px 120px,120px 120px;background-position:center center}
    .vignette{position:absolute;inset:0;pointer-events:none;
      background:radial-gradient(ellipse at 50% 50%,transparent 58%,#1c1c1e 92%)}
    .wrap{position:relative;z-index:10;width:100%;max-width:420px;padding:0 24px}
    .title{text-align:center;margin-bottom:48px}
    .title h1{font-family:'Syne',system-ui,sans-serif;font-size:3.5rem;font-weight:800;
      letter-spacing:-.04em;color:#fff;line-height:1}
    .title p{margin-top:12px;font-family:'JetBrains Mono',monospace;font-size:15px;
      color:rgba(255,255,255,.5);letter-spacing:.15em;text-transform:uppercase}
    .box{background:rgba(28,28,32,.36);border:1px solid rgba(255,255,255,.1);
      border-radius:10px;padding:28px;backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);
      box-shadow:0 8px 30px rgba(0,0,0,.5)}
    .field{position:relative}
    input{width:100%;padding:14px 48px 14px 16px;border-radius:7px;font-size:15px;outline:none;
      font-family:'Inter',system-ui,sans-serif;
      background:rgba(255,255,255,.05);color:rgba(255,255,255,.9);transition:border-color .2s;
      border:1px solid ${error ? "rgba(255,80,80,0.5)" : "rgba(255,255,255,0.12)"}}
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
    .submit{width:100%;margin-top:16px;padding:14px;border-radius:7px;
      font-family:'Inter',system-ui,sans-serif;font-size:15px;font-weight:500;
      letter-spacing:.01em;
      color:#fff;cursor:pointer;transition:background .2s,border-color .2s;
      background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.15)}
    .submit:hover{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.28)}
    .foot{text-align:center;margin-top:24px;color:rgba(255,255,255,.4);font-size:13px}
    .foot span{color:rgba(255,255,255,.6);font-weight:500}
  </style>
</head>
<body>
  <div class="grid"></div>
  <div class="vignette"></div>
  <div class="wrap">
    <div class="title">
      <h1>Shane Yun</h1>
      <p>Portfolio</p>
    </div>
    <div class="box">
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
        <button type="submit" class="submit">Enter</button>
      </form>
    </div>
    <p class="foot">Request access via <span>shane.yun0703@gmail.com</span></p>
  </div>
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
