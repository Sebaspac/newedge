import type { Core } from '@strapi/strapi';

/**
 * CORS: per Env steuerbar. Im empfohlenen Setup (nginx proxied /api & /uploads
 * same-origin auf die Website-Domain) greift CORS gar nicht — die Liste ist
 * das Sicherheitsnetz für direkte Cross-Origin-Zugriffe (z. B. cms.-Subdomain).
 * CORS_ORIGINS = kommagetrennte Liste, Default: alles (Dev-Verhalten).
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: env.array('CORS_ORIGINS', ['*']),
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
