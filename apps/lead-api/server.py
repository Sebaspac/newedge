"""
server.py — NEWEDGE Lead- & Report-Service (FastAPI)

Zwei Endpoints, ein SMTP-Zugang:

  POST /roi-report   ROI-Rechner: Lead speichern, 6-seitigen PDF-Report
                     erzeugen (generate_roi_report.py), an den Lead mailen
                     plus Benachrichtigung an NEWEDGE.
  POST /contact      Kontaktformular: Anfrage speichern, an NEWEDGE mailen
                     (Reply-To = Absender) plus Empfangsbestätigung an den
                     Absender.
  GET/POST /abmelden/<token>
                     Abmeldung von Follow-up-Mails (DSGVO). GET zeigt eine
                     Bestätigungsseite, POST trägt die Adresse aus.

Beide Formular-Endpunkte antworten nur bei echtem Erfolg mit success — Fehler
werden als HTTP-Fehler zurückgegeben, damit das Frontend sie anzeigen kann.

Zusätzlich läuft — nur wenn FOLLOWUP_ENABLED=1 — ein Hintergrund-Thread, der
zeitversetzte Follow-up-Mails abarbeitet (siehe followups.py).

Konfiguration ausschließlich über Umgebungsvariablen (.env, siehe .env.example):
  ALLOWED_ORIGINS   Komma-Liste erlaubter Browser-Origins (CORS)
  SMTP_HOST/PORT    z. B. smtp.gmail.com / 587 (Google Workspace: App-Passwort)
  SMTP_USER/PASS    Postfach-Zugang
  MAIL_FROM         Absender, z. B. "NEWEDGE <info@newedgebrand.com>"
  NOTIFY_TO         interne Benachrichtigung (Lead-Kopie), leer = aus
  SEND_DISABLED     "1" = kein Mailversand (Test), PDF wird trotzdem erzeugt
  DATA_DIR          Ablage für leads.jsonl + PDFs (Default: ./data)
  FOLLOWUP_*        Follow-up-Sequenzen, Default AUS — siehe followups.py
  STRAPI_URL        optional: Basis-URL des CMS (z. B. https://cms.newedgebrand.com)
  STRAPI_TOKEN      optional: Strapi-API-Token mit Schreibrecht auf "Lead"
  STRAPI_TIMEOUT    optional: Timeout in Sekunden für den CMS-Call (Default: 5)

Die CMS-Übertragung ist eine reine Zweitablage: Primär bleibt die .jsonl-Datei.
Ist STRAPI_URL/STRAPI_TOKEN nicht gesetzt oder das CMS gerade nicht erreichbar,
wird das nur geloggt — der Request bleibt erfolgreich, der Lead geht nie verloren.

Start lokal:   uvicorn server:app --host 0.0.0.0 --port 8090
Produktion:    docker compose up -d   (siehe README-DEPLOY.md)
"""

from __future__ import annotations

import json
import logging
import os
import re
import smtplib
import threading
import time
import urllib.error
import urllib.request
import uuid
from datetime import datetime, timezone
from email.message import EmailMessage

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from starlette.concurrency import run_in_threadpool

import followups
from generate_roi_report import generate_roi_report

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.environ.get("DATA_DIR", os.path.join(BASE_DIR, "data"))
REPORTS_DIR = os.path.join(DATA_DIR, "reports")
LEADS_PATH = os.path.join(DATA_DIR, "leads.jsonl")
CONTACTS_PATH = os.path.join(DATA_DIR, "contacts.jsonl")

ALLOWED_ORIGINS = [o.strip() for o in os.environ.get(
    "ALLOWED_ORIGINS",
    "https://newedgebrand.com,https://www.newedgebrand.com,https://newedgebrand.netlify.app,http://localhost:8081",
).split(",") if o.strip()]

SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASS", "")
MAIL_FROM = os.environ.get("MAIL_FROM", "NEWEDGE <info@newedgebrand.com>")
NOTIFY_TO = os.environ.get("NOTIFY_TO", "")
SEND_DISABLED = os.environ.get("SEND_DISABLED", "") == "1"

# Optionale Zweitablage im CMS — beide leer = Feature aus, Service läuft wie bisher.
STRAPI_URL = os.environ.get("STRAPI_URL", "").strip().rstrip("/")
STRAPI_TOKEN = os.environ.get("STRAPI_TOKEN", "").strip()
try:
    STRAPI_TIMEOUT = float(os.environ.get("STRAPI_TIMEOUT", "5"))
except ValueError:
    STRAPI_TIMEOUT = 5.0

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

log = logging.getLogger("newedge.leads")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Follow-up-Worker an die Lebensdauer des Service hängen.

    Der Worker startet nur bei FOLLOWUP_ENABLED=1 und nur in genau einem
    Prozess (Dateisperre auf DATA_DIR) — siehe followups.py.
    """
    followups.start_worker(send_mail=send_mail)
    try:
        yield
    finally:
        followups.stop_worker()


app = FastAPI(title="NEWEDGE ROI-Report-Service", docs_url=None, redoc_url=None,
              lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# Naives Rate-Limit je IP (Lead-Formular, kein API-Produkt): 5 Requests / 10 Min.
_rate: dict[str, list[float]] = {}
_rate_lock = threading.Lock()

def rate_ok(ip: str, limit: int = 5, window: int = 600) -> bool:
    now = time.time()
    with _rate_lock:
        hits = [t for t in _rate.get(ip, []) if now - t < window]
        if len(hits) >= limit:
            _rate[ip] = hits
            return False
        hits.append(now)
        _rate[ip] = hits
        return True


def mail_text(d: dict) -> str:
    first = (d.get("name") or "").strip().split(" ")[0] or "Hallo"
    anrede = f"Hallo {first}," if first != "Hallo" else "Hallo,"
    return f"""{anrede}

anbei Ihr persönlicher KI-Audit-Report aus dem NEWEDGE ROI-Rechner —
mit Ihrem Einsparpotenzial, den größten Automatisierungs-Chancen und
den nächsten Schritten für {d.get('company') or 'Ihr Unternehmen'}.

Kurz zusammengefasst:
  · Netto-Potenzial: ~{round(d.get('totalNet', 0)):,} € pro Jahr
  · Freigesetzte Zeit: ~{round(d.get('hoursYear', 0)):,} Stunden pro Jahr
  · Investition wieder drin nach: ~{round(d.get('payback', 0))} Monaten

Wenn Sie die Zahlen an Ihrem echten Betrieb validieren möchten:
30 Minuten, kostenlos, unverbindlich — antworten Sie einfach auf diese
E-Mail oder rufen Sie an: +49 176 60 431 467.

Beste Grüße
Ihr NEWEDGE-Team

NEWEDGE · Die KI-Abteilung für den Mittelstand
info@newedgebrand.com · newedgebrand.com
""".replace(",", ".")  # deutsche Tausenderpunkte in den Zahlen


def send_mail(to: str, subject: str, body: str, attachment: str | None = None,
              attach_name: str = "NEWEDGE_KI-Audit.pdf", reply_to: str | None = None,
              headers: dict | None = None):
    msg = EmailMessage()
    msg["From"] = MAIL_FROM
    msg["To"] = to
    msg["Subject"] = subject
    if reply_to:
        msg["Reply-To"] = reply_to
    # Zusatz-Header, z. B. List-Unsubscribe bei Follow-ups
    for key, value in (headers or {}).items():
        if value:
            msg[key] = value
    msg.set_content(body)
    if attachment:
        with open(attachment, "rb") as f:
            msg.add_attachment(f.read(), maintype="application",
                               subtype="pdf", filename=attach_name)
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as s:
        s.starttls()
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)


# ── CMS-Zweitablage (Strapi) ───────────────────────────────────────────────
# Die .jsonl-Datei ist und bleibt die Primärablage. Der CMS-Eintrag ist reine
# Bequemlichkeit fürs Team (Leads im Admin sehen, ohne SSH). Deshalb gilt hier
# ausnahmslos: Fehler werden geloggt, nie geworfen. Ein Lead darf niemals
# verloren gehen oder als Fehler beim Absender landen, nur weil das CMS klemmt.

def _iso_utc(value) -> str:
    """Beliebigen Zeitstempel in ein von Strapi akzeptiertes ISO-UTC-Format bringen."""
    try:
        dt = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except Exception:
        dt = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _as_int(value) -> int | None:
    try:
        if value is None or value == "":
            return None
        return int(round(float(value)))
    except (TypeError, ValueError):
        return None


def strapi_record(quelle: str, payload: dict) -> dict:
    """Payload auf die Felder des CMS-Typs „Lead" mappen (voller Payload bleibt in payloadJson)."""
    return {
        "quelle": quelle,
        "name": payload.get("name"),
        "email": payload.get("email"),
        "telefon": payload.get("phone") or payload.get("telefon"),
        "firma": payload.get("company"),
        "position": payload.get("position"),
        "nachricht": payload.get("message"),
        "leadId": payload.get("leadId") or payload.get("contactId"),
        "potenzialEur": _as_int(payload.get("totalNet")),
        "payloadJson": payload,
        "eingegangenAm": _iso_utc(payload.get("submittedAt")),
    }


def push_to_strapi(quelle: str, payload: dict, fallback_path: str) -> None:
    """Lead zusätzlich ins CMS schreiben. Wirft nie — schlimmstenfalls eine Logzeile."""
    lead_id = payload.get("leadId") or payload.get("contactId") or "?"
    if not STRAPI_URL or not STRAPI_TOKEN:
        return  # Feature nicht konfiguriert — kein Rauschen im Log
    try:
        body = json.dumps({"data": strapi_record(quelle, payload)}, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(
            f"{STRAPI_URL}/api/leads",
            data=body,
            method="POST",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {STRAPI_TOKEN}",
            },
        )
        with urllib.request.urlopen(req, timeout=STRAPI_TIMEOUT) as resp:
            resp.read()
        log.info("[strapi] Lead %s im CMS angelegt", lead_id)
    except urllib.error.HTTPError as e:
        detail = ""
        try:
            detail = e.read().decode("utf-8", "replace")[:500]
        except Exception:
            pass
        log.warning("[strapi] Lead %s NICHT ins CMS übertragen (HTTP %s %s) — liegt in %s",
                    lead_id, e.code, detail, fallback_path)
    except Exception as e:
        log.warning("[strapi] Lead %s NICHT ins CMS übertragen (%s: %s) — liegt in %s",
                    lead_id, type(e).__name__, e, fallback_path)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "roi-report",
        "mail": bool(SMTP_HOST) and not SEND_DISABLED,
        "cms": bool(STRAPI_URL and STRAPI_TOKEN),
        "followups": followups.status(),
    }


@app.post("/roi-report")
async def roi_report(request: Request):
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "?").split(",")[0].strip()
    if not rate_ok(ip):
        return JSONResponse({"error": "rate_limited"}, status_code=429)

    try:
        payload = await request.json()
    except Exception:
        return JSONResponse({"error": "invalid_json"}, status_code=400)

    # Honeypot: verstecktes Feld, das Menschen leer lassen
    if payload.get("website"):
        return {"success": True}

    email = (payload.get("email") or "").strip()
    if not EMAIL_RE.match(email):
        return JSONResponse({"error": "invalid_email"}, status_code=400)
    if not isinstance(payload.get("rows"), list) or not payload["rows"]:
        return JSONResponse({"error": "missing_rows"}, status_code=400)

    lead_id = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S") + "-" + uuid.uuid4().hex[:6]
    payload["leadId"] = lead_id
    payload.setdefault("submittedAt", datetime.now(timezone.utc).isoformat())

    # 1) Lead persistieren (JSONL — jede Zeile ein Lead, robust und grep-bar)
    os.makedirs(REPORTS_DIR, exist_ok=True)
    with open(LEADS_PATH, "a") as f:
        f.write(json.dumps(payload, ensure_ascii=False) + "\n")

    # 1b) Zusätzlich ins CMS — best effort, scheitert nie den Request.
    #     Im Threadpool, weil urllib blockiert: ein hängendes CMS würde sonst
    #     bis STRAPI_TIMEOUT den kompletten Event-Loop anhalten — also auch
    #     /health und jeden parallelen Formular-Request.
    await run_in_threadpool(push_to_strapi, "roi", payload, LEADS_PATH)

    # 2) PDF erzeugen
    safe_company = re.sub(r"[^A-Za-z0-9_-]+", "_", payload.get("company") or "Lead").strip("_") or "Lead"
    pdf_path = os.path.join(REPORTS_DIR, f"{lead_id}_{safe_company}.pdf")
    try:
        generate_roi_report(payload, pdf_path)
    except Exception as e:
        return JSONResponse({"error": f"pdf_failed: {e}"}, status_code=500)

    # 3) Versand — Fehler hier ist ein echter Fehler (Frontend zeigt ihn an)
    if SEND_DISABLED or not SMTP_HOST:
        followups.queue_roi_followup(payload)  # Testmodus: einplanen, Worker läuft trocken
        return {"success": True, "leadId": lead_id, "mail": "disabled"}
    try:
        send_mail(email, "Ihr KI-Audit-Report — NEWEDGE", mail_text(payload), attachment=pdf_path)
        if NOTIFY_TO:
            summary = json.dumps({k: payload.get(k) for k in
                                  ("leadId", "name", "company", "email", "branche", "team",
                                   "maturity", "totalNet", "payback")}, ensure_ascii=False, indent=2)
            send_mail(NOTIFY_TO, f"Neuer ROI-Lead: {payload.get('company') or email}",
                      f"Neuer Lead über den ROI-Rechner:\n\n{summary}\n\nReport im Anhang.",
                      attachment=pdf_path)
    except Exception as e:
        return JSONResponse({"error": f"mail_failed: {e}"}, status_code=502)

    # 4) Follow-up einplanen — erst jetzt, denn ein Nachfassen zu einer Mail,
    #    die nie ankam, ergibt keinen Sinn. Tut nichts bei FOLLOWUP_ENABLED=0.
    followups.queue_roi_followup(payload)

    return {"success": True, "leadId": lead_id}


# ── Kontaktformular ────────────────────────────────────────────────────────
# Die Anfrage wird gespeichert UND tatsächlich gemailt — Erfolg wird nur bei
# echtem Erfolg gemeldet.

def contact_notification(d: dict) -> str:
    felder = [
        ("Name", d.get("name")),
        ("E-Mail", d.get("email")),
        ("Telefon", d.get("phone")),
        ("Firma", d.get("company")),
        ("Position", d.get("position")),
    ]
    kopf = "\n".join(f"{k}: {v}" for k, v in felder if v)
    return f"""Neue Anfrage über das Kontaktformular:

{kopf}

Nachricht:
{d.get('message', '')}

--
Eingegangen: {d.get('submittedAt')}
Seite: {d.get('sourcePage') or 'unbekannt'}
Antworten Sie einfach auf diese E-Mail — sie geht direkt an {d.get('email')}.
"""


def contact_confirmation(d: dict) -> str:
    first = (d.get("name") or "").strip().split(" ")[0]
    anrede = f"Hallo {first}," if first else "Hallo,"
    return f"""{anrede}

vielen Dank für Ihre Nachricht — sie ist bei uns angekommen.
Wir melden uns in der Regel innerhalb eines Werktags bei Ihnen.

Ihre Nachricht zur Erinnerung:
{d.get('message', '')}

Wenn es eilt, erreichen Sie uns direkt: +49 176 60 431 467

Beste Grüße
Ihr NEWEDGE-Team

NEWEDGE · Die KI-Abteilung für den Mittelstand
info@newedgebrand.com · newedgebrand.com
"""


@app.post("/contact")
async def contact(request: Request):
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "?").split(",")[0].strip()
    if not rate_ok(ip):
        return JSONResponse({"error": "rate_limited"}, status_code=429)

    try:
        payload = await request.json()
    except Exception:
        return JSONResponse({"error": "invalid_json"}, status_code=400)

    # Honeypot — Feldname identisch zum Frontend (website_url)
    if payload.get("website_url") or payload.get("website"):
        return {"success": True}

    email = (payload.get("email") or "").strip()
    name = (payload.get("name") or "").strip()
    message = (payload.get("message") or "").strip()
    if not EMAIL_RE.match(email):
        return JSONResponse({"error": "invalid_email"}, status_code=400)
    if len(name) < 2 or len(message) < 10:
        return JSONResponse({"error": "invalid_fields"}, status_code=400)
    # Einwilligung ist Pflicht (DSGVO) — das Frontend erzwingt sie ebenfalls
    if not payload.get("consent"):
        return JSONResponse({"error": "consent_required"}, status_code=400)

    contact_id = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S") + "-" + uuid.uuid4().hex[:6]
    payload["contactId"] = contact_id
    payload.setdefault("submittedAt", datetime.now(timezone.utc).isoformat())

    os.makedirs(DATA_DIR, exist_ok=True)
    with open(CONTACTS_PATH, "a") as f:
        f.write(json.dumps(payload, ensure_ascii=False) + "\n")

    # Zusätzlich ins CMS — best effort, scheitert nie den Request (Threadpool:
    # siehe Begründung bei /roi-report)
    await run_in_threadpool(push_to_strapi, "kontakt", payload, CONTACTS_PATH)

    if SEND_DISABLED or not SMTP_HOST:
        followups.queue_contact_followup(payload)  # Testmodus: einplanen, Worker läuft trocken
        return {"success": True, "contactId": contact_id, "mail": "disabled"}

    try:
        # 1) Anfrage an NEWEDGE — Reply-To auf den Absender, damit "Antworten" reicht
        send_mail(NOTIFY_TO or SMTP_USER,
                  f"Neue Kontaktanfrage: {payload.get('company') or name}",
                  contact_notification(payload), reply_to=email)
        # 2) Empfangsbestätigung an den Absender
        send_mail(email, "Ihre Nachricht an NEWEDGE", contact_confirmation(payload))
    except Exception as e:
        return JSONResponse({"error": f"mail_failed: {e}"}, status_code=502)

    # 3) Follow-up einplanen — nur wenn FOLLOWUP_CONTACT_ENABLED=1 (Default aus,
    #    weil der Service nicht wissen kann, ob wir längst geantwortet haben)
    followups.queue_contact_followup(payload)

    return {"success": True, "contactId": contact_id}


# ── Abmeldung von Follow-ups (DSGVO) ───────────────────────────────────────
# GET zeigt nur eine Bestätigungsseite: Mailclients und Virenscanner rufen
# Links in E-Mails automatisch auf — ein GET darf deshalb nichts verändern.
# Erst das POST (Klick auf den Button oder One-Click-Abmeldung des Mail-
# providers laut RFC 8058) trägt die Adresse aus.

_PAGE = """<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Abmelden — NEWEDGE</title>
<style>
  body{{margin:0;min-height:100vh;display:grid;place-items:center;
       background:#F2F2F2;color:#171717;
       font:400 16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}}
  main{{max-width:34rem;padding:2.5rem;background:#fff;border-radius:16px;
        border:1px solid #DBDBD7;margin:1.5rem}}
  h1{{font-size:1.4rem;margin:0 0 1rem;font-weight:600}}
  p{{margin:0 0 1rem;color:#3C3C3C}}
  button{{font:inherit;font-weight:600;border:0;border-radius:12px;
          background:#171717;color:#CCFF00;padding:.85rem 1.5rem;cursor:pointer}}
  button:hover{{background:#000}}
  .muted{{font-size:.85rem;color:#6B6B66}}
</style></head><body><main>{inhalt}</main></body></html>"""


def _page(inhalt: str, status_code: int = 200) -> HTMLResponse:
    return HTMLResponse(_PAGE.format(inhalt=inhalt), status_code=status_code)


_ABGEMELDET = """<h1>Abgemeldet</h1>
<p>Ihre Adresse ist aus dem Follow-up-Verteiler gelöscht. Sie erhalten von uns
keine Nachfass-E-Mails mehr.</p>
<p class="muted">Antworten auf eine laufende Konversation sind davon nicht
betroffen. Wenn Sie auch Ihre gespeicherten Daten gelöscht haben möchten,
schreiben Sie kurz an info@newedgebrand.com.</p>"""

_UNBEKANNT = """<h1>Link nicht mehr gültig</h1>
<p>Zu diesem Link finden wir keine Adresse — vermutlich ist er abgelaufen.</p>
<p class="muted">Eine kurze Mail an info@newedgebrand.com mit dem Wort
„Abmelden" genügt, dann tragen wir Sie von Hand aus.</p>"""


@app.get("/abmelden/{token}")
def abmelden_form(token: str):
    if not followups.email_for_token(token):
        return _page(_UNBEKANNT, status_code=404)
    return _page(f"""<h1>Keine weiteren E-Mails?</h1>
<p>Ein Klick, und wir schreiben Ihnen nicht mehr. Keine Rückfragen.</p>
<form method="post" action="/abmelden/{token}">
  <button type="submit">Jetzt abmelden</button>
</form>""")


@app.post("/abmelden/{token}")
async def abmelden(token: str):
    email = followups.email_for_token(token)
    if not email:
        return _page(_UNBEKANNT, status_code=404)
    followups.suppress(email, source="link")
    return _page(_ABGEMELDET)
