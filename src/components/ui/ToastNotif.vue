<script setup>
import { computed, watch, ref } from 'vue';

/*
  Props:
  - show : Boolean — tampilkan/sembunyikan toast
  - type : 'save' | 'update' | 'delete' | 'error'
*/
const props = defineProps({
  show: { type: Boolean, default: false },
  type: { type: String, default: 'save' },
});

const emit = defineEmits(['close']);

/*
  Pesan statis per tipe — tidak perlu set dari luar
*/
const messages = {
  save:   'Data berhasil disimpan',
  update: 'Perubahan data berhasil disimpan',
  delete: 'Data berhasil dihapus',
  error:  'Terjadi kesalahan, coba lagi',
};

const icons = {
  save:   'check',
  update: 'check',
  delete: 'trash',
  error:  'x',
};

const config = computed(() => {
  const t = props.type;
  return {
    message: messages[t] ?? messages.save,
    icon:    icons[t]    ?? 'check',
    isError: t === 'error',
    isDelete: t === 'delete',
  };
});

/* Progress bar */
const progress = ref(100);
let progressTimer = null;

watch(() => props.show, (val) => {
  if (val) {
    progress.value = 100;
    let start = Date.now();
    const duration = 3500;
    progressTimer = setInterval(() => {
      const elapsed = Date.now() - start;
      progress.value = Math.max(0, 100 - (elapsed / duration) * 100);
      if (progress.value <= 0) clearInterval(progressTimer);
    }, 30);
  } else {
    clearInterval(progressTimer);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
          v-if="show"
          class="toast-wrap"
          :class="{
            'toast-error':  config.isError,
            'toast-delete': config.isDelete,
          }"
          role="alert"
      >
        <!-- Icon -->
        <div class="toast-icon">
          <!-- Check -->
          <svg v-if="config.icon === 'check'" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <!-- Trash -->
          <svg v-else-if="config.icon === 'trash'" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
          <!-- X -->
          <svg v-else width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>

        <!-- Message -->
        <span class="toast-msg">{{ config.message }}</span>

        <!-- Close Button -->
        <button class="toast-close" @click="emit('close')" aria-label="Tutup">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Progress Bar -->
        <div class="toast-progress">
          <div class="toast-progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Wrapper ── */
.toast-wrap {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 260px;
  max-width: 340px;
  background: #ffffff;
  border: 1px solid #bbf7d0;
  border-left: 4px solid #22c55e;
  border-radius: 8px;
  padding: 10px 36px 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* Variant — delete */
.toast-wrap.toast-delete {
  border-color: #fecaca;
  border-left-color: #ef4444;
}
.toast-wrap.toast-delete .toast-icon { color: #ef4444; background: #fee2e2; }
.toast-wrap.toast-delete .toast-progress-bar { background: #ef4444; }

/* Variant — error */
.toast-wrap.toast-error {
  border-color: #fecaca;
  border-left-color: #f97316;
}
.toast-wrap.toast-error .toast-icon { color: #f97316; background: #ffedd5; }
.toast-wrap.toast-error .toast-progress-bar { background: #f97316; }

/* ── Icon ── */
.toast-icon {
  width: 28px;
  height: 28px;
  background: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  flex-shrink: 0;
}

/* ── Message ── */
.toast-msg {
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: #111827;
  font-family: 'Sora', sans-serif;
  line-height: 1.4;
}

/* ── Close ── */
.toast-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.toast-close:hover { color: #374151; }

/* ── Progress Bar ── */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #e5e7eb;
}
.toast-progress-bar {
  height: 100%;
  background: #22c55e;
  transition: width 0.03s linear;
  border-radius: 0 0 0 8px;
}

/* ── Transition ── */
.toast-enter-active {
  animation: toastIn 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.toast-leave-active {
  animation: toastOut 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes toastIn {
  from { opacity: 0; transform: translateX(100%) scale(0.95); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes toastOut {
  from { opacity: 1; transform: translateX(0) scale(1); }
  to   { opacity: 0; transform: translateX(100%) scale(0.95); }
}
</style>
