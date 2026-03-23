# TEXTSCHMIEDE ⁵ᵀᶜ

## Projektübersicht

Die Textschmiede ist eine Single-Page-Webanwendung zur Generierung ausgearbeiteter Textkapitel aus Transkripten. Ursprünglich für die 5-Tage-Challenge (5TC) entwickelt, ist sie heute ein universelles Werkzeug für Bücher, Workbooks, Trainingsmaterialien und andere Textformate.

**Deployment:** Vercel — https://5-tc-app.vercel.app/
**Repository:** https://github.com/peerendees/textschmiede-5TC

## Architektur

- **Single-File Frontend:** `index.html` — gesamte App (HTML, CSS, JS) in einer Datei
- **Serverless API:** `api/generate-chapter.js`, `api/generate-sop.js` — Vercel Serverless Functions mit Multi-Provider-Routing (Claude, Gemini, Grok)
- **Kein Build-Prozess:** CDN-basierte Dependencies (docx, FileSaver, mammoth)

## Technologie-Stack

| Bereich | Technologie |
|---------|-------------|
| Frontend | Vanilla HTML/CSS/JS (kein Framework) |
| Fonts | Google Fonts: Bebas Neue, Lora, JetBrains Mono |
| API | Multi-Provider: Claude (Anthropic), Gemini (Google), Grok (xAI) |
| DOCX-Erzeugung | docx.js (Browser-seitig) |
| Datei-Upload | mammoth.js (.docx → Text), native FileReader (.txt, .md) |
| Deployment | Vercel (Serverless Functions, max 120s Timeout) |

## Corporate Identity — BERENT.AI

Die App folgt der BERENT.AI CI (siehe Skill `berent-ci`):

- **Farben:** Neutrale Dunkeltöne (#0e0e10, #151518, #1c1c20) + Kupfer-Akzent-System (#B5742A, #cc8c3e, #7a4e1c)
- **Typografie:** Bebas Neue (Headlines, uppercase), Lora (Fließtext), JetBrains Mono (Labels, Buttons, Meta)
- **Visuelle Effekte:** SVG Grain Overlay, Kupfer Glow Orb mit Drift-Animation
- **Plus-Symbol:** Obligatorisches BERENT.AI-Markenelement im Header und bei Sektions-Headern
- **Light Mode:** Warme Sand-/Kupfertöne (#F5F2EE, #EDEAE4), Text in Kupfer-Dunkel (#2E2318), Dark ist Standard
- **Kein Ampersand:** In UI-Texten immer „und" statt „&"

## App-Modi

### Buchkapitel-Modus
1. **Einstellungen** — Titel, Untertitel, Autor, Zielgruppe, KI-Modell, Vorlage, Ton, Ausführlichkeit
2. **Transkripte** — Upload (Drag und Drop) oder Text einfügen (Toggle), Kapitel per Drag und Drop sortierbar
3. **Generierung** — "Generieren"-Button → kapitelweise Verarbeitung (Kennwort im Buchmodus standardmäßig deaktiviert)
4. **Download** — DOCX-Export mit Kapitelvorschau im Browser

### SOP-Generator-Modus
1. **SOP-Einstellungen** — Titel, Zielgruppe, KI-Modell
2. **Transkript** — Upload oder Text einfügen (ein Transkript pro SOP)
3. **Generierung** — SOP generieren → Vorschau im Browser
4. **Vorschau und Tags** — KI schlägt Tags und Relevanz vor (vorausgewählt), Status wählen, Quellenangabe
5. **Notion** — Gesamtvorschau aller Properties → In Notion speichern, DOCX-Download oder Kopieren

## Prompt-Vorlagen

| Vorlage | Rolle | Stil |
|---------|-------|------|
| Buch | Ghostwriter und Buchautor | Ausführlicher Fließtext, keine Aufzählungen |
| Workbook | Trainingsdesigner | Fließtext + Übungen, Reflexionsfragen, Checklisten |
| Training | Trainingsexperte | Didaktisch: Lernziele, Merke-Kästen, Theorie → Praxis |
| Newsletter | Content-Spezialist | Kompakt, scanbar, kurze Absätze, Hook-Einstieg |

## Wichtige Mechanismen

### Kennwort-Schutz
- **Buchmodus:** Kennwort standardmäßig deaktiviert (`passwordRequired = false`) — Nutzer bringen eigene API-Keys mit
- **SOP-Modus:** Immer kennwortgeschützt, serverseitige Validierung via `/api/validate-password`
- Kennwort-Prefix wird als Vercel-Umgebungsvariable `PASSWORD_PREFIX` gespeichert (kein clientseitiges Hardcoding)
- Dynamisches Kennwort: Prefix + 2-stelliger Tag + 2-stellige Stunde (Europe/Berlin)
- Toggle: Dreifachklick auf ⁵ᵀᶜ im Header reaktiviert den Schutz im Buchmodus (dezentes Kupfer-Feedback)
- Auto-Reaktivierung nach 5 Minuten Inaktivität

### Multi-Provider API-System
- Nutzer bringen eigene API-Keys mit (Claude, Gemini, Grok) oder nutzen den kostenlosen Gemini Flash Tier
- **Provider und Modelle:** Claude Sonnet 4, Claude Opus 4, Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini Flash (Kostenlos), Grok 3 Mini, Grok 3
- Inline API-Key-Eingabe: kein Modal, Key-Input erscheint direkt unter dem Modell-Selektor
- Status-Indikatoren im Dropdown: 🔓 (Key gespeichert), 🗝️ (Key benötigt), ✦ (kostenlos)
- Gemini Flash (Kostenlos) nutzt serverseitige `GEMINI_API_KEY` Umgebungsvariable
- Keys optional im Browser speicherbar (localStorage, verschlüsselt) — pro Provider getrennt
- Notion Integration Token separat speicherbar

### Kapitel-Management
- Kapitel sind per Drag und Drop sortierbar (native HTML5 Drag API)
- Kapitel-Karten mit Nummern-Badge, Vorschau, Wortanzahl und Status
- Upload- und Paste-Modus über Toggle-Buttons umschaltbar
- Einzelne Kapitel können separat neu generiert werden

### Step Progress Bar
- 5 Schritte: Einstellungen → Transkripte → Struktur → Generierung → Download
- Visuell wie Buttons, aber nicht klickbar (rein informativer Status)

### Smart Back-Navigation
- `← berent.ai` Link im Header mit `goBackToSite()` Funktion
- Fallback-Kette: `window.close()` (wenn via `window.opener` geöffnet) → `history.back()` (wenn Referrer berent.ai) → Navigation zu berent.ai

### Theme-System
- Dark Mode (Standard): Neutrale Dunkeltöne mit Kupfer-Akzenten
- Light Mode: Warme Sand-Töne (#F5F2EE) mit dunkleren Kupfer-Akzenten, Text #2E2318 (Kupfer-Dunkelvariation)
- Toggle im Header (◐-Symbol), Auswahl wird in localStorage gespeichert

### Content-Profile (Notion)
- Profil-System für verschiedene Notion-Datenbanken (SOP als Default-Profil)
- Jedes Profil definiert: Name, Notion-DB-ID, Properties (Tags, Relevanz, Status)
- Built-in Profile (SOP) sind geschützt, DB-ID ist überschreibbar
- Custom Profile werden in localStorage gespeichert (JSON)
- Profil-Manager via Zahnrad-Icon: Liste, Bearbeiten, Neues Profil, Löschen
- KI-gestützte Tag/Relevanz-Vorschläge nach SOP-Generierung (`/api/suggest-sop-meta`)
- Notion-Vorschau vor dem Speichern (alle Properties auf einen Blick)
- Quellenangabe (Dateiname) wird als Property in Notion gespeichert

### Responsive Design
- Desktop (>1024px): Volles Layout, max-width 960px
- Tablet (≤1024px): Kompaktere Abstände, gleiche Struktur
- Smartphone (≤640px): Einspaltig, Step-Labels ausgeblendet, Karten gestapelt

## Konventionen

- **Sprache:** Deutsche UI, deutscher Kommentar wo vorhanden
- **Commit-Sprache:** Englisch
- **CSS:** Custom Properties (CSS Variables) in `:root`, keine Preprocessoren
- **JS:** Vanilla JS, keine Module im Frontend, globale Funktionen
- **Naming:** camelCase für JS-Funktionen/Variablen, kebab-case für CSS-Klassen
- **Ampersand:** Kein `&` als Konjunktion in UI-Texten — immer „und"
- **Alle Änderungen** betreffen primär `index.html` — die gesamte Frontend-Logik lebt dort

## Dateien

```
index.html              # Komplette Frontend-App (HTML + CSS + JS)
api/generate-chapter.js # Serverless API für Kapitelgenerierung (Multi-Provider-Routing)
api/generate-sop.js     # Serverless API für SOP-Generierung (Multi-Provider-Routing)
api/validate-password.js # Serverseitige Kennwort-Validierung (nutzt PASSWORD_PREFIX Env Var)
api/suggest-sop-meta.js # Serverless API für KI-gestützte Tag/Relevanz-Vorschläge
api/push-to-notion.js   # Serverless API für Notion-Integration (Tags, Relevanz, Status, Quelle)
package.json            # Nur @anthropic-ai/sdk als Dependency
vercel.json             # Vercel-Konfiguration (Rewrites, Function-Timeout)
CLAUDE.md               # Diese Datei — Projektdokumentation
.gitignore              # node_modules
```

## Umgebungsvariablen (Vercel)

| Variable | Beschreibung |
|----------|-------------|
| `GEMINI_API_KEY` | Google AI API-Key für den kostenlosen Gemini Flash Tier |
| `PASSWORD_PREFIX` | Kennwort-Prefix für SOP-Zugangsschutz |

## Hinweise für Entwicklung

- `index.html` ist eine große Single-File-App — bei Änderungen gezielt mit Edit-Tool arbeiten
- API-Keys werden zur Laufzeit vom Nutzer eingegeben oder via kostenlosem Gemini Flash Tier serverseitig bereitgestellt
- Vercel-Timeout für die Generate-Function ist auf 120s gesetzt (lange Kapitel brauchen Zeit)
- Fonts kommen via Google Fonts CDN — kein lokales Hosting
- DOCX-Generierung läuft komplett im Browser (docx.js + FileSaver)
- Prompt-Variationen (Vorlage, Ton, Ausführlichkeit) werden serverseitig in den System-Prompt eingewoben
- Dark Mode ist Standard — Light Mode nur über expliziten Toggle
