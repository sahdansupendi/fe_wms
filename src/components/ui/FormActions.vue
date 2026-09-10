<script setup>
import { computed } from "vue";

/*
========================================
PROPS
========================================
Prop utama:
- mode     : 'create' | 'update' | 'delete' | 'full'
  → menentukan tombol apa saja yang ditampilkan
- loading  : Boolean — disable semua tombol & tampilkan spinner
- disabled : Boolean — disable semua tombol

Prop label override (opsional):
- resetLabel, saveLabel, updateLabel, deleteLabel
========================================
*/
const props = defineProps({

  mode: {
    type: String,
    default: "create",
    validator: (v) => ["create", "update", "delete", "full"].includes(v),
  },

  loading: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  showReset: {
    type: Boolean,
    default: true,
  },

  resetLabel:  { type: String, default: "Reset" },
  saveLabel:   { type: String, default: "Save" },
  updateLabel: { type: String, default: "Update" },
  deleteLabel: { type: String, default: "Delete" },
});

const emit = defineEmits(["reset", "save", "update", "delete"]);

/*
========================================
COMPUTED — Tombol apa saja yang tampil
========================================
*/
const showSave   = computed(() => ["create", "full"].includes(props.mode));
const showUpdate = computed(() => ["update", "full"].includes(props.mode));
const showDelete = computed(() => ["delete", "full"].includes(props.mode));

const isDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <div class="form-actions">

    <!-- Reset Button -->
    <button
        v-if="showReset"
        type="button"
        class="fa-btn fa-btn-reset"
        :disabled="isDisabled"
        @click="emit('reset')"
    >
      <!-- Rotate Icon -->
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 1 0 .49-3.4"/>
      </svg>
      {{ resetLabel }}
    </button>

    <!-- Save Button (mode: create | full) -->
    <button
        v-if="showSave"
        type="submit"
        class="fa-btn fa-btn-save"
        :disabled="isDisabled"
        @click.prevent="emit('save')"
    >
      <span v-if="loading" class="fa-spinner"></span>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {{ loading ? "Menyimpan..." : saveLabel }}
    </button>

    <!-- Update Button (mode: update | full) -->
    <button
        v-if="showUpdate"
        type="submit"
        class="fa-btn fa-btn-update"
        :disabled="isDisabled"
        @click.prevent="emit('update')"
    >
      <span v-if="loading" class="fa-spinner"></span>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      {{ loading ? "Memperbarui..." : updateLabel }}
    </button>

    <!-- Delete Button (mode: delete | full) -->
    <button
        v-if="showDelete"
        type="button"
        class="fa-btn fa-btn-delete"
        :disabled="isDisabled"
        @click="emit('delete')"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
      </svg>
      {{ deleteLabel }}
    </button>

  </div>
</template>

<style scoped>
.form-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Base button */
.fa-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: background 0.18s, transform 0.15s, opacity 0.18s;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

.fa-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.fa-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Reset */
.fa-btn-reset {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}
.fa-btn-reset:hover:not(:disabled) {
  background: #e5e7eb;
  color: #111827;
}

/* Save */
.fa-btn-save {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}
.fa-btn-save:hover:not(:disabled) {
  background: #1d4ed8;
}

/* Update */
.fa-btn-update {
  background: #d97706;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.25);
}
.fa-btn-update:hover:not(:disabled) {
  background: #b45309;
}

/* Delete */
.fa-btn-delete {
  background: #ef4444;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
}
.fa-btn-delete:hover:not(:disabled) {
  background: #dc2626;
}

/* Spinner */
.fa-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: fa-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes fa-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
