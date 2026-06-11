# ear Recycle Permit

Digitale Antragstellung für Recyclinganlagen — eine React-Webanwendung zur Verwaltung von Zulassungsanträgen im ear-Portal.

## Voraussetzungen

- [Node.js](https://nodejs.org/) v18 oder höher
- npm v9 oder höher

## Installation

Abhängigkeiten installieren:

```bash
npm install
```

## Entwicklung

Entwicklungsserver starten:

```bash
npm run dev
```

Die Anwendung ist anschließend unter [http://localhost:5173](http://localhost:5173) erreichbar.

## Build

Produktions-Build erstellen:

```bash
npm run build
```

Die kompilierten Dateien werden im Verzeichnis `dist/` abgelegt.

Build lokal vorschauen:

```bash
npm run preview
```

## Tests

Alle Tests einmalig ausführen:

```bash
npm test
```

Tests im Watch-Modus ausführen:

```bash
npm run test:watch
```

Aktuelle Testabdeckung: **24 Tests** in 3 Suiten

| Suite            | Tests                                                    |
| ---------------- | -------------------------------------------------------- |
| `AuthModal`      | Öffnen/Schließen, Validierung, Accordion, Fokus-Trap     |
| `ProtectedRoute` | Weiterleitung ohne Login, Zugriff mit Login              |
| `PermitWizard`   | Rendering, Validierung, Navigation, Entwurf, Einreichung |

## Codequalität

Code formatieren:

```bash
npm run format
```

Lint-Prüfung ausführen:

```bash
npm run lint
```

Lint-Fehler automatisch beheben:

```bash
npm run lint:fix
```

Alle Qualitätsprüfungen (Lint + Tests) ausführen:

```bash
npm run quality
```

## Technologie-Stack

| Bereich          | Technologie              |
| ---------------- | ------------------------ |
| Framework        | React 19                 |
| Sprache          | TypeScript               |
| Build-Tool       | Vite                     |
| Routing          | React Router v7          |
| State Management | Redux Toolkit            |
| Formulare        | React Hook Form + Zod    |
| Tests            | Vitest + Testing Library |

## Projektstruktur

```
src/
├── components/           # Wiederverwendbare UI-Komponenten
│   ├── layout/           # AppLayout, AppHeader, AppFooter
│   ├── ui/               # Button
│   └── Popup/            # Popup, ConfirmPopup
├── features/
│   ├── auth/             # Login-Modal, AuthService, Validierung
│   └── permit/           # PermitWizard, PermitService, Mock-Daten
│       └── steps/        # WizardStep1Company, Step2Facility, Step3Documents, Step4Summary
├── hooks/                # useFocusTrap, Redux-Hooks
├── pages/                # Seiten-Komponenten
├── routes/               # Router-Konfiguration, ProtectedRoute
├── store/                # Redux Store, authSlice
├── test/                 # Testdateien und Hilfsfunktionen
```

## Funktionen

### Antragsstellung

Mehrstufiger Wizard (4 Schritte) zur Einreichung von Zulassungsanträgen:

1. **Unternehmensdaten** — Name, Kontaktperson, E-Mail
2. **Recyclinganlage** — Anlage, Standort, Kapazität
3. **Dokumente** — Datei-Upload mit Vorschau
4. **Zusammenfassung** — Überprüfung vor der Einreichung mit Bestätigungspflicht (Richtigkeit + Datenschutz)

### Entwurfsverwaltung

- Automatisches Speichern in `localStorage` (1-Sekunden-Debounce)
- Explizites Speichern als Entwurf über den Button „Entwurf speichern"
- Beim nächsten Aufruf wird der Entwurf automatisch geladen
- Beim Bearbeiten eines bestehenden Entwurfs wird der alte Eintrag ersetzt

### Antragsübersicht

- Filterbare Liste aller Anträge nach Status
- Statusanzeige: Entwurf, Eingereicht, In Prüfung, Unterlagen nachreichen, Genehmigt, Abgelehnt
- Entwürfe können fortgesetzt oder gelöscht werden (mit Bestätigung)
- Ladezustand mit Skeleton-Animation

### Detailansicht

- Vollständige Antragsdetails
- Behördenmitteilungen bei Ablehnung oder fehlendem Unterlagen (farblich differenziert)
- Direktlink zum Fortsetzen bei Entwürfen und nachzureichenden Unterlagen

### Authentifizierung

- Geschützte Routen (`/permits`, `/permit/new`, `/permit/:id/edit`)
- Fokus-Trap im Login-Modal (Tastaturnavigation bleibt im Modal)
- Sichtbare Fokus-Stile für alle Buttons und Eingaben
- Fehlermeldungen mit `role="alert"` für Screenreader

## Teststrategie

Tests prüfen Verhalten, nicht Implementierungsdetails:

- Komponenten werden mit echtem Redux-Store und `MemoryRouter` gerendert
- Kein Mocking von Kindkomponenten
- `permitService` wird nur für Submit-Tests gemockt
- `localStorage` wird vor und nach jedem Test bereinigt
