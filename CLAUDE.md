# TEXTSCHMIEDE ⁵ᵀᶜ

## Projektübersicht

Die Textschmiede ist eine Single-Page-Webanwendung zur Generierung ausgearbeiteter Textkapitel aus Transkripten. Ursprünglich für die 5-Tage-Challenge (5TC) entwickelt, ist sie heute ein universelles Werkzeug für Bücher, Workbooks, Trainingsmaterialien und andere Textformate.

**Deployment:** Vercel — https://5-tc-app.vercel.app/
**Repository:** https://github.com/peerendees/textschmiede-5TC

## Architektur

- **Single-File Frontend:** `index.html` — gesamte App (HTML, CSS, JS) in einer Datei
- **Serverless API:** `api/generate-chapter.js` — Vercel Serverless Function, nutzt Claude API via `@anthropic-ai/sdk`
- **Kein Build-Prozess:** CDN-basierte Dependencies (docx, FileSaver, mammoth)

## Technologie-Stack

| Bereich | Technologie |
|---------|-------------|
| Frontend | Vanilla HTML/CSS/JS (kein Framework) |
| Fonts | Google Fonts: Bebas Neue, Lora, JetBrains Mono |
| API | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| DOCX-Erzeugung | docx.js (Browser-seitig) |
| Datei-Upload | mammoth.js (.docx → Text), native FileReader (.txt, .md) |
| Deployment | Vercel (Serverless Functions, max 120s Timeout) |

## Corporate Identity — BERENT.AI

Die App folgt der BERENT.AI CI (siehe Skill `berent-ci`):

- **Farben:** Neutrale Dunkeltöne (#0e0e10, #151518, #1c1c20) + Kupfer-Akzent-System (#B5742A, #cc8c3e, #7a4e1c)
- **Typografie:** Bebas Neue (Headlines, uppercase), Lora (Fließtext), JetBrains Mono (Labels, Buttons, Meta)
- **Visuelle Effekte:** SVG Grain Overlay, Kupfer Glow Orb mit Drift-Animation
- **Plus-Symbol:** Obligatorisches BERENT.AI-Markenelement im Header und bei Sektions-Headern

## App-Flow

1. **Einstellungen** — Titel, Untertitel, Autor
2. **Transkripte** — Upload (Drag & Drop) oder Text einfügen (Toggle), Kapitel per Drag & Drop sortierbar
3. **Generierung** — "Generieren"-Button → Kennwort-Modal → API-Key-Modal → kapitelweise Verarbeitung
4. **Download** — DOCX-Export

## Wichtige Mechanismen

### Kennwort-Schutz
- Dynamisches Kennwort: `8Lp!n3#` + 2-stelliger Tag + 2-stellige Stunde (Europe/Berlin)
- Validierung via `Intl.DateTimeFormat.formatToParts()` mit `hourCycle: 'h23'`
- Toggle: Dreifachklick auf ⁵ᵀᶜ im Header deaktiviert den Schutz (dezentes Kupfer-Feedback)
- Auto-Reaktivierung nach 5 Minuten Inaktivität

### Kapitel-Management
- Kapitel sind per Drag & Drop sortierbar (native HTML5 Drag API)
- Kapitel-Karten mit Nummern-Badge, Vorschau, Wortanzahl und Status
- Upload- und Paste-Modus über Toggle-Buttons umschaltbar

### Step Progress Bar
- 4 Schritte: Einstellungen → Transkripte → Generierung → Download
- Visuell wie Buttons, aber nicht klickbar (rein informativer Status)

## Konventionen

- **Sprache:** Deutsche UI, deutscher Kommentar wo vorhanden
- **Commit-Sprache:** Englisch
- **CSS:** Custom Properties (CSS Variables) in `:root`, keine Preprocessoren
- **JS:** Vanilla JS, keine Module im Frontend, globale Funktionen
- **Naming:** camelCase für JS-Funktionen/Variablen, kebab-case für CSS-Klassen
- **Alle Änderungen** betreffen primär `index.html` — die gesamte Frontend-Logik lebt dort

## Dateien

```
index.html              # Komplette Frontend-App (HTML + CSS + JS)
api/generate-chapter.js # Serverless API Proxy für Claude
package.json            # Nur @anthropic-ai/sdk als Dependency
vercel.json             # Vercel-Konfiguration (Rewrites, Function-Timeout)
.gitignore              # node_modules
```

## Hinweise für Entwicklung

- `index.html` ist eine große Single-File-App (~45KB) — bei Änderungen gezielt mit Edit-Tool arbeiten
- API-Key wird zur Laufzeit vom Nutzer eingegeben (kein serverseitiges Secret)
- Vercel-Timeout für die Generate-Function ist auf 120s gesetzt (lange Kapitel brauchen Zeit)
- Fonts kommen via Google Fonts CDN — kein lokales Hosting
- DOCX-Generierung läuft komplett im Browser (docx.js + FileSaver)
