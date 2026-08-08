/**
 * Icon Registry
 * --------------------------------------------------------------
 * Zentrale Single-Source-of-Truth für content-gebundene Icons.
 * Content referenziert Icons per stabilem `IconName` (String) statt
 * per Komponenten-Import — so kann ein Icon aus dem CMS gesetzt/getauscht
 * werden. Gerendert via `<Icon name="Sparkles" />`.
 *
 * shadcn-`ui/`-Primitives importieren lucide weiterhin direkt (dekorativ,
 * kein Inhalt) — die werden bewusst NICHT über diese Registry geleitet.
 *
 * CMS-Mapping (Strapi): `IconName` ⇆ Enumeration/String-Feld.
 * --------------------------------------------------------------
 */
import {
  AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, ArrowUpRight, Award,
  BarChart3, BookOpen, Bot, Brain, Briefcase, Building2, Calendar, CalendarCheck,
  Camera, Check, CheckCircle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  ChevronUp, Circle, Clapperboard, ClipboardCheck, ClipboardList, Clock, Code, Cog,
  Compass, Cookie, Cpu, Database, Dot, Eye, FileCheck, FileCode, FileSearch, FileText,
  Film, Filter, Fingerprint, Flame, FlaskConical, FolderOpen, Github, Globe,
  GripVertical, Headphones, Heart, HeartPulse, HelpCircle, Image as ImageIcon,
  Instagram, Languages,
  Layers, Layout, Lightbulb, Link as LinkIcon, Link2, Linkedin, Loader2, Mail, Map,
  Megaphone, Menu, MessageCircle, MessageSquare, Monitor, MoreHorizontal,
  MousePointer2, MousePointerClick, Palette, PanelLeft, PenTool, Phone, PieChart,
  Plug, Plus, Presentation, Quote, Radio, Rocket, Route, Search, Send, Server,
  Settings, Share2, Shield, ShieldCheck, ShoppingCart, Sparkles, Star, Target,
  TrendingDown, TrendingUp, Trophy, Truck, Twitter, User, Users, Video, Workflow,
  Wrench, X, XCircle, Zap,
  type LucideIcon, type LucideProps,
} from "lucide-react";

/** Vollständige Icon-Palette. Schlüssel = stabiler, CMS-tauglicher Name. */
export const ICONS = {
  AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, ArrowUpRight, Award,
  BarChart3, BookOpen, Bot, Brain, Briefcase, Building2, Calendar, CalendarCheck,
  Camera, Check, CheckCircle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  ChevronUp, Circle, Clapperboard, ClipboardCheck, ClipboardList, Clock, Code, Cog,
  Compass, Cookie, Cpu, Database, Dot, Eye, FileCheck, FileCode, FileSearch, FileText,
  Film, Filter, Fingerprint, Flame, FlaskConical, FolderOpen, Github, Globe,
  GripVertical, Headphones, Heart, HeartPulse, HelpCircle, Image: ImageIcon,
  Instagram, Languages,
  Layers, Layout, Lightbulb, Link: LinkIcon, Link2, Linkedin, Loader2, Mail, Map,
  Megaphone, Menu, MessageCircle, MessageSquare, Monitor, MoreHorizontal,
  MousePointer2, MousePointerClick, Palette, PanelLeft, PenTool, Phone, PieChart,
  Plug, Plus, Presentation, Quote, Radio, Rocket, Route, Search, Send, Server,
  Settings, Share2, Shield, ShieldCheck, ShoppingCart, Sparkles, Star, Target,
  TrendingDown, TrendingUp, Trophy, Truck, Twitter, User, Users, Video, Workflow,
  Wrench, X, XCircle, Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/** Löst einen Icon-Namen zur lucide-Komponente auf (oder undefined). */
export const getIcon = (name: IconName): LucideIcon => ICONS[name];

/** Rendert ein Icon per Name. Reicht alle lucide-Props (size, className, …) durch. */
export const Icon = ({ name, ...props }: { name: IconName } & LucideProps) => {
  const Cmp = ICONS[name];
  return <Cmp {...props} />;
};
