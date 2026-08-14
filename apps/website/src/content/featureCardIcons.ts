import type { Icon } from "@tabler/icons-react";
import {
  IconBellRinging,
  IconBolt,
  IconBulb,
  IconCalendarCheck,
  IconCalendarEvent,
  IconChartLine,
  IconChecklist,
  IconClock,
  IconDatabase,
  IconFileImport,
  IconInbox,
  IconLanguage,
  IconMessageCircle,
  IconReceipt,
  IconReportAnalytics,
  IconRoute,
  IconScale,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconTruckDelivery,
  IconUsers,
} from "@tabler/icons-react";

/* ──────────────────────────────────────────────────────────────
   FEATURE-CARD-ICONS — Anwendungsfelder & Industrien
   --------------------------------------------------------------
   Pro Feature-Karte (featureCards.cards in painPoints.ts) ein
   inhaltlich passendes Tabler-Icon, index-aligned zum cards-Array.
   Gewählt anhand der jeweiligen `iconNote` der Karte.
   Gerendert als EdgeIconBadge (Board-Stil: Ink-Badge, Lime-Icon) —
   ersetzt die früheren generischen Bild-Icons (painpoint-a-icon-*).

   Wie featureBulletIcons.ts / resultJourney.ts bewusst als statische
   Map über den kanonischen Slug — CMS-Rows ersetzen PainPointContent
   komplett, dort angehängte Felder verschwänden mit erreichbarem
   Strapi. Ändert sich die Karten-Reihenfolge im Content, hier
   nachziehen; fehlende Einträge fallen auf IconCheck zurück.
────────────────────────────────────────────────────────────── */

export const featureCardIcons: Record<string, Icon[]> = {
  "entscheidungen-fallpruefung": [IconFileImport, IconBellRinging, IconShieldCheck],
  "dokumente-prozesse": [IconLanguage, IconTruckDelivery, IconShieldCheck],
  "steuerung-reporting": [
    IconChartLine,
    IconBellRinging,
    IconUsers,
    IconBulb,
    IconCalendarCheck,
    IconDatabase,
  ],
  "service-fallbearbeitung": [IconMessageCircle, IconRoute, IconReportAnalytics],
  "foerderungen-entscheidungsinstanzen": [IconScale, IconCalendarEvent, IconShieldCheck],
  "health-care": [
    IconBellRinging,
    IconReceipt,
    IconUsers,
    IconSettings,
    IconCalendarCheck,
    IconClock,
  ],
  "handel-supply-chain": [IconInbox, IconReportAnalytics, IconChecklist],
  "professional-services": [IconSearch, IconMessageCircle, IconBolt],
};
