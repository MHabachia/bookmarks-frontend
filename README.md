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

---

## Projektstruktur

```
bookmarks-frontend/
├── index.html                          ← HTML-Einstiegspunkt + Tabler Icons CDN
├── vite.config.ts                      ← Vite-Konfiguration + API-Proxy
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
    └── components/
        ├── AppSidebar.vue              ← Navigation & Filter-Buttons
        ├── AppTopbar.vue               ← Titel, Dark Mode, Profil-Dropdown
        ├── BookmarkList.vue            ← API-Calls, Filter-Logik, Modal-Steuerung
        ├── BookmarkItem.vue            ← Einzelne Bookmark-Karte
        ├── BookmarkModal.vue           ← Add/Edit Modal mit Tag-Chip Eingabe
        └── ToastNotification.vue       ← Toast-Benachrichtigungen
```

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

Der `useAuth` Composable kapselt die gesamte Auth0-Logik:

```ts
const { user, isAuthenticated, login, logout, authFetch } = useAuth()

// API-Call mit automatischem JWT-Token
const response = await authFetch('/api/bookmarks')
```

---

## Komponenten

### `App.vue` — Wurzelkomponente & Login-Gate

Zeigt je nach Auth-Status:
- **Ladescreen** — während Auth0 den Status prüft
- **Login-Card** — wenn nicht eingeloggt
- **Haupt-App** — wenn eingeloggt

Globaler Zustand via `provide()`:

| Variable | Typ | Beschreibung |
|---|---|---|
| `bookmarks` | `Ref<Array>` | Zentrale Bookmark-Liste |
| `activeFilter` | `Ref<string>` | Aktiver Sidebar-Filter |
| `isDark` | `Ref<boolean>` | Dark-Mode-Status |
| `showToast` | `Function` | Toast-Benachrichtigung anzeigen |

### `AppSidebar.vue` — Navigation

5 Filter-Buttons mit reaktiven Badge-Zählern:

| Filter | Beschreibung |
|---|---|
| `alle` | Alle Bookmarks |
| `ungelesen` | `gelesen === false` |
| `favoriten` | `favorit === true` |
| `gelesen` | `gelesen === true` |
| `tags` | Gruppiert nach Tags |

### `AppTopbar.vue` — Topbar

- Dynamischer Seitentitel je nach Filter
- Dark/Light Mode Toggle
- Profil-Dropdown mit Auth0-Profilbild, Name, E-Mail, Mini-Statistiken
- Link zu Mein Profil + Abmelden

### `BookmarkList.vue` — Bookmark-Liste

Alle API-Calls via `authFetch()` mit automatischem JWT-Token:

| Aktion | Methode | Endpunkt |
|---|---|---|
| Laden | GET | `/api/bookmarks` |
| Erstellen | POST | `/api/bookmarks` |
| Bearbeiten | PUT | `/api/bookmarks/{id}` |
| Favorit/Gelesen | PUT | `/api/bookmarks/{id}` |
| Löschen | DELETE | `/api/bookmarks/{id}` |

### `BookmarkItem.vue` — Bookmark-Karte

- Favicon via Google S2 API mit Fallback-Icon
- Favorit-Button (⭐) und Gelesen-Button (✓)
- Dreipunkt-Menü: Bearbeiten / Löschen
- Tag-Chips

### `BookmarkModal.vue` — Formular

Add- und Edit-Modus in einer Komponente. Tag-Chip-Eingabe:
- `Enter` oder `,` → Tag hinzufügen
- `Backspace` → letzten Tag entfernen
- `×` → einzelnen Tag entfernen

### `ProfileView.vue` — User-Profil

- Auth0-Profilbild, Name, E-Mail
- Statistiken: Gesamt, Favoriten, Gelesen, Ungelesen, Tags, Lesefortschritt
- Fortschrittsbalken
- Top-Tags Balkendiagramm
- Auth0 Account-Informationen (Sub, E-Mail-Verifizierungsstatus)

### `ToastNotification.vue` — Benachrichtigungen

| Aktion | Meldung |
|---|---|
| Hinzufügen | ✅ Bookmark wurde hinzugefügt |
| Bearbeiten | ✏️ Bookmark wurde aktualisiert |
| Löschen | 🗑️ Bookmark wurde gelöscht |
| Favorit an/aus | ⭐ / ★ |
| Gelesen an/aus | ✓ / ○ |

---

## Lokale Entwicklung

### Voraussetzungen

- Node.js 20+
- npm
- Auth0-Account (kostenlos)
- Laufendes Backend (`bookmarks-backend`)

### Setup

```bash
git clone https://github.com/MHabachia/bookmarks-frontend.git
cd bookmarks-frontend
npm install
```

`.env` anlegen (wird nicht committed):

```bash
cp .env.example .env
# Werte aus dem Auth0 Dashboard eintragen
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

Vite leitet `/api`-Anfragen automatisch an `http://localhost:8080` weiter (Proxy in `vite.config.ts`).

---

## Deployment auf Render

### Architektur

```
Internet → Render CDN (SSL) → Static Files (dist/)
                  ↓ VITE_API_URL
         Render Web Service (Spring Boot)
                  ↓
         Render PostgreSQL
```

### Render Build-Einstellungen

| Einstellung | Wert |
|---|---|
| Type | Static Site |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

### Umgebungsvariablen auf Render setzen

| Variable | Wert |
|---|---|
| `VITE_AUTH0_DOMAIN` | `dev-XXXXX.eu.auth0.com` |
| `VITE_AUTH0_CLIENT_ID` | aus Auth0 Dashboard |
| `VITE_AUTH0_AUDIENCE` | `https://bookmarkit-api` |
| `VITE_API_URL` | `https://bookmarkit-backend.onrender.com` |

Im Auth0 Dashboard zusätzlich eintragen:
```
Allowed Callback URLs:  https://bookmarkit-frontend.onrender.com
Allowed Logout URLs:    https://bookmarkit-frontend.onrender.com
Allowed Web Origins:    https://bookmarkit-frontend.onrender.com
```

> Die `public/_redirects` Datei sorgt dafür dass Vue Router bei direkten URLs
> (z.B. `/profile`) nicht 404 zurückgibt.

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

### Repositories

- **Frontend:** https://github.com/MHabachia/bookmarks-frontend
- **Backend:** https://github.com/MHabachia/bookmarks-backend
