# BookmarkIt — Frontend

Vue.js 3 Frontend der BookmarkIt-Webanwendung.  
Entwickelt im Rahmen des Moduls **Webtechnologien** an der HTW Berlin, SoSe 2026.

BookmarkIt ist eine Webanwendung zur Verwaltung von Lesezeichen. Das Frontend ist als
**Single Page Application (SPA)** mit Vue.js 3 umgesetzt, kommuniziert mit dem Spring Boot
Backend über eine gesicherte REST-API und authentifiziert Nutzer über **Auth0**.

---

## Features

- Auth0 Login-Gate — App nur für eingeloggte User zugänglich
- Session bleibt nach Seiten-Reload erhalten (localStorage + Refresh-Tokens)
- Bookmarks anzeigen, hinzufügen, bearbeiten und löschen
- Favorit & Gelesen Status pro Bookmark togglen
- Filterung nach Kategorie (Alle, Ungelesen, Favoriten, Gelesen, Tags)
- Tags/Kategorien-Ansicht mit Gruppierung nach Tag
- Lösch-Bestätigung Dialog
- Toast-Benachrichtigungen für alle Aktionen
- Dark / Light Mode Toggle
- Automatische Favicon-Ermittlung pro Bookmark
- User-Profil mit Statistiken (Gesamt, Favoriten, Gelesen, Lesefortschritt, Top-Tags)
- Profil-Dropdown mit Mini-Statistiken im Topbar

---

## Technologie-Stack

| Technologie | Version | Zweck |
|---|---|---|
| Vue.js | 3.5 | Frontend-Framework |
| Vite | 6 | Build-Tool & Dev-Server |
| Vue Router | 4.5 | Client-seitiges Routing |
| Auth0 Vue SDK | aktuell | Authentifizierung |
| Tabler Icons | 3.31.0 | Icon-Bibliothek (via CDN) |
| Vitest | 3 | Test-Framework |
| Vue Test Utils | 2 | Vue-Komponenten testen |

---

## Projektstruktur

```
bookmarks-frontend/
├── index.html                          ← HTML-Einstiegspunkt + Tabler Icons CDN
├── vite.config.ts                      ← Vite-Konfiguration + API-Proxy + Vitest
├── package.json                        ← Dependencies & npm-Skripte
├── .env.example                        ← Vorlage für Umgebungsvariablen
├── public/
│   └── _redirects                      ← Render SPA-Routing (alle Pfade → index.html)
└── src/
    ├── main.ts                         ← App + Router + Auth0 Plugin initialisieren
    ├── App.vue                         ← Wurzelkomponente + Login-Gate + globaler Zustand
    ├── assets/
    │   └── main.css                    ← CSS-Variablen, Light/Dark Mode, Reset
    ├── composables/
    │   └── useAuth.ts                  ← Auth0 Wrapper + authFetch() Helper
    ├── views/
    │   ├── HomeView.vue                ← Route "/" — Bookmark-Liste
    │   ├── AboutView.vue               ← Route "/about" — Projektinfos
    │   └── ProfileView.vue             ← Route "/profile" — User-Profil & Statistiken
    ├── components/
    │   ├── AppSidebar.vue              ← Navigation & Filter-Buttons
    │   ├── AppTopbar.vue               ← Titel, Dark Mode, Profil-Dropdown
    │   ├── BookmarkList.vue            ← API-Calls, Filter-Logik, Modal-Steuerung
    │   ├── BookmarkItem.vue            ← Einzelne Bookmark-Karte
    │   ├── BookmarkModal.vue           ← Add/Edit Modal mit Tag-Chip Eingabe
    │   └── ToastNotification.vue       ← Toast-Benachrichtigungen
    └── tests/
        ├── BookmarkItem.test.ts        ← Komponenten-Tests
        ├── BookmarkModal.test.ts       ← Formular-Tests
        └── useAuth.test.ts             ← Composable-Tests
```

---

## Tests

### Tests ausführen

```bash
npm test                  # einmal ausführen
npm run test:watch        # bei Dateiänderungen automatisch neu
npm run test:coverage     # mit Coverage-Report
```

### Testübersicht

| Datei | Anzahl | Was wird getestet |
|---|---|---|
| `BookmarkItem.test.ts` | 4 | Titel/URL/Tags anzeigen, Favorit/Gelesen Events |
| `BookmarkModal.test.ts` | 4 | Add/Edit Modus, Validierung, save/close Events |
| `useAuth.test.ts` | 4 | Initialen-Berechnung, JWT-Header, Content-Type |

**Gesamt: 12 Tests**

Auth0 SDK wird in Tests gemockt — kein echter Auth0-Aufruf nötig.

---

## GitHub Actions CI

Bei jedem Push auf `main` wird automatisch ausgeführt:

```
Push auf main
      ↓
1. Node.js 20 einrichten (mit npm Cache)
2. npm ci  → saubere Installation
3. npm test  → 12 Vitest Tests
4. npm run build  → Production Build mit Auth0 Variablen
```

Die Auth0-Konfiguration wird als GitHub Secrets hinterlegt:
`VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`, `VITE_API_URL`

---

## Authentifizierung

Die App nutzt **Auth0 Universal Login**. Nach dem Login erhält der Browser ein JWT-Token,
das bei jedem API-Call automatisch mitgeschickt wird.

```
Benutzer klickt "Anmelden"
        ↓
Auth0 Login-Seite (Universal Login)
        ↓
JWT-Token wird im localStorage gespeichert
        ↓
authFetch() setzt automatisch "Authorization: Bearer <token>"
        ↓
Spring Boot Backend validiert Token und gibt Daten zurück
```

---

## Lokale Entwicklung

### Voraussetzungen

- Node.js 20+
- npm
- Auth0-Account (kostenlos)
- Laufendes Backend (`bookmarkit-backend`)

### Setup

```bash
git clone https://github.com/MHabachia/bookmarkit-frontend.git
cd bookmarkit-frontend
npm install
cp .env.example .env
# Werte aus dem Auth0 Dashboard in .env eintragen
```

```env
VITE_AUTH0_DOMAIN=dev-XXXXX.eu.auth0.com
VITE_AUTH0_CLIENT_ID=dein_client_id
VITE_AUTH0_AUDIENCE=https://bookmarkit-api
VITE_API_URL=
```

Im Auth0 Dashboard eintragen:
```
Allowed Callback URLs:  http://localhost:5173
Allowed Logout URLs:    http://localhost:5173
Allowed Web Origins:    http://localhost:5173
```

### Starten

```bash
npm run dev
# → http://localhost:5173
```

---

## Deployment auf Render

### Render Build-Einstellungen

| Einstellung | Wert |
|---|---|
| Type | Static Site |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

### Umgebungsvariablen auf Render

| Variable | Wert |
|---|---|
| `VITE_AUTH0_DOMAIN` | `dev-XXXXX.eu.auth0.com` |
| `VITE_AUTH0_CLIENT_ID` | aus Auth0 Dashboard |
| `VITE_AUTH0_AUDIENCE` | `https://bookmarkit-api` |
| `VITE_API_URL` | `https://bookmarks-backend-uats.onrender.com` |

---

## Milestones

| Milestone | Beschreibung | Deadline | Status |
|---|---|---|---|
| M1 | Backend mit GET-Route auf GitHub | 19. April | ✅ |
| M2 | Vue.js App mit v-for Komponente auf GitHub | 10. Mai | ✅ |
| M3 | Frontend & Backend deployed | 24. Mai | ✅ |
| M4 | Vollständige CRUD-API, Toggle, Toast, Tag-Gruppen | 14. Juni | ✅ |
| Finale | Auth0, User-Profil, Tests, GitHub Actions | 5. Juli | ✅ |

---

## Team

**Team 40 · Kurs: Webtechnologien · HTW Berlin · SoSe 2026**

| Name | GitHub |
|---|---|
| Mohamad Habachia | [@MHabachia](https://github.com/MHabachia) |
| Ibrahim Hassan | [@Hassan9977](https://github.com/Hassan9977) |

- **Frontend:** https://github.com/MHabachia/bookmarkit-frontend
- **Backend:** https://github.com/MHabachia/bookmarkit-backend
