import { readFileSync } from "node:fs";
import { join } from "node:path";

/* ── Reservierte Keys, die fromStrapi() im Frontend zurück-mappt (id/type/default).
      Vor dem Speichern in json-Feldern umbenennen, damit das Frontend die identische
      Content-Form zurückbekommt. ── */
const RENAME: Record<string, string> = { id: "fieldId", type: "fieldType", default: "defaultLabel" };
function renameReserved(value: any): any {
  if (Array.isArray(value)) return value.map(renameReserved);
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) out[RENAME[k] ?? k] = renameReserved(v);
    return out;
  }
  return value;
}

async function grantPublicRead(strapi: any, actions: string[]) {
  const publicRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });
  if (!publicRole) return;
  for (const action of actions) {
    const existing = await strapi
      .query("plugin::users-permissions.permission")
      .findOne({ where: { action, role: publicRole.id } });
    if (!existing) {
      await strapi
        .query("plugin::users-permissions.permission")
        .create({ data: { action, role: publicRole.id } });
    }
  }
}

async function upsertSingle(strapi: any, uid: string, data: any) {
  const existing = await strapi.documents(uid).findFirst({});
  let documentId: string;
  if (existing) {
    await strapi.documents(uid).update({ documentId: existing.documentId, data });
    documentId = existing.documentId;
  } else {
    const created = await strapi.documents(uid).create({ data });
    documentId = created.documentId;
  }
  await strapi.documents(uid).publish({ documentId });
}

async function upsertBySlug(strapi: any, uid: string, slug: string, data: any) {
  const existing = await strapi.documents(uid).findFirst({ filters: { slug } });
  let documentId: string;
  if (existing) {
    await strapi.documents(uid).update({ documentId: existing.documentId, data });
    documentId = existing.documentId;
  } else {
    const created = await strapi.documents(uid).create({ data });
    documentId = created.documentId;
  }
  await strapi.documents(uid).publish({ documentId });
}

/** Wie upsertBySlug, nur für Typen ohne slug — Identität über beliebige Filter. */
async function upsertByFilters(strapi: any, uid: string, filters: any, data: any) {
  const existing = await strapi.documents(uid).findFirst({ filters });
  let documentId: string;
  if (existing) {
    await strapi.documents(uid).update({ documentId: existing.documentId, data });
    documentId = existing.documentId;
  } else {
    const created = await strapi.documents(uid).create({ data });
    documentId = created.documentId;
  }
  await strapi.documents(uid).publish({ documentId });
}

/**
 * Legt einen Datensatz nur an, wenn er noch nicht existiert — bestehende bleiben
 * unangetastet. Für „Bild austauschen": ein Reseed darf hochgeladene Dateien
 * NIEMALS überschreiben, sonst wäre die Redaktionsarbeit nach jedem Update weg.
 */
async function createIfMissing(strapi: any, uid: string, filters: any, data: any) {
  const existing = await strapi.documents(uid).findFirst({ filters });
  if (existing) return false;
  await strapi.documents(uid).create({ data });
  return true;
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    if (process.env.SEED !== "1") return;

    const preparedPath = join(strapi.dirs.app.root, "data", "prepared-content.json");
    const prepared = JSON.parse(readFileSync(preparedPath, "utf8")) as {
      singleTypes: Record<string, any>;
      painPoints: any[];
      painPointsEn?: any[];
      imageOverrides?: { imageKey: string; label: string; category: string }[];
      testimonials?: { name: string; text: string; role: string; order?: number }[];
      jobs?: { slug: string; title: string; [key: string]: any }[];
    };

    const readActions: string[] = [];

    // Single Types
    for (const [apiId, obj] of Object.entries(prepared.singleTypes)) {
      const uid = `api::${apiId}.${apiId}`;
      await upsertSingle(strapi, uid, renameReserved(obj));
      readActions.push(`${uid}.find`);
      strapi.log.info(`[seed] single type ${apiId} ✓`);
    }

    // pain-point Collection
    const ppUid = "api::pain-point.pain-point";
    for (const row of prepared.painPoints) {
      await upsertBySlug(strapi, ppUid, row.slug, renameReserved(row));
    }
    readActions.push(`${ppUid}.find`, `${ppUid}.findOne`);
    strapi.log.info(`[seed] pain-point collection: ${prepared.painPoints.length} rows ✓`);

    // pain-point-en Collection (EN-Locale)
    if (prepared.painPointsEn?.length) {
      const ppEnUid = "api::pain-point-en.pain-point-en";
      for (const row of prepared.painPointsEn) {
        await upsertBySlug(strapi, ppEnUid, row.slug, renameReserved(row));
      }
      readActions.push(`${ppEnUid}.find`, `${ppEnUid}.findOne`);
      strapi.log.info(`[seed] pain-point-en collection: ${prepared.painPointsEn.length} rows ✓`);
    }

    // „Bild austauschen"-Liste: ein Eintrag pro Bild der Registry.
    // Nur anlegen, nie aktualisieren — sonst gingen hochgeladene Dateien verloren.
    if (prepared.imageOverrides?.length) {
      const ioUid = "api::image-override.image-override";
      let created = 0;
      for (const row of prepared.imageOverrides) {
        if (await createIfMissing(strapi, ioUid, { imageKey: row.imageKey }, row)) created++;
      }
      readActions.push(`${ioUid}.find`, `${ioUid}.findOne`);
      strapi.log.info(
        `[seed] image-override: ${created} neu angelegt, ${prepared.imageOverrides.length - created} bestehende unverändert ✓`,
      );
    }

    // testimonial Collection („Custom Post" — Redaktion legt eigene Einträge an).
    // Identität über den Namen, weil das Schema keinen slug hat.
    // renameReserved entfällt: die Felder sind flache Strings, keine json-Blobs.
    const tUid = "api::testimonial.testimonial";
    if (prepared.testimonials?.length) {
      for (const row of prepared.testimonials) {
        await upsertByFilters(strapi, tUid, { name: row.name }, row);
      }
      strapi.log.info(`[seed] testimonial collection: ${prepared.testimonials.length} rows ✓`);
    }
    // Rechte immer vergeben — sonst antwortet /api/testimonials mit 403,
    // auch wenn die Redaktion selbst Einträge angelegt hat.
    readActions.push(`${tUid}.find`, `${tUid}.findOne`);

    // job Collection (offene Positionen, ebenfalls frei anlegbar).
    // tags/sections sind Components — der Generator liefert sie bereits in
    // Component-Form ({ label } bzw. { label, items: [{ text }] }).
    const jUid = "api::job.job";
    if (prepared.jobs?.length) {
      for (const row of prepared.jobs) {
        await upsertBySlug(strapi, jUid, row.slug, row);
      }
      strapi.log.info(`[seed] job collection: ${prepared.jobs.length} rows ✓`);
    }
    // Auch hier: Lese-Rechte unabhängig vom Seed-Inhalt.
    readActions.push(`${jUid}.find`, `${jUid}.findOne`);

    // Öffentliche Lese-Rechte für alle neuen Typen
    await grantPublicRead(strapi, readActions);
    strapi.log.info(`[seed] public read granted for ${readActions.length} actions ✓`);
    strapi.log.info(`[seed] DONE`);
  },
};
