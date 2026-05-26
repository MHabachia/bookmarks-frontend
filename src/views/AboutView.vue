<template>
  <section class="about-section">

    <div class="about-card">
      <div class="about-header">
        <i class="ti ti-bookmark"></i>
        <h1>BookmarkIt</h1>
        <span class="version-badge">Version 1.3 · M3</span>
      </div>

      <p class="about-desc">
        BookmarkIt ist eine Webanwendung zur Verwaltung von Lesezeichen.
        Entwickelt im Rahmen des Moduls <strong>Webtechnologien</strong>
        an der HTW Berlin, SoSe 2026.
      </p>

      <div class="about-grid">

        <div class="info-block">
          <h3><i class="ti ti-server"></i> Backend</h3>
          <ul>
            <li>Java 21</li>
            <li>Spring Boot 4.0</li>
            <li>Gradle</li>
            <li>Lombok</li>
          </ul>
        </div>

        <div class="info-block">
          <h3><i class="ti ti-layout"></i> Frontend</h3>
          <ul>
            <li>Vue.js 3 (Composition API)</li>
            <li>Vite</li>
            <li>Vue Router 4</li>
            <li>Tabler Icons</li>
          </ul>
        </div>

        <div class="info-block">
          <h3><i class="ti ti-server-2"></i> Deployment</h3>
          <ul>
            <li>Proxmox LXC (Ubuntu 24.04)</li>
            <li>Nginx Reverse Proxy</li>
            <li>Traefik + SSL</li>
            <li>systemd Service</li>
          </ul>
        </div>

      </div>

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
          <div class="milestone pending">
            <i class="ti ti-circle"></i>
            <div>
              <strong>M4</strong> — PostgreSQL + POST-Route
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

      <div class="repo-links">
        <a href="https://github.com/MHabachia/bookmarks-frontend" target="_blank" class="repo-btn">
          <i class="ti ti-brand-github"></i> Frontend Repo
        </a>
        <a href="https://github.com/MHabachia/bookmarks-backend" target="_blank" class="repo-btn">
          <i class="ti ti-brand-github"></i> Backend Repo
        </a>
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
  gap: 28px;
}

/* Header */
.about-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.about-header i {
  font-size: 32px;
  color: var(--accent);
}
.about-header h1 {
  font-size: 26px;
  font-weight: 700;
  color: var(--text);
}
.version-badge {
  margin-left: auto;
  background: var(--tag-bg);
  color: var(--accent);
  font-size: 12px;
  font-weight: 500;
  border-radius: 99px;
  padding: 4px 12px;
}

.about-desc {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
}

/* Tech-Stack Grid */
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
.info-block ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.info-block li {
  font-size: 13px;
  color: var(--muted);
  padding-left: 8px;
  border-left: 2px solid var(--accent);
}

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

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.milestone {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}
.milestone i { font-size: 18px; flex-shrink: 0; }
.milestone.done i { color: var(--accent); }
.milestone.pending i { color: var(--muted); }
.milestone div { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.milestone strong { color: var(--text); }
.milestone.done strong { color: var(--text); }
.milestone.pending strong { color: var(--muted); }
.date {
  margin-left: auto;
  font-size: 11px;
  color: var(--muted);
  opacity: 0.7;
}

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

.team-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.team-member {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.team-member p { font-size: 13px; font-weight: 500; color: var(--text); }
.team-member a {
  font-size: 12px;
  color: var(--accent);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}
.team-member a:hover { text-decoration: underline; }
.muted { font-size: 12px; color: var(--muted); }

/* Repo-Links */
.repo-links {
  display: flex;
  gap: 12px;
}
.repo-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}
.repo-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.repo-btn i { font-size: 16px; }
</style>
