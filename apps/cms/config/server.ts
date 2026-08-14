import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Öffentliche Basis-URL hinter dem Reverse-Proxy (z. B. https://www.newedgebrand.com).
  // Nötig, damit Admin-Panel-Assets und Media-URLs absolute, korrekte Links bekommen.
  url: env('PUBLIC_URL', ''),
  // Hinter nginx laufen wir geproxied — Strapi soll X-Forwarded-* Headern vertrauen.
  proxy: env.bool('IS_PROXIED', false),
  app: {
    keys: env.array('APP_KEYS'),
  },
});

export default config;
