<template>
  <!-- Ladescreen während Auth0 den Login-Status prüft -->
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
/**
 * @component App
 * @description Wurzelkomponente der BookmarkIt-Anwendung.
 *
 * Verantwortlichkeiten:
 * - Auth0 Login-Gate: zeigt Ladescreen → Login-Card → App je nach Auth-Status
 * - Globaler Zustand via Vue `provide()` für alle Kind-Komponenten
 * - Dark/Light Mode Toggle mit CSS-Klasse auf `document.body`
 * - Zentrales Toast-Benachrichtigungssystem mit Auto-Dismiss nach 3 Sekunden
 *
 * Globaler Zustand (via provide/inject):
 * - `bookmarks`    → zentrale Bookmark-Liste (Ref<Array>)
 * - `activeFilter` → aktiver Sidebar-Filter (Ref<string>)
 * - `isDark`       → Dark-Mode-Status (Ref<boolean>)
 * - `showToast`    → Funktion zum Anzeigen von Toast-Meldungen
 *
 * @author Mohamad Habachia, Ibrahim Hassan
 * @version 2.0
 */

import { ref, provide, reactive } from 'vue'
import { RouterView } from 'vue-router'
import { useAuth } from './composables/useAuth'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import ToastNotification from './components/ToastNotification.vue'

const { isLoading, isAuthenticated, login } = useAuth()

// ── Dark Mode ──────────────────────────────────────────────────────────────

/** Reaktiver Dark-Mode-Status. Wird an AppTopbar übergeben und global bereitgestellt. */
const isDark = ref(false)

/**
 * Schaltet zwischen Dark und Light Mode um.
 * Setzt/entfernt die CSS-Klasse `dark` auf `document.body`,
 * die in main.css alle CSS-Variablen überschreibt.
 */
function toggleDark() {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark', isDark.value)
}

provide('isDark', isDark)

// ── Toast-Benachrichtigungen ───────────────────────────────────────────────

/**
 * Reaktiver Toast-Zustand.
 * @property message - Anzuzeigende Nachricht
 * @property type    - Toast-Typ: 'success' | 'error' | 'info'
 * @property visible - Sichtbarkeit des Toasts
 */
const toast = reactive({ message: '', type: 'success', visible: false })

/** Timer-Handle für das automatische Ausblenden des Toasts */
let toastTimer = null

/**
 * Zeigt eine Toast-Benachrichtigung für 3 Sekunden an.
 * Laufende Toasts werden sofort ersetzt (Timer zurückgesetzt).
 *
 * @param {string} message - Anzuzeigende Nachricht
 * @param {string} [type='success'] - Toast-Typ: 'success', 'error' oder 'info'
 *
 * @example
 * showToast('Bookmark wurde gespeichert ✅')
 * showToast('Fehler beim Laden', 'error')
 */
function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.message = message
  toast.type    = type
  toast.visible = true
  toastTimer = setTimeout(() => { toast.visible = false }, 3000)
}

provide('showToast', showToast)

// ── Globale Bookmark-Liste ─────────────────────────────────────────────────

/**
 * Zentrale Bookmark-Liste für die gesamte Anwendung.
 * Wird von BookmarkList.vue beim Mount via API geladen und danach
 * bei jeder CRUD-Operation aktuell gehalten (kein komplettes Neuladen).
 */
const bookmarks = ref([])
provide('bookmarks', bookmarks)

// ── Aktiver Filter ─────────────────────────────────────────────────────────

/**
 * Aktiver Sidebar-Filter.
 * Mögliche Werte: 'alle' | 'ungelesen' | 'favoriten' | 'gelesen' | 'tags'
 * Standard: 'alle'
 */
const activeFilter = ref('alle')
provide('activeFilter', activeFilter)
</script>

<style scoped>
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
