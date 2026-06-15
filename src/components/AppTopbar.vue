<template>
  <div class="topbar-and-content">

    <header class="topbar">
      <h1 class="topbar-title">{{ filterTitle }}</h1>

      <div class="topbar-right">
        <button class="toggle-btn" @click="$emit('toggle-dark')">
          <i :class="isDark ? 'ti ti-sun' : 'ti ti-moon'"></i>
          {{ isDark ? 'Light mode' : 'Dark mode' }}
        </button>

        <!-- Profil-Dropdown -->
        <div class="profile-wrap" ref="profileWrap">
          <button class="profile-btn" @click="toggleDropdown" :title="user?.name ?? 'Profil'">
            <img
              v-if="user?.picture && !avatarError"
              :src="user.picture"
              :alt="user.name"
              class="profile-avatar-img"
              @error="avatarError = true"
            />
            <span v-else>{{ userInitials }}</span>
          </button>

          <div class="dropdown" :class="{ open: dropdownOpen }">

            <!-- User-Info Header -->
            <div class="dropdown-header">
              <div class="dropdown-avatar">
                <img
                  v-if="user?.picture && !avatarError"
                  :src="user.picture"
                  :alt="user.name"
                  class="dropdown-avatar-img"
                  @error="avatarError = true"
                />
                <span v-else>{{ userInitials }}</span>
              </div>
              <div class="dropdown-user-info">
                <p class="dropdown-name">{{ user?.name ?? user?.nickname ?? 'Benutzer' }}</p>
                <span class="dropdown-email">{{ user?.email }}</span>
              </div>
            </div>

            <!-- Schnellübersicht Statistiken -->
            <div class="dropdown-stats">
              <div class="dropdown-stat">
                <span class="stat-num">{{ stats.total }}</span>
                <span class="stat-lbl">Gesamt</span>
              </div>
              <div class="dropdown-stat">
                <span class="stat-num">{{ stats.favoriten }}</span>
                <span class="stat-lbl">Favoriten</span>
              </div>
              <div class="dropdown-stat">
                <span class="stat-num">{{ stats.gelesen }}</span>
                <span class="stat-lbl">Gelesen</span>
              </div>
            </div>

            <div class="dropdown-divider"></div>

            <!-- Mein Profil — navigiert zu /profile -->
            <RouterLink
              to="/profile"
              class="dropdown-item"
              @click="dropdownOpen = false"
            >
              <i class="ti ti-user"></i>
              Mein Profil
            </RouterLink>

            <div class="dropdown-divider"></div>

            <!-- Abmelden -->
            <button class="dropdown-item danger" @click="logout">
              <i class="ti ti-logout"></i>
              Abmelden
            </button>

          </div>
        </div>
      </div>
    </header>

    <slot />

    <footer class="page-footer">
      © BookmarkIt · WebTechnologie Projekt SoSe2026 · HTW Berlin
    </footer>

  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'

defineProps({ isDark: Boolean })
defineEmits(['toggle-dark'])

const { user, userInitials, logout } = useAuth()
const avatarError  = ref(false)
const dropdownOpen = ref(false)
const profileWrap  = ref(null)

const activeFilter = inject('activeFilter', ref('alle'))
const bookmarks    = inject('bookmarks', ref([]))

// Titel je nach aktivem Filter
const filterTitle = computed(() => ({
  alle:      'Alle Lesezeichen',
  ungelesen: 'Ungelesen',
  favoriten: 'Favoriten',
  gelesen:   'Gelesen',
  tags:      'Tag / Kategorie'
}[activeFilter.value] ?? 'Alle Lesezeichen'))

// Mini-Statistiken für das Dropdown
const stats = computed(() => {
  const all = bookmarks.value ?? []
  return {
    total:    all.length,
    favoriten: all.filter(b => b.favorit).length,
    gelesen:   all.filter(b => b.gelesen).length,
  }
})

function toggleDropdown() { dropdownOpen.value = !dropdownOpen.value }

function handleOutsideClick(e) {
  if (profileWrap.value && !profileWrap.value.contains(e.target))
    dropdownOpen.value = false
}
onMounted(()   => document.addEventListener('click', handleOutsideClick))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>

<style scoped>
.topbar-and-content {
  display: flex; flex-direction: column; flex: 1; height: 100vh; overflow: hidden;
}
.topbar {
  background: var(--topbar); border-bottom: 0.5px solid var(--border);
  padding: 12px 24px; display: flex; align-items: center; justify-content: space-between;
  transition: background 0.2s; position: relative; z-index: 20; flex-shrink: 0;
}
.topbar-title { font-size: 20px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; }
.topbar-right { display: flex; align-items: center; gap: 10px; }

.toggle-btn {
  display: flex; align-items: center; gap: 6px;
  background: var(--tag-bg); border: 0.5px solid var(--border);
  border-radius: 99px; padding: 5px 12px; font-size: 12px; color: var(--muted); cursor: pointer;
}
.toggle-btn i { font-size: 14px; }
.toggle-btn:hover { opacity: 0.8; }

/* ── Profil-Button ── */
.profile-wrap { position: relative; }
.profile-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: #1a6dbf; border: 2px solid #5ba3e8;
  color: #fff; font-size: 12px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: border-color 0.15s; overflow: hidden; padding: 0;
}
.profile-btn:hover { border-color: #a8c8f0; }
.profile-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

/* ── Dropdown ── */
.dropdown {
  position: absolute; top: calc(100% + 10px); right: 0; width: 240px;
  background: var(--dropdown); border: 0.5px solid var(--border);
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.16); display: none; z-index: 100;
}
.dropdown.open { display: block; }

/* Header */
.dropdown-header {
  padding: 14px; border-bottom: 0.5px solid var(--border);
  display: flex; align-items: center; gap: 10px;
}
.dropdown-avatar {
  width: 36px; height: 36px; border-radius: 50%; background: #1a6dbf;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; overflow: hidden;
}
.dropdown-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.dropdown-user-info  { min-width: 0; }
.dropdown-name  { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dropdown-email { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }

/* Mini-Stats */
.dropdown-stats {
  display: flex; justify-content: space-around;
  padding: 10px 14px; background: var(--bg);
  border-bottom: 0.5px solid var(--border);
}
.dropdown-stat { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.stat-num { font-size: 16px; font-weight: 800; color: var(--accent); }
.stat-lbl { font-size: 10px; color: var(--muted); }

/* Items */
.dropdown-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 14px;
  font-size: 13px; color: var(--text); background: none; border: none;
  width: 100%; text-align: left; cursor: pointer; transition: background 0.12s;
  text-decoration: none; font-family: inherit;
}
.dropdown-item:hover { background: var(--hover); }
.dropdown-item i { font-size: 15px; color: var(--muted); }
.dropdown-divider { height: 0.5px; background: var(--border); }
.dropdown-item.danger { color: #E24B4A; }
.dropdown-item.danger i { color: #E24B4A; }
.dropdown-item.danger:hover { background: rgba(226,75,74,0.08); }

.page-footer {
  padding: 16px 24px; border-top: 1px solid var(--border); text-align: center;
  font-size: 13px; font-weight: 500; color: var(--muted); background: var(--topbar);
  transition: background 0.2s; flex-shrink: 0;
}
</style>
