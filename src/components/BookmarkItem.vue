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

        <div class="menu-wrap" ref="menuWrap">
          <button class="card-menu" @click="toggleMenu">
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
 * Einzelne Bookmark-Karte.
 *
 * Stellt einen Bookmark als Karte mit folgenden Elementen dar:
 * - Favicon (via Google S2 Favicon API) mit Fallback-Icon
 * - Titel und anklickbare Domain-URL
 * - Beschreibungstext
 * - Tag-Chips
 * - Dreipunkt-Menü mit Bearbeiten und Löschen
 *
 * Das Dreipunkt-Menü schließt sich automatisch bei Klick
 * außerhalb der Karte (document click listener).
 *
 * @component BookmarkItem
 * @prop {Object} bookmark - Das anzuzeigende Bookmark-Objekt
 * @prop {number} bookmark.id - Eindeutige ID
 * @prop {string} bookmark.title - Titel des Bookmarks
 * @prop {string} bookmark.url - Vollständige URL
 * @prop {string} bookmark.description - Beschreibungstext
 * @prop {string[]} bookmark.tags - Liste der Tags
 * @emits {Object} edit - Das zu bearbeitende Bookmark-Objekt
 * @emits {Object} delete - Das zu löschende Bookmark-Objekt
 */
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({ bookmark: { type: Object, required: true } })
const emit = defineEmits(['edit', 'delete'])

/** Template-Ref auf das Favicon-Bild Element. @type {import('vue').Ref} */
const faviconImg = ref(null)

/** Template-Ref auf das Fallback-Icon Element. @type {import('vue').Ref} */
const faviconFallback = ref(null)

/** Template-Ref auf den Menü-Wrapper (für Außenklick-Erkennung). @type {import('vue').Ref} */
const menuWrap = ref(null)

/** Gibt an ob das Dreipunkt-Dropdown geöffnet ist. @type {import('vue').Ref<boolean>} */
const menuOpen = ref(false)

/**
 * Extrahiert die Domain aus der Bookmark-URL.
 *
 * Verwendet die eingebaute URL-Klasse des Browsers.
 * Entfernt 'www.' für eine sauberere Darstellung.
 * Gibt bei ungültiger URL den Roh-String zurück.
 *
 * @type {import('vue').ComputedRef<string>}
 * Beispiel
 * // 'https://www.htw-berlin.de' → 'htw-berlin.de'
 */
const domain = computed(() => {
  try { return new URL(props.bookmark.url).hostname.replace('www.', '') }
  catch { return props.bookmark.url }
})

/**
 * Behandelt einen Fehler beim Laden des Favicons.
 * Blendet das Bild aus und zeigt das Fallback-Icon an.
 */
function onFaviconError() {
  if (faviconImg.value) faviconImg.value.style.display = 'none'
  if (faviconFallback.value) faviconFallback.value.style.display = 'flex'
}

/** Öffnet oder schließt das Dreipunkt-Dropdown. */
function toggleMenu() { menuOpen.value = !menuOpen.value }

/**
 * Schließt das Menü und emittiert das 'edit' Event.
 * BookmarkList öffnet daraufhin das Modal im Edit-Modus.
 */
function onEdit() { menuOpen.value = false; emit('edit', props.bookmark) }

/**
 * Schließt das Menü und emittiert das 'delete' Event.
 * BookmarkList entfernt daraufhin das Bookmark aus der Liste.
 */
function onDelete() { menuOpen.value = false; emit('delete', props.bookmark) }

/**
 * Schließt das Dropdown bei Klick außerhalb des Menü-Wrappers.
 * @param {MouseEvent} e - Das Click-Event
 */
function handleOutside(e) {
  if (menuWrap.value && !menuWrap.value.contains(e.target)) menuOpen.value = false
}

onMounted(() => document.addEventListener('click', handleOutside))
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
.card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); }
.card-body { padding: 13px 15px; }
.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 7px;
}
.card-title-row { display: flex; align-items: center; gap: 8px; }
.favicon { width: 18px; height: 18px; border-radius: 3px; object-fit: contain; flex-shrink: 0; }
.favicon-fallback {
  width: 18px; height: 18px; border-radius: 3px;
  background: var(--tag-bg); align-items: center; justify-content: center; flex-shrink: 0;
}
.favicon-fallback i { font-size: 11px; color: var(--muted); }
.card-title { font-size: 13px; font-weight: 500; color: var(--text); }
.menu-wrap { position: relative; }
.card-menu { background: none; border: none; padding: 2px; cursor: pointer; border-radius: 4px; }
.card-menu i { font-size: 15px; color: var(--muted); }
.card-menu:hover { background: var(--hover); }
.card-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 150px;
  background: var(--dropdown);
  border: 0.5px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  display: none;
  z-index: 50;
}
.card-dropdown.open { display: block; }
.card-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  font-size: 13px;
  color: var(--text);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
}
.card-dropdown-item:hover { background: var(--hover); }
.card-dropdown-item i { font-size: 14px; color: var(--muted); }
.card-dropdown-item.danger { color: #E24B4A; }
.card-dropdown-item.danger i { color: #E24B4A; }
.card-dropdown-item.danger:hover { background: rgba(226, 75, 74, 0.08); }
.card-url {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: var(--accent); margin-bottom: 7px; text-decoration: none;
}
.card-url i { font-size: 11px; }
.card-url:hover { text-decoration: underline; }
.card-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
.card-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.tag {
  font-size: 11px;
  background: var(--tag-bg);
  color: var(--accent);
  border-radius: 99px;
  padding: 2px 9px;
  font-weight: 500;
}
</style>
