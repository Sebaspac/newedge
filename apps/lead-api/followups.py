"""
followups.py — zeitversetzte Follow-up-Mails für beide Formulare.

Architektur (bewusst klein gehalten, keine zusätzliche Infrastruktur):

  data/followups.jsonl      Warteschlange, append-only. Eine Zeile = ein
                            geplantes Follow-up (id, dueAt, to, kind, …).
  data/followups.log.jsonl  Ereignis-Protokoll, append-only. Eine Zeile =
                            ein Zustandswechsel (claim / sent / error / …).
                            Diese Datei allein entscheidet, was schon
                            passiert ist — dadurch ist der Versand nach
                            Absturz oder Neustart nicht wiederholbar.
  data/suppressed.txt       Abgemeldete Adressen, eine je Zeile.
  data/followups.lock       Betriebssystem-Lock: genau ein Worker.

Ein Hintergrund-Thread im Service (Start über den FastAPI-Lifespan) sieht
alle FOLLOWUP_INTERVAL_MINUTES nach, welche Einträge fällig sind, und
verschickt sie. Beide Dateien liegen im gemountetem DATA_DIR und überleben
damit jeden Container-Neustart.

Warum Thread statt Cron: siehe README-DEPLOY.md, Abschnitt "Follow-ups".
Kurz — ein einzelner Container soll ein einzelner Prozess bleiben; Cron im
Container bräuchte einen zweiten Dienst (supervisord) und Cron auf dem Host
bräuchte `docker exec` plus eigene Fehlerbehandlung. Der Thread startet und
stirbt mit dem Service und nutzt exakt denselben SMTP-Weg wie der
Sofortversand.

Zustandsautomat je Eintrag (aus followups.log.jsonl rekonstruiert):

  (neu) ──fällig──▶ claim ──▶ sent            fertig
                      │
                      ├────▶ error ──▶ (Retry nach FOLLOWUP_RETRY_MINUTES,
                      │                 max. FOLLOWUP_MAX_ATTEMPTS) ──▶ gaveup
                      └────▶ suppressed / dry_run                     fertig

  claim ohne Folge-Ereignis = Absturz mitten im Versand. Der Eintrag wird
  beim nächsten Durchlauf als `orphaned` abgeschlossen und NICHT erneut
  verschickt (lieber ein verlorenes Follow-up als eine doppelte Mail).
  Solche Fälle werden geloggt und tauchen in /health auf.

CLI (kein Mailversand, für Tests):
  python followups.py preview roi          Mailtext aus sample_roi_lead.json
  python followups.py preview contact      Mailtext für das Kontaktformular
  python followups.py list                 Warteschlange + Status
  python followups.py run-once             fälliges abarbeiten (Dry-Run)
  python followups.py run-once --send      … und wirklich verschicken
  python followups.py enqueue-test <mail>  Testeintrag, sofort fällig
"""

from __future__ import annotations

import json
import os
import sys
import threading
import uuid
from contextlib import contextmanager
from datetime import datetime, time as dtime, timedelta, timezone
from typing import Any, Callable, Dict, List, Optional, Tuple

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.environ.get("DATA_DIR", os.path.join(BASE_DIR, "data"))

QUEUE_PATH = os.path.join(DATA_DIR, "followups.jsonl")
LOG_PATH = os.path.join(DATA_DIR, "followups.log.jsonl")
SUPPRESS_PATH = os.path.join(DATA_DIR, "suppressed.txt")
LOCK_PATH = os.path.join(DATA_DIR, "followups.lock")


# ── Konfiguration ──────────────────────────────────────────────────────────

def _flag(name: str, default: str = "0") -> bool:
    return os.environ.get(name, default).strip().lower() in ("1", "true", "yes", "on")


def _num(name: str, default: float) -> float:
    try:
        return float(os.environ.get(name, "").strip() or default)
    except ValueError:
        return default


# Default AUS: ohne bewusste Freischaltung wird nichts geplant und nichts verschickt.
ENABLED = _flag("FOLLOWUP_ENABLED", "0")
CONTACT_ENABLED = _flag("FOLLOWUP_CONTACT_ENABLED", "0")

# Der Worker-Thread im Service. Default AN — nur abschalten, wenn die
# Warteschlange stattdessen von außen abgearbeitet wird (Cron mit
# `followups.py run-once --send`). Geplant wird weiterhin, nur eben nicht
# versendet: der Thread hält das Lock sonst dauerhaft und der Cron-Lauf käme
# nie zum Zug.
WORKER_ENABLED = _flag("FOLLOWUP_WORKER", "1")

INTERVAL_MINUTES = max(1.0, _num("FOLLOWUP_INTERVAL_MINUTES", 10))
ROI_DELAY_DAYS = _num("FOLLOWUP_ROI_DELAY_DAYS", 3)
CONTACT_DELAY_DAYS = _num("FOLLOWUP_CONTACT_DELAY_DAYS", 5)
MAX_OVERDUE_DAYS = _num("FOLLOWUP_MAX_OVERDUE_DAYS", 14)
MAX_ATTEMPTS = int(_num("FOLLOWUP_MAX_ATTEMPTS", 3))
RETRY_MINUTES = _num("FOLLOWUP_RETRY_MINUTES", 30)

# Versandfenster in lokaler Zeit — eine Mail um 4:12 Uhr sieht nach Maschine aus.
SEND_WINDOW = os.environ.get("FOLLOWUP_SEND_WINDOW", "08:00-18:00").strip()
SEND_TZ = os.environ.get("FOLLOWUP_TZ", "Europe/Berlin").strip() or "Europe/Berlin"
WEEKDAYS_ONLY = _flag("FOLLOWUP_WEEKDAYS_ONLY", "1")

# Abmeldelink; leer = nur Abmeldung per Antwortmail im Text.
UNSUBSCRIBE_BASE = os.environ.get("FOLLOWUP_UNSUBSCRIBE_BASE", "").strip().rstrip("/")
UNSUBSCRIBE_MAILTO = os.environ.get("FOLLOWUP_UNSUBSCRIBE_MAILTO", "info@newedgebrand.com").strip()

# Trockenlauf: rendert und protokolliert, verschickt nichts.
DRY_RUN = _flag("FOLLOWUP_DRY_RUN", "0") or _flag("SEND_DISABLED", "0")

PHONE = "+49 176 60 431 467"


def _log_line(msg: str) -> None:
    print(f"[followups] {msg}", flush=True)


# ── Zeit ───────────────────────────────────────────────────────────────────

def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat()


def parse_iso(value: Any) -> Optional[datetime]:
    if not isinstance(value, str) or not value.strip():
        return None
    text = value.strip().replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(text)
    except ValueError:
        return None
    return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt


def _local_now(now: datetime) -> datetime:
    try:
        from zoneinfo import ZoneInfo

        return now.astimezone(ZoneInfo(SEND_TZ))
    except Exception:  # keine tzdata im Image → lieber UTC als gar kein Fenster
        return now.astimezone(timezone.utc)


def _window() -> Optional[Tuple[dtime, dtime]]:
    if not SEND_WINDOW or SEND_WINDOW.lower() in ("", "off", "always", "24/7"):
        return None
    try:
        start_s, end_s = SEND_WINDOW.split("-", 1)
        sh, sm = (int(x) for x in start_s.strip().split(":", 1))
        eh, em = (int(x) for x in end_s.strip().split(":", 1))
        return dtime(sh, sm), dtime(eh, em)
    except Exception:
        _log_line(f"FOLLOWUP_SEND_WINDOW unlesbar ({SEND_WINDOW!r}) — Fenster deaktiviert")
        return None


def in_send_window(now: Optional[datetime] = None) -> bool:
    """Darf jetzt verschickt werden? Außerhalb wird nur gewartet, nichts verworfen."""
    now = now or now_utc()
    local = _local_now(now)
    if WEEKDAYS_ONLY and local.weekday() >= 5:
        return False
    win = _window()
    if win is None:
        return True
    start, end = win
    return start <= local.time() <= end


# ── Dateizugriff (append-only, mit fsync — Neustart-fest) ──────────────────

def _append_json(path: str, record: Dict[str, Any]) -> None:
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
        f.flush()
        os.fsync(f.fileno())


def _read_jsonl(path: str) -> List[Dict[str, Any]]:
    if not os.path.exists(path):
        return []
    out: List[Dict[str, Any]] = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue  # abgeschnittene Zeile (harter Abbruch) einfach überspringen
            if isinstance(rec, dict):
                out.append(rec)
    return out


def read_queue() -> List[Dict[str, Any]]:
    return _read_jsonl(QUEUE_PATH)


def _write_event(entry_id: str, event: str, **detail: Any) -> None:
    rec = {"at": iso(now_utc()), "id": entry_id, "event": event}
    rec.update({k: v for k, v in detail.items() if v is not None})
    _append_json(LOG_PATH, rec)


TERMINAL = {"sent", "gaveup", "expired", "suppressed", "dry_run", "orphaned", "cancelled"}
RESOLVING = {"sent", "error", "suppressed", "dry_run"}  # schließt genau einen claim ab


class EntryState:
    __slots__ = ("attempts", "resolved", "terminal", "last_error_at")

    def __init__(self) -> None:
        self.attempts = 0
        self.resolved = 0
        self.terminal: Optional[str] = None
        self.last_error_at: Optional[datetime] = None

    @property
    def open_claim(self) -> bool:
        return self.attempts > self.resolved


def read_state() -> Dict[str, EntryState]:
    """Zustand je Eintrag aus dem Ereignis-Protokoll rekonstruieren."""
    states: Dict[str, EntryState] = {}
    for rec in _read_jsonl(LOG_PATH):
        entry_id = rec.get("id")
        event = rec.get("event")
        if not isinstance(entry_id, str) or not isinstance(event, str):
            continue
        st = states.setdefault(entry_id, EntryState())
        if event == "claim":
            st.attempts += 1
        elif event in RESOLVING:
            st.resolved += 1
        if event == "error":
            st.last_error_at = parse_iso(rec.get("at"))
        if event in TERMINAL:
            st.terminal = event
    return states


# ── Abmeldung (DSGVO) ──────────────────────────────────────────────────────

def _norm_mail(email: str) -> str:
    return (email or "").strip().lower()


def suppressed_addresses() -> set:
    if not os.path.exists(SUPPRESS_PATH):
        return set()
    with open(SUPPRESS_PATH, "r", encoding="utf-8") as f:
        return {_norm_mail(l) for l in f if l.strip() and not l.startswith("#")}


def is_suppressed(email: str) -> bool:
    return _norm_mail(email) in suppressed_addresses()


def suppress(email: str, source: str = "unsubscribe") -> bool:
    """Adresse dauerhaft von Follow-ups ausnehmen. Idempotent."""
    addr = _norm_mail(email)
    if not addr:
        return False
    if addr in suppressed_addresses():
        return True
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(SUPPRESS_PATH, "a", encoding="utf-8") as f:
        f.write(f"{addr}\n")
        f.flush()
        os.fsync(f.fileno())
    _write_event(f"unsub-{uuid.uuid4().hex[:8]}", "unsubscribed", email=addr, source=source)
    _log_line(f"abgemeldet: {addr} ({source})")
    return True


def email_for_token(token: str) -> Optional[str]:
    """Abmelde-Token → Adresse. Token steht im Warteschlangen-Eintrag selbst,
    damit keine Adresse in einer URL landet."""
    token = (token or "").strip()
    if len(token) < 16:
        return None
    for entry in read_queue():
        if entry.get("unsubToken") == token:
            return entry.get("to")
    return None


def unsubscribe_url(entry: Dict[str, Any]) -> Optional[str]:
    token = entry.get("unsubToken")
    if not UNSUBSCRIBE_BASE or not token:
        return None
    return f"{UNSUBSCRIBE_BASE}/abmelden/{token}"


# ── Mailtexte ──────────────────────────────────────────────────────────────

def de_int(value: Any) -> str:
    """17300 → '17.300' (deutsche Tausenderpunkte)."""
    try:
        n = round(float(value))
    except (TypeError, ValueError):
        n = 0
    return f"{n:,}".replace(",", ".")


def de_date(value: Any) -> str:
    dt = parse_iso(value)
    if dt is None:
        return "damals"
    return _local_now(dt).strftime("%d.%m.%Y")


def _first_name(name: Any) -> str:
    parts = (name or "").strip().split()
    if not parts:
        return ""
    # "Dr. Anna Beispiel" → "Anna"
    for part in parts:
        if part.rstrip(".").lower() not in ("dr", "prof", "dipl", "ing", "med", "herr", "frau"):
            return part
    return parts[-1]


def _anrede(name: Any) -> str:
    first = _first_name(name)
    return f"Hallo {first}," if first else "Hallo,"


def _footer(entry: Dict[str, Any]) -> str:
    """Signatur + Pflicht-Abmeldehinweis. Steht unter JEDER Follow-up-Mail."""
    import textwrap

    ctx = entry.get("ctx") or {}
    grund = ctx.get("grund") or "Sie uns Ihre Adresse über ein Formular auf newedgebrand.com übermittelt haben"
    hinweis = textwrap.fill(f"Sie erhalten diese E-Mail einmalig, weil {grund}.", width=72)
    url = unsubscribe_url(entry)
    weg = f"{url}\n" if url else ""
    return f"""Beste Grüße
Ihr NEWEDGE-Team

--
NEWEDGE · Die KI-Abteilung für den Mittelstand
info@newedgebrand.com · newedgebrand.com · {PHONE}

{hinweis}
Keine weiteren E-Mails von uns?
{weg}Eine Antwort auf diese Mail mit dem Wort "Abmelden" genügt
(oder eine kurze Nachricht an {UNSUBSCRIBE_MAILTO}). Wir löschen Ihre
Adresse dann aus dem Verteiler."""


def render_roi(entry: Dict[str, Any]) -> Tuple[str, str]:
    ctx = entry.get("ctx") or {}
    firma = ctx.get("company") or "Ihr Unternehmen"
    subject = "Kurz nachgefragt: Ihr KI-Audit-Report"
    body = f"""{_anrede(ctx.get('name'))}

vor ein paar Tagen haben Sie über unseren ROI-Rechner einen KI-Audit-Report
bekommen — für {firma} standen dort rund {de_int(ctx.get('totalNet'))} € Netto-Potenzial
pro Jahr und etwa {de_int(ctx.get('hoursYear'))} Stunden freigesetzte Arbeitszeit.

Diese Zahlen beruhen auf Ihren Angaben und auf Erfahrungswerten aus
vergleichbaren Projekten. Ob sie in Ihrem Betrieb genauso aufgehen, lässt
sich seriös nur an Ihren echten Abläufen klären. Genau dafür gibt es das
30-Minuten-Gespräch: wir gehen die zwei, drei größten Posten durch und sagen
Ihnen, was davon realistisch ist — und was nicht.

Falls Sie Fragen zum Report haben oder einen Termin möchten: einfach auf
diese E-Mail antworten oder anrufen unter {PHONE}.

Falls das Thema für Sie erledigt ist, ist das ebenfalls in Ordnung — dies
ist die letzte Mail dazu.

{_footer(entry)}
"""
    return subject, body


def render_contact(entry: Dict[str, Any]) -> Tuple[str, str]:
    ctx = entry.get("ctx") or {}
    datum = de_date(ctx.get("submittedAt"))
    original = (ctx.get("message") or "").strip()
    if len(original) > 400:
        original = original[:400].rstrip() + " …"
    zitat = "\n".join("> " + l for l in original.splitlines()) if original else ""
    zitat_block = f"\nIhre Nachricht von damals:\n{zitat}\n" if zitat else ""
    subject = f"Ihre Anfrage vom {datum}"
    body = f"""{_anrede(ctx.get('name'))}

Sie haben uns am {datum} über das Kontaktformular geschrieben.
Diese Mail ist automatisch — wenn wir uns inzwischen bei Ihnen gemeldet
haben oder sich die Sache erledigt hat, ignorieren Sie sie bitte einfach.
{zitat_block}
Falls Ihre Anfrage offen ist: Sie erreichen uns direkt unter
{PHONE} oder mit einer kurzen Antwort auf diese E-Mail.
Wenn es um eine erste Einschätzung geht, reichen dafür meistens
30 Minuten.

{_footer(entry)}
"""
    return subject, body


RENDERERS: Dict[str, Callable[[Dict[str, Any]], Tuple[str, str]]] = {
    "roi": render_roi,
    "contact": render_contact,
}


def render(entry: Dict[str, Any]) -> Tuple[str, str]:
    renderer = RENDERERS.get(entry.get("kind") or "")
    if renderer is None:
        raise ValueError(f"unbekannter Follow-up-Typ: {entry.get('kind')!r}")
    return renderer(entry)


def mail_headers(entry: Dict[str, Any]) -> Dict[str, str]:
    """List-Unsubscribe (RFC 2369 / 8058) — Abmelden direkt im Mailclient."""
    targets = []
    url = unsubscribe_url(entry)
    if url:
        targets.append(f"<{url}>")
    if UNSUBSCRIBE_MAILTO:
        targets.append(f"<mailto:{UNSUBSCRIBE_MAILTO}?subject=Abmelden>")
    if not targets:
        return {}
    headers = {"List-Unsubscribe": ", ".join(targets)}
    if url:
        headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"
    return headers


# ── Warteschlange füllen ───────────────────────────────────────────────────

def enqueue(kind: str, to: str, due_at: datetime, ctx: Dict[str, Any],
            ref: Optional[str] = None) -> Optional[str]:
    """Follow-up einplanen. Gibt die Eintrags-ID zurück (oder None, wenn nicht
    geplant wurde). Schreibt nie doppelt für dieselbe Referenz."""
    to = (to or "").strip()
    if not ENABLED or not to:
        return None
    if is_suppressed(to):
        _log_line(f"nicht geplant (abgemeldet): {to}")
        return None
    if ref and any(e.get("ref") == ref and e.get("kind") == kind for e in read_queue()):
        return None
    entry_id = f"{kind}-{now_utc().strftime('%Y%m%d-%H%M%S')}-{uuid.uuid4().hex[:6]}"
    entry = {
        "id": entry_id,
        "kind": kind,
        "to": to,
        "ref": ref,
        "createdAt": iso(now_utc()),
        "dueAt": iso(due_at),
        "unsubToken": uuid.uuid4().hex,
        "ctx": ctx,
    }
    _append_json(QUEUE_PATH, entry)
    _log_line(f"geplant: {entry_id} → {to} fällig {entry['dueAt']}")
    return entry_id


def queue_roi_followup(payload: Dict[str, Any]) -> Optional[str]:
    """Ein Follow-up, 3 Tage nach dem Report."""
    ctx = {
        "name": payload.get("name"),
        "company": payload.get("company"),
        "totalNet": payload.get("totalNet"),
        "hoursYear": payload.get("hoursYear"),
        "submittedAt": payload.get("submittedAt"),
        "grund": "Sie am {} über den ROI-Rechner auf newedgebrand.com einen KI-Audit-Report angefordert haben".format(
            de_date(payload.get("submittedAt"))),
    }
    return enqueue("roi", payload.get("email") or "",
                   now_utc() + timedelta(days=ROI_DELAY_DAYS), ctx,
                   ref=payload.get("leadId"))


def queue_contact_followup(payload: Dict[str, Any]) -> Optional[str]:
    """Ein Follow-up, 5 Tage nach der Kontaktanfrage.

    ACHTUNG (ehrliche Einschränkung): Der Service kennt nur das Eingangs-
    Postfach-Ereignis, nicht den weiteren Mailverkehr. Er kann NICHT wissen,
    ob jemand aus dem Team bereits geantwortet hat. Wer FOLLOWUP_CONTACT_
    ENABLED einschaltet, nimmt in Kauf, dass ein Kontakt eine Erinnerung
    bekommt, obwohl er längst eine Antwort hat. Deshalb Default AUS und
    deshalb ist der Text so formuliert, dass er in beiden Fällen passt.
    """
    if not CONTACT_ENABLED:
        return None
    ctx = {
        "name": payload.get("name"),
        "company": payload.get("company"),
        "message": payload.get("message"),
        "submittedAt": payload.get("submittedAt"),
        "grund": "Sie uns am {} über das Kontaktformular auf newedgebrand.com geschrieben haben".format(
            de_date(payload.get("submittedAt"))),
    }
    return enqueue("contact", payload.get("email") or "",
                   now_utc() + timedelta(days=CONTACT_DELAY_DAYS), ctx,
                   ref=payload.get("contactId"))


# ── Versand ────────────────────────────────────────────────────────────────

_sender: Optional[Callable[..., None]] = None


def set_sender(fn: Callable[..., None]) -> None:
    """send_mail aus server.py hinterlegen (vermeidet einen Zirkelimport)."""
    global _sender
    _sender = fn


def _deliver(entry: Dict[str, Any], subject: str, body: str) -> None:
    if _sender is None:
        raise RuntimeError("kein Sender gesetzt (followups.set_sender fehlt)")
    _sender(entry["to"], subject, body, headers=mail_headers(entry))


@contextmanager
def _exclusive_run():
    """Genau EIN Durchlauf je DATA_DIR — auch über Prozessgrenzen hinweg.

    Ohne diese Sperre ist der `claim` allein zu schwach: zwei gleichzeitig
    laufende Durchläufe (z. B. `run-once --send` per Cron, während der Worker
    im Service tickt) lesen beide das Protokoll, sehen beide keinen claim,
    schreiben beide einen — und dieselbe Mail geht zweimal raus. Genau das
    war reproduzierbar.

    Der Worker-Thread hält das Lock bereits über `_acquire_lock()` und läuft
    deshalb direkt durch. Jeder andere Prozess, der es nicht bekommt, macht
    lieber gar nichts: ein ausgelassener Durchlauf wird 10 Minuten später
    nachgeholt, eine Doppelmail an einen Interessenten nie wieder eingefangen.
    """
    if _lock_fh is not None:  # dieser Prozess hält es schon (Worker-Thread)
        yield True
        return
    try:
        import fcntl
    except ImportError:  # Plattform ohne flock → Einzelprozess annehmen
        yield True
        return
    fh = None
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        # "a" statt "w": ein fehlgeschlagener Versuch soll die PID des
        # laufenden Workers in der Lock-Datei nicht wegkürzen.
        fh = open(LOCK_PATH, "a")
        fcntl.flock(fh.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
    except Exception:
        if fh is not None:
            try:
                fh.close()
            except Exception:
                pass
        yield False
        return
    try:
        yield True
    finally:
        try:
            fh.close()
        except Exception:
            pass


def process_due(now: Optional[datetime] = None, dry_run: Optional[bool] = None) -> Dict[str, int]:
    """Einen Durchlauf machen. Idempotent: was im Protokoll steht, wird nie
    erneut verschickt. Läuft nur, wenn kein anderer Prozess gerade dasselbe tut."""
    with _exclusive_run() as allein:
        if not allein:
            _log_line("Durchlauf übersprungen: ein anderer Prozess arbeitet die "
                      "Warteschlange gerade ab (kein Doppelversand).")
            return {"faellig": 0, "gesendet": 0, "fehler": 0, "uebersprungen": 0,
                    "abgelaufen": 0, "abgemeldet": 0, "verwaist": 0, "dry_run": 0}
        return _process_due(now, dry_run)


def _process_due(now: Optional[datetime] = None, dry_run: Optional[bool] = None) -> Dict[str, int]:
    now = now or now_utc()
    dry = DRY_RUN if dry_run is None else dry_run
    stats = {"faellig": 0, "gesendet": 0, "fehler": 0, "uebersprungen": 0,
             "abgelaufen": 0, "abgemeldet": 0, "verwaist": 0, "dry_run": 0}

    queue = read_queue()
    if not queue:
        return stats
    states = read_state()
    seen: set = set()

    for entry in queue:
        entry_id = entry.get("id")
        if not isinstance(entry_id, str) or entry_id in seen:
            continue
        seen.add(entry_id)
        st = states.get(entry_id) or EntryState()

        if st.terminal:
            continue

        # Absturz mitten im Versand: nicht wiederholen (keine Doppelmail).
        if st.open_claim:
            _write_event(entry_id, "orphaned",
                         note="claim ohne Abschluss — Versand unklar, kein erneuter Versuch")
            _log_line(f"VERWAIST {entry_id} ({entry.get('to')}): Ausgang unklar, bitte manuell prüfen")
            stats["verwaist"] += 1
            continue

        due = parse_iso(entry.get("dueAt"))
        if due is None:
            _write_event(entry_id, "cancelled", note="dueAt unlesbar")
            stats["uebersprungen"] += 1
            continue
        if due > now:
            continue

        stats["faellig"] += 1

        # Nach langer Ausfallzeit nicht plötzlich alte Post nachschicken.
        if now - due > timedelta(days=MAX_OVERDUE_DAYS):
            _write_event(entry_id, "expired", overdueDays=round((now - due).total_seconds() / 86400, 1))
            stats["abgelaufen"] += 1
            continue

        if st.attempts >= MAX_ATTEMPTS:
            _write_event(entry_id, "gaveup", attempts=st.attempts)
            stats["uebersprungen"] += 1
            continue

        if st.attempts and st.last_error_at and now - st.last_error_at < timedelta(minutes=RETRY_MINUTES):
            stats["uebersprungen"] += 1
            continue

        if is_suppressed(entry.get("to") or ""):
            _write_event(entry_id, "suppressed")
            stats["abgemeldet"] += 1
            continue

        if not in_send_window(now):
            stats["uebersprungen"] += 1
            continue

        try:
            subject, body = render(entry)
        except Exception as exc:
            _write_event(entry_id, "cancelled", note=f"render_failed: {exc}")
            stats["uebersprungen"] += 1
            continue

        # Reihenfolge ist der Kern der Idempotenz: erst der claim auf Platte
        # (mit fsync), dann der Versand. Stirbt der Prozess dazwischen, bleibt
        # der claim stehen und der Eintrag wird oben als "verwaist" beendet.
        _write_event(entry_id, "claim", attempt=st.attempts + 1, to=entry.get("to"))

        if dry:
            _write_event(entry_id, "dry_run", subject=subject)
            _log_line(f"DRY-RUN {entry_id} → {entry.get('to')} | {subject}")
            stats["dry_run"] += 1
            continue

        try:
            _deliver(entry, subject, body)
        except Exception as exc:
            _write_event(entry_id, "error", attempt=st.attempts + 1, error=str(exc)[:400])
            _log_line(f"FEHLER {entry_id} → {entry.get('to')}: {exc}")
            stats["fehler"] += 1
            continue

        _write_event(entry_id, "sent", to=entry.get("to"), subject=subject)
        _log_line(f"gesendet {entry_id} → {entry.get('to')}")
        stats["gesendet"] += 1

    return stats


# ── Worker-Thread ──────────────────────────────────────────────────────────

_stop = threading.Event()
_thread: Optional[threading.Thread] = None
_lock_fh = None
_last_run: Optional[str] = None
_last_stats: Dict[str, int] = {}


def _acquire_lock() -> bool:
    """Genau ein Worker je DATA_DIR — auch wenn uvicorn mit mehreren Workern
    startet oder versehentlich ein zweiter Container auf dasselbe Volume geht."""
    global _lock_fh
    try:
        import fcntl

        os.makedirs(DATA_DIR, exist_ok=True)
        fh = open(LOCK_PATH, "w")
        fcntl.flock(fh.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        fh.write(f"{os.getpid()}\n")
        fh.flush()
        _lock_fh = fh
        return True
    except Exception:
        return False


def _release_lock() -> None:
    global _lock_fh
    if _lock_fh is not None:
        try:
            _lock_fh.close()
        finally:
            _lock_fh = None


def _loop() -> None:
    global _last_run, _last_stats
    _log_line(
        f"Worker läuft: alle {INTERVAL_MINUTES:g} Min., ROI +{ROI_DELAY_DAYS:g} Tage, "
        f"Kontakt {'+%g Tage' % CONTACT_DELAY_DAYS if CONTACT_ENABLED else 'aus'}, "
        f"Fenster {SEND_WINDOW} {SEND_TZ}{' (Mo–Fr)' if WEEKDAYS_ONLY else ''}"
        f"{', DRY-RUN' if DRY_RUN else ''}"
    )
    while not _stop.is_set():
        try:
            stats = process_due()
            _last_run = iso(now_utc())
            _last_stats = stats
            if any(v for k, v in stats.items() if k != "uebersprungen"):
                _log_line("Durchlauf: " + ", ".join(f"{k}={v}" for k, v in stats.items() if v))
        except Exception as exc:  # der Thread darf niemals sterben
            _log_line(f"Durchlauf fehlgeschlagen: {exc}")
        _stop.wait(INTERVAL_MINUTES * 60)


def start_worker(send_mail: Optional[Callable[..., None]] = None) -> bool:
    global _thread
    if send_mail is not None:
        set_sender(send_mail)
    if not ENABLED:
        _log_line("FOLLOWUP_ENABLED ist aus — keine Follow-ups, kein Worker.")
        return False
    if not WORKER_ENABLED:
        _log_line("FOLLOWUP_WORKER=0 — es wird geplant, aber nicht versendet "
                  "(Versand erwartet von außen: followups.py run-once --send).")
        return False
    if _thread is not None and _thread.is_alive():
        return True
    if not _acquire_lock():
        _log_line("anderer Worker hält bereits das Lock — dieser Prozess plant nur, versendet nicht.")
        return False
    _stop.clear()
    _thread = threading.Thread(target=_loop, name="followups", daemon=True)
    _thread.start()
    return True


def stop_worker(timeout: float = 5.0) -> None:
    global _thread
    _stop.set()
    if _thread is not None and _thread.is_alive():
        _thread.join(timeout=timeout)
    _thread = None
    _release_lock()


def status() -> Dict[str, Any]:
    states = read_state()
    queue = read_queue()
    now = now_utc()
    offen = 0
    faellig = 0
    for entry in queue:
        st = states.get(entry.get("id") or "")
        if st and st.terminal:
            continue
        offen += 1
        due = parse_iso(entry.get("dueAt"))
        if due and due <= now:
            faellig += 1
    return {
        "enabled": ENABLED,
        "contactEnabled": CONTACT_ENABLED,
        "dryRun": DRY_RUN,
        "worker": bool(_thread and _thread.is_alive()),
        "workerEnabled": WORKER_ENABLED,
        "intervalMinutes": INTERVAL_MINUTES,
        "queued": len(queue),
        "open": offen,
        "due": faellig,
        "sent": sum(1 for s in states.values() if s.terminal == "sent"),
        "orphaned": sum(1 for s in states.values() if s.terminal == "orphaned"),
        "suppressed": len(suppressed_addresses()),
        "lastRun": _last_run,
        "lastStats": _last_stats,
        "inSendWindow": in_send_window(now),
    }


# ── CLI (Testen ohne echten Mailversand) ──────────────────────────────────

def _cli_preview(kind: str) -> int:
    if kind == "roi":
        sample_path = os.path.join(BASE_DIR, "sample_roi_lead.json")
        with open(sample_path, "r", encoding="utf-8") as f:
            payload = json.load(f)
        payload.setdefault("leadId", "preview")
        ctx = {
            "name": payload.get("name"), "company": payload.get("company"),
            "totalNet": payload.get("totalNet"), "hoursYear": payload.get("hoursYear"),
            "submittedAt": payload.get("submittedAt"),
            "grund": "Sie am {} über den ROI-Rechner auf newedgebrand.com einen KI-Audit-Report angefordert haben".format(
                de_date(payload.get("submittedAt"))),
        }
        entry = {"id": "preview", "kind": "roi", "to": payload.get("email"),
                 "unsubToken": "0" * 32, "ctx": ctx}
    elif kind == "contact":
        ctx = {"name": "Max Mustermann", "company": "Muster GmbH",
               "message": "Wir überlegen, unsere Angebotserstellung zu automatisieren.\nHaben Sie damit Erfahrung im Maschinenbau?",
               "submittedAt": iso(now_utc() - timedelta(days=5)),
               "grund": "Sie uns am {} über das Kontaktformular auf newedgebrand.com geschrieben haben".format(
                   de_date(iso(now_utc() - timedelta(days=5))))}
        entry = {"id": "preview", "kind": "contact", "to": "max@muster.de",
                 "unsubToken": "0" * 32, "ctx": ctx}
    else:
        print("preview roi|contact")
        return 2
    subject, body = render(entry)
    print(f"An:      {entry['to']}")
    print(f"Betreff: {subject}")
    print(f"Header:  {mail_headers(entry) or '—'}")
    print("-" * 72)
    print(body)
    return 0


def _cli_list() -> int:
    states = read_state()
    queue = read_queue()
    if not queue:
        print(f"Warteschlange leer ({QUEUE_PATH})")
        return 0
    print(f"{'ID':<28} {'Typ':<8} {'fällig (UTC)':<26} {'Status':<12} Empfänger")
    for entry in queue:
        st = states.get(entry.get("id") or "") or EntryState()
        status_text = st.terminal or ("offen(claim)" if st.open_claim else
                                      f"offen/{st.attempts}" if st.attempts else "offen")
        print(f"{entry.get('id',''):<28} {entry.get('kind',''):<8} "
              f"{entry.get('dueAt',''):<26} {status_text:<12} {entry.get('to','')}")
    st_all = status()
    print("\n" + json.dumps(st_all, ensure_ascii=False, indent=2))
    return 0


def _cli_run_once(really_send: bool) -> int:
    if really_send:
        from server import send_mail  # lazy, sonst Zirkelimport

        set_sender(send_mail)
    stats = process_due(dry_run=not really_send)
    print(json.dumps(stats, ensure_ascii=False, indent=2))
    return 0


def _cli_enqueue_test(email: str, kind: str = "roi") -> int:
    global ENABLED
    ENABLED = True  # Testeintrag auch bei FOLLOWUP_ENABLED=0
    ctx = {"name": "Test Person", "company": "Test GmbH", "totalNet": 17300,
           "hoursYear": 662, "message": "Testnachricht über das Kontaktformular.",
           "submittedAt": iso(now_utc()),
           "grund": "dies ein Testeintrag ist"}
    entry_id = enqueue(kind, email, now_utc() - timedelta(minutes=1), ctx,
                       ref=f"test-{uuid.uuid4().hex[:6]}")
    print(entry_id or "nicht eingeplant")
    return 0 if entry_id else 1


def main(argv: List[str]) -> int:
    cmd = argv[1] if len(argv) > 1 else "list"
    if cmd == "preview":
        return _cli_preview(argv[2] if len(argv) > 2 else "roi")
    if cmd == "list":
        return _cli_list()
    if cmd == "run-once":
        return _cli_run_once("--send" in argv)
    if cmd == "enqueue-test":
        if len(argv) < 3:
            print("enqueue-test <mailadresse> [roi|contact]")
            return 2
        return _cli_enqueue_test(argv[2], argv[3] if len(argv) > 3 else "roi")
    if cmd == "unsubscribe":
        if len(argv) < 3:
            print("unsubscribe <mailadresse>")
            return 2
        suppress(argv[2], source="cli")
        return 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
