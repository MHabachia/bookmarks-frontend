<template>
  <div id="app-layout">
    <AppSidebar @set-filter="activeFilter = $event" />
    <div class="main-area">
      <!--
        AppTopbar umschließt jetzt den Seiteninhalt per <slot>
        so dass der Footer immer unterhalb des Inhalts sitzt,
        unabhängig davon wie viel Inhalt auf der Seite ist
      -->
      <AppTopbar @toggle-dark="toggleDark" :isDark="isDark">
        <RouterView />
      </AppTopbar>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'

const isDark = ref(false)
function toggleDark() {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark', isDark.value)
}
provide('isDark', isDark)

const bookmarks = ref([])
provide('bookmarks', bookmarks)

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
