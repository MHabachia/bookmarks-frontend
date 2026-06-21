<template>
  <article class="card">
    <div class="card-body">
      <div class="card-top">
        <div class="card-title-row">
          <img
            class="favicon"
            :src="`https://www.google.com/s2/favicons?domain=${domain}&sz=32`"
            :alt="bookmark.title"
            @error="onFaviconError"
            ref="faviconImg"
          />
          <div class="favicon-fallback" ref="faviconFallback" style="display:none;">
            <i class="ti ti-world"></i>
          </div>
          <span class="card-title">{{ bookmark.title }}</span>
        </div>

        <div class="card-actions">
          <button
            class="action-btn"
            :class="{ active: isFavorit }"
            @click="toggleFavorit"
            :title="isFavorit ? 'Aus Favoriten entfernen' : 'Als Favorit markieren'"
          >
            <i :class="isFavorit ? 'ti ti-star-filled' : 'ti ti-star'"></i>
          </button>

          <button
            class="action-btn"
            :class="{ active: isGelesen }"
            @click="toggleGelesen"
            :title="isGelesen ? 'Als ungelesen markieren' : 'Als gelesen markieren'"
          >
            <i :class="isGelesen ? 'ti ti-circle-check-filled' : 'ti ti-circle-check'"></i>
          </button>

          <div class="menu-wrap" ref="menuWrap">
            <button class="action-btn" @click="toggleMenu">
              <i class="ti ti-dots-vertical"></i>
            </button>
            <div class="card-dropdown" :class="{ open: menuOpen }">
              <button class="card-dropdown-item" @click="onEdit">
                <i class="ti ti-edit"></i>
                Bearbeiten
              </button>
              <button class="card-dropdown-item danger" @click="onDelete">
                <i class="ti ti-trash"></i>
                Löschen
              </button>
            </div>
          </div>
        </div>
      </div>

      <a :href="bookmark.url" target="_blank" rel="noopener noreferrer" class="card-url">
        <i class="ti ti-external-link"></i>
        {{ domain }}
      </a>

      <p class="card-desc">{{ bookmark.description }}</p>

      <div class="card-tags" v-if="bookmark.tags?.length">
        <span class="tag" v-for="tag in bookmark.tags" :key="tag">{{ tag }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
/**
 * @component BookmarkItem
 * @description Einzelne Bookmark-Karte in der Listenansicht.
 *
 * Zeigt alle Informationen eines Bookmarks an und ermöglicht:
 * - Favorit- und Gelesen-Status toggling (direkte Buttons)
 * - Bearbeiten und Löschen (Dreipunkt-Menü)
 * - Öffnen der URL in einem neuen Tab
 *
 * Favicon wird via Google S2 API geladen. Bei Ladefehler wird ein Fallback-Icon angezeigt.
 * Das Dreipunkt-Menü schließt sich automatisch bei Klick außerhalb der Komponente.
 *
 * @prop {Object} bookmark - Das Bookmark-Objekt mit id, title, url, description, tags, favorit, gelesen
 *
 * @emits edit           - Wenn "Bearbeiten" geklickt wird, mit dem Bookmark-Objekt
 * @emits delete         - Wenn "Löschen" geklickt wird, mit dem Bookmark-Objekt
 * @emits toggle-favorit - Wenn der Favorit-Button geklickt wird, mit dem aktualisierten Bookmark
 * @emits toggle-gelesen - Wenn der Gelesen-Button geklickt wird, mit dem aktualisierten Bookmark
 *
 * @author Mohamad Habachia, Ibrahim Hassan
 * @version 2.0
 */

import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({ bookmark: { type: Object, required: true } })
const emit  = defineEmits(['edit', 'delete', 'toggle-favorit', 'toggle-gelesen'])

/** Berechneter Favorit-Status aus dem Bookmark-Prop */
const isFavorit = computed(() => props.bookmark.favorit ?? false)

/** Berechneter Gelesen-Status aus dem Bookmark-Prop */
const isGelesen = computed(() => props.bookmark.gelesen ?? false)

/** Template-Ref auf das Favicon-Bild für Fehlerbehandlung */
const faviconImg      = ref(null)

/** Template-Ref auf das Fallback-Icon wenn Favicon nicht lädt */
const faviconFallback = ref(null)

/** Template-Ref auf den Menü-Wrapper für Outside-Click-Erkennung */
const menuWrap  = ref(null)

/** Gibt an ob das Dreipunkt-Menü geöffnet ist */
const menuOpen  = ref(false)

/**
 * Extrahierter Domain-Name aus der Bookmark-URL ohne www.
 * @example "https://www.htw-berlin.de/studium" → "htw-berlin.de"
 */
const domain = computed(() => {
  try { return new URL(props.bookmark.url).hostname.replace('www.', '') }
  catch { return props.bookmark.url }
})

/**
 * Wird aufgerufen wenn das Favicon nicht geladen werden kann.
 * Versteckt das Bild und zeigt das Fallback-Icon an.
 */
function onFaviconError() {
  if (faviconImg.value)      faviconImg.value.style.display = 'none'
  if (faviconFallback.value) faviconFallback.value.style.display = 'flex'
}

/** Öffnet/schließt das Dreipunkt-Menü */
function toggleMenu() { menuOpen.value = !menuOpen.value }

/**
 * Schließt das Menü und emittiert das `edit` Event.
 * BookmarkList.vue öffnet daraufhin das BookmarkModal im Edit-Modus.
 */
function onEdit() {
  menuOpen.value = false
  emit('edit', props.bookmark)
}

/**
 * Schließt das Menü und emittiert das `delete` Event.
 * BookmarkList.vue zeigt daraufhin den Bestätigungs-Dialog an.
 */
function onDelete() {
  menuOpen.value = false
  emit('delete', props.bookmark)
}

/**
 * Toggled den Favorit-Status und emittiert das `toggle-favorit` Event
 * mit dem vollständigen aktualisierten Bookmark-Objekt.
 */
function toggleFavorit() {
  emit('toggle-favorit', {
    id:          props.bookmark.id,
    title:       props.bookmark.title,
    url:         props.bookmark.url,
    description: props.bookmark.description,
    tags:        props.bookmark.tags ?? [],
    favorit:     !isFavorit.value,
    gelesen:     isGelesen.value
  })
}

/**
 * Toggled den Gelesen-Status und emittiert das `toggle-gelesen` Event
 * mit dem vollständigen aktualisierten Bookmark-Objekt.
 */
function toggleGelesen() {
  emit('toggle-gelesen', {
    id:          props.bookmark.id,
    title:       props.bookmark.title,
    url:         props.bookmark.url,
    description: props.bookmark.description,
    tags:        props.bookmark.tags ?? [],
    favorit:     isFavorit.value,
    gelesen:     !isGelesen.value
  })
}

/**
 * Schließt das Dreipunkt-Menü bei Klick außerhalb der Komponente.
 * @param {MouseEvent} e - Das click-Event vom document
 */
function handleOutside(e) {
  if (menuWrap.value && !menuWrap.value.contains(e.target)) menuOpen.value = false
}

onMounted(()   => document.addEventListener('click', handleOutside))
onUnmounted(() => document.removeEventListener('click', handleOutside))
</script>

<style scoped>
.card {
  background: var(--card);
  border-top: 5px solid var(--accent);
  border-left: 0.5px solid var(--border);
  border-right: 0.5px solid var(--border);
  border-bottom: 0.5px solid var(--border);
  border-radius: 12px;
  transition: background 0.2s, box-shadow 0.2s;
}
.card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.card-body { padding: 13px 15px; }
.card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 7px; }
.card-title-row { display: flex; align-items: center; gap: 8px; }
.favicon { width: 18px; height: 18px; border-radius: 3px; object-fit: contain; flex-shrink: 0; }
.favicon-fallback { width: 18px; height: 18px; border-radius: 3px; background: var(--tag-bg); align-items: center; justify-content: center; flex-shrink: 0; }
.favicon-fallback i { font-size: 11px; color: var(--muted); }
.card-title { font-size: 13px; font-weight: 500; color: var(--text); }
.card-actions { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
.menu-wrap { position: relative; }
.action-btn { background: none; border: none; padding: 4px; cursor: pointer; border-radius: 6px; display: flex; align-items: center; color: #888888; transition: background 0.15s, color 0.15s; }
.action-btn:hover { background: var(--hover); color: var(--text); }
.action-btn i { font-size: 18px; color: #888888; }
.action-btn.active { background: var(--tag-bg); }
.action-btn.active i { color: var(--accent); font-size: 18px; }
.card-dropdown { position: absolute; top: calc(100% + 4px); right: 0; width: 150px; background: var(--dropdown); border: 0.5px solid var(--border); border-radius: 10px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.12); display: none; z-index: 50; }
.card-dropdown.open { display: block; }
.card-dropdown-item { display: flex; align-items: center; gap: 8px; padding: 9px 12px; font-size: 13px; color: var(--text); background: none; border: none; width: 100%; text-align: left; cursor: pointer; font-family: inherit; }
.card-dropdown-item:hover { background: var(--hover); }
.card-dropdown-item i { font-size: 14px; color: var(--muted); }
.card-dropdown-item.danger { color: #E24B4A; }
.card-dropdown-item.danger i { color: #E24B4A; }
.card-dropdown-item.danger:hover { background: rgba(226,75,74,0.08); }
.card-url { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--accent); margin-bottom: 7px; text-decoration: none; }
.card-url i { font-size: 11px; }
.card-url:hover { text-decoration: underline; }
.card-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
.card-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.tag { font-size: 11px; background: var(--tag-bg); color: var(--accent); border-radius: 99px; padding: 2px 9px; font-weight: 500; }
</style>
