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

function gatePage(error?: string): string {
  const borderColor = error
    ? "rgba(255,80,80,0.5)"
    : "rgba(255,255,255,0.1)";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Shane Yun · Portfolio</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;
      background:#1c1c1e;font-family:'Inter',system-ui,sans-serif;overflow:hidden;position:relative}
    .grid{position:absolute;inset:0;opacity:.04;pointer-events:none;
      background-image:linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),
        linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px);
      background-size:60px 60px}
    .vignette{position:absolute;inset:0;pointer-events:none;
      background:radial-gradient(ellipse at 50% 50%,transparent 30%,#1c1c1e 75%)}
    .wrap{position:relative;z-index:10;width:100%;max-width:420px;padding:0 24px}
    .title{text-align:center;margin-bottom:48px}
    .title h1{font-size:3.5rem;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1}
    .title p{margin-top:12px;font-size:15px;color:rgba(255,255,255,.5);
      letter-spacing:.15em;text-transform:uppercase;font-family:'JetBrains Mono',monospace}
    .box{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
      border-radius:16px;padding:28px;backdrop-filter:blur(12px)}
    input{width:100%;padding:14px 16px;border-radius:12px;font-size:15px;outline:none;
      background:rgba(255,255,255,.06);border:1px solid ${borderColor};
      color:rgba(255,255,255,.9)}
    input::placeholder{color:rgba(255,255,255,.25)}
    .err{color:#ff5050;font-size:12px;text-align:center;margin-top:8px}
    button{width:100%;margin-top:16px;padding:14px;border-radius:12px;font-size:14px;
      font-weight:600;color:#fff;cursor:pointer;
      background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12)}
    button:hover{background:rgba(255,255,255,.15)}
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
        <input type="password" name="password" placeholder="Enter password"
          autofocus autocomplete="current-password"/>
        ${error ? `<p class="err">${error}</p>` : ""}
        <button type="submit">Enter</button>
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
    try {
      const form = await req.formData();
      submitted = (form.get("password") as string) ?? "";
    } catch {
      // ignore parse errors
    }

    if (submitted === password) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": `${COOKIE}=${expected}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`,
        },
      });
    }

    return new Response(gatePage("Incorrect password — try again."), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Check auth cookie on every other request
  const jar = cookies(req.headers.get("cookie"));
  if (jar[COOKIE] === expected) return undefined; // authenticated

  return new Response(gatePage(), {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
