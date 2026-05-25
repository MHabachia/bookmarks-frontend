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

    <p v-if="error" class="status warning">
      <i class="ti ti-alert-triangle"></i> {{ error }}
    </p>

    <div v-if="!loading" class="bookmark-grid">
      <BookmarkItem
        v-for="bookmark in filteredBookmarks"
        :key="bookmark.id"
        :bookmark="bookmark"
        @edit="openEdit"
        @delete="deleteBookmark"
        @toggle-favorit="toggleBookmark"
        @toggle-gelesen="toggleBookmark"
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
 * @fileoverview Hauptkomponente zur Anzeige der Bookmark-Liste.
 *
 * Verantwortlichkeiten:
 * - Lädt Bookmarks vom Backend (GET /api/bookmarks) beim Mounten
 * - Fällt bei nicht erreichbarem Backend auf Mock-Daten zurück
 * - Filtert Bookmarks je nach aktivem Filter aus AppSidebar
 * - Verwaltet den Modal-Zustand für Add- und Edit-Aktionen
 *
 * Datenfluss:
 * - bookmarks und activeFilter per inject() von App.vue
 * - BookmarkItem emittiert 'edit' und 'delete'
 * - BookmarkModal emittiert 'save' und 'close'
 *
 * @component BookmarkList
 * @author Mohamad Habachia, Ibrahim Hassan
 * @version 1.3
 * @since SoSe 2026
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
const searchQuery  = inject('searchQuery')

/** Gibt an ob der API-Call noch läuft. @type {import('vue').Ref<boolean>} */
const loading = ref(true)
const error = ref(null)

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
 *
 * @param {Object} b - Das zu löschende Bookmark-Objekt
 */
function deleteBookmark(b) {
  bookmarks.value = bookmarks.value.filter(x => x.id !== b.id)
}

/**
 * Aktualisiert ein Bookmark in der Liste (für Favorit/Gelesen Toggle).
 * @param {Object} updated - Das aktualisierte Bookmark-Objekt
 */
function toggleBookmark(updated) {
  const idx = bookmarks.value.findIndex(b => b.id === updated.id)
  if (idx !== -1) bookmarks.value[idx] = updated
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
  let all = bookmarks.value ?? []

  // Filter nach Kategorie
  switch (activeFilter.value) {
    case 'ungelesen': all = all.filter(b => !b.gelesen); break
    case 'favoriten': all = all.filter(b => b.favorit);  break
    case 'gelesen':   all = all.filter(b => b.gelesen);  break
    case 'tags':                                          break
    default:                                              break
  }

  // Filter nach Suchbegriff (Titel, URL, Beschreibung)
  const q = searchQuery?.value?.toLowerCase().trim()
  if (q) {
    all = all.filter(b =>
      b.title?.toLowerCase().includes(q) ||
      b.url?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.tags?.some(t => t.toLowerCase().includes(q))
    )
  }

  return all
})

/**
 * Beispieldaten für den Fall dass das Backend nicht erreichbar ist.
 * Ermöglicht Frontend-Entwicklung ohne laufendes Backend.
 * @type {Array<{id: number, title: string, url: string, description: string, tags: string[]}>}
 */
const mockData = [
  { id: 1, title: 'HTW Berlin',       url: 'https://www.htw-berlin.de',         description: 'Hochschule für Technik und Wirtschaft Berlin', tags: ['Studium', 'HTW']       },
  { id: 2, title: 'Youtube DE', url: 'https://www.youtube.de', description: 'Deutschland Youtube Streaming Platform',         tags: ['media', 'stream']      },
  { id: 3, title: 'Vue.js Docs',      url: 'https://vuejs.org',                 description: 'Offizielle Vue.js 3 Dokumentation',            tags: ['Frontend', 'Vue']      },
  { id: 4, title: 'Facebook DE',     url: 'https://wwww.facebook.de',     description: 'Meta Facebook ',         tags: ['Socialmedia'] }
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
    // Backend nicht erreichbar → Mock-Daten laden + Warnung anzeigen
    console.warn('Backend nicht erreichbar, lade Mock-Daten.')
    bookmarks.value = mockData
    error.value = 'Backend nicht erreichbar — Beispieldaten werden angezeigt.'
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
  grid-template-columns: repeat(5, 1fr);
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
.status.warning {
  color: #b45309;
  background: rgba(251, 191, 36, 0.1);
  border-radius: 8px;
  margin-bottom: 12px;
}
</style>
