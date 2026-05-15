# Bookmark App – Frontend

Eine einfache Lesezeichen-Verwaltungs WebApp, entwickelt im Rahmen eines Projekts für den Kurs **Webtechnologien** an der HTW Berlin.

## Technologie-Stack

- **Vue.js 3**
- **Vite** (Build-Tool & Dev-Server)
- **Vue Router 4**

## Projektbeschreibung

Das Frontend zeigt eine Liste von Bookmarks an, die vom Spring Boot Backend per REST-API geladen werden.

## Lokale Ausführung

Voraussetzung: Node.js ≥ 18

```bash
npm install
npm run dev
```

Das Frontend läuft dann auf `http://localhost:5173`.  
Der Vite-Dev-Server leitet `/api`-Anfragen automatisch an das Backend auf Port 8080 weiter.

## Komponenten

| Komponente       | Beschreibung                                                  |
|------------------|---------------------------------------------------------------|
| `AppSidebar`     | Seitenleiste mit Navigation, Repos, Doku und Abmelden-Button |
| `AppTopbar`      | Obere Leiste mit Seitentitel, Dark-Mode-Toggle und Profil     |
| `BookmarkList`   | Lädt Bookmarks vom Backend und rendert sie mit `v-for`        |
| `BookmarkItem`   | Einzelne Bookmark-Karte mit Favicon, Menü und Tag-Chips       |
| `BookmarkModal`  | Modal zum Hinzufügen und Bearbeiten von Bookmarks             |

## Milestones

- [x] **M1** – Backend-Repo verknüpft, Projekt-Thema: Bookmark-App
- [x] **M2** – Vue.js App auf GitHub gepusht, `BookmarkList`-Komponente rendert Liste mit `v-for`
- [ ] **M3** – Auf Render deployed, Frontend ruft GET-Route auf
- [ ] **M4** – POST-Route, neuer Bookmark kann gespeichert werden

## Team

- **Team: 40** · **Kurs: Webtechnologien**
- Studiengang: Wirtschaftsinfromatik · HTW Berlin · SoSe 2026

| Name              | GitHub     |
|-------------------|------------|
| Mohamad Habachia  | @MHabachia |
| Ibrahim Hassan    | @Hassan9977|
