<template>
  <section class="bookmark-section">
    <div class="section-header">
      <h2>{{ filteredBookmarks.length }} Lesezeichen</h2>
      <button class="add-btn" @click="openAdd">
        <i class="ti ti-plus"></i>
        Add Bookmark
      </button>
    </div>

    <p v-if="loading" class="status">
      <i class="ti ti-loader"></i> Lade Bookmarks...
    </p>

    <div v-else class="bookmark-grid">
      <BookmarkItem
        v-for="bookmark in filteredBookmarks"
        :key="bookmark.id"
        :bookmark="bookmark"
        @edit="openEdit"
        @delete="deleteBookmark"
      />
    </div>

    <p v-if="!loading && filteredBookmarks.length === 0" class="status">
      Keine Bookmarks in dieser Kategorie.
    </p>

    <BookmarkModal
      v-if="modalOpen"
      :bookmark="editingBookmark"
      :isEdit="!!editingBookmark"
      @close="closeModal"
      @save="saveBookmark"
    />
  </section>
</template>

<script setup>
/**
 * Hauptkomponente zur Anzeige der Bookmark-Liste.
 *
 * Verantwortlichkeiten:
 * - Lädt Bookmarks vom Backend (GET /api/bookmarks) beim Mounten
 * - Fällt bei nicht erreichbarem Backend auf Mock-Daten zurück
 * - Filtert Bookmarks je nach aktivem Filter aus AppSidebar
 * - Verwaltet den Modal-Zustand für Add- und Edit-Aktionen
 * - Delegiert Hinzufügen, Bearbeiten und Löschen lokal
 *
 *
 * Datenfluss:
 * - bookmarks und activeFilter per inject() von App.vue
 * - BookmarkItem emittiert 'edit' und 'delete'
 * - BookmarkModal emittiert 'save' und 'close'
 */
import { ref, inject, computed, onMounted } from 'vue'
import BookmarkItem from './BookmarkItem.vue'
import BookmarkModal from './BookmarkModal.vue'

/**
 * Gemeinsame Bookmark-Liste aus App.vue.
 * Nach dem Laden wird sie hier befüllt — Sidebar-Badges
 * aktualisieren sich dadurch automatisch.
 * @type {import('vue').Ref<Array>}
 */
const bookmarks = inject('bookmarks')

/**
 * Aktuell aktiver Filter aus App.vue.
 * @type {import('vue').Ref<string>}
 */
const activeFilter = inject('activeFilter')

/** Gibt an ob der API-Call noch läuft. @type {import('vue').Ref<boolean>} */
const loading = ref(true)

/** Gibt an ob das Modal sichtbar ist. @type {import('vue').Ref<boolean>} */
const modalOpen = ref(false)

/**
 * Das Bookmark das gerade bearbeitet wird.
 * null = Add-Modus, Objekt = Edit-Modus.
 * @type {import('vue').Ref<Object|null>}
 */
const editingBookmark = ref(null)

/**
 * Öffnet das Modal im Add-Modus (kein Bookmark vorausgewählt).
 */
function openAdd() { editingBookmark.value = null; modalOpen.value = true }

/**
 * Öffnet das Modal im Edit-Modus mit dem gewählten Bookmark.
 * @param {Object} b - Das zu bearbeitende Bookmark-Objekt
 */
function openEdit(b) { editingBookmark.value = b; modalOpen.value = true }

/**
 * Schließt das Modal und setzt den Edit-Zustand zurück.
 */
function closeModal() { modalOpen.value = false; editingBookmark.value = null }

/**
 * Speichert ein neues oder bearbeitetes Bookmark lokal.
 *
 * Im Edit-Modus: ersetzt das bestehende Bookmark in der Liste.
 * Im Add-Modus: fügt ein neues Bookmark mit temporärer ID hinzu.
 * Ab M4 werden hier POST/PUT API-Calls eingebaut.
 *
 * @param {Object} data - Die Formulardaten aus BookmarkModal
 */
function saveBookmark(data) {
  if (editingBookmark.value) {
    const idx = bookmarks.value.findIndex(b => b.id === data.id)
    if (idx !== -1) bookmarks.value[idx] = data
  } else {
    bookmarks.value.push({ ...data, id: Date.now() })
  }
  closeModal()
}

/**
 * Löscht ein Bookmark aus der lokalen Liste.
 * Ab M4 wird hier ein DELETE API-Call eingebaut.
 *
 * @param {Object} b - Das zu löschende Bookmark-Objekt
 */
function deleteBookmark(b) {
  bookmarks.value = bookmarks.value.filter(x => x.id !== b.id)
}

/**
 * Gefilterte Bookmark-Liste basierend auf dem aktiven Filter.
 *
 * Wird automatisch neu berechnet wenn sich bookmarks
 * oder activeFilter ändert.
 *
 * @type {import('vue').ComputedRef<Array>}
 */
const filteredBookmarks = computed(() => {
  const all = bookmarks.value ?? []
  switch (activeFilter.value) {
    case 'ungelesen': return all.filter(b => !b.gelesen)
    case 'favoriten': return all.filter(b => b.favorit)
    case 'gelesen':   return all.filter(b => b.gelesen)
    case 'tags':      return all
    default:          return all
  }
})

/**
 * Beispieldaten für den Fall dass das Backend nicht erreichbar ist.
 * Ermöglicht Frontend-Entwicklung ohne laufendes Backend.
 * @type {Array<{id: number, title: string, url: string, description: string, tags: string[]}>}
 */
const mockData = [
  { id: 1, title: 'HTW Berlin',       url: 'https://www.htw-berlin.de',         description: 'Hochschule für Technik und Wirtschaft Berlin', tags: ['Studium']  },
  { id: 2, title: 'Spring Boot Docs', url: 'https://docs.spring.io/spring-boot', description: 'Offizielle Spring Boot Dokumentation',         tags: ['Backend']  },
  { id: 3, title: 'Vue.js Docs',      url: 'https://vuejs.org',                 description: 'Offizielle Vue.js 3 Dokumentation',            tags: ['Frontend'] },
  { id: 4, title: 'MDN Web Docs',     url: 'https://developer.mozilla.org',     description: 'Web-Entwicklungs-Referenz von Mozilla',         tags: ['Referenz'] }
]

/**
 * Lädt Bookmarks vom Backend beim Mounten der Komponente.
 *
 * Vite's Proxy leitet /api/bookmarks an localhost:8080 weiter.
 * Bei einem Fehler (Backend nicht erreichbar) werden mockData geladen.
 */
onMounted(async () => {
  try {
    const response = await fetch('/api/bookmarks')
    if (!response.ok) throw new Error('HTTP Fehler: ' + response.status)
    bookmarks.value = await response.json()
  } catch {
    console.warn('Backend nicht erreichbar, lade Mock-Daten.')
    bookmarks.value = mockData
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.bookmark-section {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-header h2 {
  font-size: 18px;
  font-weight: 500;
  color: var(--text);
}
.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--btn);
  color: var(--btn-text);
  border: none;
  border-radius: 8px;
  padding: 7px 13px;
  font-size: 13px;
  font-weight: 600;
}
.add-btn i { font-size: 14px; }
.add-btn:hover { opacity: 0.9; }
.bookmark-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 1rem;
  color: var(--muted);
  font-size: 14px;
}
</style>
