<template>
  <section class="about-section">
    <div class="about-card">

      <!-- Header -->
      <div class="about-header">
        <i class="ti ti-bookmark"></i>
        <h1>BookmarkIt</h1>
        <span class="version-badge">Version 1.4 · M4</span>
      </div>

      <p class="about-desc">
        BookmarkIt ist eine Webanwendung zur Verwaltung von Lesezeichen.
        Entwickelt im Rahmen des Moduls <strong>Webtechnologien</strong>
        an der HTW Berlin, SoSe 2026. Das Frontend kommuniziert mit einem
        Spring Boot Backend über eine REST-API und speichert alle Daten
        in einer PostgreSQL-Datenbank.
      </p>

      <!-- Features -->
      <div class="features-section">
        <h3><i class="ti ti-stars"></i> Features</h3>
        <div class="features-grid">
          <div class="feature-item">
            <i class="ti ti-plus"></i>
            <span>Bookmarks hinzufügen, bearbeiten, löschen</span>
          </div>
          <div class="feature-item">
            <i class="ti ti-star"></i>
            <span>Favoriten markieren</span>
          </div>
          <div class="feature-item">
            <i class="ti ti-circle-check"></i>
            <span>Als gelesen markieren</span>
          </div>
          <div class="feature-item">
            <i class="ti ti-tag"></i>
            <span>Tags & Kategorien</span>
          </div>
          <div class="feature-item">
            <i class="ti ti-filter"></i>
            <span>Filterung nach Kategorie</span>
          </div>
          <div class="feature-item">
            <i class="ti ti-moon"></i>
            <span>Dark / Light Mode</span>
          </div>
          <div class="feature-item">
            <i class="ti ti-bell"></i>
            <span>Toast-Benachrichtigungen</span>
          </div>
          <div class="feature-item">
            <i class="ti ti-world"></i>
            <span>Automatische Favicons</span>
          </div>
        </div>
      </div>

      <!-- Tech Stack -->
      <div class="about-grid">
        <div class="info-block">
          <h3><i class="ti ti-server"></i> Backend</h3>
          <ul>
            <li>Java 21</li>
            <li>Spring Boot 4.0</li>
            <li>Spring Data JPA</li>
            <li>Flyway Migration</li>
            <li>PostgreSQL 16</li>
            <li>Gradle</li>
          </ul>
        </div>

        <div class="info-block">
          <h3><i class="ti ti-layout"></i> Frontend</h3>
          <ul>
            <li>Vue.js 3</li>
            <li>Vite 6</li>
            <li>Vue Router 4</li>
            <li>Tabler Icons 3.31</li>
          </ul>
        </div>

        <div class="info-block">
          <h3><i class="ti ti-server-2"></i> Deployment</h3>
          <ul>
            <li>Ubuntu 24.04 System</li>
            <li>Nginx für API Reverse Proxy</li>
            <li>Reverse Proxy für SSL-Termination </li>
            <li>systemd Service</li>
          </ul>
        </div>
      </div>

      <!-- API -->
      <div class="api-section">
        <h3><i class="ti ti-api"></i> REST API</h3>
        <div class="api-list">
          <div class="api-item">
            <span class="method get">GET</span>
            <code>/api/bookmarks</code>
            <span class="api-desc">Alle Bookmarks laden</span>
          </div>
          <div class="api-item">
            <span class="method get">GET</span>
            <code>/api/bookmarks/{id}</code>
            <span class="api-desc">Einzelnen Bookmark laden</span>
          </div>
          <div class="api-item">
            <span class="method post">POST</span>
            <code>/api/bookmarks</code>
            <span class="api-desc">Neuen Bookmark erstellen</span>
          </div>
          <div class="api-item">
            <span class="method put">PUT</span>
            <code>/api/bookmarks/{id}</code>
            <span class="api-desc">Bookmark aktualisieren</span>
          </div>
          <div class="api-item">
            <span class="method delete">DELETE</span>
            <code>/api/bookmarks/{id}</code>
            <span class="api-desc">Bookmark löschen</span>
          </div>
        </div>
      </div>

      <!-- Milestones -->
      <div class="milestones">
        <h3><i class="ti ti-list-check"></i> Milestones</h3>
        <div class="milestone-list">
          <div class="milestone done">
            <i class="ti ti-circle-check-filled"></i>
            <div>
              <strong>M1</strong> — Spring Boot Backend mit GET-Route
              <span class="date">19. April</span>
            </div>
          </div>
          <div class="milestone done">
            <i class="ti ti-circle-check-filled"></i>
            <div>
              <strong>M2</strong> — Vue.js Frontend mit v-for Komponente
              <span class="date">10. Mai</span>
            </div>
          </div>
          <div class="milestone done">
            <i class="ti ti-circle-check-filled"></i>
            <div>
              <strong>M3</strong> — Frontend & Backend deployed
              <span class="date">24. Mai</span>
            </div>
          </div>
          <div class="milestone done">
            <i class="ti ti-circle-check-filled"></i>
            <div>
              <strong>M4</strong> — PostgreSQL + CRUD API + Toggle + Toast
              <span class="date">14. Juni</span>
            </div>
          </div>
          <div class="milestone pending">
            <i class="ti ti-circle"></i>
            <div>
              <strong>Finale</strong> — Tests + GitHub Actions + Dokumentation
              <span class="date">5. Juli</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Team -->
      <div class="team-section">
        <h3><i class="ti ti-users"></i> Team 40</h3>
        <div class="team-list">
          <div class="team-member">
            <div class="avatar">MH</div>
            <div>
              <p>Mohamad Habachia</p>
              <a href="https://github.com/MHabachia" target="_blank">
                <i class="ti ti-brand-github"></i> @MHabachia
              </a>
            </div>
          </div>
          <div class="team-member">
            <div class="avatar">IH</div>
            <div>
              <p>Ibrahim Hassan</p>
              <a href="https://github.com/Hassan9977" target="_blank">
                <i class="ti ti-brand-github"></i> @Hassan9977
              </a>
            </div>
          </div>
        </div>
      </div>


    </div>
  </section>
</template>

<script setup>

</script>

<style scoped>
.about-section {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}
.about-card {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header */
.about-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.about-header i { font-size: 32px; color: var(--accent); }
.about-header h1 { font-size: 26px; font-weight: 700; color: var(--text); }
.version-badge {
  margin-left: auto;
  background: var(--tag-bg);
  color: var(--accent);
  font-size: 12px;
  font-weight: 500;
  border-radius: 99px;
  padding: 4px 12px;
}
.about-desc { font-size: 14px; color: var(--muted); line-height: 1.7; }

/* Features */
.features-section {
  background: var(--card);
  border: 0.5px solid var(--border);
  border-radius: 12px;
  padding: 18px;
}
.features-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 14px;
}
.features-section h3 i { color: var(--accent); font-size: 16px; }
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--muted);
}
.feature-item i { font-size: 15px; color: var(--accent); flex-shrink: 0; }

/* Tech Stack */
.about-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.info-block {
  background: var(--card);
  border: 0.5px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
.info-block h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 10px;
}
.info-block h3 i { color: var(--accent); font-size: 16px; }
.info-block ul { list-style: none; display: flex; flex-direction: column; gap: 5px; }
.info-block li {
  font-size: 13px;
  color: var(--muted);
  padding-left: 8px;
  border-left: 2px solid var(--accent);
}

/* API */
.api-section {
  background: var(--card);
  border: 0.5px solid var(--border);
  border-radius: 12px;
  padding: 18px;
}
.api-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 14px;
}
.api-section h3 i { color: var(--accent); font-size: 16px; }
.api-list { display: flex; flex-direction: column; gap: 8px; }
.api-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}
.method {
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  padding: 2px 6px;
  min-width: 52px;
  text-align: center;
  flex-shrink: 0;
}
.method.get    { background: rgba(34,197,94,0.15);  color: #16a34a; }
.method.post   { background: rgba(59,130,246,0.15); color: #2563eb; }
.method.put    { background: rgba(234,179,8,0.15);  color: #ca8a04; }
.method.delete { background: rgba(239,68,68,0.15);  color: #dc2626; }
.api-item code {
  font-size: 12px;
  background: var(--bg);
  border: 0.5px solid var(--border);
  border-radius: 4px;
  padding: 2px 8px;
  color: var(--accent);
  min-width: 200px;
}
.api-desc { font-size: 12px; color: var(--muted); }

/* Milestones */
.milestones {
  background: var(--card);
  border: 0.5px solid var(--border);
  border-radius: 12px;
  padding: 18px;
}
.milestones h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 14px;
}
.milestones h3 i { color: var(--accent); font-size: 16px; }
.milestone-list { display: flex; flex-direction: column; gap: 10px; }
.milestone { display: flex; align-items: center; gap: 12px; font-size: 13px; }
.milestone i { font-size: 18px; flex-shrink: 0; }
.milestone.done i { color: var(--accent); }
.milestone.pending i { color: var(--muted); }
.milestone div { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.milestone strong { color: var(--text); }
.milestone.pending strong { color: var(--muted); }
.date { margin-left: auto; font-size: 11px; color: var(--muted); opacity: 0.7; }

/* Team */
.team-section {
  background: var(--card);
  border: 0.5px solid var(--border);
  border-radius: 12px;
  padding: 18px;
}
.team-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 14px;
}
.team-section h3 i { color: var(--accent); font-size: 16px; }
.team-list { display: flex; gap: 20px; flex-wrap: wrap; }
.team-member { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; flex-shrink: 0;
}
.team-member p { font-size: 13px; font-weight: 500; color: var(--text); }
.team-member a {
  font-size: 12px; color: var(--accent); text-decoration: none;
  display: flex; align-items: center; gap: 4px;
}
.team-member a:hover { text-decoration: underline; }

/* Repo Links */
.repo-links { display: flex; gap: 12px; }
.repo-btn {
  display: flex; align-items: center; gap: 8px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 8px; padding: 9px 16px;
  font-size: 13px; font-weight: 500; color: var(--text);
  text-decoration: none; transition: background 0.15s, border-color 0.15s;
}
.repo-btn:hover { border-color: var(--accent); color: var(--accent); }
.repo-btn i { font-size: 16px; }
</style>
