<template>
  <section class="profile-section">
    <div class="profile-card">

      <!-- Header -->
      <div class="profile-header">
        <div class="avatar-wrap">
          <img
            v-if="user?.picture && !avatarError"
            :src="user.picture"
            :alt="user.name"
            class="avatar-img"
            @error="avatarError = true"
          />
          <div v-else class="avatar-initials">{{ userInitials }}</div>
          <div class="avatar-badge"><i class="ti ti-shield-check"></i></div>
        </div>
        <div class="profile-info">
          <h1>{{ user?.name ?? user?.nickname ?? 'Benutzer' }}</h1>
          <p class="profile-email">
            <i class="ti ti-mail"></i>
            {{ user?.email }}
          </p>
          <span class="profile-provider">
            <i class="ti ti-brand-auth0"></i>
            Angemeldet via Auth0
          </span>
        </div>
      </div>

      <!-- Statistiken -->
      <div class="stats-section">
        <h2><i class="ti ti-chart-bar"></i> Deine Statistiken</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">Lesezeichen gesamt</div>
            <i class="ti ti-bookmarks stat-icon"></i>
          </div>
          <div class="stat-card accent">
            <div class="stat-number">{{ stats.favoriten }}</div>
            <div class="stat-label">Favoriten</div>
            <i class="ti ti-star-filled stat-icon"></i>
          </div>
          <div class="stat-card green">
            <div class="stat-number">{{ stats.gelesen }}</div>
            <div class="stat-label">Gelesen</div>
            <i class="ti ti-circle-check-filled stat-icon"></i>
          </div>
          <div class="stat-card muted">
            <div class="stat-number">{{ stats.ungelesen }}</div>
            <div class="stat-label">Ungelesen</div>
            <i class="ti ti-mail-opened stat-icon"></i>
          </div>
          <div class="stat-card purple">
            <div class="stat-number">{{ stats.tags }}</div>
            <div class="stat-label">Einzigartige Tags</div>
            <i class="ti ti-tag stat-icon"></i>
          </div>
          <div class="stat-card orange">
            <div class="stat-number">{{ stats.lesefortschritt }}%</div>
            <div class="stat-label">Lesefortschritt</div>
            <i class="ti ti-progress stat-icon"></i>
          </div>
        </div>

        <!-- Fortschrittsbalken -->
        <div class="progress-wrap" v-if="stats.total > 0">
          <div class="progress-label">
            <span>Lesefortschritt</span>
            <span>{{ stats.gelesen }} / {{ stats.total }}</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: stats.lesefortschritt + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Top Tags -->
      <div class="tags-section" v-if="topTags.length > 0">
        <h2><i class="ti ti-tags"></i> Meist verwendete Tags</h2>
        <div class="tags-list">
          <div v-for="item in topTags" :key="item.tag" class="tag-row">
            <span class="tag-name">{{ item.tag }}</span>
            <div class="tag-bar-wrap">
              <div
                class="tag-bar"
                :style="{ width: (item.count / topTags[0].count * 100) + '%' }"
              ></div>
            </div>
            <span class="tag-count">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <!-- Auth0 Account-Infos -->
      <div class="account-section">
        <h2><i class="ti ti-id-badge"></i> Account-Informationen</h2>
        <div class="account-grid">
          <div class="account-row">
            <span class="account-label">Name</span>
            <span class="account-value">{{ user?.name ?? '—' }}</span>
          </div>
          <div class="account-row">
            <span class="account-label">E-Mail</span>
            <span class="account-value">{{ user?.email ?? '—' }}</span>
          </div>
          <div class="account-row">
            <span class="account-label">Nickname</span>
            <span class="account-value">{{ user?.nickname ?? '—' }}</span>
          </div>
          <div class="account-row">
            <span class="account-label">E-Mail verifiziert</span>
            <span class="account-value">
              <span v-if="user?.email_verified" class="badge green">
                <i class="ti ti-check"></i> Verifiziert
              </span>
              <span v-else class="badge orange">
                <i class="ti ti-clock"></i> Ausstehend
              </span>
            </span>
          </div>
          <div class="account-row">
            <span class="account-label">Auth0 Sub</span>
            <span class="account-value mono">{{ user?.sub ?? '—' }}</span>
          </div>
        </div>
      </div>

      <!-- Abmelden -->
      <div class="logout-section">
        <button class="logout-btn" @click="logout">
          <i class="ti ti-logout"></i>
          Abmelden
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useAuth } from '../composables/useAuth'

const { user, userInitials, logout } = useAuth()
const bookmarks = inject('bookmarks', ref([]))
const avatarError = ref(false)

const stats = computed(() => {
  const all = bookmarks.value ?? []
  const gelesen   = all.filter(b => b.gelesen).length
  const total     = all.length
  return {
    total,
    favoriten:      all.filter(b => b.favorit).length,
    gelesen,
    ungelesen:      all.filter(b => !b.gelesen).length,
    tags:           new Set(all.flatMap(b => b.tags ?? [])).size,
    lesefortschritt: total > 0 ? Math.round((gelesen / total) * 100) : 0
  }
})

const topTags = computed(() => {
  const all = bookmarks.value ?? []
  const map = new Map()
  all.forEach(b => {
    (b.tags ?? []).forEach(tag => {
      map.set(tag, (map.get(tag) ?? 0) + 1)
    })
  })
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag, count]) => ({ tag, count }))
})
</script>

<style scoped>
.profile-section {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.profile-card {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── Header ── */
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--card);
  border: 0.5px solid var(--border);
  border-top: 4px solid var(--accent);
  border-radius: 14px;
  padding: 24px;
}

.avatar-wrap { position: relative; flex-shrink: 0; }

.avatar-img,
.avatar-initials {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
}
.avatar-initials {
  background: #1a6dbf;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}
.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 22px;
  height: 22px;
  background: #16a34a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--card);
}
.avatar-badge i { font-size: 11px; color: #fff; }

.profile-info { display: flex; flex-direction: column; gap: 5px; }
.profile-info h1 { font-size: 20px; font-weight: 700; color: var(--text); }
.profile-email {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
}
.profile-email i { font-size: 14px; }
.profile-provider {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  background: var(--tag-bg);
  color: var(--accent);
  border-radius: 99px;
  padding: 3px 10px;
  font-weight: 500;
  width: fit-content;
  margin-top: 2px;
}
.profile-provider i { font-size: 12px; }

/* ── Sections gemeinsam ── */
.stats-section,
.tags-section,
.account-section {
  background: var(--card);
  border: 0.5px solid var(--border);
  border-radius: 14px;
  padding: 20px;
}

.stats-section h2,
.tags-section h2,
.account-section h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 16px;
}
.stats-section h2 i,
.tags-section h2 i,
.account-section h2 i {
  font-size: 16px;
  color: var(--accent);
}

/* ── Stats Grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}

.stat-card {
  background: var(--bg);
  border: 0.5px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  position: relative;
  overflow: hidden;
}

.stat-number {
  font-size: 26px;
  font-weight: 800;
  color: var(--text);
  line-height: 1;
}
.stat-label {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}
.stat-icon {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 22px;
  opacity: 0.12;
  color: var(--text);
}

.stat-card.accent .stat-number { color: var(--accent); }
.stat-card.accent .stat-icon   { opacity: 0.2; color: var(--accent); }
.stat-card.green  .stat-number { color: #16a34a; }
.stat-card.green  .stat-icon   { opacity: 0.2; color: #16a34a; }
.stat-card.purple .stat-number { color: #7c3aed; }
.stat-card.purple .stat-icon   { opacity: 0.2; color: #7c3aed; }
.stat-card.orange .stat-number { color: #d97706; }
.stat-card.orange .stat-icon   { opacity: 0.2; color: #d97706; }

/* ── Fortschrittsbalken ── */
.progress-wrap { display: flex; flex-direction: column; gap: 6px; }
.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
}
.progress-bar {
  height: 6px;
  background: var(--tag-bg);
  border-radius: 99px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 99px;
  transition: width 0.6s ease;
}

/* ── Top Tags ── */
.tags-list { display: flex; flex-direction: column; gap: 10px; }
.tag-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.tag-name {
  font-size: 12px;
  color: var(--text);
  min-width: 90px;
  font-weight: 500;
}
.tag-bar-wrap {
  flex: 1;
  height: 6px;
  background: var(--tag-bg);
  border-radius: 99px;
  overflow: hidden;
}
.tag-bar {
  height: 100%;
  background: var(--accent);
  border-radius: 99px;
  transition: width 0.5s ease;
}
.tag-count {
  font-size: 11px;
  color: var(--muted);
  min-width: 20px;
  text-align: right;
}

/* ── Account-Info ── */
.account-grid { display: flex; flex-direction: column; gap: 0; }
.account-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 0.5px solid var(--border);
  gap: 12px;
}
.account-row:last-child { border-bottom: none; }
.account-label {
  font-size: 12px;
  color: var(--muted);
  font-weight: 500;
  min-width: 130px;
}
.account-value {
  font-size: 13px;
  color: var(--text);
  text-align: right;
}
.account-value.mono {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: var(--muted);
  word-break: break-all;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 99px;
  padding: 3px 9px;
}
.badge.green  { background: rgba(22,163,74,0.12);  color: #16a34a; }
.badge.orange { background: rgba(217,119,6,0.12);  color: #d97706; }
.badge i { font-size: 11px; }

/* ── Logout ── */
.logout-section { display: flex; justify-content: flex-end; }
.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid rgba(226,75,74,0.4);
  color: #E24B4A;
  border-radius: 8px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.logout-btn:hover { background: rgba(226,75,74,0.08); }
.logout-btn i { font-size: 15px; }
</style>
