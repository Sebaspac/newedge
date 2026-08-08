/**
 * Image Registry
 * --------------------------------------------------------------
 * Zentrale Single-Source-of-Truth für alle Bild-Assets der Website.
 * Ein Bild austauschen = hier den einen Import ändern (nicht in den
 * Komponenten suchen). Content referenziert Bilder per stabilem `ImageKey`;
 * `img(key)` löst den Key zur (gehashten) Vite-URL auf.
 *
 * CMS-Mapping (Strapi): `ImageKey` ⇆ Media-Library-Feld.
 * --------------------------------------------------------------
 */

// — Brand / Logo —
import newEdgeLogo from "@/assets/new-edge-logo.webp";
import newEdgeLogoHorizontal from "@/assets/new-edge-logo-horizontal.png";
import newEdgeLogoWordmark from "@/assets/new-edge-logo-wordmark.png";
import newedgeWordmark from "@/assets/newedge-wordmark.webp";
import newedgeWordmarkWhite from "@/assets/newedge-wordmark-white.webp";
import newedgeLogoWhite from "@/assets/newedge-logo-white.png";
import newedgeCharacterPresenting from "@/assets/newedge-character-presenting.webp";

// — Team —
import teamSebastian from "@/assets/team-sebastian.webp";
import teamSebastian1 from "@/assets/team-sebastian-1.webp";
import teamSebastian2 from "@/assets/team-sebastian-2.webp";
import teamIvan from "@/assets/team-ivan.webp";
import teamIvan2 from "@/assets/team-ivan-2.webp";
import teamWenjamin from "@/assets/team-wenjamin.webp";
import teamWenjamin1 from "@/assets/team-wenjamin-1.webp";
import teamWenjamin2 from "@/assets/team-wenjamin-2.webp";
import teamPresentation from "@/assets/team-presentation.webp";
import teamPresentationColor from "@/assets/team-presentation-color.webp";
import foundersColor from "@/assets/founders-color.webp";
import systemsFounder1 from "@/assets/systems-founder-1.jpg";
import systemsFounder2 from "@/assets/systems-founder-2.jpg";
import bmpAwardCase from "@/assets/bmp-award-case.jpg";

// — Case Studies / Cards —
import albanovaBuilding from "@/assets/albanova-building.webp";
import albanovaWebsite from "@/assets/albanova-website.webp";
import leadGeneration from "@/assets/lead-generation.webp";
import marketingAutomation from "@/assets/marketing-automation.webp";
import ragDatacenter from "@/assets/rag-datacenter.webp";
import hochschulZulassungCase from "@/assets/hochschul-zulassung-case.webp";
import foerderbankAntragspruefungCase from "@/assets/foerderbank-antragspruefung-case.webp";
import gynPraxisMuenchenCase from "@/assets/gyn-praxis-muenchen-case.webp";
import therapiezentrumOnboardingCase from "@/assets/therapiezentrum-onboarding-case.webp";
import praxisverbundKapazitaetenCase from "@/assets/praxisverbund-kapazitaeten-case.webp";
import grosshandelBestelleingabeCase from "@/assets/grosshandel-bestelleingabe-case.webp";
import maschinenbauSendungstransparenzCase from "@/assets/maschinenbau-sendungstransparenz-case.webp";
import fachhaendlerFruehwarnsystemCase from "@/assets/fachhaendler-fruehwarnsystem-case.webp";
import aeskonProzesslandkarteCase from "@/assets/aeskon-prozesslandkarte-case.webp";
import steuerkanzleiMandantenkommunikationCase from "@/assets/steuerkanzlei-mandantenkommunikation-case.webp";
import personalberatungScreeningCase from "@/assets/personalberatung-screening-case.webp";
import maschinenbauDokumenteCase from "@/assets/maschinenbau-dokumente-case.webp";
import aeskonBafaComplianceCase from "@/assets/aeskon-bafa-compliance-case.webp";
import grosshaendlerZollpraeferenzenCase from "@/assets/grosshaendler-zollpraeferenzen-case.webp";
import mehrstandortDashboardCase from "@/assets/mehrstandort-dashboard-case.webp";
import vertriebPipelineReportingCase from "@/assets/vertrieb-pipeline-reporting-case.webp";
import logistikLieferantenKpiCase from "@/assets/logistik-lieferanten-kpi-case.webp";
import eosTherapiezentrumCase from "@/assets/eos-therapiezentrum-case.webp";
import onlinehaendlerSupportCase from "@/assets/onlinehaendler-support-case.webp";
import steuerkanzleiFristenCase from "@/assets/steuerkanzlei-fristen-case.webp";
import consultancy340FunnelCase from "@/assets/340-consultancy-funnel-case.webp";
import b2bLeadQualifizierungCase from "@/assets/b2b-lead-qualifizierung-case.webp";
import handwerkFunnelCase from "@/assets/handwerk-funnel-case.webp";

// — KI-Audit —
import kiAuditHero from "@/assets/ki-audit-hero.webp";
import kiAuditProcess from "@/assets/ki-audit-process.webp";

// — Pain Point: Auswahlverfahren —
import painpointAVorherNachher from "@/assets/painpoint-a-vorher-nachher.webp";
import painpointASection3 from "@/assets/painpoint-a-section3.webp";
import painpointAFeature2 from "@/assets/painpoint-a-feature2.webp";
import painpointAFeature3 from "@/assets/painpoint-a-feature3.webp";
import painpointAIconAnalyse from "@/assets/painpoint-a-icon-analyse.webp";
import painpointAIconKoordination from "@/assets/painpoint-a-icon-koordination.webp";
import painpointAIconInsights from "@/assets/painpoint-a-icon-insights.webp";

// — Anwendungsfelder (Pain Points B–E, Industrien 1–4) —
import painPointComplianceHero from "@/assets/pain-point-compliance-hero.webp";
import painPointKpiDashboardHero from "@/assets/pain-point-kpi-dashboard-hero.webp";
import painPointKundensupportHero from "@/assets/pain-point-kundensupport-hero.webp";
import painPointEntscheidungsinstanzenHero from "@/assets/pain-point-entscheidungsinstanzen-hero.webp";
import painPointHealthCareHero from "@/assets/pain-point-health-care-hero.webp";
import painPointHandelSupplyChainHero from "@/assets/pain-point-handel-supply-chain-hero.webp";
import painPointProfessionalServicesHero from "@/assets/pain-point-professional-services-hero.webp";
import painPointEntscheidungsinstanzenFeature2 from "@/assets/pain-point-entscheidungsinstanzen-feature2.webp";
import painPointProfessionalServicesFeature2 from "@/assets/pain-point-professional-services-feature2.webp";
import painPointKundensupportFeature3 from "@/assets/pain-point-kundensupport-feature3.webp";
import painPointKundengewinnungHero from "@/assets/pain-point-kundengewinnung-hero.webp";
import painPointComplianceFeature1 from "@/assets/pain-point-compliance-feature1.webp";
import painPointComplianceFeature2 from "@/assets/pain-point-compliance-feature2.webp";
import painPointComplianceFeature3 from "@/assets/pain-point-compliance-feature3.webp";
import painPointKpiDashboardFeature1 from "@/assets/pain-point-kpi-dashboard-feature1.webp";
import painPointKpiDashboardFeature2 from "@/assets/pain-point-kpi-dashboard-feature2.webp";
import painPointKpiDashboardFeature3 from "@/assets/pain-point-kpi-dashboard-feature3.webp";
import painPointKundensupportFeature1 from "@/assets/pain-point-kundensupport-feature1.webp";
import painPointKundensupportFeature2 from "@/assets/pain-point-kundensupport-feature2.webp";
import painPointEntscheidungsinstanzenFeature1 from "@/assets/pain-point-entscheidungsinstanzen-feature1.webp";
import painPointEntscheidungsinstanzenFeature3 from "@/assets/pain-point-entscheidungsinstanzen-feature3.webp";
import painPointHealthCareFeature1 from "@/assets/pain-point-health-care-feature1.webp";
import painPointHealthCareFeature2 from "@/assets/pain-point-health-care-feature2.webp";
import painPointHealthCareFeature3 from "@/assets/pain-point-health-care-feature3.webp";
import painPointHandelSupplyChainFeature1 from "@/assets/pain-point-handel-supply-chain-feature1.webp";
import painPointHandelSupplyChainFeature2 from "@/assets/pain-point-handel-supply-chain-feature2.webp";
import painPointHandelSupplyChainFeature3 from "@/assets/pain-point-handel-supply-chain-feature3.webp";
import painPointProfessionalServicesFeature1 from "@/assets/pain-point-professional-services-feature1.webp";
import painPointProfessionalServicesFeature3 from "@/assets/pain-point-professional-services-feature3.webp";
import painPointAuswahlverfahrenFeature1 from "@/assets/pain-point-auswahlverfahren-feature1.webp";
import painPointAuswahlverfahrenFeature2 from "@/assets/pain-point-auswahlverfahren-feature2.webp";
import painPointAuswahlverfahrenFeature3 from "@/assets/pain-point-auswahlverfahren-feature3.webp";

// — Anwendungsfelder: Feature-Card-Icons (SVG) —
import iconI1IconAggreg from "@/assets/pain-point-icons/i1-icon-aggreg__icon-aggregation-zusammenf-hrung.svg";
import iconI1IconAudit from "@/assets/pain-point-icons/i1-icon-audit__icon-audit-trail.svg";
import iconI1IconBegruend from "@/assets/pain-point-icons/i1-icon-begruend__icon-begr-ndung-kommentar.svg";
import iconI1IconDoku from "@/assets/pain-point-icons/i1-icon-doku__icon-l-ckenlose-dokumentation.svg";
import iconI1IconErfassung from "@/assets/pain-point-icons/i1-icon-erfassung__icon-strukturierte-erfassung.svg";
import iconI1IconIndivid from "@/assets/pain-point-icons/i1-icon-individ__icon-individuelles-interface.svg";
import iconI1IconVergleich from "@/assets/pain-point-icons/i1-icon-vergleich__icon-vergleichbarkeit.svg";
import iconI1IconWissen from "@/assets/pain-point-icons/i1-icon-wissen__icon-wissensbasis-persistenz.svg";
import iconI2IconLampeidee from "@/assets/pain-point-icons/i2-icon-lampeidee__icon-ki-empfehlung-gl-hbirne.svg";
import iconI4Icon247 from "@/assets/pain-point-icons/i4-icon-24-7__icon-24-7-verf-gbarkeit.svg";
import iconI4IconAgent from "@/assets/pain-point-icons/i4-icon-agent__icon-ki-agent-chat-bot.svg";
import iconI4IconEskalation from "@/assets/pain-point-icons/i4-icon-eskalation__icon-intelligente-eskalation.svg";
import iconI4IconFollowup from "@/assets/pain-point-icons/i4-icon-followup__icon-follow-up-kein-f-llt-durchs-raster.svg";
import iconI4IconKireport from "@/assets/pain-point-icons/i4-icon-kireport__icon-ki-generierter-report.svg";
import iconI4IconOnboarding from "@/assets/pain-point-icons/i4-icon-onboarding__icon-onboarding-person-mit-pfeil.svg";
import iconI4IconOutput from "@/assets/pain-point-icons/i4-icon-output__icon-ki-output-euro-tracking.svg";
import iconI4IconReport from "@/assets/pain-point-icons/i4-icon-report__icon-klienten-reporting-dokument.svg";
import iconPpaIconBalance from "@/assets/pain-point-icons/ppa-icon-balance__icon-balance-waage.svg";
import iconPpaIconBell from "@/assets/pain-point-icons/ppa-icon-bell__icon-bell-glocke.svg";
import iconPpaIconChart from "@/assets/pain-point-icons/ppa-icon-chart__icon-chart-balkendiagramm.svg";
import iconPpaIconCluster from "@/assets/pain-point-icons/ppa-icon-cluster__icon-cluster-punkte.svg";
import iconPpaIconDb from "@/assets/pain-point-icons/ppa-icon-db__icon-datenbank-speicher.svg";
import iconPpaIconDok from "@/assets/pain-point-icons/ppa-icon-dok__icon-dokument-datei.svg";
import iconPpaIconForm from "@/assets/pain-point-icons/ppa-icon-form__icon-formular-eingabemaske.svg";
import iconPpaIconInsight from "@/assets/pain-point-icons/ppa-icon-insight__icon-insight-gl-hbirne.svg";
import iconPpaIconSliders from "@/assets/pain-point-icons/ppa-icon-sliders__icon-sliders-regler.svg";
import iconPpbIconCal from "@/assets/pain-point-icons/ppb-icon-cal__icon-kalender-mit-h-kchen.svg";
import iconPpbIconChat from "@/assets/pain-point-icons/ppb-icon-chat__icon-chat-messenger.svg";
import iconPpbIconClock from "@/assets/pain-point-icons/ppb-icon-clock__icon-clock-uhr.svg";
import iconPpbIconDashboard from "@/assets/pain-point-icons/ppb-icon-dashboard__icon-dashboard-monitor.svg";
import iconPpbIconEuro from "@/assets/pain-point-icons/ppb-icon-euro__icon-euro-w-hrung.svg";
import iconPpbIconFunnel from "@/assets/pain-point-icons/ppb-icon-funnel__icon-funnel-trichter.svg";
import iconPpbIconLine from "@/assets/pain-point-icons/ppb-icon-line__icon-liniendiagramm-wachstum.svg";
import iconPpbIconLock from "@/assets/pain-point-icons/ppb-icon-lock__icon-lock-schloss.svg";
import iconPpbIconPerson from "@/assets/pain-point-icons/ppb-icon-person__icon-person-personalisierung.svg";
import iconPpcIconAlert from "@/assets/pain-point-icons/ppc-icon-alert__icon-alert-warnung.svg";
import iconPpcIconBrain from "@/assets/pain-point-icons/ppc-icon-brain__icon-brain-gehirn.svg";
import iconPpcIconGlobe from "@/assets/pain-point-icons/ppc-icon-globe__icon-globe-weltkugel.svg";
import iconPpcIconHistory from "@/assets/pain-point-icons/ppc-icon-history__icon-history-verlauf.svg";
import iconPpcIconRefresh from "@/assets/pain-point-icons/ppc-icon-refresh__icon-refresh-aktualisierung.svg";
import iconPpcIconScan from "@/assets/pain-point-icons/ppc-icon-scan__icon-scan-scanner.svg";
import iconPpcIconShield from "@/assets/pain-point-icons/ppc-icon-shield__icon-shield-schutzschild.svg";
import iconPpcIconTeams from "@/assets/pain-point-icons/ppc-icon-teams__icon-teams-kollaboration.svg";
import iconPpcIconTimeline from "@/assets/pain-point-icons/ppc-icon-timeline__icon-timeline-zeitstrahl.svg";
import iconPpdIconApi from "@/assets/pain-point-icons/ppd-icon-api__icon-api-verbindung.svg";
import iconPpdIconBot from "@/assets/pain-point-icons/ppd-icon-bot__icon-bot-automatisierung.svg";
import iconPpdIconBrand from "@/assets/pain-point-icons/ppd-icon-brand__icon-brand-marke.svg";
import iconPpdIconLeaf from "@/assets/pain-point-icons/ppd-icon-leaf__icon-leaf-co.svg";
import iconPpdIconLightning from "@/assets/pain-point-icons/ppd-icon-lightning__icon-lightning-blitz.svg";
import iconPpdIconRobot from "@/assets/pain-point-icons/ppd-icon-robot__icon-robot-ki-chip.svg";
import iconPpdIconServer from "@/assets/pain-point-icons/ppd-icon-server__icon-server-lokal.svg";
import iconPpdIconTeam from "@/assets/pain-point-icons/ppd-icon-team__icon-team-gruppe.svg";
import iconPpdIconTeams2 from "@/assets/pain-point-icons/ppd-icon-teams2__icon-teams-chat-interface.svg";
import iconPpeIconAnalytics from "@/assets/pain-point-icons/ppe-icon-analytics__icon-analytics-trenddiagramm.svg";
import iconPpeIconContext from "@/assets/pain-point-icons/ppe-icon-context__icon-context-kontext.svg";
import iconPpeIconCsat from "@/assets/pain-point-icons/ppe-icon-csat__icon-csat-zufriedenheit.svg";
import iconPpeIconLearn from "@/assets/pain-point-icons/ppe-icon-learn__icon-learn-lernen.svg";
import iconPpeIconPrio from "@/assets/pain-point-icons/ppe-icon-prio__icon-priority-priorit-t.svg";
import iconPpeIconProduct from "@/assets/pain-point-icons/ppe-icon-product__icon-product-produkt.svg";
import iconPpeIconRoute from "@/assets/pain-point-icons/ppe-icon-route__icon-route-weiterleitung.svg";
import iconPpeIconSpeed from "@/assets/pain-point-icons/ppe-icon-speed__icon-speed-blitz.svg";
import iconPpeIconVoice from "@/assets/pain-point-icons/ppe-icon-voice__icon-voice-mikrofon.svg";

// — Partner / Award Logos —
import logoBafa from "@/assets/logos/bafa-logo.png";
import logoIdc from "@/assets/logos/idc-logo.png";
import logoBmp2026 from "@/assets/logos/bayerischer-mittelstandspreis-2026.webp";

// — Client Logos (logo-cloud) —
import logoAlbanovaConsulting from "@/assets/logos/albanova-consulting.png";
import logoBecomingYou from "@/assets/logos/becoming-you.png";
import logoCirclePhoto from "@/assets/logos/circle-photo.webp";
import logoClubCli from "@/assets/logos/club-cli.webp";
import logoDariusCompany from "@/assets/logos/darius-company.webp";
import logoDrAaronLoeb from "@/assets/logos/dr-aaron-loeb.webp";
import logoEliteAesthetic from "@/assets/logos/elite-aesthetic.webp";
import logoHydeOfficial from "@/assets/logos/hyde-official.webp";
import logoMuseStudio from "@/assets/logos/muse-studio.webp";
import logoPureDesign from "@/assets/logos/pure-design.webp";
import logoSadieKessler from "@/assets/logos/sadie-kessler.webp";
import logoSeabreeze from "@/assets/logos/seabreeze.webp";

/**
 * Bild-Registry. Keys sind stabil und CMS-tauglich (kebab-case).
 * Werte sind die importierten, von Vite gehashten URLs — identisch
 * zum bisherigen direkten Import (verhaltenserhaltend).
 */
export const IMAGES = {
  // Brand
  "new-edge-logo": newEdgeLogo,
  "new-edge-logo-horizontal": newEdgeLogoHorizontal,
  "new-edge-logo-wordmark": newEdgeLogoWordmark,
  "newedge-wordmark": newedgeWordmark,
  "newedge-wordmark-white": newedgeWordmarkWhite,
  "newedge-logo-white": newedgeLogoWhite,
  "newedge-character-presenting": newedgeCharacterPresenting,
  // Team
  "team-sebastian": teamSebastian,
  "team-sebastian-1": teamSebastian1,
  "team-sebastian-2": teamSebastian2,
  "team-ivan": teamIvan,
  "team-ivan-2": teamIvan2,
  "team-wenjamin": teamWenjamin,
  "team-wenjamin-1": teamWenjamin1,
  "team-wenjamin-2": teamWenjamin2,
  "team-presentation": teamPresentation,
  "team-presentation-color": teamPresentationColor,
  "founders-color": foundersColor,
  "systems-founder-1": systemsFounder1,
  "systems-founder-2": systemsFounder2,
  "bmp-award-case": bmpAwardCase,
  // Case Studies
  "albanova-building": albanovaBuilding,
  "albanova-website": albanovaWebsite,
  "lead-generation": leadGeneration,
  "marketing-automation": marketingAutomation,
  "rag-datacenter": ragDatacenter,
  "hochschul-zulassung-case": hochschulZulassungCase,
  "foerderbank-antragspruefung-case": foerderbankAntragspruefungCase,
  "gyn-praxis-muenchen-case": gynPraxisMuenchenCase,
  "therapiezentrum-onboarding-case": therapiezentrumOnboardingCase,
  "praxisverbund-kapazitaeten-case": praxisverbundKapazitaetenCase,
  "grosshandel-bestelleingabe-case": grosshandelBestelleingabeCase,
  "maschinenbau-sendungstransparenz-case": maschinenbauSendungstransparenzCase,
  "fachhaendler-fruehwarnsystem-case": fachhaendlerFruehwarnsystemCase,
  "aeskon-prozesslandkarte-case": aeskonProzesslandkarteCase,
  "steuerkanzlei-mandantenkommunikation-case": steuerkanzleiMandantenkommunikationCase,
  "personalberatung-screening-case": personalberatungScreeningCase,
  "maschinenbau-dokumente-case": maschinenbauDokumenteCase,
  "aeskon-bafa-compliance-case": aeskonBafaComplianceCase,
  "grosshaendler-zollpraeferenzen-case": grosshaendlerZollpraeferenzenCase,
  "mehrstandort-dashboard-case": mehrstandortDashboardCase,
  "vertrieb-pipeline-reporting-case": vertriebPipelineReportingCase,
  "logistik-lieferanten-kpi-case": logistikLieferantenKpiCase,
  "eos-therapiezentrum-case": eosTherapiezentrumCase,
  "onlinehaendler-support-case": onlinehaendlerSupportCase,
  "steuerkanzlei-fristen-case": steuerkanzleiFristenCase,
  "340-consultancy-funnel-case": consultancy340FunnelCase,
  "b2b-lead-qualifizierung-case": b2bLeadQualifizierungCase,
  "handwerk-funnel-case": handwerkFunnelCase,
  // KI-Audit
  "ki-audit-hero": kiAuditHero,
  "ki-audit-process": kiAuditProcess,
  // Pain Point A
  "painpoint-a-vorher-nachher": painpointAVorherNachher,
  "painpoint-a-section3": painpointASection3,
  "painpoint-a-feature2": painpointAFeature2,
  "painpoint-a-feature3": painpointAFeature3,
  "painpoint-a-icon-analyse": painpointAIconAnalyse,
  "painpoint-a-icon-koordination": painpointAIconKoordination,
  "painpoint-a-icon-insights": painpointAIconInsights,
  // Anwendungsfelder (Pain Points B–E, Industrien 1–4)
"pain-point-compliance-hero": painPointComplianceHero,
  "pain-point-kpi-dashboard-hero": painPointKpiDashboardHero,
  "pain-point-kundensupport-hero": painPointKundensupportHero,
  "pain-point-entscheidungsinstanzen-hero": painPointEntscheidungsinstanzenHero,
  "pain-point-health-care-hero": painPointHealthCareHero,
  "pain-point-handel-supply-chain-hero": painPointHandelSupplyChainHero,
  "pain-point-professional-services-hero": painPointProfessionalServicesHero,
  "pain-point-entscheidungsinstanzen-feature2": painPointEntscheidungsinstanzenFeature2,
  "pain-point-professional-services-feature2": painPointProfessionalServicesFeature2,
  "pain-point-kundensupport-feature3": painPointKundensupportFeature3,
  "pain-point-kundengewinnung-hero": painPointKundengewinnungHero,
  "pain-point-compliance-feature1": painPointComplianceFeature1,
  "pain-point-compliance-feature2": painPointComplianceFeature2,
  "pain-point-compliance-feature3": painPointComplianceFeature3,
  "pain-point-kpi-dashboard-feature1": painPointKpiDashboardFeature1,
  "pain-point-kpi-dashboard-feature2": painPointKpiDashboardFeature2,
  "pain-point-kpi-dashboard-feature3": painPointKpiDashboardFeature3,
  "pain-point-kundensupport-feature1": painPointKundensupportFeature1,
  "pain-point-kundensupport-feature2": painPointKundensupportFeature2,
  "pain-point-entscheidungsinstanzen-feature1": painPointEntscheidungsinstanzenFeature1,
  "pain-point-entscheidungsinstanzen-feature3": painPointEntscheidungsinstanzenFeature3,
  "pain-point-health-care-feature1": painPointHealthCareFeature1,
  "pain-point-health-care-feature2": painPointHealthCareFeature2,
  "pain-point-health-care-feature3": painPointHealthCareFeature3,
  "pain-point-handel-supply-chain-feature1": painPointHandelSupplyChainFeature1,
  "pain-point-handel-supply-chain-feature2": painPointHandelSupplyChainFeature2,
  "pain-point-handel-supply-chain-feature3": painPointHandelSupplyChainFeature3,
  "pain-point-professional-services-feature1": painPointProfessionalServicesFeature1,
  "pain-point-professional-services-feature3": painPointProfessionalServicesFeature3,
  "pain-point-auswahlverfahren-feature1": painPointAuswahlverfahrenFeature1,
  "pain-point-auswahlverfahren-feature2": painPointAuswahlverfahrenFeature2,
  "pain-point-auswahlverfahren-feature3": painPointAuswahlverfahrenFeature3,
  // Anwendungsfelder: Feature-Card-Icons
"i1-icon-aggreg": iconI1IconAggreg,
  "i1-icon-audit": iconI1IconAudit,
  "i1-icon-begruend": iconI1IconBegruend,
  "i1-icon-doku": iconI1IconDoku,
  "i1-icon-erfassung": iconI1IconErfassung,
  "i1-icon-individ": iconI1IconIndivid,
  "i1-icon-vergleich": iconI1IconVergleich,
  "i1-icon-wissen": iconI1IconWissen,
  "i2-icon-lampeidee": iconI2IconLampeidee,
  "i4-icon-24-7": iconI4Icon247,
  "i4-icon-agent": iconI4IconAgent,
  "i4-icon-eskalation": iconI4IconEskalation,
  "i4-icon-followup": iconI4IconFollowup,
  "i4-icon-kireport": iconI4IconKireport,
  "i4-icon-onboarding": iconI4IconOnboarding,
  "i4-icon-output": iconI4IconOutput,
  "i4-icon-report": iconI4IconReport,
  "ppa-icon-balance": iconPpaIconBalance,
  "ppa-icon-bell": iconPpaIconBell,
  "ppa-icon-chart": iconPpaIconChart,
  "ppa-icon-cluster": iconPpaIconCluster,
  "ppa-icon-db": iconPpaIconDb,
  "ppa-icon-dok": iconPpaIconDok,
  "ppa-icon-form": iconPpaIconForm,
  "ppa-icon-insight": iconPpaIconInsight,
  "ppa-icon-sliders": iconPpaIconSliders,
  "ppb-icon-cal": iconPpbIconCal,
  "ppb-icon-chat": iconPpbIconChat,
  "ppb-icon-clock": iconPpbIconClock,
  "ppb-icon-dashboard": iconPpbIconDashboard,
  "ppb-icon-euro": iconPpbIconEuro,
  "ppb-icon-funnel": iconPpbIconFunnel,
  "ppb-icon-line": iconPpbIconLine,
  "ppb-icon-lock": iconPpbIconLock,
  "ppb-icon-person": iconPpbIconPerson,
  "ppc-icon-alert": iconPpcIconAlert,
  "ppc-icon-brain": iconPpcIconBrain,
  "ppc-icon-globe": iconPpcIconGlobe,
  "ppc-icon-history": iconPpcIconHistory,
  "ppc-icon-refresh": iconPpcIconRefresh,
  "ppc-icon-scan": iconPpcIconScan,
  "ppc-icon-shield": iconPpcIconShield,
  "ppc-icon-teams": iconPpcIconTeams,
  "ppc-icon-timeline": iconPpcIconTimeline,
  "ppd-icon-api": iconPpdIconApi,
  "ppd-icon-bot": iconPpdIconBot,
  "ppd-icon-brand": iconPpdIconBrand,
  "ppd-icon-leaf": iconPpdIconLeaf,
  "ppd-icon-lightning": iconPpdIconLightning,
  "ppd-icon-robot": iconPpdIconRobot,
  "ppd-icon-server": iconPpdIconServer,
  "ppd-icon-team": iconPpdIconTeam,
  "ppd-icon-teams2": iconPpdIconTeams2,
  "ppe-icon-analytics": iconPpeIconAnalytics,
  "ppe-icon-context": iconPpeIconContext,
  "ppe-icon-csat": iconPpeIconCsat,
  "ppe-icon-learn": iconPpeIconLearn,
  "ppe-icon-prio": iconPpeIconPrio,
  "ppe-icon-product": iconPpeIconProduct,
  "ppe-icon-route": iconPpeIconRoute,
  "ppe-icon-speed": iconPpeIconSpeed,
  "ppe-icon-voice": iconPpeIconVoice,
  // Partner / Award Logos
  "logo-bafa": logoBafa,
  "logo-idc": logoIdc,
  "logo-bmp-2026": logoBmp2026,
  // Client Logos
  "logo-albanova-consulting": logoAlbanovaConsulting,
  "logo-becoming-you": logoBecomingYou,
  "logo-circle-photo": logoCirclePhoto,
  "logo-club-cli": logoClubCli,
  "logo-darius-company": logoDariusCompany,
  "logo-dr-aaron-loeb": logoDrAaronLoeb,
  "logo-elite-aesthetic": logoEliteAesthetic,
  "logo-hyde-official": logoHydeOfficial,
  "logo-muse-studio": logoMuseStudio,
  "logo-pure-design": logoPureDesign,
  "logo-sadie-kessler": logoSadieKessler,
  "logo-seabreeze": logoSeabreeze,
} as const;

export type ImageKey = keyof typeof IMAGES;

/**
 * Im CMS hochgeladene Ersatzbilder: Registry-Key → Upload-URL.
 * Wird beim App-Start einmalig aus `/api/image-overrides` befüllt
 * (siehe `hooks/useImageOverrides.ts`). Leer = alles wie eingebaut.
 */
let overrides: Readonly<Record<string, string>> = {};

/** Setzt die CMS-Überschreibungen (nur vom useImageOverrides-Hook aufgerufen). */
export const setImageOverrides = (map: Record<string, string>): void => {
  overrides = map;
};

/** Aktuelle Überschreibungen (für Debugging/Tests). */
export const getImageOverrides = (): Readonly<Record<string, string>> => overrides;

/**
 * Löst einen Bild-Key zur finalen URL auf. Reihenfolge:
 *   1. im CMS hochgeladenes Ersatzbild („Bild austauschen")
 *   2. eingebautes Bild aus der Registry (gehashte Vite-URL)
 *   3. unveränderter Durchreicher — CMS-Upload-URLs, /public-Pfade
 */
export const img = (key: ImageKey | (string & {})): string =>
  overrides[key as string] ?? IMAGES[key as ImageKey] ?? (key as string);
