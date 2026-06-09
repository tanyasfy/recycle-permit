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
├── components/       # Wiederverwendbare UI-Komponenten
│   ├── layout/       # AppLayout, AppHeader, AppFooter
│   ├── ui/           # Button
│   └── Popup/        # Popup, ConfirmPopup
├── features/
│   ├── auth/         # Login-Modal, AuthService, Validierung
│   └── permit/       # PermitWizard, PermitService, Mock-Daten
├── hooks/            # useFocusTrap, Redux-Hooks
├── pages/            # Seiten-Komponenten
├── routes/           # Router-Konfiguration, ProtectedRoute
├── store/            # Redux Store, authSlice
├── test/             # Testdateien und Hilfsfunktionen
```

## Funktionen

- **Antragsstellung** — Mehrstufiger Wizard zur Einreichung von Zulassungsanträgen
- **Entwurfsverwaltung** — Automatisches Speichern und Fortsetzen von Entwürfen
- **Antragsübersicht** — Filterbare Liste aller Anträge mit Statusanzeige
- **Detailansicht** — Vollständige Antragsdetails inkl. Behördenmitteilungen
- **Authentifizierung** — Geschützte Routen, Fokus-Trap im Login-Modal
