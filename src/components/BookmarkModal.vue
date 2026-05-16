<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Bookmark bearbeiten' : 'Bookmark hinzufügen' }}</h2>
        <button class="modal-close" @click="$emit('close')">
          <i class="ti ti-x"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="field">
          <label>Titel</label>
          <input v-model="form.title" type="text" placeholder="z.B. Vue.js Dokumentation" />
        </div>
        <div class="field">
          <label>URL</label>
          <input v-model="form.url" type="url" placeholder="https://..." />
        </div>
        <div class="field">
          <label>Beschreibung</label>
          <input v-model="form.description" type="text" placeholder="Kurze Beschreibung (optional)" />
        </div>
        <div class="field">
          <label>Tag / Kategorie</label>
          <input v-model="form.tag" type="text" placeholder="z.B. Studium, Frontend, Backend" />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Abbrechen</button>
        <button class="btn-save" @click="save" :disabled="!form.title || !form.url">
          <i class="ti ti-check"></i>
          {{ isEdit ? 'Speichern' : 'Hinzufügen' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 *  Modal-Dialog zum Hinzufügen und Bearbeiten von Bookmarks.
 *
 * Wird für zwei Anwendungsfälle genutzt:
 *
 * 1. ADD-MODUS (isEdit = false, bookmark = null):
 *    - Alle Felder sind leer
 *    - Button-Text: "Hinzufügen"
 *    - emit('save') sendet ein neues Objekt ohne ID
 *
 * 2. EDIT-MODUS (isEdit = true, bookmark = Objekt):
 *    - Felder werden mit bestehenden Werten befüllt (via watch)
 *    - Button-Text: "Speichern"
 *    - emit('save') sendet das aktualisierte Objekt mit ID
 *
 * Der Speichern-Button ist deaktiviert solange Titel oder URL leer sind.
 * Klick auf das dunkle Overlay (@click.self) schließt das Modal.
 *
 * @component BookmarkModal
 * @prop {Object|null} bookmark - Das zu bearbeitende Bookmark (null im Add-Modus)
 * @prop {boolean} isEdit - true = Edit-Modus, false = Add-Modus
 * @emits {void} close - Modal soll geschlossen werden
 * @emits {Object} save - Formulardaten zum Speichern
 */
import { reactive, watch } from 'vue'

const props = defineProps({
  bookmark: { type: Object, default: null },
  isEdit:   { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'save'])

/**
 * Reaktiver Formular-Zustand.
 * reactive() wird statt ref() verwendet da es sich um ein Objekt handelt —
 * Zugriff ohne .value: form.title statt form.value.title.
 *
 * @type {{ title: string, url: string, description: string, tag: string }}
 */
const form = reactive({
  title:       '',
  url:         '',
  description: '',
  tag:         ''
})

/**
 * Befüllt das Formular wenn ein Bookmark zum Bearbeiten übergeben wird.
 *
 * immediate: true — wird sofort beim Öffnen des Modals ausgeführt,
 * nicht erst bei der nächsten Änderung des bookmark-Props.
 *
 * tags?.[0] — nur der erste Tag wird angezeigt da das Formular
 * aktuell nur ein Tag-Feld hat.
 */
watch(() => props.bookmark, (b) => {
  if (b) {
    form.title       = b.title ?? ''
    form.url         = b.url ?? ''
    form.description = b.description ?? ''
    form.tag         = b.tags?.[0] ?? ''
  }
}, { immediate: true })

/**
 * Validiert und sendet die Formulardaten.
 *
 * Bricht ab wenn Titel oder URL fehlen.
 * Sendet das zusammengesetzte Objekt per emit('save') an BookmarkList.
 * Der Spread-Operator (...props.bookmark) erhält die ID und andere
 * bestehende Felder im Edit-Modus.
 */
function save() {
  if (!form.title || !form.url) return
  emit('save', {
    ...(props.bookmark ?? {}),
    title:       form.title,
    url:         form.url,
    description: form.description,
    tags:        form.tag ? [form.tag] : []
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.modal {
  background: var(--card);
  border: 0.5px solid var(--border);
  border-radius: 16px;
  width: 440px;
  max-width: 90vw;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 0.5px solid var(--border);
}
.modal-header h2 { font-size: 16px; font-weight: 700; color: var(--text); }
.modal-close {
  background: none; border: none; color: var(--muted);
  padding: 4px; border-radius: 6px; display: flex; align-items: center;
}
.modal-close i { font-size: 18px; }
.modal-close:hover { background: var(--hover); color: var(--text); }
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field label {
  font-size: 12px; font-weight: 600; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.5px;
}
.field input {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 8px; padding: 9px 12px; font-size: 14px;
  color: var(--text); outline: none; transition: border-color 0.15s; font-family: inherit;
}
.field input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(26, 109, 191, 0.12);
}
.field input::placeholder { color: var(--muted); opacity: 0.6; }
.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 16px 20px; border-top: 0.5px solid var(--border);
}
.btn-cancel {
  background: none; border: 0.5px solid var(--border);
  border-radius: 8px; padding: 8px 16px; font-size: 13px; color: var(--muted);
}
.btn-cancel:hover { background: var(--hover); }
.btn-save {
  display: flex; align-items: center; gap: 6px;
  background: var(--btn); color: var(--btn-text); border: none;
  border-radius: 8px; padding: 8px 18px; font-size: 13px; font-weight: 600;
}
.btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-save:not(:disabled):hover { opacity: 0.9; }
.btn-save i { font-size: 14px; }
</style>
