<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <i class="ti ti-bookmark"></i>
      <span>BookmarkIt</span>
    </div>

    <nav class="sidebar-nav">
      <button
        v-for="item in navItems"
        :key="item.filter"
        class="nav-item"
        :class="{ active: activeFilter === item.filter }"
        @click="$emit('set-filter', item.filter)"
      >
        <i :class="`ti ti-${item.icon}`"></i>
        {{ item.label }}
        <span class="nav-badge">{{ item.count }}</span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <div class="repos-row">
        <a href="#" class="repo-btn">
          <i class="ti ti-brand-github"></i>
          Frontend
        </a>
        <a href="#" class="repo-btn">
          <i class="ti ti-brand-github"></i>
          Backend
        </a>
      </div>
      <a href="#" class="footer-item">
        <i class="ti ti-file-description"></i>
        Dokumentation
      </a>
      <button class="footer-item danger">
        <i class="ti ti-logout"></i>
        Abmelden
      </button>
      <div class="footer-meta">
        <p>Version 1.3 · SoSe2026</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
/**
 *  Seitenleiste der BookmarkIt-Anwendung.
 *
 * Zeigt die Navigation mit Filter-Optionen sowie den Footer-Bereich
 * mit GitHub-Repos, Dokumentation und Abmelden-Button.
 *
 * Datenfluss:
 * - bookmarks und activeFilter werden per inject() von App.vue empfangen
 * - navItems berechnet die Badge-Zahlen reaktiv aus bookmarks
 * - Bei Nav-Klick wird 'set-filter' nach oben an App.vue emittiert
 *
 */
import { inject, computed } from 'vue'

defineEmits(['set-filter'])

/**
 * Gemeinsame Bookmark-Liste aus App.vue.
 * Wird verwendet um die Badge-Zahlen pro Kategorie zu berechnen.
 * @type {import('vue').Ref<Array>}
 */
const bookmarks = inject('bookmarks', { value: [] })

/**
 * Aktuell aktiver Filter aus App.vue.
 * Bestimmt welcher Nav-Eintrag hervorgehoben wird.
 * @type {import('vue').Ref<string>}
 */
const activeFilter = inject('activeFilter')

/**
 * Berechnete Navigation-Einträge mit aktuellen Badge-Zahlen.
 *
 * Wird automatisch neu berechnet wenn sich bookmarks ändert.
 * Jeder Eintrag enthält:
 * - filter: der Filter-Schlüssel der an App.vue gesendet wird
 * - icon: Tabler Icon Name (ohne 'ti ti-' Prefix)
 * - label: Anzeigetext
 * - count: Anzahl der Bookmarks in dieser Kategorie
 *
 * @type {import('vue').ComputedRef<Array<{filter: string, icon: string, label: string, count: number}>>}
 */
const navItems = computed(() => [
  {
    filter: 'alle',
    icon: 'layout-list',
    label: 'Alle',
    count: bookmarks.value?.length ?? 0
  },
  {
    filter: 'ungelesen',
    icon: 'mail-opened',
    label: 'Ungelesen',
    count: bookmarks.value?.filter(b => !b.gelesen).length ?? 0
  },
  {
    filter: 'favoriten',
    icon: 'star',
    label: 'Favoriten',
    count: bookmarks.value?.filter(b => b.favorit).length ?? 0
  },
  {
    filter: 'gelesen',
    icon: 'circle-check',
    label: 'Gelesen',
    count: bookmarks.value?.filter(b => b.gelesen).length ?? 0
  },
  {
    filter: 'tags',
    icon: 'tag',
    label: 'Tags / Kategorien',
    count: [...new Set(bookmarks.value?.flatMap(b => b.tags ?? []))].length ?? 0
  }
])
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-width: 220px;
  background: var(--sidebar);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.sidebar-logo {
  padding: 20px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 0.5px solid var(--sidebar-border);
}
.sidebar-logo i { font-size: 22px; color: var(--sidebar-muted); }
.sidebar-logo span {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.2px;
}
.sidebar-nav {
  padding: 12px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--sidebar-text);
  font-size: 15px;
  font-weight: 700;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.nav-item:hover { background: var(--sidebar-hover); color: #fff; }
.nav-item.active {
  background: var(--sidebar-active-bg);
  color: #fff;
  font-weight: 800;
}
.nav-item i { font-size: 20px; }
.nav-badge {
  margin-left: auto;
  background: var(--sidebar-badge-bg);
  color: var(--sidebar-muted);
  font-size: 11px;
  font-weight: 600;
  border-radius: 99px;
  padding: 2px 8px;
  min-width: 22px;
  text-align: center;
}
.nav-item.active .nav-badge {
  background: rgba(122, 176, 232, 0.3);
  color: #fff;
}
.sidebar-footer {
  padding: 12px 10px;
  border-top: 0.5px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.repos-row {
  display: flex;
  gap: 6px;
  padding: 4px 2px;
}
.repo-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 6px;
  border-radius: 8px;
  color: var(--sidebar-text);
  font-size: 12px;
  font-weight: 500;
  background: rgba(122, 176, 232, 0.08);
  border: 0.5px solid rgba(122, 176, 232, 0.2);
  text-decoration: none;
  transition: background 0.15s;
}
.repo-btn:hover { background: rgba(122, 176, 232, 0.18); }
.repo-btn i { font-size: 14px; color: var(--sidebar-muted); }
.footer-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--sidebar-text);
  font-size: 13px;
  font-weight: 500;
  background: none;
  border: none;
  text-decoration: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}
.footer-item:hover { background: var(--sidebar-hover); }
.footer-item i { font-size: 15px; color: var(--sidebar-muted); }
.footer-item.danger { color: #f08080; }
.footer-item.danger i { color: #f08080; }
.footer-item.danger:hover { background: rgba(226, 75, 74, 0.12); }
.footer-meta {
  padding: 6px 8px 0;
  border-top: 0.5px solid rgba(255, 255, 255, 0.06);
  margin-top: 4px;
}
.footer-meta p { font-size: 11px; color: var(--sidebar-muted); opacity: 0.6; }
</style>
