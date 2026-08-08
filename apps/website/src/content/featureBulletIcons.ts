import type { Icon } from "@tabler/icons-react";
import {
  IconAdjustments,
  IconAlertTriangle,
  IconArrowsExchange,
  IconArrowsJoin,
  IconBell,
  IconBellRinging,
  IconBook,
  IconBulb,
  IconCalendarCheck,
  IconCalendarEvent,
  IconChartBar,
  IconChartLine,
  IconChecklist,
  IconClock,
  IconCoins,
  IconDatabase,
  IconDatabaseImport,
  IconEyeOff,
  IconFileAlert,
  IconFileCertificate,
  IconFileCheck,
  IconFileImport,
  IconFileText,
  IconFilter,
  IconFolder,
  IconForms,
  IconHistory,
  IconInbox,
  IconLanguage,
  IconLayoutDashboard,
  IconMessageCircle,
  IconMoodSad,
  IconPlugConnected,
  IconPuzzle,
  IconReceipt,
  IconRefresh,
  IconReportAnalytics,
  IconRoute,
  IconScale,
  IconSettings,
  IconShieldCheck,
  IconStar,
  IconTargetArrow,
  IconTemplate,
  IconTrendingUp,
  IconTruckDelivery,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";

/* ──────────────────────────────────────────────────────────────
   FEATURE-BULLET-ICONS — Anwendungsfelder & Industrien
   --------------------------------------------------------------
   Pro Feature-Bullet (feature1–3 in painPoints.ts) ein inhaltlich
   passendes Tabler-Icon, index-aligned zum bullets-Array der Seite.
   Gerendert als EdgeIconBadge (Board-Stil: Ink-Badge, Lime-Icon).

   Wie resultJourney.ts bewusst als statische Map über den
   kanonischen Slug — CMS-Rows ersetzen PainPointContent komplett,
   dort angehängte Felder verschwänden mit erreichbarem Strapi.
   Ändert sich die Bullet-Reihenfolge im Content, hier nachziehen;
   fehlende Einträge fallen auf IconCheck zurück (BulletList).
────────────────────────────────────────────────────────────── */

export interface FeatureBulletIcons {
  feature1: Icon[];
  feature2: Icon[];
  feature3: Icon[];
}

export const featureBulletIcons: Record<string, FeatureBulletIcons> = {
  auswahlverfahren: {
    feature1: [IconFileAlert, IconForms, IconFolder],
    feature2: [IconBell, IconStar, IconAlertTriangle],
    feature3: [IconHistory, IconFileText, IconDatabase],
  },
  compliance: {
    feature1: [IconFileImport, IconLanguage, IconAlertTriangle],
    feature2: [IconTruckDelivery, IconRefresh, IconLayoutDashboard],
    feature3: [IconShieldCheck, IconCoins, IconFileCertificate],
  },
  "kpi-dashboard": {
    feature1: [IconAdjustments, IconPlugConnected, IconUsers, IconChartBar],
    feature2: [IconRefresh, IconLayoutDashboard, IconBellRinging, IconDatabase],
    feature3: [IconBulb, IconTargetArrow, IconPuzzle, IconCalendarCheck],
  },
  "ki-kundensupport": {
    feature1: [IconClock, IconBook, IconRefresh],
    feature2: [IconRoute, IconMessageCircle, IconMoodSad],
    feature3: [IconTrendingUp, IconBulb, IconChartLine],
  },
  entscheidungsinstanzen: {
    feature1: [IconScale, IconAlertTriangle, IconEyeOff],
    feature2: [IconBellRinging, IconWorld, IconArrowsJoin],
    feature3: [IconHistory, IconFileCertificate, IconFileText],
  },
  "health-care": {
    feature1: [IconBellRinging, IconChartLine, IconTemplate, IconPlugConnected],
    feature2: [IconReceipt, IconShieldCheck, IconAdjustments, IconReportAnalytics],
    feature3: [IconCalendarEvent, IconArrowsExchange, IconSettings, IconTrendingUp],
  },
  "handel-supply-chain": {
    feature1: [IconInbox, IconDatabaseImport, IconAlertTriangle],
    feature2: [IconChartBar, IconBellRinging, IconReportAnalytics],
    feature3: [IconChecklist, IconAlertTriangle, IconFileCheck],
  },
  "professional-services": {
    feature1: [IconDatabase, IconFilter, IconLayoutDashboard, IconPlugConnected],
    feature2: [IconMessageCircle, IconInbox, IconTemplate, IconPlugConnected],
    feature3: [IconFileText, IconDatabase, IconClock, IconShieldCheck],
  },
};
