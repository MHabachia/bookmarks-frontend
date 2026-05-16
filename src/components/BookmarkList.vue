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
import { ref, inject, computed, onMounted } from 'vue'
import BookmarkItem from './BookmarkItem.vue'
import BookmarkModal from './BookmarkModal.vue'

const bookmarks    = inject('bookmarks')
const activeFilter = inject('activeFilter')

const loading = ref(true)

// Modal-Zustand
const modalOpen       = ref(false)
const editingBookmark = ref(null)

function openAdd()    { editingBookmark.value = null; modalOpen.value = true }
function openEdit(b)  { editingBookmark.value = b;    modalOpen.value = true }
function closeModal() { modalOpen.value = false; editingBookmark.value = null }

function saveBookmark(data) {
  if (editingBookmark.value) {
    const idx = bookmarks.value.findIndex(b => b.id === data.id)
    if (idx !== -1) bookmarks.value[idx] = data
  } else {
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

// Mock-Daten wenn Backend nicht läuft
const mockData = [
  { id: 1, title: 'HTW Berlin',       url: 'https://www.htw-berlin.de',        description: 'Hochschule für Technik und Wirtschaft Berlin', tags: ['Studium']  },
  { id: 2, title: 'Spring Boot Docs', url: 'https://docs.spring.io/spring-boot', description: 'Offizielle Spring Boot Dokumentation',       tags: ['Backend']  },
  { id: 3, title: 'Vue.js Docs',      url: 'https://vuejs.org',                description: 'Offizielle Vue.js 3 Dokumentation',           tags: ['Frontend'] }
]

onMounted(async () => {
  try {
    const response = await fetch('/api/bookmarks')
    if (!response.ok) throw new Error('HTTP Fehler: ' + response.status)
    bookmarks.value = await response.json()
  } catch {
    // Backend nicht erreichbar → Mock-Daten laden
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
