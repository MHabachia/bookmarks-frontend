<template>
  <!-- Ladescreen während Auth0 den Status prüft -->
  <div v-if="isLoading" class="auth-loading">
    <i class="ti ti-bookmark"></i>
    <p>BookmarkIt wird geladen…</p>
  </div>

  <!-- Login-Screen wenn nicht eingeloggt -->
  <div v-else-if="!isAuthenticated" class="auth-gate">
    <div class="auth-card">
      <div class="auth-logo">
        <i class="ti ti-bookmark"></i>
        <span>BookmarkIt</span>
      </div>
      <h1>Willkommen zurück</h1>
      <p>Melde dich an um deine Lesezeichen zu verwalten.</p>
      <button class="auth-btn" @click="login">
        <i class="ti ti-login"></i>
        Mit Auth0 anmelden
      </button>
      <div class="auth-footer">
        WebTechnologien · Team 40 · HTW Berlin SoSe 2026
      </div>
    </div>
  </div>

  <!-- Haupt-App wenn eingeloggt -->
  <div v-else id="app-layout">
    <AppSidebar @set-filter="activeFilter = $event" />
    <div class="main-area">
      <AppTopbar @toggle-dark="toggleDark" :isDark="isDark">
        <RouterView />
      </AppTopbar>
    </div>
  </div>

  <!-- Globale Toast-Benachrichtigung -->
  <ToastNotification
    :message="toast.message"
    :type="toast.type"
    :visible="toast.visible"
  />
</template>

<script setup>
import { ref, provide, reactive } from 'vue'
import { RouterView } from 'vue-router'
import { useAuth } from './composables/useAuth'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import ToastNotification from './components/ToastNotification.vue'

const { isLoading, isAuthenticated, login } = useAuth()

// ── Dark Mode ──────────────────────────────────────────────
const isDark = ref(false)
function toggleDark() {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark', isDark.value)
}
provide('isDark', isDark)

// ── Toast ──────────────────────────────────────────────────
const toast = reactive({ message: '', type: 'success', visible: false })
let toastTimer = null
function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.message = message
  toast.type    = type
  toast.visible = true
  toastTimer = setTimeout(() => { toast.visible = false }, 3000)
}
provide('showToast', showToast)

// ── Bookmarks ──────────────────────────────────────────────
const bookmarks = ref([])
provide('bookmarks', bookmarks)

// ── Aktiver Filter ─────────────────────────────────────────
const activeFilter = ref('alle')
provide('activeFilter', activeFilter)
</script>

<style scoped>
/* ── Login / Loading Gate ── */
.auth-loading {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--bg);
  color: var(--muted);
}
.auth-loading i {
  font-size: 40px;
  color: var(--accent);
  animation: pulse 1.4s ease-in-out infinite;
}
.auth-loading p { font-size: 14px; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.auth-gate {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  position: fixed;
  top: 0;
  left: 0;
}

.auth-card {
  background: var(--card);
  border: 0.5px solid var(--border);
  border-radius: 20px;
  padding: 48px 40px 36px;
  width: 380px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  text-align: center;
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.auth-logo i    { font-size: 28px; color: var(--accent); }
.auth-logo span { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.3px; }

.auth-card h1 { font-size: 18px; font-weight: 700; color: var(--text); }
.auth-card p  { font-size: 14px; color: var(--muted); line-height: 1.6; }

.auth-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--btn);
  color: var(--btn-text);
  border: none;
  border-radius: 10px;
  padding: 11px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  margin-top: 8px;
  transition: opacity 0.15s;
}
.auth-btn:hover { opacity: 0.88; }
.auth-btn i { font-size: 16px; }

.auth-footer {
  font-size: 11px;
  color: var(--muted);
  opacity: 0.6;
  margin-top: 4px;
}

/* ── App Layout ── */
#app-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
  transition: background 0.2s;
}
</style>
