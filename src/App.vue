<template>
  <div id="app-layout">
    <AppSidebar @set-filter="activeFilter = $event" />
    <div class="main-area">
      <AppTopbar @toggle-dark="toggleDark" :isDark="isDark">
        <RouterView />
      </AppTopbar>
    </div>
  </div>
</template>

<script setup>
/**
 * Wurzel-Komponente der BookmarkIt-Anwendung.
 *
 * App.vue ist die oberste Komponente und erfüllt zwei Aufgaben:
 *
 * 1. LAYOUT — definiert das Zweispalten-Layout:
 *    - Linke Spalte: AppSidebar (Navigation)
 *    - Rechte Spalte: AppTopbar + RouterView (Seiteninhalt)
 *
 * 2. GLOBALER ZUSTAND — verwaltet drei reaktive Variablen
 *    und stellt sie per provide() allen Kindkomponenten bereit:
 *    - isDark     → Dark-Mode-Status
 *    - bookmarks  → Liste aller Bookmarks (von BookmarkList befüllt)
 *    - activeFilter → aktuell gewählter Sidebar-Filter
 *
 * Kommunikation:
 * - AppSidebar emittiert 'set-filter' → App setzt activeFilter
 * - AppTopbar emittiert 'toggle-dark' → App ruft toggleDark() auf

 */
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'

/**
 * Reaktiver Dark-Mode-Status.
 * true = Dark Mode aktiv, false = Light Mode aktiv.
 * @type {import('vue').Ref<boolean>}
 */
const isDark = ref(false)

/**
 * Schaltet den Dark Mode um.
 *
 * Toggelt isDark und setzt/entfernt die CSS-Klasse 'dark'
 * auf document.body. Die CSS-Variablen in main.css reagieren
 * automatisch auf body.dark und wechseln alle Farben.
 */
function toggleDark() {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark', isDark.value)
}
provide('isDark', isDark)

/**
 * Zentrale Bookmark-Liste — wird von BookmarkList befüllt.
 *
 * Wird per provide() geteilt, damit AppSidebar die Anzahl
 * pro Kategorie in den Badges anzeigen kann, ohne einen
 * eigenen API-Call zu machen.
 *
 * @type {import('vue').Ref<Array<{id: number, title: string, url: string, description: string, tags: string[]}>>}
 */
const bookmarks = ref([])
provide('bookmarks', bookmarks)

/**
 * Aktuell aktiver Filter für die Bookmark-Ansicht.
 *
 * Mögliche Werte: 'alle' | 'ungelesen' | 'favoriten' | 'gelesen' | 'tags'
 * Wird von AppSidebar gesetzt und von BookmarkList ausgewertet.
 *
 * @type {import('vue').Ref<string>}
 */
const activeFilter = ref('alle')
provide('activeFilter', activeFilter)
</script>

<style scoped>
#app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--bg);
  transition: background 0.2s;
}
</style>
