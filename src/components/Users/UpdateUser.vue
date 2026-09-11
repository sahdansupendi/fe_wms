<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { findmeApi, updateuserApi } from "@/api/user.js";
import FormActions from "@/components/ui/FormActions.vue";
import ConfirmDialog from "@/components/ui/ConfirmDialog.vue";
import ToastNotif from "@/components/ui/ToastNotif.vue";
import { useFormReset } from "@/composables/useFormReset.js";
import { useConfirmDialog } from "@/composables/useConfirmDialog.js";
import { useToast } from "@/composables/useToast.js";

const emit = defineEmits(['navigate']);

const { confirmDialog, openConfirm, closeConfirm } = useConfirmDialog();
const { toast, showToast, hideToast } = useToast();

/*
  STATE — dideklarasikan dulu agar bisa dipakai oleh composable di bawah
*/
const form = reactive({
  username: '',
  email: '',
  roleid: '',
});

const roles = ref([
  { id: '00', name: 'Super User' },
  { id: '01', name: 'Admin' },
  { id: '02', name: 'User' },
]);

const errors     = ref({});
const globalError = ref('');
const loading     = ref(false);
const savedUser   = ref(null);
const users       = ref([]);
const usersLoading = ref(false);
const usersError   = ref('');

/*
  FORM RESET — cukup 1 baris, tidak ada method lokal lagi.
  composable menerima form + semua ref yang perlu di-reset sekaligus.
*/
const { resetForm } = useFormReset(
  form,
  { username: '', email: '', roleid: '' },
  {
    errors:      { ref: errors,      defaultValue: {} },
    globalError: { ref: globalError, defaultValue: '' },
  }
);

/*
  HELPERS
*/
const roleid = (rolename) => {
  if (rolename?.includes("SUPERUSER")) return "00";
  if (rolename?.includes("ADMIN"))     return "01";
  if (rolename?.includes("USER"))      return "02";
  return '';
};

const selectedRole = computed(() =>
  roles.value.find(r => r.id === form.roleid) || null
);

const clearError = (field) => {
  if (errors.value[field]) {
    const e = { ...errors.value };
    delete e[field];
    errors.value = e;
  }
  globalError.value = '';
};

const roleChipClass = (id) => {
  if (id === '00') return 'chip-superuser';
  if (id === '01') return 'chip-admin';
  return 'chip-user';
};

/*
  FETCH — isi form dari data user yang sedang login
*/
const currentUsers = async () => {
  usersLoading.value = true;
  usersError.value   = '';

  try {
    const res = await findmeApi();
    users.value = res.data.data;

    form.username = users.value.username || '';
    form.email    = users.value.email    || '';
    form.roleid   = roleid(users.value.rolename) || '';

  } catch (e) {
    usersError.value = e.response?.data?.message || "Gagal memuat data users";
  } finally {
    usersLoading.value = false;
  }
};

onMounted(() => currentUsers());

/*
  VALIDATE
*/
const validate = () => {
  const e = {};
  const { username, email, roleid: rid } = form;

  if (!username)          e.username = 'Username wajib diisi';
  else if (username.length < 3) e.username = 'Username minimal 3 karakter';

  if (!email)             e.email = 'Email wajib diisi';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Format email tidak valid';

  if (!rid)               e.roleid = 'Role wajib dipilih';

  errors.value = e;
  return Object.keys(e).length === 0;
};

/*
  SUBMIT
*/
const handleUpdateClick = () => {
  globalError.value = '';
  if (!validate()) return;
  openConfirm('update');
};

const executeSubmit = async () => {
  globalError.value = '';
  savedUser.value   = null;
  loading.value = true;

  const payload = {
    username: form.username.trim().toLowerCase(),
    email:    form.email.trim().toLowerCase(),
    roleid:   form.roleid,
  };

  try {
    const response = await updateuserApi(payload);
    const data = response.data;

    if (data.success) {
      savedUser.value = data.data;
      resetForm();
      currentUsers();
      closeConfirm();
      showToast('update');
    }
  } catch (err) {
    closeConfirm();
    const res = err.response?.data;

    if (res?.details) {
      errors.value  = { ...res.details };
      globalError.value = Object.values(res.details).join(', ') || 'Validation Error';
    } else {
      globalError.value = res?.message || 'Tidak dapat terhubung ke server';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="content">

    <!-- Form Card -->
    <div class="update-card">
      <div class="update-card-header">
        <div class="update-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </div>
        <span class="update-card-title">Informasi Pengguna</span>
      </div>

      <form class="reg-form" @submit.prevent="handleUpdateClick" novalidate>
        <!-- Username -->
        <div class="form-group" :class="{ 'has-error': errors.username }">
          <label class="form-label">
            Username
            <span class="required-star">*</span>
          </label>
          <div class="input-wrap">
            <span class="input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input
                v-model="form.username"
                type="text"
                class="reg-input"
                placeholder="Masukkan username"
                autocomplete="username"
                readonly
                @input="clearError('username')"
            />
          </div>
          <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
        </div>

        <!-- Email -->
        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label class="form-label">
            Email
            <span class="required-star">*</span>
          </label>
          <div class="input-wrap">
            <span class="input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline
                  points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input
                v-model="form.email"
                type="email"
                class="reg-input"
                placeholder="Masukkan email"
                autocomplete="email"
                :disabled="loading"
                @input="clearError('email')"
            />
          </div>
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <!-- Role ID -->
        <div class="form-group" :class="{ 'has-error': errors.roleid }">
          <label class="form-label">
            Role
            <span class="required-star">*</span>
          </label>
          <div class="input-wrap select-wrap">
            <span class="input-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <select
                v-model="form.roleid"
                class="reg-select"
                :disabled="loading"
                @change="clearError('roleid')"
            >
              <option value="" disabled>Pilih Role</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.id }} — {{ role.name }}
              </option>
            </select>
            <span class="select-arrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>

          <span v-if="errors.roleid" class="field-error">{{ errors.roleid }}</span>
        </div>

        <!-- Actions -->
        <div class="form-divider"></div>
        <FormActions
            mode="update"
            :loading="loading"
            @reset="resetForm"
            @update="handleUpdateClick"
        />
      </form>
    </div>

    <!-- Reusable Confirmation Dialog -->
    <ConfirmDialog
      :show="confirmDialog.show"
      :type="confirmDialog.type"
      :loading="loading"
      @confirm="executeSubmit"
      @cancel="closeConfirm"
    />

    <!-- Reusable Toast Notification -->
    <ToastNotif
      :show="toast.show"
      :type="toast.type"
      @close="hideToast"
    />
  </div>
</template>

<style scoped src="@/assets/css/updateUser.css"></style>