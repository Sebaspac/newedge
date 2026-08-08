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
  auswahlverfahren: [IconFileImport, IconBellRinging, IconShieldCheck],
  compliance: [IconLanguage, IconTruckDelivery, IconShieldCheck],
  "kpi-dashboard": [
    IconChartLine,
    IconBellRinging,
    IconUsers,
    IconBulb,
    IconCalendarCheck,
    IconDatabase,
  ],
  "ki-kundensupport": [IconMessageCircle, IconRoute, IconReportAnalytics],
  entscheidungsinstanzen: [IconScale, IconCalendarEvent, IconShieldCheck],
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
