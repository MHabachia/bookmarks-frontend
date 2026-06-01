<template>
  <section class="bookmark-section">
    <div class="section-header">
      <h2 v-if="!isTagsView">{{ filteredBookmarks.length }} Lesezeichen</h2>
      <h2 v-else>{{ tagGroups.length }} Tags · {{ bookmarks.length }} Lesezeichen</h2>
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

    <!-- Normal-Ansicht: flache Grid-Liste -->
    <div v-if="!loading && !isTagsView" class="bookmark-grid">
      <BookmarkItem
        v-for="bookmark in filteredBookmarks"
        :key="`${bookmark.id}-${bookmark.favorit ? 1 : 0}-${bookmark.gelesen ? 1 : 0}`"
        :bookmark="bookmark"
        @edit="openEdit"
        @delete="deleteBookmark"
        @toggle-favorit="toggleBookmark"
        @toggle-gelesen="toggleBookmark"
      />
    </div>

    <!-- Tag-Ansicht: nach Tag gruppiert -->
    <div v-if="!loading && isTagsView" class="tag-groups">
      <div
        v-for="group in tagGroups"
        :key="group.tag"
        class="tag-group"
      >
        <div class="tag-group-header">
          <i class="ti ti-tag"></i>
          <span class="tag-group-name">{{ group.tag }}</span>
          <span class="tag-group-count">{{ group.bookmarks.length }}</span>
        </div>
        <div class="bookmark-grid">
          <BookmarkItem
            v-for="bookmark in group.bookmarks"
            :key="`${bookmark.id}-${bookmark.favorit ? 1 : 0}-${bookmark.gelesen ? 1 : 0}`"
            :bookmark="bookmark"
            @edit="openEdit"
            @delete="deleteBookmark"
            @toggle-favorit="toggleBookmark"
            @toggle-gelesen="toggleBookmark"
          />
        </div>
      </div>

      <div v-if="tagGroups.length === 0" class="status">
        Keine Tags vorhanden.
      </div>
    </div>

    <p v-if="!loading && !isTagsView && filteredBookmarks.length === 0" class="status">
      Es sind keine Lesezeichen in dieser Ansicht vorhanden.
    </p>

    <!-- Bestätigungs-Dialog beim Löschen -->
    <div v-if="deleteConfirm.open" class="confirm-overlay" @click.self="deleteConfirm.open = false">
      <div class="confirm-dialog">
        <div class="confirm-icon">
          <i class="ti ti-trash"></i>
        </div>
        <h3>Bookmark löschen?</h3>
        <p>„{{ deleteConfirm.bookmark?.title }}" wird unwiderruflich gelöscht.</p>
        <div class="confirm-actions">
          <button class="confirm-cancel" @click="deleteConfirm.open = false">
            Abbrechen
          </button>
          <button class="confirm-delete" @click="confirmDelete">
            <i class="ti ti-trash"></i>
            Löschen
          </button>
        </div>
      </div>
    </div>

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

import { ref, reactive, inject, computed, onMounted } from 'vue'
import BookmarkItem from './BookmarkItem.vue'
import BookmarkModal from './BookmarkModal.vue'
const API_URL = import.meta.env.VITE_API_URL || ''
  
const bookmarks = inject('bookmarks')

const activeFilter = inject('activeFilter')
const showToast    = inject('showToast')

const isTagsView = computed(() => activeFilter.value === 'tags')

const loading = ref(true)
const error = ref(null)

const modalOpen = ref(false)


const deleteConfirm = reactive({ open: false, bookmark: null })


const editingBookmark = ref(null)

function openAdd() { editingBookmark.value = null; modalOpen.value = true }


function openEdit(b) { editingBookmark.value = b; modalOpen.value = true }

function closeModal() { modalOpen.value = false; editingBookmark.value = null }

async function saveBookmark(data) {
  try {
    if (editingBookmark.value) {
      // PUT — Bookmark aktualisieren
      const id = data.id ?? editingBookmark.value.id
      const response = await fetch(`${API_URL}/api/bookmarks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id })
      })
      if (!response.ok) throw new Error('Fehler beim Aktualisieren')
      const updated = await response.json()
      const idx = bookmarks.value.findIndex(b => b.id === updated.id)
      if (idx !== -1) bookmarks.value.splice(idx, 1, updated)
      showToast('Bookmark wurde aktualisiert ✏️')
    } else {
      // POST — neues Bookmark erstellen
      const response = await fetch(`${API_URL}/api/bookmarks/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Fehler beim Erstellen')
      const created = await response.json()
      bookmarks.value.push(created)
      showToast('Bookmark wurde hinzugefügt ✅')
    }
    closeModal()
  } catch (e) {
    console.error('saveBookmark Fehler:', e)
    showToast('Fehler beim Speichern', 'error')
  }
}

function deleteBookmark(b) {
  deleteConfirm.bookmark = b
  deleteConfirm.open     = true
}

async function confirmDelete() {
  const b = deleteConfirm.bookmark
  deleteConfirm.open = false
  try {
    const response = await fetch(`${API_URL}/api/bookmarks/${b.id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Fehler beim Löschen')
    bookmarks.value = bookmarks.value.filter(x => x.id !== b.id)
    showToast('Bookmark wurde gelöscht 🗑️', 'info')
  } catch (e) {
    console.error('confirmDelete Fehler:', e)
    showToast('Fehler beim Löschen', 'error')
  }
}

async function toggleBookmark(updated) {
  try {
    const original = bookmarks.value.find(b => b.id === updated.id)
    const favoritGeandert = original?.favorit !== updated.favorit
    const gelesenGeandert = original?.gelesen !== updated.gelesen

    const response = await fetch(`${API_URL}/api/bookmarks/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
    if (!response.ok) throw new Error('Fehler beim Aktualisieren')
    const result = await response.json()
    bookmarks.value = bookmarks.value.map(b => b.id === result.id ? result : b)

    if (favoritGeandert) {
      showToast(result.favorit ? '⭐ Als Favorit markiert' : '★ Aus Favoriten entfernt')
    } else if (gelesenGeandert) {
      showToast(result.gelesen ? '✓ Als gelesen markiert' : '○ Als ungelesen markiert')
    }
  } catch (e) {
    console.error('toggleBookmark Fehler:', e)
    showToast('Fehler beim Aktualisieren', 'error')
  }
}


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

  return all
})

const tagGroups = computed(() => {
  const all = bookmarks.value ?? []
  const map = new Map()

  all.forEach(bookmark => {
    const tags = bookmark.tags?.length ? bookmark.tags : ['Ohne Tag']
    tags.forEach(tag => {
      if (!map.has(tag)) map.set(tag, [])
      map.get(tag).push(bookmark)
    })
  })

  // Sortiert nach Tag-Name, "Ohne Tag" immer zuletzt
  return [...map.entries()]
    .sort(([a], [b]) => {
      if (a === 'Ohne Tag') return 1
      if (b === 'Ohne Tag') return -1
      return a.localeCompare(b)
    })
    .map(([tag, bookmarks]) => ({ tag, bookmarks }))
})

const mockData = [
  { id: 1, title: 'HTW Berlin',       url: 'https://www.htw-berlin.de',         description: 'Hochschule für Technik und Wirtschaft Berlin', tags: ['Studium', 'HTW']       },
  { id: 2, title: 'Facebook', url: 'https://facebook.com', description: 'Facebook Social media Plattform',         tags: ['Meta', 'Socialmedia']      },
  { id: 3, title: 'Reddit',      url: 'https://www.reddit.com',                 description: 'Reddit Forum Plattform',            tags: ['Forum', 'Socialmedia']      },
  { id: 4, title: 'Moodle HTW-Berlin',     url: 'https://moodle.htw-berlin.de',     description: 'Moodle Learning Plattform der HTW-Berlin',         tags: ['Studium', 'HTW'] }
]

onMounted(async () => {
  try {
    const response = await fetch(`${API_URL}/api/bookmarks`)
    if (!response.ok) throw new Error('HTTP Fehler: ' + response.status)
    bookmarks.value = await response.json()
  } catch {
    // Backend nicht erreichbar → Mock-Daten laden + Warnung anzeigen
    console.warn('Backend nicht erreichbar, lade Mock-Daten.')
    bookmarks.value = mockData
    error.value = 'Backend nicht erreichbar — Mock-Daten werden angezeigt.'
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
/* Bestätigungs-Dialog */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
}
.confirm-dialog {
  background: var(--card);
  border: 0.5px solid var(--border);
  border-radius: 16px;
  padding: 28px 28px 24px;
  width: 360px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}
.confirm-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(226,75,74,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.confirm-icon i { font-size: 24px; color: #E24B4A; }
.confirm-dialog h3 { font-size: 16px; font-weight: 700; color: var(--text); }
.confirm-dialog p  { font-size: 13px; color: var(--muted); line-height: 1.5; }
.confirm-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  width: 100%;
}
.confirm-cancel {
  flex: 1;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px;
  font-size: 13px;
  color: var(--muted);
  cursor: pointer;
  font-family: inherit;
}
.confirm-cancel:hover { background: var(--hover); }
.confirm-delete {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #E24B4A;
  border: none;
  border-radius: 8px;
  padding: 9px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
}
.confirm-delete:hover { opacity: 0.9; }
.confirm-delete i { font-size: 14px; }

/* Tag-Gruppen Ansicht */
.tag-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.tag-group {}
.tag-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.tag-group-header i {
  font-size: 16px;
  color: var(--accent);
}
.tag-group-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}
.tag-group-count {
  margin-left: 4px;
  background: var(--tag-bg);
  color: var(--accent);
  font-size: 11px;
  font-weight: 600;
  border-radius: 99px;
  padding: 2px 8px;
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
