<script setup>
import { computed } from 'vue';

/*
  Props:
  - show: Boolean
  - type: 'save' | 'update' | 'delete' | 'custom'
  - title: String (opsional override)
  - message: String (opsional override)
  - confirmLabel: String (opsional override)
  - cancelLabel: String (default: 'Batal')
  - loading: Boolean (default: false)
*/
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'save',
    validator: (v) => ['save', 'update', 'delete', 'custom'].includes(v),
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  confirmLabel: {
    type: String,
    default: '',
  },
  cancelLabel: {
    type: String,
    default: 'Batal',
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['confirm', 'cancel']);

/*
  Preset teks & styling statis per action type
*/
const presets = {
  save: {
    title: 'Konfirmasi Simpan',
    message: 'Apakah Anda yakin ingin menyimpan data ini?',
    confirmLabel: 'Ya, Simpan',
    themeClass: 'theme-save',
    icon: 'save',
  },
  update: {
    title: 'Konfirmasi Update',
    message: 'Apakah Anda yakin ingin memperbarui data ini?',
    confirmLabel: 'Ya, Perbarui',
    themeClass: 'theme-update',
    icon: 'update',
  },
  delete: {
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
    confirmLabel: 'Ya, Hapus',
    themeClass: 'theme-delete',
    icon: 'delete',
  },
  custom: {
    title: 'Konfirmasi Tindakan',
    message: 'Apakah Anda yakin ingin melanjutkan?',
    confirmLabel: 'Ya, Lanjutkan',
    themeClass: 'theme-save',
    icon: 'save',
  },
};

const activeConfig = computed(() => {
  const p = presets[props.type] || presets.save;
  return {
    title: props.title || p.title,
    message: props.message || p.message,
    confirmLabel: props.confirmLabel || p.confirmLabel,
    themeClass: p.themeClass,
    icon: p.icon,
  };
});
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="show" class="dialog-overlay" @click.self="emit('cancel')">
        <div class="dialog-card" :class="activeConfig.themeClass" role="dialog" aria-modal="true">
          <!-- Close button -->
          <button
            type="button"
            class="dialog-close-btn"
            :disabled="loading"
            @click="emit('cancel')"
            aria-label="Tutup"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Icon Header -->
          <div class="dialog-icon-wrap">
            <!-- Save / Check Icon -->
            <svg
              v-if="activeConfig.icon === 'save'"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.3"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>

            <!-- Update / Pencil Icon -->
            <svg
              v-else-if="activeConfig.icon === 'update'"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.3"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>

            <!-- Delete / Trash Icon -->
            <svg
              v-else-if="activeConfig.icon === 'delete'"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.3"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>

          <!-- Title & Message -->
          <h3 class="dialog-title">{{ activeConfig.title }}</h3>
          <p class="dialog-message">{{ activeConfig.message }}</p>

          <!-- Actions -->
          <div class="dialog-actions">
            <button
              type="button"
              class="dialog-btn dialog-btn-cancel"
              :disabled="loading"
              @click="emit('cancel')"
            >
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              class="dialog-btn dialog-btn-confirm"
              :disabled="loading"
              @click="emit('confirm')"
            >
              <span v-if="loading" class="dialog-spinner"></span>
              <span v-else>{{ activeConfig.confirmLabel }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay Backdrop ── */
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* ── Card Modal ── */
.dialog-card {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px;
  padding: 24px 20px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Sora', sans-serif;
}

/* ── Close Button ── */
.dialog-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}
.dialog-close-btn:hover:not(:disabled) {
  background: #f3f4f6;
  color: #374151;
}

/* ── Icon Wrap ── */
.dialog-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: transform 0.2s;
}

/* ── Themes ── */
/* Save (Blue) */
.theme-save .dialog-icon-wrap {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #2563eb;
}
.theme-save .dialog-btn-confirm {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}
.theme-save .dialog-btn-confirm:hover:not(:disabled) {
  background: #1d4ed8;
}

/* Update (Amber / Orange) */
.theme-update .dialog-icon-wrap {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #d97706;
}
.theme-update .dialog-btn-confirm {
  background: #d97706;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.25);
}
.theme-update .dialog-btn-confirm:hover:not(:disabled) {
  background: #b45309;
}

/* Delete (Red) */
.theme-delete .dialog-icon-wrap {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #ef4444;
}
.theme-delete .dialog-btn-confirm {
  background: #ef4444;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
}
.theme-delete .dialog-btn-confirm:hover:not(:disabled) {
  background: #dc2626;
}

/* ── Text ── */
.dialog-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
  letter-spacing: -0.01em;
}

.dialog-message {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 20px 0;
  line-height: 1.5;
  padding: 0 8px;
}

/* ── Actions ── */
.dialog-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

.dialog-btn {
  flex: 1;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  border: none;
  transition: background 0.18s, transform 0.15s, opacity 0.18s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
}
.dialog-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}
.dialog-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Cancel button */
.dialog-btn-cancel {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}
.dialog-btn-cancel:hover:not(:disabled) {
  background: #e5e7eb;
  color: #111827;
}

/* ── Spinner ── */
.dialog-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: d-spin 0.7s linear infinite;
}

@keyframes d-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ── Transition Animations ── */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.22s ease;
}
.dialog-fade-enter-active .dialog-card {
  animation: dialogScaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.dialog-fade-leave-active .dialog-card {
  animation: dialogScaleOut 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

@keyframes dialogScaleIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes dialogScaleOut {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.94) translateY(8px);
  }
}
</style>
