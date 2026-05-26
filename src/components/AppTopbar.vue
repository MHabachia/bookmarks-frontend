<template>
  <div class="topbar-and-content">

    <header class="topbar">
      <h1 class="topbar-title">{{ filterTitle }}</h1>

      <div class="topbar-right">
        <button class="toggle-btn" @click="$emit('toggle-dark')">
          <i :class="isDark ? 'ti ti-sun' : 'ti ti-moon'"></i>
          {{ isDark ? 'Light mode' : 'Dark mode' }}
        </button>

        <div class="profile-wrap" ref="profileWrap">
          <button class="profile-btn" @click="toggleDropdown">MH</button>

          <div class="dropdown" :class="{ open: dropdownOpen }">
            <div class="dropdown-header">
              <div class="dropdown-avatar">MH</div>
              <div>
                <p class="dropdown-name">Mo Hamad</p>
                <span class="dropdown-email">mo@htw-berlin.de</span>
              </div>
            </div>
            <button class="dropdown-item">
              <i class="ti ti-settings"></i>Profileinstellungen
            </button>
            <button class="dropdown-item">
              <i class="ti ti-photo"></i>Bild hinzufügen
            </button>
            <button class="dropdown-item">
              <i class="ti ti-lock"></i>Passwort ändern
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item danger">
              <i class="ti ti-logout"></i>Abmelden
            </button>
          </div>
        </div>
      </div>
    </header>

    <slot />

    <footer class="page-footer">
      © BookmarkIt - Lesezeichen Manager · WebTechnologie Projekt SoSe2026 · HTW Berlin
    </footer>

  </div>
</template>

<script setup>

import { ref, inject, computed, onMounted, onUnmounted } from 'vue'

defineProps({ isDark: Boolean })
defineEmits(['toggle-dark'])

const activeFilter = inject('activeFilter', ref('alle'))


const filterTitle = computed(() => ({
  alle:      'Alle Lesezeichen',
  ungelesen: 'Ungelesen',
  favoriten: 'Favoriten',
  gelesen:   'Gelesen',
  tags:      'Tag/Kategorie'
}[activeFilter.value] ?? 'Alle Lesezeichen'))

const dropdownOpen = ref(false)
const profileWrap  = ref(null)

function toggleDropdown() { dropdownOpen.value = !dropdownOpen.value }

function handleOutsideClick(e) {
  if (profileWrap.value && !profileWrap.value.contains(e.target))
    dropdownOpen.value = false
}
onMounted(()   => document.addEventListener('click', handleOutsideClick))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>

<style scoped>
.topbar-and-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  overflow: hidden;
}
.topbar {
  background: var(--topbar);
  border-bottom: 0.5px solid var(--border);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s;
  position: relative;
  z-index: 20;
  flex-shrink: 0;
}
.topbar-title { font-size: 20px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; }
.topbar-right { display: flex; align-items: center; gap: 10px; }
.toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--tag-bg);
  border: 0.5px solid var(--border);
  border-radius: 99px;
  padding: 5px 12px;
  font-size: 12px;
  color: var(--muted);
  transition: opacity 0.15s;
  cursor: pointer;
}
.toggle-btn i { font-size: 14px; }
.toggle-btn:hover { opacity: 0.8; }
.profile-wrap { position: relative; }
.profile-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1a6dbf;
  border: 2px solid #5ba3e8;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s;
}
.profile-btn:hover { border-color: #a8c8f0; }
.dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 210px;
  background: var(--dropdown);
  border: 0.5px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.14);
  display: none;
  z-index: 100;
}
.dropdown.open { display: block; }
.dropdown-header {
  padding: 12px 14px;
  border-bottom: 0.5px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}
.dropdown-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: #1a6dbf; display: flex; align-items: center;
  justify-content: center; font-size: 11px; font-weight: 600;
  color: #fff; flex-shrink: 0;
}
.dropdown-name  { font-size: 13px; font-weight: 500; color: var(--text); }
.dropdown-email { font-size: 11px; color: var(--muted); }
.dropdown-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 14px; font-size: 13px; color: var(--text);
  background: none; border: none; width: 100%;
  text-align: left; cursor: pointer; transition: background 0.12s;
}
.dropdown-item:hover { background: var(--hover); }
.dropdown-item i { font-size: 15px; color: var(--muted); }
.dropdown-divider { height: 0.5px; background: var(--border); }
.dropdown-item.danger { color: #E24B4A; }
.dropdown-item.danger i { color: #E24B4A; }
.dropdown-item.danger:hover { background: rgba(226,75,74,0.08); }
.page-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  background: var(--topbar);
  transition: background 0.2s;
  flex-shrink: 0;
}
</style>
