<template>
  <div id="app-layout">
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
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import ToastNotification from './components/ToastNotification.vue'

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
/** @type {import('vue').Ref<Array>} */
const bookmarks = ref([])
provide('bookmarks', bookmarks)

// ── Aktiver Filter ─────────────────────────────────────────
/** @type {import('vue').Ref<string>} */
const activeFilter = ref('alle')
provide('activeFilter', activeFilter)
</script>

<style scoped>
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
