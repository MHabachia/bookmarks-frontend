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
          <input v-model="form.title" type="text" placeholder="z.B. Moodle HTW-berlin" />
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
          <label>Tags</label>
          <div class="tag-input-wrap" @click="focusTagInput">
            <span v-for="(tag, index) in form.tags" :key="index" class="tag-chip">
              {{ tag }}
              <button class="tag-remove" @click.stop="removeTag(index)">
                <i class="ti ti-x"></i>
              </button>
            </span>
            <input
              ref="tagInputRef"
              v-model="tagInput"
              class="tag-input"
              placeholder="Tag eingeben + Enter"
              @keydown.enter.prevent="addTag"
              @keydown.comma.prevent="addTag"
              @keydown.backspace="removeLastTag"
            />
          </div>
          <span class="field-hint">Enter drücken um einen Tag hinzuzufügen</span>
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
 * @component BookmarkModal
 * @description Modal-Dialog zum Hinzufügen und Bearbeiten von Bookmarks.
 *
 * Funktioniert in zwei Modi:
 * - **Add-Modus** (`isEdit: false`): Leeres Formular, Button "Hinzufügen"
 * - **Edit-Modus** (`isEdit: true`): Formular mit bestehenden Werten, Button "Speichern"
 *
 * Tag-Chip-Eingabe:
 * - `Enter` oder `,` → fügt den eingegebenen Text als Tag-Chip hinzu
 * - `Backspace` bei leerem Feld → entfernt den letzten Tag-Chip
 * - `×` Button → entfernt einen bestimmten Tag-Chip
 *
 * Validierung:
 * - Titel und URL sind Pflichtfelder (Save-Button deaktiviert wenn leer)
 *
 * @prop {Object|null} bookmark - Bestehendes Bookmark für Edit-Modus, null für Add-Modus
 * @prop {boolean}     isEdit   - true = Edit-Modus, false = Add-Modus
 *
 * @emits close - Wenn der Dialog geschlossen werden soll
 * @emits save  - Wenn gespeichert wird, mit dem Bookmark-Objekt als Payload
 *
 * @author Mohamad Habachia, Ibrahim Hassan
 * @version 2.0
 */

import { reactive, ref, watch } from 'vue'

const props = defineProps({
  bookmark: { type: Object, default: null },
  isEdit:   { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'save'])

/**
 * Reaktives Formular-Objekt.
 * Wird beim Öffnen im Edit-Modus mit den Bookmark-Werten befüllt.
 */
const form = reactive({
  title:       '',
  url:         '',
  description: '',
  tags:        []
})

/** Aktueller Text im Tag-Eingabefeld (noch nicht als Chip hinzugefügt) */
const tagInput = ref('')

/** Template-Ref auf das Tag-Eingabefeld für programmatischen Fokus */
const tagInputRef = ref(null)

/**
 * Setzt den Fokus auf das Tag-Eingabefeld.
 * Wird aufgerufen wenn auf den Tag-Container geklickt wird.
 */
function focusTagInput() {
  tagInputRef.value?.focus()
}

/**
 * Fügt den aktuellen Tag-Input-Text als neuen Tag-Chip hinzu.
 * Entfernt Leerzeichen und abschließende Kommas. Verhindert Duplikate.
 */
function addTag() {
  const val = tagInput.value.trim().replace(/,$/, '')
  if (val && !form.tags.includes(val)) {
    form.tags.push(val)
  }
  tagInput.value = ''
}

/**
 * Entfernt einen Tag-Chip anhand seines Index.
 * @param {number} index - Index des zu entfernenden Tags in form.tags
 */
function removeTag(index) {
  form.tags.splice(index, 1)
}

/**
 * Entfernt den letzten Tag-Chip wenn Backspace bei leerem Eingabefeld gedrückt wird.
 */
function removeLastTag() {
  if (tagInput.value === '' && form.tags.length > 0) {
    form.tags.pop()
  }
}

/**
 * Beobachtet Änderungen am `bookmark` Prop und befüllt das Formular im Edit-Modus.
 * `immediate: true` → wird auch beim ersten Render ausgeführt.
 */
watch(() => props.bookmark, (b) => {
  if (b) {
    form.title       = b.title ?? ''
    form.url         = b.url ?? ''
    form.description = b.description ?? ''
    form.tags        = b.tags ? [...b.tags] : []
  }
}, { immediate: true })

/**
 * Validiert und sendet das Formular.
 * Abbruch wenn Titel oder URL leer. Noch nicht bestätigter Tag-Input wird als Tag hinzugefügt.
 */
function save() {
  if (!form.title || !form.url) return
  if (tagInput.value.trim()) addTag()
  emit('save', {
    ...(props.bookmark ?? {}),
    title:       form.title,
    url:         form.url,
    description: form.description,
    tags:        [...form.tags]
  })
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal { background: var(--card); border: 0.5px solid var(--border); border-radius: 16px; width: 460px; max-width: 90vw; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 0.5px solid var(--border); }
.modal-header h2 { font-size: 16px; font-weight: 700; color: var(--text); }
.modal-close { background: none; border: none; color: var(--muted); padding: 4px; border-radius: 6px; display: flex; align-items: center; cursor: pointer; }
.modal-close i { font-size: 18px; }
.modal-close:hover { background: var(--hover); color: var(--text); }
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
.field-hint { font-size: 11px; color: var(--muted); opacity: 0.7; }
.field input { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-size: 14px; color: var(--text); outline: none; transition: border-color 0.15s; font-family: inherit; }
.field input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(26,109,191,0.12); }
.field input::placeholder { color: var(--muted); opacity: 0.6; }
.tag-input-wrap { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 7px 10px; cursor: text; min-height: 42px; transition: border-color 0.15s; }
.tag-input-wrap:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(26,109,191,0.12); }
.tag-chip { display: flex; align-items: center; gap: 4px; background: var(--tag-bg); color: var(--accent); border-radius: 99px; padding: 3px 8px 3px 10px; font-size: 12px; font-weight: 500; white-space: nowrap; }
.tag-remove { background: none; border: none; padding: 0; cursor: pointer; display: flex; align-items: center; color: var(--accent); opacity: 0.7; border-radius: 50%; }
.tag-remove:hover { opacity: 1; }
.tag-remove i { font-size: 11px; }
.tag-input { border: none !important; background: transparent !important; outline: none !important; box-shadow: none !important; padding: 2px 4px !important; font-size: 13px; color: var(--text); flex: 1; min-width: 120px; }
.tag-input::placeholder { color: var(--muted); opacity: 0.5; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 0.5px solid var(--border); }
.btn-cancel { background: none; border: 0.5px solid var(--border); border-radius: 8px; padding: 8px 16px; font-size: 13px; color: var(--muted); cursor: pointer; }
.btn-cancel:hover { background: var(--hover); }
.btn-save { display: flex; align-items: center; gap: 6px; background: var(--btn); color: var(--btn-text); border: none; border-radius: 8px; padding: 8px 18px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-save:not(:disabled):hover { opacity: 0.9; }
.btn-save i { font-size: 14px; }
</style>
