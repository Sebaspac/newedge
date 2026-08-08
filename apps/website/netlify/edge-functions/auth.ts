// Netlify Edge Function — stateless auth gate
// Password stored in Netlify env var APP_PASSWORD (never in client bundle)

const COOKIE = "ne_session";

const LOGIN_HTML = (error = false) => `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Edge — Zugang</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@800&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100dvh;
      background: #0D0618;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Consolas, ui-monospace, monospace;
    }
    .card {
      width: 100%;
      max-width: 400px;
      padding: 48px 40px 40px;
      border: 1px solid rgba(91,33,182,0.25);
      background: rgba(26,10,46,0.85);
      backdrop-filter: blur(20px);
    }
    .logo { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-weight: 800; font-size: 1.6rem; color: #fff; letter-spacing: -0.02em; margin-bottom: 6px; }
    .sub  { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(196,181,253,0.45); margin-bottom: 36px; }
    label { display: block; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(196,181,253,0.55); margin-bottom: 8px; }
    input[type=password] {
      width: 100%; background: rgba(255,255,255,0.04);
      border: 1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(91,33,182,0.3)"};
      color: #fff; font-family: Consolas, monospace; font-size: 14px;
      padding: 13px 14px; outline: none; letter-spacing: 0.08em;
    }
    input[type=password]:focus { border-color: #7c3aed; }
    .error { font-size: 10px; color: rgba(239,68,68,0.8); letter-spacing: 0.12em; margin-top: 8px; ${error ? "" : "display:none"} }
    button {
      margin-top: 24px; width: 100%;
      background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
      color: #fff; border: none; font-family: Consolas, monospace;
      font-size: 11px; font-weight: 700; letter-spacing: 0.22em;
      text-transform: uppercase; padding: 15px; cursor: pointer;
    }
    button:hover { opacity: 0.88; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">New Edge</div>
    <div class="sub">Geschützter Bereich</div>
    <form method="POST" action="/__auth/login">
      <label for="pw">Passwort</label>
      <input id="pw" type="password" name="password" autofocus autocomplete="current-password" placeholder="••••••••••••••••••••"/>
      <div class="error">Falsches Passwort. Bitte erneut versuchen.</div>
      <button type="submit">Zugang erhalten →</button>
    </form>
  </div>
</body>
</html>`;

function parseCookies(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

async function hmac(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function makeToken(password: string): Promise<string> {
  const exp = String(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
  const sig = await hmac(password, exp);
  return `${exp}.${sig}`;
}

async function verifyToken(token: string, password: string): Promise<boolean> {
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Date.now() > Number(exp)) return false;
  const expected = await hmac(password, exp);
  return sig === expected;
}

export default async function handler(req: Request, context: { next: () => Promise<Response> }) {
  const url = new URL(req.url);
  const password = Deno.env.get("APP_PASSWORD");

  // No password set → allow everything (dev fallback)
  if (!password) return context.next();

  // Pass through static assets
  if (/\.(js|mjs|css|png|webp|avif|jpg|mp4|woff2?|svg|ico|json|txt|xml)(\?|$)/.test(url.pathname)) {
    return context.next();
  }

  // ── Handle logout ──
  if (url.pathname === "/__auth/logout") {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/",
        "Set-Cookie": `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
      },
    });
  }

  // ── Handle login POST ──
  if (url.pathname === "/__auth/login" && req.method === "POST") {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const submitted = params.get("password") ?? "";

    if (submitted === password) {
      const token = await makeToken(password);
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}`,
        },
      });
    }

    return new Response(LOGIN_HTML(true), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // ── Check session cookie ──
  const cookies = parseCookies(req.headers.get("cookie") ?? "");
  const token = decodeURIComponent(cookies[COOKIE] ?? "");
  if (token && await verifyToken(token, password)) {
    return context.next();
  }

  // ── Block — show login ──
  return new Response(LOGIN_HTML(false), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
