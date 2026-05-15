<template>
  <section class="bookmark-section">

    <div class="section-header">
      <h2>{{ filteredBookmarks.length }} Lesezeichen</h2>
      <!-- Add-Button öffnet das Modal im Add-Modus -->
      <button class="add-btn" @click="openAdd">
        <i class="ti ti-plus"></i>
        Add Bookmark
      </button>
    </div>

    <p v-if="loading" class="status">
      <i class="ti ti-loader"></i> Lade Bookmarks...
    </p>
    <p v-else-if="error" class="status error">
      <i class="ti ti-alert-circle"></i> Fehler: {{ error }}
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

    <p v-if="!loading && !error && filteredBookmarks.length === 0" class="status">
      Keine Bookmarks in dieser Kategorie.
    </p>

    <!-- Modal — wird für Add und Edit verwendet -->
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
 * BookmarkList.vue — Änderungen:
 *
 * 1. modalOpen: steuert ob das Modal sichtbar ist
 * 2. editingBookmark: null = Add-Modus, Objekt = Edit-Modus
 * 3. openAdd(): öffnet Modal im Add-Modus
 * 4. openEdit(b): öffnet Modal im Edit-Modus mit dem gewählten Bookmark
 * 5. saveBookmark(data): fügt hinzu oder aktualisiert lokal
 *    (für M4 wird hier der POST/PUT API-Call eingebaut)
 * 6. deleteBookmark(b): entfernt das Bookmark lokal aus der Liste
 *    (für M4 wird hier der DELETE API-Call eingebaut)
 */
import { ref, inject, computed, onMounted } from 'vue'
import BookmarkItem from './BookmarkItem.vue'
import BookmarkModal from './BookmarkModal.vue'

const bookmarks   = inject('bookmarks')
const activeFilter = inject('activeFilter')

const loading = ref(true)
const error   = ref(null)

// Modal-Zustand
const modalOpen       = ref(false)
const editingBookmark = ref(null)

function openAdd()    { editingBookmark.value = null; modalOpen.value = true }
function openEdit(b)  { editingBookmark.value = b;    modalOpen.value = true }
function closeModal() { modalOpen.value = false; editingBookmark.value = null }

function saveBookmark(data) {
  if (editingBookmark.value) {
    // Edit: bestehendes Bookmark ersetzen
    const idx = bookmarks.value.findIndex(b => b.id === data.id)
    if (idx !== -1) bookmarks.value[idx] = data
  } else {
    // Add: neues Bookmark mit temporärer ID hinzufügen
    bookmarks.value.push({ ...data, id: Date.now() })
  }
  closeModal()
}

function deleteBookmark(b) {
  bookmarks.value = bookmarks.value.filter(x => x.id !== b.id)
}

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

onMounted(async () => {
  try {
    const response = await fetch('/api/bookmarks')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    bookmarks.value = await response.json()
  } catch (e) {
    error.value = e.message
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
.status.error {
  color: #E24B4A;
  background: rgba(226, 75, 74, 0.08);
  border-radius: 8px;
}
</style>
