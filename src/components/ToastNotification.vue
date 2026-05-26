<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" :class="type">
      <i :class="icon"></i>
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup>

import { computed } from 'vue'

const props = defineProps({
  message: { type: String,  default: '' },
  type:    { type: String,  default: 'success' },
  visible: { type: Boolean, default: false }
})

/** Icon je nach Toast-Typ. */
const icon = computed(() => ({
  error: 'ti ti-alert-circle',
  info:  'ti ti-info-circle'
}[props.type] ?? 'ti ti-circle-check'))
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  z-index: 999;
  min-width: 220px;
  max-width: 360px;
}
.toast.success { background: #1a6dbf; color: #ffffff; }
.toast.success i { color: #a8d8ff; font-size: 18px; }
.toast.error { background: #E24B4A; color: #ffffff; }
.toast.error i { color: #ffd0d0; font-size: 18px; }
.toast.info { background: #2a2a2a; color: #f0f0f0; }
.toast.info i { color: #aaaaaa; font-size: 18px; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }
</style>
