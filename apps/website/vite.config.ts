import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

// ── Load .env manually so APP_PASSWORD is never bundled into client code ──
function loadEnvFile(dir: string): Record<string, string> {
  try {
    return Object.fromEntries(
      readFileSync(path.resolve(dir, ".env"), "utf-8")
        .split("\n")
        .filter(l => l.includes("="))
        .map(l => {
          const idx = l.indexOf("=");
          return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^["']|["']$/g, "")];
        })
    );
  } catch { return {}; }
}

// ── Server-side session store (memory only, never sent to client) ──
const SESSIONS = new Set<string>();

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
    .logo {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-weight: 800;
      font-size: 1.6rem;
      color: #fff;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }
    .sub {
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(196,181,253,0.45);
      margin-bottom: 36px;
    }
    label {
      display: block;
      font-size: 9px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(196,181,253,0.55);
      margin-bottom: 8px;
    }
    input[type=password] {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(91,33,182,0.3)'};
      color: #fff;
      font-family: Consolas, monospace;
      font-size: 14px;
      padding: 13px 14px;
      outline: none;
      transition: border-color 0.2s;
      letter-spacing: 0.08em;
    }
    input[type=password]:focus { border-color: #7c3aed; }
    .error {
      font-size: 10px;
      color: rgba(239,68,68,0.8);
      letter-spacing: 0.12em;
      margin-top: 8px;
      display: ${error ? 'block' : 'none'};
    }
    button {
      margin-top: 24px;
      width: 100%;
      background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
      color: #fff;
      border: none;
      font-family: Consolas, monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      padding: 15px;
      cursor: pointer;
      transition: opacity 0.2s;
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

function parseCookies(raw = ""): Record<string, string> {
  return Object.fromEntries(raw.split(";").map(c => c.trim().split("=").map(decodeURIComponent)));
}

function authPlugin(appPassword: string) {
  return {
    name: "ne-auth",
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const cookies = parseCookies(req.headers.cookie);

        // ── Handle login POST ──
        if (req.url === "/__auth/login" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
          req.on("end", () => {
            const params = new URLSearchParams(body);
            const pw = params.get("password") ?? "";
            if (pw === appPassword) {
              const token = randomUUID();
              SESSIONS.add(token);
              res.writeHead(302, {
                "Set-Cookie": `ne_session=${token}; Path=/; HttpOnly; SameSite=Strict`,
                "Location": "/",
              });
              res.end();
            } else {
              res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
              res.end(LOGIN_HTML(true));
            }
          });
          return;
        }

        // ── Handle logout ──
        if (req.url === "/__auth/logout") {
          const token = cookies["ne_session"];
          if (token) SESSIONS.delete(token);
          res.writeHead(302, {
            "Set-Cookie": "ne_session=; Path=/; HttpOnly; Max-Age=0",
            "Location": "/",
          });
          res.end();
          return;
        }

        // ── Allow static assets / Vite internals ──
        if (
          req.url?.startsWith("/@") ||
          req.url?.startsWith("/node_modules") ||
          req.url?.startsWith("/__vite") ||
          req.url?.match(/\.(js|ts|jsx|tsx|css|png|webp|mp4|woff2?|svg|ico|json)(\?|$)/)
        ) {
          return next();
        }

        // ── Check session ──
        const token = cookies["ne_session"];
        if (token && SESSIONS.has(token)) return next();

        // ── Block — show login ──
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(LOGIN_HTML(false));
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnvFile(__dirname);
  const appPassword = env["APP_PASSWORD"] ?? "";

  return {
  server: {
    host: "::",
    port: Number(process.env.PORT) || 8081,
    // ── CMS unter derselben Adresse wie die Website ──────────────────────
    // localhost:8081/admin → Strapi-Adminpanel, /api → Content-API usw.
    // Vite reicht diese Pfade intern an Strapi (:1337) weiter; nach außen
    // gibt es nur eine Origin. In Produktion übernimmt nginx dieses Mapping.
    proxy: {
      ...Object.fromEntries(
        [
          "/admin",                // Adminpanel + Admin-API
          "/api",                  // Content-API (public)
          "/uploads",              // Medien-Dateien
          "/upload",               // Upload-Plugin-API
          "/content-manager",      // Admin: Content Manager
          "/content-type-builder", // Admin: Content-Type Builder
          "/users-permissions",    // Admin: Rollen & Rechte
          "/i18n",                 // Admin: Lokalisierung
          "/_health",              // Strapi-Healthcheck
        ].map((p) => [p, { target: "http://localhost:1337", changeOrigin: true, ws: true }])
      ),
      // ── Lead-Service (apps/lead-api, :8090) — dieselbe Origin ──────────
      // Spiegelt den nginx-Block aus apps/cms/deploy/nginx.conf. Lokal nur
      // aktiv, wenn der Container läuft UND VITE_API_URL auf diese Origin
      // zeigt (z. B. http://localhost:8081); sonst bleiben die Formulare im
      // Testmodus und rufen diese Pfade gar nicht erst auf.
      ...Object.fromEntries(
        [
          "/contact",     // Kontaktformular
          "/roi-report",  // ROI-Rechner + PDF-Report
          "/abmelden",    // Follow-up-Abmeldeseite (DSGVO)
          "/health",      // Healthcheck des Lead-Service (≠ Strapis /_health)
        ].map((p) => [p, { target: "http://localhost:8090", changeOrigin: true }])
      ),
    },
  },
  plugins: [
    react(),
    appPassword ? authPlugin(appPassword) : null,
    mode === 'production' && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'assets/*.png', 'assets/*.webp', 'assets/*.mp4'],
      manifest: {
        name: 'NEWEDGE',
        short_name: 'NEWEDGE',
        description: 'Die KI-Abteilung für den Mittelstand',
        theme_color: '#171717',
        background_color: '#171717',
        display: 'standalone',
        // Icons aus der Wortmarke erzeugt: python3 scripts/gen-brand-icons.py
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB for videos
        // ── Same-Origin, aber NICHT die SPA ────────────────────────────────
        // vite-plugin-pwa setzt navigateFallback: 'index.html'. Ohne diese
        // Liste würde der Service Worker jede Navigation abfangen — auch
        // /abmelden/<token> (Lead-Service) und /admin (Strapi) — und statt
        // der echten Seite index.html ausliefern. Betrifft nur Besucher, die
        // die PWA schon einmal geladen haben, und ist von außen nicht sichtbar.
        navigateFallbackDenylist: [
          /^\/abmelden\//,            // Lead-Service: Abmeldeseite (DSGVO)
          /^\/health$/,               // Lead-Service: Healthcheck
          /^\/admin/,                 // Strapi: Adminpanel
          /^\/api\//,                 // Strapi: Content-API
          /^\/uploads?\//,            // Strapi: Medien / Upload-API
          /^\/content-manager/,
          /^\/content-type-builder/,
          /^\/users-permissions/,
          /^\/i18n\//,
          /^\/_health/,               // Strapi: Healthcheck
          // ── Vorgerenderte Routen ──────────────────────────────────────────
          // Seit scripts/prerender-seo.mjs jeder Route einen EIGENEN Head
          // (title, description, canonical, hreflang, JSON-LD) und einen
          // eigenen Textkörper in eine eigene index.html schreibt, ist der
          // Navigations-Fallback für diese Pfade falsch: Er lieferte
          // Besuchern mit installiertem Service Worker auf JEDER Unterseite
          // die Startseiten-index.html aus — also den Startseiten-Titel und
          // die Startseiten-canonical, während React daneben den richtigen
          // Seiteninhalt rendert. (Nachgeprüft am gebauten sw.js: das
          // Precache-Manifest entsteht in `vite build`, also BEVOR der
          // Prerender-Schritt die 33 weiteren index.html anlegt — precacht
          // ist daher nur die Startseite.) Diese Pfade holen sich ihr HTML
          // jetzt wieder vom Server; offline sind sie dadurch nicht mehr
          // verfügbar, was der Auslieferung des falschen Kopfes vorzuziehen
          // ist. Dynamische Routen (Mini-Case-Detailseiten, Alias-Slugs,
          // /impressum, 404) behalten den Fallback — für sie gibt es
          // ohnehin keine vorgerenderte Datei.
          /^\/en\/?$/,
          /^\/(en\/)?(methodik|kontakt|ki-audit|cortex|websites|sicherheit|ki-glossar|roi-rechner)\/?$/,
          /^\/(en\/)?(loesungen|industrien)\/[^/]+\/?$/,
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.mp4$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'video-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 1 month
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  esbuild: mode === 'production' ? {
    drop: ['console', 'debugger'],
  } : {},
  };
});
