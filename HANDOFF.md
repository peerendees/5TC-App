# TEXTSCHMIEDE — Übergabe

**Datum:** 2026-03-23
**Letzter Commit:** Deactivate password, smart back-nav, multi-provider API

## Was wurde zuletzt gemacht

- Multi-Provider API-System eingebaut (Claude, Gemini, Grok) mit Inline-Key-Verwaltung
- Gemini Flash als kostenlose Option (serverseitiger Key via Vercel Env)
- Kennwort-Schutz: Buch-Modus deaktiviert (User bringt eigenen Key), SOP-Modus bleibt geschützt
- Kennwort-Validierung auf Server verlagert (`/api/validate-password`) — kein Klartext im Client
- Smart Back-Navigation (`← berent.ai`) mit window.close/history.back/Fallback
- Dropdown-Statusanzeige: 🔓 Key gespeichert, 🗝️ Key benötigt, ✦ Kostenlos
- Profil-System für Notion-Content-Types (SOP als Default)
- KI-gestützte Tag/Relevanz-Vorschläge nach SOP-Generierung
- Generierungs-Timer bei Buch und SOP

## Aktueller Stand

App ist voll funktional mit beiden Modi (Buchkapitel + SOP-Generator). Multi-Provider-Support live. Notion-Integration funktioniert. Deployment auf Vercel automatisch via GitHub Push.

## Nächste konkrete Schritte

1. **Profil-Manager UI-Feinschliff:** Schriftgrößen vergrößern, Spaltenbreiten anpassen (Name schmaler, Beschreibung breiter), einheitliche Button-Styles (rund vs. oval klären)
2. **Spracheingabe:** Dritter Input-Kanal neben Upload und Paste (Web Speech API)
3. **Fehlerbehandlung verbessern:** Rate-Limit-Fehler (429) benutzerfreundlich anzeigen statt JSON-Dump

## Vercel Environment Variables

- `GEMINI_API_KEY` — Google AI API Key für kostenlosen Gemini Flash Tier
- `PASSWORD_PREFIX` — Kennwort-Prefix für SOP-Zugangskontrolle
