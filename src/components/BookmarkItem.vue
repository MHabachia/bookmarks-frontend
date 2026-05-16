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

        <!-- Dreipunkt-Menü -->
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

      <!-- Tag-Badge falls vorhanden -->
      <div class="card-tags" v-if="bookmark.tags?.length">
        <span class="tag" v-for="tag in bookmark.tags" :key="tag">{{ tag }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>

import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({ bookmark: { type: Object, required: true } })
const emit = defineEmits(['edit', 'delete'])

const faviconImg = ref(null)
const faviconFallback = ref(null)
const menuWrap = ref(null)
const menuOpen = ref(false)

const domain = computed(() => {
  try { return new URL(props.bookmark.url).hostname.replace('www.', '') }
  catch { return props.bookmark.url }
})

function onFaviconError() {
  if (faviconImg.value) faviconImg.value.style.display = 'none'
  if (faviconFallback.value) faviconFallback.value.style.display = 'flex'
}

function toggleMenu() { menuOpen.value = !menuOpen.value }

function onEdit()   { menuOpen.value = false; emit('edit', props.bookmark) }
function onDelete() { menuOpen.value = false; emit('delete', props.bookmark) }

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

.card-title { font-size: 16px; font-weight: 500; color: var(--text); }

/* Dreipunkt-Menü */
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

/* URL */
.card-url {
  display: flex; align-items: center; gap: 4px;
  font-size: 13px; color: var(--accent); margin-bottom: 7px; text-decoration: none;
}
.card-url i { font-size: 14px; }
.card-url:hover { text-decoration: underline; }

.card-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }

/* Tag-Chips */
.card-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.tag {
  font-size: 12px;
  background: var(--tag-bg);
  color: var(--accent);
  border-radius: 99px;
  padding: 2px 9px;
  font-weight: 500;
}
</style>
