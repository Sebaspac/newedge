"""
test_followups.py — Nachweise für die Follow-up-Warteschlange.

Verschickt nichts: der Versand ist durch eine Attrappe ersetzt, es wird kein
SMTP-Zugang gebraucht. Der Test arbeitet ausschließlich in einem eigenen
Temp-Verzeichnis — data/ wird nie angefasst, auch nicht im Container.

Ausführen:
    python test_followups.py
    docker compose exec lead-api python test_followups.py   # aus apps/cms/

Geprüft wird vor allem das, was im Betrieb weh tut:
kein doppelter Versand nach einem harten Absturz mitten in der Mail.
"""

import os
import shutil
import tempfile

# MUSS vor dem Import von followups stehen — sonst läuft der Test auf den
# echten Daten. Kein Weg, das aus Versehen falsch zu machen.
_TMP = tempfile.mkdtemp(prefix="followup-test-")
os.environ["DATA_DIR"] = _TMP
os.environ["FOLLOWUP_ENABLED"] = "1"
os.environ["FOLLOWUP_CONTACT_ENABLED"] = "1"
os.environ["FOLLOWUP_SEND_WINDOW"] = "off"
os.environ["FOLLOWUP_WEEKDAYS_ONLY"] = "0"
os.environ["FOLLOWUP_UNSUBSCRIBE_BASE"] = "https://roi-api.example.com"
os.environ.pop("SEND_DISABLED", None)
os.environ.pop("FOLLOWUP_DRY_RUN", None)

import json  # noqa: E402
import subprocess  # noqa: E402
import sys  # noqa: E402
from datetime import timedelta  # noqa: E402

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import followups as F  # noqa: E402

assert F.DATA_DIR == _TMP, "Test würde auf echten Daten laufen — abgebrochen"

sent = []
failed = False


def fake_send(to, subject, body, headers=None, **kw):
    sent.append((to, subject, headers))


def reset():
    for p in (F.QUEUE_PATH, F.LOG_PATH, F.SUPPRESS_PATH):
        if os.path.exists(p):
            os.remove(p)
    del sent[:]


def add(kind="roi", to="a@b.de", minutes_ago=1):
    F.ENABLED = True
    return F.enqueue(kind, to, F.now_utc() - timedelta(minutes=minutes_ago),
                     {"name": "Test Person", "company": "Test GmbH",
                      "totalNet": 17300, "hoursYear": 662,
                      "message": "Testnachricht mit genug Zeichen.",
                      "submittedAt": F.iso(F.now_utc())})


def check(label, cond):
    global failed
    print(("  OK   " if cond else "  FEHLER ") + label)
    if not cond:
        failed = True


def main() -> int:
    F.set_sender(fake_send)

    print("1) Normaler Versand + Idempotenz")
    reset()
    eid = add()
    s1 = F.process_due(dry_run=False)
    s2 = F.process_due(dry_run=False)
    check("erster Lauf verschickt genau 1 Mail", s1["gesendet"] == 1 and len(sent) == 1)
    check("zweiter Lauf verschickt nichts", s2["gesendet"] == 0 and len(sent) == 1)
    check("Status = sent", F.read_state()[eid].terminal == "sent")

    print("2) Absturz mitten im Versand (harter Prozessabbruch)")
    reset()
    eid = add(to="crash@b.de")
    here = os.path.dirname(os.path.abspath(__file__))
    crash = subprocess.run(
        [sys.executable, "-c",
         "import os,sys;sys.path.insert(0,%r);import followups as F;"
         "F.set_sender(lambda *a, **k: os._exit(9));F.process_due(dry_run=False)" % here],
        capture_output=True, env=dict(os.environ))
    check("Kindprozess ist im Versand gestorben", crash.returncode == 9)
    log = [json.loads(l) for l in open(F.LOG_PATH)]
    check("claim lag vor dem Versand auf Platte (fsync)",
          any(r["event"] == "claim" for r in log))
    s3 = F.process_due(dry_run=False)
    check("nach dem Neustart KEIN zweiter Versand", s3["gesendet"] == 0 and not sent)
    check("Eintrag ist als verwaist abgeschlossen", F.read_state()[eid].terminal == "orphaned")
    check("verwaister Eintrag bleibt danach still", F.process_due(dry_run=False)["verwaist"] == 0)

    print("3) Abmeldung wird respektiert")
    reset()
    add(to="raus@b.de")
    F.suppress("RAUS@b.de", source="test")
    check("abgemeldete Adresse bekommt nichts",
          F.process_due(dry_run=False)["abgemeldet"] == 1 and not sent)
    check("Abmeldung ist gross-/kleinschreibungsunabhängig", F.is_suppressed("raus@B.de"))
    check("Neuplanung für Abgemeldete unterbleibt", add(to="raus@b.de") is None)

    print("4) Uraltes Follow-up wird nicht nachgeschickt")
    reset()
    add(to="alt@b.de", minutes_ago=60 * 24 * (F.MAX_OVERDUE_DAYS + 26))
    check("weit überfällig = abgelaufen",
          F.process_due(dry_run=False)["abgelaufen"] == 1 and not sent)

    print("5) SMTP-Fehler: Wiederholung mit Deckel")
    reset()

    def boom(*a, **k):
        raise RuntimeError("SMTP kaputt")

    F.set_sender(boom)
    retry_alt, F.RETRY_MINUTES = F.RETRY_MINUTES, 0
    eid = add(to="fehler@b.de")
    runs = [F.process_due(dry_run=False) for _ in range(F.MAX_ATTEMPTS + 2)]
    st = F.read_state()[eid]
    check("genau FOLLOWUP_MAX_ATTEMPTS Versuche", st.attempts == F.MAX_ATTEMPTS)
    check("danach aufgegeben", st.terminal == "gaveup")
    check("Fehler wurden gezählt", sum(r["fehler"] for r in runs) == F.MAX_ATTEMPTS)
    F.RETRY_MINUTES = retry_alt
    F.set_sender(fake_send)

    print("6) Fälligkeit und Versandfenster")
    reset()
    F.ENABLED = True
    F.enqueue("roi", "spaeter@b.de", F.now_utc() + timedelta(days=3), {"name": "X"})
    check("Zukunft bleibt liegen", F.process_due(dry_run=False)["faellig"] == 0 and not sent)
    add(to="fenster@b.de")
    fenster_alt, tage_alt = F.SEND_WINDOW, F.WEEKDAYS_ONLY
    F.SEND_WINDOW, F.WEEKDAYS_ONLY = "03:00-03:01", False
    check("ausserhalb des Fensters wird nur gewartet",
          F.process_due(dry_run=False)["gesendet"] == 0 and not sent)
    F.SEND_WINDOW, F.WEEKDAYS_ONLY = fenster_alt, tage_alt
    check("im Fenster geht es dann raus", F.process_due(dry_run=False)["gesendet"] == 1)

    print("7) Doppelte Planung für dieselbe Anfrage")
    reset()
    F.ENABLED = True
    p = {"email": "doppelt@b.de", "leadId": "LEAD-1", "name": "A", "company": "B",
         "submittedAt": F.iso(F.now_utc())}
    check("zweite Planung mit gleicher leadId wird verworfen",
          F.queue_roi_followup(p) and F.queue_roi_followup(p) is None)
    check("Fälligkeit = heute + FOLLOWUP_ROI_DELAY_DAYS",
          abs((F.parse_iso(F.read_queue()[0]["dueAt"]) - F.now_utc()).days - F.ROI_DELAY_DAYS) <= 1)

    print("8) Abmeldehinweis und -link (DSGVO)")
    reset()
    add(to="token@b.de")
    entry = F.read_queue()[0]
    check("Token findet die Adresse", F.email_for_token(entry["unsubToken"]) == "token@b.de")
    check("unbekanntes Token findet nichts", F.email_for_token("f" * 32) is None)
    body = F.render(entry)[1]
    check("Abmeldehinweis steht im Mailtext", "Abmelden" in body and "abmelden/" in body)
    check("List-Unsubscribe-Header gesetzt", "List-Unsubscribe" in F.mail_headers(entry))
    for kind in ("roi", "contact"):
        e = dict(entry, kind=kind)
        check(f"{kind}-Mail trägt den Abmeldehinweis", "Abmelden" in F.render(e)[1])

    print("9) Kaputte Zeile in der Warteschlange")
    reset()
    add(to="heil@b.de")
    with open(F.QUEUE_PATH, "a") as f:
        f.write('{"id": "kaputt", "kind": "roi"\n')  # abgeschnitten (harter Abbruch)
    check("defekte Zeile blockiert den Durchlauf nicht",
          F.process_due(dry_run=False)["gesendet"] == 1)

    print("\n" + ("FEHLGESCHLAGEN" if failed else "ALLE PRÜFUNGEN BESTANDEN"))
    return 1 if failed else 0


if __name__ == "__main__":
    try:
        code = main()
    finally:
        shutil.rmtree(_TMP, ignore_errors=True)
    sys.exit(code)
