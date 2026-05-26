# BookmarkIt — Frontend

Vue.js 3 Frontend der BookmarkIt-Webanwendung.  
Entwickelt im Rahmen des Moduls **Webtechnologien** an der HTW Berlin, SoSe 2026.


BookmarkIt ist eine Webanwendung zur Verwaltung von Lesezeichen (Bookmarks).  
Das Frontend ist als Single Page Application (SPA) mit Vue.js 3 umgesetzt
und kommuniziert mit dem Spring Boot Backend über eine REST-API.

## Features:
- Bookmarks anzeigen, hinzufügen, bearbeiten und löschen
- Favorit & Gelesen Status pro Bookmark togglen
- Filterung nach Kategorie (Alle, Ungelesen, Favoriten, Gelesen, Tags)
- Tags/Kategorien-Ansicht mit Gruppierung nach Tag
- Lösch-Bestätigung Dialog
- Toast-Benachrichtigungen für alle Aktionen
- Dark / Light Mode Toggle
- Automatische Favicon-Ermittlung pro Bookmark
- Fallback auf Mock-Daten wenn Backend nicht erreichbar


---

## Technologie-Stack

| Technologie | Version | Zweck |
|---|---|---|
| Vue.js | 3 | Frontend-Framework |
| Vite | 6 | Build-Tool & Dev-Server |
| Vue Router | 4 | Client-seitiges Routing |
| Tabler Icons | 3.31.0 | Icon-Bibliothek (via CDN) |

---

## Projektstruktur

```
bookmarks-frontend/
├── index.html                        ← HTML-Einstiegspunkt + Tabler Icons CDN
├── vite.config.ts                    ← Vite-Konfiguration + API-Proxy
├── package.json                      ← Dependencies & npm-Skripte
└── src/
    ├── main.js                       ← App initialisieren + Router
    ├── App.vue                       ← Wurzelkomponente + globaler Zustand
    ├── assets/
    │   └── main.css                  ← CSS-Variablen, Light/Dark Mode, Reset
    ├── views/
    │   ├── HomeView.vue              ← Route "/" — lädt BookmarkList
    │   └── AboutView.vue            ← Route "/about" — Projektinfos
    └── components/
        ├── AppSidebar.vue            ← Seitenleiste mit Navigation & Filter
        ├── AppTopbar.vue             ← Topbar mit Titel, Dark Mode, Profil
        ├── BookmarkList.vue          ← Lädt & filtert Bookmarks, API-Calls
        ├── BookmarkItem.vue          ← Einzelne Bookmark-Karte
        ├── BookmarkModal.vue         ← Add/Edit Modal mit Tag-Chip Eingabe
        └── ToastNotification.vue     ← Toast-Benachrichtigungen
```

---

## Komponenten

### `App.vue` — Wurzelkomponente

Verwaltet den globalen Zustand und stellt ihn per `provide()` bereit:

| Variable | Typ | Beschreibung |
|---|---|---|
| `isDark` | `Ref<boolean>` | Dark-Mode-Status |
| `bookmarks` | `Ref<Array>` | Zentrale Bookmark-Liste |
| `activeFilter` | `Ref<string>` | Aktiver Sidebar-Filter |
| `showToast` | `Function` | Toast-Benachrichtigung anzeigen |

---

### `AppSidebar.vue` — Seitenleiste

Navigation mit 5 Filter-Optionen. Badge-Zahlen werden reaktiv aus
der gemeinsamen Bookmark-Liste berechnet.

| Filter | Beschreibung |
|---|---|
| `alle` | Alle Bookmarks |
| `ungelesen` | Bookmarks wo `gelesen === false` |
| `favoriten` | Bookmarks wo `favorit === true` |
| `gelesen` | Bookmarks wo `gelesen === true` |
| `tags` | Bookmarks gruppiert nach Tags |

---

### `AppTopbar.vue` — Obere Leiste

- Dynamischer Seitentitel je nach aktivem Filter
- Dark/Light Mode Toggle
- Profil-Dropdown (Einstellungen, Bild, Passwort, Abmelden)
- Footer mit Projekt-Info

---

### `BookmarkList.vue` — Bookmark-Liste

Lädt Bookmarks beim Mounten via `GET /api/bookmarks`.  
Bei nicht erreichbarem Backend werden Mock-Daten geladen.  
Verwaltet Modal-Zustand und alle API-Calls:

| Aktion | HTTP-Methode | Endpunkt |
|---|---|---|
| Laden | GET | `/api/bookmarks` |
| Hinzufügen | POST | `/api/bookmarks` |
| Bearbeiten | PUT | `/api/bookmarks/{id}` |
| Löschen | DELETE | `/api/bookmarks/{id}` |
| Favorit/Gelesen | PUT | `/api/bookmarks/{id}` |

---

### `BookmarkItem.vue` — Bookmark-Karte

Zeigt einen einzelnen Bookmark als Karte:
- Favicon via [Google S2 Favicon API](https://www.google.com/s2/favicons?domain=example.com&sz=32)
- Anklickbare Domain-URL (öffnet in neuem Tab)
- Favorit-Button (Stern) — togglet Favorit-Status
- Gelesen-Button (Haken) — togglet Gelesen-Status
- Dreipunkt-Menü: Bearbeiten / Löschen
- Tag-Chips

---

### `BookmarkModal.vue` — Formular-Modal

Add-Modus und Edit-Modus in einer Komponente.  
4 Felder: Titel, URL, Beschreibung, Tags.

Tag-Chip Eingabe:
- Enter oder Komma → Tag als Chip hinzufügen
- Backspace → letzten Chip entfernen
- × Button → einzelnen Chip entfernen

---

### `ToastNotification.vue` — Toast-Benachrichtigungen

Zeigt kurze Meldungen nach Aktionen an (verschwindet nach 3 Sekunden):

| Aktion | Meldung |
|---|---|
| Hinzufügen | ✅ Bookmark wurde hinzugefügt |
| Bearbeiten | ✏️ Bookmark wurde aktualisiert |
| Löschen | 🗑️ Bookmark wurde gelöscht |
| Favorit markieren | ⭐ Als Favorit markiert |
| Favorit entfernen | ★ Aus Favoriten entfernt |
| Gelesen markieren | ✓ Als gelesen markiert |
| Ungelesen markieren | ○ Als ungelesen markiert |

---

## Datenfluss

```
App.vue (provide: bookmarks, activeFilter, isDark, showToast)
  │
  ├── AppSidebar
  │     inject(bookmarks) → Badge-Zahlen berechnen
  │     inject(activeFilter) → aktiven Eintrag hervorheben
  │     emit('set-filter') → App setzt activeFilter
  │
  └── AppTopbar
        inject(activeFilter) → Seitentitel anzeigen
        emit('toggle-dark') → App toggelt Dark Mode
        <slot> → HomeView
                   └── BookmarkList
                         inject(bookmarks, activeFilter, showToast)
                         API: GET/POST/PUT/DELETE /api/bookmarks
                         └── BookmarkItem
                               emit('toggle-favorit') → PUT /api/bookmarks/{id}
                               emit('toggle-gelesen')  → PUT /api/bookmarks/{id}
                               emit('edit')   → Modal öffnen
                               emit('delete') → Bestätigungs-Dialog
                         └── BookmarkModal
                               emit('save')  → POST oder PUT
                               emit('close') → Modal schließen
                         └── ToastNotification
                               inject(showToast) → Meldung anzeigen
```

---

## Server-Deployment — Voraussetzungen

Folgende Software muss auf dem Server installiert sein:

| Software | Version | Zweck |
|---|---|---|
| Ubuntu | 24.04 | Betriebssystem |
| Node.js | 20+ | Build-Tool (nur zum Bauen) |
| npm | 10+ | Package Manager |
| Nginx | aktuell | Statische Dateien ausliefern + API Proxy |



## Lokale Entwicklung

### Voraussetzungen

- Node.js 20 oder höher
- npm

### Starten

```bash
git clone https://github.com/MHabachia/bookmarks-frontend.git
cd bookmarks-frontend
npm install
npm run dev
```

Das Frontend ist dann erreichbar unter:
```
http://localhost:5173
```

> **Hinweis:** Vite leitet `/api`-Anfragen automatisch an
> `http://localhost:8080` weiter (Proxy in `vite.config.js`).
> Ohne laufendes Backend werden automatisch Mock-Daten geladen.



---

## Deployment

Das Frontend wird als statische Dateien via Nginx ausgeliefert,
auf demselben Server wie das Backend (Virtuelle Maschine, Ubuntu 24.04).

### Architektur

```
Internet → Reverse-Proxy (SSL) → Nginx (Port 80)
                               ├── /      → dist/ (statische Dateien)
                               └── /api   → Spring Boot (Port 8080)
```

### Deploy-Befehl

```bash
cd /opt/bookmarkit/bookmarks-frontend
git pull
npm install
npm run build
cp -r dist/* /var/www/bookmarkit/
```

---

## Milestones

| Milestone | Beschreibung | Deadline | Status |
|---|---|---|---|
| M1 | Backend mit GET-Route auf GitHub | 19. April | ✅ |
| M2 | Vue.js App mit v-for Komponente auf GitHub | 10. Mai | ✅ |
| M3 | Frontend & Backend deployed | 24. Mai | ✅ |
| M4 | Vollständige CRUD-API, Toggle, Toast, Tag-Gruppen | 14. Juni | ✅ |
| Finale | Tests, GitHub Actions, Screenshot-Dokumentation | 5. Juli | ⏳ |

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
