# BookmarkIt — Frontend

Vue.js 3 Frontend der BookmarkIt-Webanwendung.  
Entwickelt im Rahmen des Moduls **Webtechnologien** an der HTW Berlin, SoSe 2026.

---



## Projektbeschreibung

BookmarkIt ist eine Webanwendung zur Verwaltung von Lesezeichen (Bookmarks).  
Das Frontend ist als Single Page Application (SPA) mit Vue.js 3 umgesetzt
und kommuniziert mit dem Spring Boot Backend über eine REST-API.

Features:
- Bookmarks anzeigen, hinzufügen, bearbeiten und löschen
- Filterung nach Kategorie (Alle, Ungelesen, Favoriten, Gelesen, Tags)
- Dark / Light Mode Toggle
- Automatische Favicon-Ermittlung pro Bookmark
- Fallback auf Mock-Daten wenn Backend nicht erreichbar

---

## Technologie-Stack

| Technologie | Zweck                 |
|----|-----------------------|
| Vue.js | Frontend-Framework        |
| Vite |  Build-Tool & Dev-Server   |
| Vue Router | Client-seitiges Routing   |
| Tabler Icons  | Icon-Bibliothek (via CDN) |

---

## Projektstruktur

```
bookmark-frontend/
├── index.html                    ← HTML-Einstiegspunkt
├── vite.config.ts                ← Vite-Konfiguration + API-Proxy
├── package.json                  ← Dependencies & npm-Skripte
└── src/
    ├── main.ts                   ← App initialisieren + Router starten
    ├── App.vue                   ← Wurzelkomponente + globaler Zustand
    ├── assets/
    │   └── main.css              ← CSS-Variablen, Light/Dark Mode, Reset
    ├── views/
    │   └── HomeView.vue          ← Route "/" — lädt BookmarkList
    └── components/
        ├── AppSidebar.vue        ← Seitenleiste mit Navigation & Filter
        ├── AppTopbar.vue         ← Topbar mit Titel, Dark Mode, Profil
        ├── BookmarkList.vue      ← Lädt & filtert Bookmarks, Modal-Verwaltung
        ├── BookmarkItem.vue      ← Einzelne Bookmark-Karte mit Menü
        └── BookmarkModal.vue     ← Add/Edit Modal mit Formular
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
| `tags` | Alle Bookmarks (Gruppierung ab M4) |

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
Verwaltet den Modal-Zustand für Add- und Edit-Aktionen.

---

### `BookmarkItem.vue` — Bookmark-Karte

Zeigt einen einzelnen Bookmark als Karte:
- Favicon via [Google S2 Favicon API](https://www.google.com/s2/favicons?domain=example.com&sz=32)
- Anklickbare Domain-URL (öffnet in neuem Tab)
- Dreipunkt-Menü: Bearbeiten / Löschen
- Tag-Chips

---

### `BookmarkModal.vue` — Formular-Modal

Add-Modus und Edit-Modus in einer Komponente.  
4 Felder: Titel, URL, Beschreibung, Tag/Kategorie.  
Speichern-Button deaktiviert solange Titel oder URL fehlen.

---

## Datenfluss und übergabe

```
App.vue (provide: bookmarks, activeFilter, isDark)
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
                         inject(bookmarks) → Liste befüllen & rendern
                         inject(activeFilter) → filtern
                         └── BookmarkItem
                               emit('edit') → Modal öffnen
                               emit('delete') → Bookmark löschen
                         └── BookmarkModal
                               emit('save') → Bookmark speichern
                               emit('close') → Modal schließen
```

---

## Lokale Deployment

### Voraussetzungen

- Node.js 18 oder höher
- npm

### Starten

```bash
# Repository clonen
git clone https://github.com/MHabachia/bookmarks-frontend.git
cd bookmarks-frontend

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Das Frontend ist dann erreichbar unter:
```
http://localhost:5173
```

> **Hinweis:** Vite leitet `/api`-Anfragen automatisch an
> `http://localhost:8080` weiter (Proxy in `vite.config.js`).
> Ohne laufendes Backend werden automatisch Mock-Daten geladen.

### Production Build

```bash
npm run build
# Statische Dateien liegen in: dist/
```

---

## Deployment

Das Frontend wird als statische Dateien via Nginx ausgeliefert,
auf demselben Server wie das Backend (Proxmox LXC, Ubuntu 24.04).

### Architektur

```
Internet → Reverse-Proxy (SSL) → Nginx (Port 80)
                               ├── /      → dist/ (statische Dateien)
                               └── /api   → Spring Boot (Port 8080)
```


## Milestones

| Milestone | Beschreibung | Deadline | Status |
|---|---|---|---|
| M1 | Backend mit GET-Route auf GitHub | 19. April | ✅ |
| M2 | Vue.js App mit v-for Komponente auf GitHub | 10. Mai | ✅ |
| M3 | Frontend & Backend deployed, Frontend ruft GET-Route auf | 24. Mai | ✅ |
| M4 | PostgreSQL + POST-Route, Bookmark speichern | 14. Juni | ⏳ |
| Finale | Tests, GitHub Actions, Screenshot-Dokumentation | 5. Juli | ⏳ |

---

## Team

- **Team: 40** · **Kurs: Webtechnologien**
- Studiengang: Wirtschaftsinfromatik · HTW Berlin · SoSe 2026

| Name | GitHub                                     |
|---|--------------------------------------------|
| Mohamad Habachia | [@MHabachia](https://github.com/MHabachia) |
| Ibrahim Hassan |   [@Hassan9977](https://github.com/Hassan9977)                                        |

### Repositories

- **Frontend:** https://github.com/MHabachia/bookmarks-frontend
- **Backend:** https://github.com/MHabachia/bookmarks-backend
